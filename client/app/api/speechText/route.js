import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"



const elevenlabs = new ElevenLabsClient({
    apiKey:process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
});

export  async function POST(request) {

       
    try {
        const {text} = await  request.json();
        

        const audio = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb",{
             text,
      voiceId: "JBFqnCBsd6RMkjVDRZzb",
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",
        })
        
            return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

       } catch (error) {
        console.error(error);
    }
}