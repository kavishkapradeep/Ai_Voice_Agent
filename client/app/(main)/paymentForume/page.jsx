'use client'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react"
import StripeCheckoutForm from "../_components/StripeCheckoutForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PaymentPage(){
    const [clientSecret,setClientSecret] = useState(null)

    useEffect(()=>{
        fetch('/api/payment',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({amount:1000})
        }).then((res)=>res.json()).then((data)=>setClientSecret(data.clientSecret))
    },[])

    const options = {
        clientSecret,
        appearance:{
             theme: 'none', // No predefined theme
    variables: {
      colorPrimary: '#1d72b8', // Custom primary color
      colorBackground: '#f7f7f7', // Light background color
      colorText: '#333333', // Dark text
      colorInputBackground: '#ffffff', // Input field background
      colorInputBorder: '#cccccc', // Input field border
      colorDanger: '#d9534f'
    }}
    }

    if(!clientSecret) return <div>Loading ...</div>

    return (
        <div className=" p-10 border">
            <Elements stripe={stripePromise} options={options}>
                 <StripeCheckoutForm clientSecret={clientSecret}/>
            </Elements>
        </div>
    )
}