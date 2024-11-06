"use client";
import { ProductType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { useCartStore } from "../utils/store";
import { toast } from "react-toastify";

const Price = ({product}: {product :ProductType}) => {
  const [total, setTotal] = useState(product.price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const {addToCart}=useCartStore()
  useEffect(()=>{
    useCartStore.persist.rehydrate()
  },[])
  useEffect(()=>{
    if(product.options?.length){
        setTotal(
          quantity * product.price + product.options[selected].additionalPrice
        )
    }
  },[quantity,selected,product])
  const handelCart=()=>{
    addToCart({
      id:product.id,
      title:product.title,
      price: total,
      img:product.img,
      ...(product.options?.length && {
        optionTitle: product.options[selected].title,
      }),
      quantity:quantity
    })
    toast.success("The products added to the cart!")
  }
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${total}</h2>
      {/* OPTIONS CONTAINER */}
      <div className="flex gap-4">
        {product.options?.length &&  product.options?.map((option, index) => (
          <button
            key={option.title}
            className="p-2 ring-1 ring-red-400 rounded-md min-w-[6rem]"
            style={{
              background: selected === index ? "rgb(248 113 113)" : "white",
              color:selected === index ? "white" : "red"
            }}
            onClick={()=> setSelected(index)}
          >
            {option.title}
          </button>
        ))}
      </div>
      {/* OPTIONS CONTAINER */}
      <div className="flex justify-between items-center">
        {/*  QUANTITY */}
        <div className="flex justify-between ring-red-500 ring-1 w-full p-3">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button onClick={()=>setQuantity(prev=> (prev > 1 ? prev - 1 : prev))}>{"<"}</button>
            <span>{quantity}</span>
            <button onClick={()=>setQuantity(prev=> (prev < 9 ? prev + 1 : prev))}>{">"}</button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button className="bg-red-500 uppercase p-3 w-56 text-white  ring-1 ring-red-500" onClick={handelCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
