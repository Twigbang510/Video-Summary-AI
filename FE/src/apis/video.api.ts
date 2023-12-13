import http from 'src/utils/http'

const videoApi = {
  fetchVideo(videoUrl: string) {
    const videoCpns = videoUrl.split('/')
    const videoId = videoCpns[videoCpns.length - 1]

    const GC_API_KEY = 'AIzaSyBhD35BBdiAM13KOakN26NXx02tjgQueAU'

    return http.get(`https://youtube.com/oembed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=json`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

export default videoApi
