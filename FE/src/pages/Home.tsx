import { useState } from 'react'
import videoApi from 'src/apis/video.api'

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('')

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value)
  }

  const handleSearch = async () => {
    try {
      const res = await videoApi.fetchVideo(videoUrl)
      console.log(123, res)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center bg-zinc-800 pt-56'>
      <div className='text-[5rem] font-bold text-white'>SumYou</div>
      <div className='text-[2rem] font-medium text-white'>Let&apos;s summarize and save time</div>
      <div className='relative mt-20 w-[60vw] min-w-[500px]'>
        <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-5'>
          <svg
            className='h-4 w-4 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
          </svg>
        </div>
        <input
          type='search'
          id='default-search'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-12 text-sm text-gray-900 focus:ring-0'
          placeholder='Input Youtube Video URL...'
          value={videoUrl}
          onChange={handleOnInputChange}
          required
        />
        <button
          className='absolute bottom-2.5 end-2.5 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-0'
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className='mt-4 text-sm text-white'>
        <b>*Accepted format: </b> https://youtu.be/video_id
      </div>

      <div className='mt-24 grid max-w-6xl grid-cols-12 gap-2 gap-y-4'>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <div className='flex w-full flex-col'>
            <div className='relative'>
              <div>
                <img src='https://picsum.photos/seed/59/300/200' className='h-auto w-96' alt='' />
              </div>

              <p className='py absolute bottom-2 right-2 bg-gray-900 px-1 text-xs text-gray-100'>1:15</p>
            </div>

            <div className='mt-2 flex flex-row gap-2'>
              <div>
                <img src='https://picsum.photos/seed/1/40/40' className='max-w-10 max-h-10 rounded-full' alt='' />
              </div>

              <div className='flex flex-col'>
                <div>
                  <p className='text-sm font-semibold text-gray-100'>Learn CSS Box Model in 8 Minutes</p>
                </div>
                <div className='mt-2 text-xs text-gray-400 hover:text-gray-100'> Web Dev Simplified </div>
                <p className='mt-1 text-xs text-gray-400'>241K views . 3 years ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
