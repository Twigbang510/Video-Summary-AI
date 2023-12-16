from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
from googleapiclient.discovery import build
import openai
from transformers import pipeline, T5Tokenizer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta

app = FastAPI()

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
    
    