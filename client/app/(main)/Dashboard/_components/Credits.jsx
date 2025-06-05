import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUser } from '@stackframe/stack'
import { loadStripe } from '@stripe/stripe-js'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

function Credits() {

  const {userData} =useContext(UserContext)
  const [loading,setLoading] = useState(false)

  const CalculateProgress = ()=>{
      if (userData?.subscriptionId) {
            return (Number(userData.credits)/50000)*100
      }else{
            return (Number(userData.credits)/5000)*100
      }
  }

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const handlePayment = async () => {
  setLoading(true);

  try {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 10
      }),
    });

    const text = await response.text();

    if (!text) {
      throw new Error('Empty response from server');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('Invalid JSON returned:', text);
      throw new Error('Invalid response from payment server');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong with payment.');
    }

    const { sessionId } = data;
    if (!sessionId) {
      throw new Error('No session ID returned from server');
    }

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId:data.sessionId });

  } catch (error) {
    console.log('Payment error:', error.message);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

useEffect(()=>{
 CalculateProgress()
 },[userData])

  const user = useUser()
  return (
    <div>
        <div className=' flex gap-5 items-center'>
            <Image src={user?.profileImageUrl} className=' rounded-full ' alt='profile pic' width={60} height={60}/>
          <div>
             <h2 className=' text-lg font-bold'>{user?.displayName}</h2>
             <h2 className=' text-gray-500'>{user?.primaryEmail}</h2>
          </div>
        </div>
          <hr  className=' my-3'/>
          <div>
             <h2>Token Usage</h2>
             <h2>{userData.credits}/{userData?.subscriptionId?'50,000':'5000'}</h2>
             <Progress value={CalculateProgress()} className='my-3'/>

             <div className=' flex justify-between items-center mt-3'>
               <h2 className=' font-bold'>Current Plan</h2>
               <h2 className=' p-1 bg-secondary rounded-lg px-2'>
                {userData?.subscriptionId ?'Paid Plan':'Free plan'}</h2>
             </div>
             <div className=' mt-5 p-5 border rounded-2xl'>
               <div className=' flex justify-between'>
                 <div>
                    <h2 className=' font-bold'>Pro Plan</h2>
                    <h2>50,000 Tokens</h2>
                 </div>
                 <h2 className=' font-bold'>$10/Month</h2>
               </div>
               <hr  className=' my-3'/>
               <Button onClick={handlePayment} className='w-full'><Wallet2/> Upgrade 10$</Button>

             </div>
          </div>
       
    </div>
  )
}

export default Credits