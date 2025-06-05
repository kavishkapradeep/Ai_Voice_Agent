'use client'
import { UserContext } from '@/app/_context/UserContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react'

function page() {
     const convex = useConvex()
     const searchParams = useSearchParams()
     const [sessionId,setSessionId]=useState(null)
     const router = useRouter();
      const {userData,setUserData} = useContext(UserContext);
      useEffect(()=>{
        const id = searchParams.get('session_id')
        setSessionId(id)


      },[searchParams])
useEffect(()=>{
    
      const updateCredits = async () => {
        try {
           const updatedUser= await convex.mutation(api.users.UpdatePaymentUserToken,{
                id:userData._id,
                credits:50000,
                subscriptionId:sessionId
            })

            setUserData(prev=>(
               
            {   ...prev,
                  credits:50000,
                subscriptionId:sessionId
            }))

            console.log("success updated");
              setTimeout(() => {
          router.push('/Dashboard');
        }, 5000);
            
        } catch (error) {
            console.log(error);
            
        }
      }
updateCredits()
},[userData?._id,sessionId,convex])
      return (
    <div>
        <div>
            <h2 className=' text-center text-lg font-bold'>Payment SuccessFull !</h2>
        </div>
        <div className=' my-20 items-center flex justify-center'>
             <div className=' animate-spin duration-800 w-10 h-10 border-b rounded-full border-blue-600'></div>
        </div>
    </div>
  )
}

export default page
