"use client"
import React, { useEffect, useState } from 'react'
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/app/components/CheckoutForm';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const PayPage =  ({params}:{params:{id:string}}) => {
  const [clientSecret,setClientSecret] = useState("");
  const {id}= params;
  console.log("orderId",id)
  useEffect(()=>{
    const makeRequest =async ()=>{
      try {
        const res =await fetch(`http://localhost:3000/api/create-intent/${id}`,{
          method: 'POST',
         
        })
        console.log("res",res)
        if(!res.ok){
          throw new Error(`Failed to create intent: ${res.text}`)
        }
        const data=await res.json()
        setClientSecret(data.clientSecret)
        console.log("clientSecret",data.clientSecret)
      } catch (error) {
        console.log("Error fetching client secret",error)
      }
    }
    makeRequest();
  },[id])
  const options:StripeElementsOptions={
    clientSecret,
    appearance:{
      theme:"stripe"
    }
  }
  return (
    <div>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm/>
              </Elements>
            )}
            
    </div>
  )
}

export default PayPage
