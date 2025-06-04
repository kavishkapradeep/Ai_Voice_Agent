import Stripe from "stripe"
import  {v4 as uuidv4}  from 'uuid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
/** @type {import('next').NextRequest} */
export  async function POST(req,res) {

    try {
        const body = await req.json()
        const {amount} = await body;

        if (!amount) {
      return new Response(JSON.stringify({ error: 'Amount is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

        //Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:'Credit Package',
                        }
                        ,unit_amount:amount*100
                    },
                    quantity:1
                }
            ],
            mode:'payment',
            success_url:`${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.NEXT_PUBLIC_URL}/Dashboard`
        })

        return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    } catch (error) {
      
        console.log(error);
        
    }
}