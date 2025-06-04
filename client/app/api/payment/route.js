import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export  async function POST(req) {

    try {
        const {amount} = await req.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency:'eur',
            payment_method_types:['card']
        })

        return new Response(
            JSON.stringify({clientSecret:paymentIntent.client_secret}),
            {status:200,
                headers:{'Content-Type':'application/json'}
            }
        )

    } catch (error) {
        res.json(error.message)
    }
}