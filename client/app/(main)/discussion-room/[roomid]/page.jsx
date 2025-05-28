"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Option";
import { UserButton } from "@stackframe/stack";
import { useQueries, useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

//const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });
function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const [expert, setExpert] = useState();
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef(null);


  const [transcript,setTranscript] = useState('');

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
      console.log(Expert);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = () => {
    setEnableMic(true);

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

socket.onmessage = (message) =>{
  const  data = JSON.parse(message.data);
  const newTranscript = data.channel?.alternatives[0]?.transcript;

  if (newTranscript && data.is_final) {
    setTranscript((prev)=>prev+ ' '+ newTranscript)
    console.log(newTranscript);
    
  }
}

socket.onerror = (error)=>{
  console.log(error);
}

socket.onclose = ()=>{
  console.log('socket closed');
  
}

  };

  const disconnect = (e) => {
    e.preventDefault();
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
    
    setEnableMic(false);
    console.log("Recording Stoped");
    
  };
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
            <div className=" absolute bottom-10 right-10 px-10 p-5 rounded-lg bg-gray-200">
              <UserButton />
            </div>
          </div>
          <div className=" mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="  relative h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center">
            <h2> Chat Section</h2>
          </div>
          <p className=" mt-4 text-gray-400 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes
          </p>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;
