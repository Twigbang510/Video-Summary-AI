from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
from googleapiclient.discovery import build
import openai
from transformers import pipeline, T5Tokenizer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
import uvicorn
import firebase_admin
import pyrebase
import json
import httpx


from firebase_admin import credentials, auth , db
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

cred = credentials.Certificate('video-sum-b43b5-firebase-adminsdk-jovmu-e691b650d3.json')
firebase = firebase_admin.initialize_app(cred,{"databaseURL": "https://video-sum-b43b5-default-rtdb.asia-southeast1.firebasedatabase.app/"})
pb = pyrebase.initialize_app(json.load(open('firebase_config.json')))
allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)
# NOTE: This Authentication module
@app.post("/signup")
async def signup(request: Request):
   req = await request.json()
   email = req['email']
   password = req['password']
   print()
   if email is None or password is None:
       return HTTPException(detail={'message': 'Error! Missing Email or Password'}, status_code=400)
   try:
       user = auth.create_user(
           email=email,
           password=password
       )
       return JSONResponse(content={'message': f'Successfully created user {user.uid}'}, status_code=200)    
   except Exception as e:
       return JSONResponse(content={'Error when signin ': e}, status_code= 500)
   
@app.post("/login")
async def login(request: Request):
    req_json = await request.json()
    email = req_json['email']
    password = req_json['password']
    try:
        user = pb.auth().sign_in_with_email_and_password(email, password)
        jwt = user['idToken']
        uuid = user['localId']  
        return JSONResponse(content={'token': jwt, 'uuid': uuid}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content={'Error when login ': e}, status_code=500)

# NOTE : This is api method that saves the user information by id
@app.post("/save")
async def login(request: Request):
    req_json = await request.json()
    try : 
        ref = db.reference('/')
        uid = "jaY82FbHBWbufh3wWSZwDO4kRiK2" #HARDCODE  TODO:  Save by user id 
        users_ref = ref.child('videos')
        users_ref.set({
            uid: {
                'video_detail' : req_json
            }
        })
        print(users_ref)
        return JSONResponse(content={'Success': True}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content={'Error when save data ': e}, status_code= 500)

async def save_video_data(data):
    save_endpoint = "http://127.0.0.1:8000/save"  # TODO: Change domain for deployment

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(save_endpoint, json=data)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to send data to /save endpoint")

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")

# NOTE : This process is create summary from script
class YouTubeLink(BaseModel):
    url: str

# Function to extract the video ID from the URL
def extract_video_id(url: str):
    if "youtube.com/watch?v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1]
    else:
        return None

@app.post("/get-transcript/")
async def get_transcript(youtube_link: YouTubeLink):
    video_id = extract_video_id(youtube_link.url)
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

    # Try fetching the manual transcript
    try:
        transcript = transcript_list.find_manually_created_transcript()
        language_code = transcript.language_code  # Save the detected language
    except:
        # If no manual transcript is found, try fetching an auto-generated transcript in a supported language
        try:
            generated_transcripts = [trans for trans in transcript_list if trans.is_generated]
            transcript = generated_transcripts[0]
            language_code = transcript.language_code  # Save the detected language
        except:
            # If no auto-generated transcript is found, raise an exception
            raise Exception("No suitable transcript found.")

    return transcript.fetch()

@app.post("/transcript/full")
async def get_full_transcript(youtube_link: YouTubeLink):
    video_id = extract_video_id(youtube_link.url)
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

    # Try fetching the manual transcript
    try:
        transcript = transcript_list.find_manually_created_transcript()
        language_code = transcript.language_code  # Save the detected language
    except:
        # If no manual transcript is found, try fetching an auto-generated transcript in a supported language
        try:
            generated_transcripts = [trans for trans in transcript_list if trans.is_generated]
            transcript = generated_transcripts[0]
            language_code = transcript.language_code  # Save the detected language
        except:
            # If no auto-generated transcript is found, raise an exception
            raise Exception("No suitable transcript found.")

    full_transcript = " ".join([part['text'] for part in transcript.fetch()])
    return full_transcript, language_code  # Return both the transcript and detected language

