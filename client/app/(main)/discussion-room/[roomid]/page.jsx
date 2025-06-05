"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { AIModel, textToSpeech } from "@/services/GlobalServices";
import { CoachingExpert } from "@/services/Option";
import { UserButton } from "@stackframe/stack";
import { useMutation, useQueries, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "./_components/ChatBox";
import axios from "axios";
import { UserContext } from "@/app/_context/UserContext";
import Webcam from "react-webcam";

//const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });
function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const [expert, setExpert] = useState();
  const [loading,setLoading] = useState(false)
  const [enableMic, setEnableMic] = useState(false);
  const  [enableFeedback,setEnableFeedback] = useState(false)
  const {userData,setUserData} = useContext(UserContext)
  const [camera,setCamera] = useState(false)
  const recorder = useRef(null);

 const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
 const updateUserToken = useMutation(api.users.UpdateUserToken)

 const [transcript,setTranscript] = useState([
    {role:'assistant',content:'HI'},
    {role:'user',content:'hi'}
  ]);

   const deepgramSocket = useRef(null);
  const processorRef = useRef(null);
  const audioContextRef = useRef(null);
  const micStreamRef = useRef(null)

  let silenceTimeout;
  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
     
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = () => {
    setEnableMic(true);
    setLoading(true)

    const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    const socketUrl = `wss://api.deepgram.com/v1/listen?punctuate=true&language=en-US&encoding=linear16&sample_rate=16000`;
    const socket = new  WebSocket(socketUrl,['token',apiKey])

deepgramSocket.current  = socket;

socket.onopen = async () => {
   const stream = await navigator.mediaDevices.getUserMedia({audio:true});
   micStreamRef.current = stream;
   const audioContext = new  AudioContext({sampleRate:16000})
   audioContextRef.current  =audioContext;

   const source = audioContext.createMediaStreamSource(stream);
   const processor = audioContext.createScriptProcessor(4096,1,1)
   processorRef.current = processor

   source.connect(processor)
   processor.connect(audioContext.destination)

   processor.onaudioprocess = (e) =>{
    const input = e.inputBuffer.getChannelData(0)
    const buffer = new ArrayBuffer(input.length *2)

    
    const view = new DataView(buffer)


    for (let i =0 ;  i<input.length; i++){
      let sample = input[i]*32767;
      sample = Math.max(-32768,Math.min(32767,sample))
      view.setInt16(i*2,sample,true)
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(buffer)
    }
   }
}

socket.onmessage = async (message) =>{
  const  data = JSON.parse(message.data);
  const newTranscript = data.channel?.alternatives[0]?.transcript;

  if (newTranscript && data.is_final) {
    console.log(newTranscript);
    // let voice;
    //     if(DiscussionRoomData.expertName == 'Micheal'){
    //         voice ="JBFqnCBsd6RMkjVDRZzb"
    //     }else{
    //          voice="Ps8lsQuJKZHMxxDU1tff"
    //     }
   const aiResp = await AIModel(
      DiscussionRoomData.topic,
      DiscussionRoomData.coachingOption,
      newTranscript
    )
    console.log(aiResp);
    setTranscript((prev) => [
  ...prev,
  { role: "user", content: newTranscript },
  { role: "assistant", content: aiResp.content || aiResp },
]);

    const response =  await  axios.post('/api/speechText',{
      text:aiResp.content 
    },{responseType:'blob'})

    const audioUrl = URL.createObjectURL(response.data)
    const audioElement = new Audio(audioUrl)
    audioElement.play()

   await   updateUserTokenMethod(newTranscript)

  }


  setLoading(false)
}

socket.onerror = (error)=>{
  console.log(error);
}

socket.onclose = ()=>{
  console.log('socket closed');
}

  };

  const disconnect = async (e) => {
    e.preventDefault();
    setLoading(true)

    

    if (processorRef.current) {
      processorRef.current.disconnect()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
     if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (deepgramSocket.current?.readyState === WebSocket.OPEN) {
      deepgramSocket.current.close()
    }

    await UpdateConversation({
      id:DiscussionRoomData._id,
      conversation:transcript
    })
    setEnableMic(false);
    console.log("Recording Stoped");
    setLoading(false)
    setEnableFeedback(true)
  };

const updateUserTokenMethod = async (text) => {
  const  tokenCount = text.trim()?text.trim().split (/\s+/).length:0   
  const result = await updateUserToken({
    id:userData._id,
    credits:Number  (userData.credits) - Number(tokenCount)
  }) 

  setUserData(prev=>({
    ...prev,
    credits:Number  (userData.credits) - Number(tokenCount)
  }))
}

const cameraOn = async () => {
  setCamera(!camera)
}

  return (
    <div className=" -mt-12">
      <h2 className=" text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className=" mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className=" lg:col-span-2 ">
          <div className=" relative h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center">
            <Image
              src={expert?.avatar}
              alt="Avatar"
              width={200}
              height={200}
              className=" h-[80px] w-[80px] animate-pulse rounded-full object-cover"
            />
            <h2 className=" text-gray-500">{expert?.name}</h2>
            <div className=" absolute bottom-10 right-10   rounded-lg bg-gray-200">
            {!camera ?<div className=" px-10 p-6 border rounded-xl ">
              <UserButton />
           </div>:
            <Webcam height={170} width={170} className="rounded-2xl"/> 
            } </div>
          <Button onClick={cameraOn} className=' text-sm mt-2 absolute bottom-1 right-8' variant='outline'>turn {!camera?"on":"off"} camera</Button>
            <div>
             
            </div>
          </div>
          <div className=" mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button disabled={loading} onClick={connectToServer}>{loading &&  <Loader2Icon className=" animate-spin"/>}Connect</Button>
            ) : (
              <Button disabled={loading} variant="destructive" onClick={disconnect}>
                {loading &&  <Loader2Icon className=" animate-spin"/>} 
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
         <ChatBox  transcript={transcript} enableFeedback={enableFeedback}
         coachingOption={DiscussionRoomData?.coachingOption}/>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;
