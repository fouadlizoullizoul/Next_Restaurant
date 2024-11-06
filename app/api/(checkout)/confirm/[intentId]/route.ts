import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export const PUT =async (req:Request,{params}:{params:{intentId:string}})=>{
    const intentId= params.intentId;
    console.log("Intent ID:", intentId);
    try {
        const existingOrder =await prisma.order.findUnique({
            where:{
                intent_id:intentId
            }
        })
        if(!existingOrder){
            return  NextResponse.json("Order not found",{status:404})
        }
        await prisma.order.update({
            where:{
                intent_id:intentId,
            },
            data:{status:"Being prepared"}
        });
        return  NextResponse.json("Order has been updated to being prepared!",{status:200})
    } catch (error) {
        console.log("error updating order",error);
        return  NextResponse.json({message:"Something went wrong"},{status:500})
    }
}