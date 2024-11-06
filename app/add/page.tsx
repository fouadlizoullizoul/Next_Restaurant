"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
type Input = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};
type Option = {
  title: string;
  additionalPrice: number;
};
const AddPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file,setFile]=useState<File>()
  const [inputs, setInputs] = useState<Input>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });
  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });
  const [options, setOptions] = useState<Option[]>([]);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]:name === "price" ? parseFloat(value) || 0 : value};
    });
  };
  const handleChangeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOption((prev) => ({
      ...prev,
      [name]: name === "additionalPrice" ? parseFloat(value) || 0 : value,
    }));
  };
  const handleChangeImg=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const target = e.target as HTMLInputElement
        const item =(target.files as FileList)[0]
        setFile(item)
  }
  const upload = async ()=>{
    const data =new FormData()
    data.append("file",file!)
    data.append("upload_preset","restaurant")
    if(!file){
      throw new Error("No file selected for upload")
    }
    const res =await fetch("https://api.cloudinary.com/v1_1/drcjwynkg/image/upload",{
        method:"POST",
        body:data,
    });
    console.log("res",res)
    if (!res.ok) {
      const errorDetails = await res.json();
      console.error("Error Details:", errorDetails);
      throw new Error("Failed to upload image");
    }
        const resData =await res.json()
    return resData.url
  }
  const handleSubmit= async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try {
        const url = await upload();
        const res =await fetch("http://localhost:3000/api/products",{
            method:"POST",
            body:JSON.stringify({
                img:url,
                ...inputs,
                options
            }
            )
        })
        const data= await res.json()
        router.push(`/product/${data.id}`)
    } catch (error) {
        console.log("errrrror",error)
    }
  }
  return (
    <div>
      <form className="shadow-lg flex flex-wrap gap-4 p-8" onSubmit={handleSubmit}>
        <h1>Add New Product</h1>
        <div className="w-full flex flex-col gap-2">
          <label>Image</label>
          <input
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="file"
            onChange={handleChangeImg}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Title</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="text"
            name="title"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Description</label>
          <textarea
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            name="desc"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Price</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="number"
            name="price"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Category</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="text"
            name="catSlug"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Options</label>
          <div>
            <input
              onChange={handleChangeOption}
              className="ring-1 ring-red-200 p-2 rounded-sm"
              type="text"
              placeholder="Title"
              name="title"
            />
            <input
              onChange={handleChangeOption}
              className="ring-1 ring-red-200 p-2 rounded-sm"
              type="text"
              placeholder="Additional Price"
              name="additionalPrice"
            />
          </div>
          <div
            className="w-52 bg-red-500 text-white p-2"
            onClick={() => setOptions((prev) => [...prev, option])}
          >
            Add Option
          </div>
        </div>
        <div>
          {options.map((item) => (
            <div
              className="ring-1 p-2 ring-red-500 rounded-md cursor-pointer"
              key={item.title}
              onClick={()=>setOptions(options.filter((opt)=>opt.title !== item.title))}
            >
              <span>{item.title}</span>
              <span>${item.additionalPrice}</span>
            </div>
          ))}
        </div>
        <button type="submit" className=" bg-red-500 w-full text-white p-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;
