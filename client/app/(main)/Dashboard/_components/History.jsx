'use client'
import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { CoachingExpert, ExpertsList } from '@/services/Option';
import { useConvex } from 'convex/react'
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

function History() {

  const convex = useConvex()
  const {userData} = useContext(UserContext);
  const [discucussionRoomList,setDiscussionRoomList] = useState([])

  useEffect(()=>{
    userData && GetDiscussionRooms()
  },[userData])

  const GetDiscussionRooms = async () => {
    const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom,{
      uid:userData?._id
    })
    setDiscussionRoomList(result)
    console.log(result);
  }

  const GetAbstractImage = (option)=>{
    const coachingOption =  ExpertsList.find((item)=>item.name == option)
    return coachingOption?.abstract??'/ab1.png';
  }
  return (
    <div>
        <h2 className=' font-bold text-xl'>Your Previos Lecture</h2>
     {discucussionRoomList?.length==0 && <p className=' text-gray-400'>Your don't have an previos lecture</p>
   } 
   <div className=' overflow-auto h-[25vh] mt-5'>
     {discucussionRoomList.map((item,index)=>(
      item.coachingOption == 'Languages Skill' ||item.coachingOption == 'Meditation' ||item.coachingOption == 'Lecture on topic'
     )&&( <div key={index} className='cursor-pointer border-b-[1px] group pb-4 justify-between  mb-4 flex gap-7 items-center  p-1   rounded-tr-lg'>
          <div   >
            <div  className=' flex gap-7'>
              <Image src={GetAbstractImage(item.coachingOption
)} alt='item.topic' className=' rounded-full h-[50px] w-[50px] '
              width={50} height={50} />
            <div>
              <h2 className=' font-bold'>{item.topic}</h2>
              <h2 className=' text-gray-400'>{item.coachingOption}</h2>
           </div>
           </div>
          </div>
         <Link href={'/discussion-summery/'+item._id}>
            <Button variant='outline' className='invisible group-hover:visible'>View Notes</Button>
      </Link>
      </div>))}
   </div>
   </div>
  )
}

export default History