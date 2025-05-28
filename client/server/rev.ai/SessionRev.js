'use server'
const initiateGladiaSession = async () => {
    try {
     const response = await axios.post(
      'https://api.gladia.io/v2/live',{
        encoding:'wav/pcm',
        sample_rate:16000,
        bit_depth:16,
        channels:1,
        realtime_processing:{
           speaker_diarlization:false,
           words_accurate_timestamps:false,
           translation:false
        },
      },
      {headers :{
          "Content-Type": "application/json",
          "x-gladia-key": process.env.NEXT_PUBLIC_GLADIA_API_KEY,
      }

      }
     )
     return response.data.url
    } catch (error) {
      console.log(error);
      return null;
    }
}

export default initiateGladiaSession;