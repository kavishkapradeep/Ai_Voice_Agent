'use client'
import { api } from '@/convex/_generated/api';
import { ExpertsList } from '@/services/Option';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React from 'react'
import moment from 'moment';
import ChatBox from '../../discussion-room/[roomid]/_components/ChatBox';
import SummeryBox from './_components/SummeryBox';


function ViewSummery() {
  const  {roomid} = useParams();
  const DisscusionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom ,{id:roomid})
  console.log(DisscusionRoomData);
  
     const GetAbstractImage = (option)=>{
          const coachingOption =  ExpertsList.find((item)=>item.name == option)
          return coachingOption?.abstract??'/ab1.png';
        }
  return (
    <div className=' -mt-24'>
      <div className=' flex justify-between items-end'>
      <div className=' flex gap-7 items-center'>
        <Image src={GetAbstractImage(DisscusionRoomData?.coachingOption)} alt='abstract/png'
        width={ 100} height={100} className=' w-[70px] h-[70px] rounded-full'/>
          <div>
             <h2 className=' font-bold text-lg'>{DisscusionRoomData?.topic}</h2>
             <h2 className=' text-gray-400'>{DisscusionRoomData?.coachingOption}</h2>
          </div>
      </div>
         <h2 className=' text-gray-400 text-sm'>{moment(DisscusionRoomData?._creationTime).fromNow()}</h2>
          </div>
          <div className=' grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5'>
            <div className=' col-span-3'>
              <h2 className=' text-lg font-bold mb-6'>Summery of Your Conversation</h2>
              <SummeryBox summery={DisscusionRoomData?.summery}/>
            </div>
            <div className=' col-span-2'>
              {DisscusionRoomData?.conversation &&<ChatBox coachingOption={DisscusionRoomData?.coachingOption}
              enableFeedback={false} transcript={DisscusionRoomData?.conversation}/>}
            </div>
          </div>
    </div>
  )
}

export default ViewSummery