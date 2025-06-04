'use client'

import { Button } from '@/components/ui/button'
import { CardElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { toast } from 'sonner'

function StripeCheckoutForm({clientSecret}) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading,setloading] = useState(false)

    const  handleSubmit = async (e) => {
        e.preventDefault()
        setloading(true)

        const {error,paymentIntent} = await stripe.confirmCardPayment(elements)
        if (error) {
            console.log(error.message);
            toast.error(error.message)
        }else if (paymentIntent?.status === 'succeeded'){
            toast("payment success")
            console.log(paymentIntent.id);
            
        }
        setloading(false)
    }

  return (
    <form onSubmit={handleSubmit} className=' max-w-md space-y-4'>
        <PaymentElement/>
        <Button disabled={loading}>{loading?"process":"Pay now"}</Button>
    </form>
  )
}

export default StripeCheckoutForm