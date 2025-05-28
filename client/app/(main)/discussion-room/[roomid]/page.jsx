"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Option";
import { UserButton } from "@stackframe/stack";
import { useQueries, useQuery } from "convex/react";
import { time } from "motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import RecordRTC from 'recordrtc';

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
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new MediaRecorder(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
    timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              // if (!realtimeTranscriber.current) return;
              clearTimeout(silenceTimeout);
              const buffer = await blob.arrayBuffer();
              console.log(buffer);

              silenceTimeout = setTimeout(() => {
                console.log("User stopped talking");
              }, 2000);
            },
          });
          recorder.current.start();
        })
        .catch((err) => console.log(err));
    }
  };

  const disconnect = (e) => {
    e.preventDefault();
    recorder.current.stop();
    recorder.current = null;
    setEnableMic(false);
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