@app.post("/metadata")
async def get_video_metadata(youtube_link: YouTubeLink):
    video_id = extract_video_id(youtube_link.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # Replace 'YOUR_API_KEY' with your actual YouTube Data API key
    youtube_service = build('youtube', 'v3', developerKey='AIzaSyBbbnTAD-PXqR3WtiZ-MmDljMGC4oV-uLc')
    request = youtube_service.videos().list(part='snippet,contentDetails,statistics', id=video_id)
    response = request.execute()
    await save_video_data(response)

    return response

# Initialize the Hugging Face summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
tokenizer = T5Tokenizer.from_pretrained("t5-small")
    
def summarize_chunk(chunk):
    # Truncate the chunk to a suitable length
    truncated_chunk = ' '.join(chunk.split()[:500])  # Adjust the number of words as needed
    summary = summarizer(truncated_chunk, max_length=130, min_length=30, do_sample=False)[0]['summary_text']
    return summary

def process_transcript_segment(segment):
    group_text, start_time = segment
    summary = summarize_chunk(group_text)
    return {
        "summaryText": summary,
        "startTime": str(timedelta(seconds=start_time)),
    }

@app.post("/summarize")
async def summarize_by_interval(youtube_link: YouTubeLink):
    video_id = extract_video_id(youtube_link.url)
    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])

    # Group transcript by 5-minute intervals
    interval = 300  # seconds
    grouped_transcripts = []
    current_group = []
    current_start_time = 0

    for entry in transcript:
        if entry['start'] < current_start_time + interval:
            current_group.append(entry['text'])
        else:
            grouped_transcripts.append((' '.join(current_group), current_start_time))
            current_group = [entry['text']]
            current_start_time += interval

    # Add the last group if it's not empty
    if current_group:
        grouped_transcripts.append((' '.join(current_group), current_start_time))

    # Summarize each group in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        summaries = list(executor.map(process_transcript_segment, grouped_transcripts))

    return summaries

def get_transcript(youtube_url):
    video_id = youtube_url.split("v=")[-1]
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

    # Try fetching the manual transcript
    try:
        transcript = transcript_list.find_manually_created_transcript()
        language_code = transcript.language_code  # Save the detected language
    except:
        # If no manual transcript is found, try fetching an auto-generated transcript in a supported language
        try:
            generated_transcripts = [trans for trans in transcript_list if trans.is_generated]
            transcript = generated_transcripts[0]
            language_code = transcript.language_code  # Save the detected language
        except:
            # If no auto-generated transcript is found, raise an exception
            raise Exception("No suitable transcript found.")

    full_transcript = " ".join([part['text'] for part in transcript.fetch()])
    return full_transcript, language_code  # Return both the transcript and detected language


def summarize_with_langchain_and_openai(transcript, language_code, model_name='gpt-3.5-turbo'):
    # Split the document if it's too long
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
    texts = text_splitter.split_text(transcript)
    text_to_summarize = " ".join(texts[:4]) # Adjust this as needed

    # Prepare the prompt for summarization
    system_prompt = 'I want you to act as a Life Coach that can create good summaries!'
    prompt = f'''Summarize the following text in {language_code}.
    Text: {text_to_summarize}

    Add a title to the summary in {language_code}. 
    Include an INTRODUCTION, BULLET POINTS if possible, and a CONCLUSION in {language_code}.'''

    # Start summarizing using OpenAI
    response = openai.ChatCompletion.create(
        model=model_name,
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': prompt}
        ],
        temperature=1
    )
    
    return response['choices'][0]['message']['content']

class SummarizeRequest(BaseModel):
    url: str
    openai_api_key: str
    
@app.post("/summarize/openai")
async def summarize_with_openai(request: SummarizeRequest):
    # Set the OpenAI API key
    openai.api_key = request.openai_api_key
    transcript, language_code = get_transcript(request.url)
    model_name = 'gpt-3.5-turbo'
    summary = summarize_with_langchain_and_openai(transcript, language_code, model_name)
    return {"summaryText": summary}
    
    