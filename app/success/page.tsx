"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");
  console.log("payment_intent",payment_intent)
  const router = useRouter();
  useEffect(() => {
    if (!payment_intent) return;
    const makeRequest = async () => {
      try {
       const response= await fetch(`http://localhost:3000/api/confirm/${payment_intent}`,{
          method: "PUT",
          headers:{
            'Content-Type': 'application/json',
          }
        });
        if(response.ok){
          setTimeout(()=>{
            router.push("/orders");
          },2000)
        }else{
          console.log("Faild to update order status",response.statusText)
        }
      } catch (error) {
        console.log(error);
      }
    };
    makeRequest()
  }, [payment_intent,router]);
  return <div>
    Payment successful.You are being redirected to the orders page.
    Please do not close the page.
  </div>;
};

export default SuccessPage;
