import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export const POST = async(req:Request,{params}:{params:{orderId:string}})=>{
    try {
        if(!params || !params.orderId){
            return new Response('Missing or invalid orderId', { status: 400 });
        }
    const {orderId}=params
    const order =await prisma.order.findUnique({
        where:{
            id:orderId,
        }
    });
    console.log("order",order)
    if(!order){
        return new NextResponse(JSON.stringify({message:"Order not found!"}),{
            status:404,
        })
    }
    if(order.intent_id){
        console.log("Payment intent already exists for this order",order.intent_id)
        return new NextResponse(JSON.stringify({clientSecret:order.intent_id}),{
            status:200,
        })
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount:100 * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      await prisma.order.update({
        where:{
            id:orderId,
        },
        data:{intent_id:paymentIntent.id}
      })
      console.log("Uplated intent_in DB",paymentIntent.id)
      return new NextResponse(JSON.stringify({clientSecret:paymentIntent.client_secret}),{
        status:200,
    })
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return new NextResponse(JSON.stringify({message:"Internal Server Error"}),{
            status:500,
        })
    }
  
}