"use client"
import { OrderType } from '@/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CiEdit } from "react-icons/ci";
import { toast } from 'react-toastify'
const OrderPage = () => {
  const {data:session,status}=useSession()
  const router =useRouter()
  if(status ==="unauthenticated"){
      router.push('/')
  }
  const { isPending, data } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      fetch('http://localhost:3000/api/orders').then((res) =>
        res.json(),
      ),
  })
  const queryClinet=useQueryClient()
  const mutation =useMutation({
    mutationFn:({id,status}:{id:string,status:string})=>{
      return fetch(`http://localhost:3000/api/orders/${id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      })
    },
    onSuccess(){
        queryClinet.invalidateQueries({queryKey:["orders"]})
    }
  })
  const handleUpdate= (e:React.FormEvent<HTMLFormElement>,id:string)=>{
      e.preventDefault();
      const form =e.target as HTMLFormElement;
      const input =form.elements[0] as HTMLInputElement
      const status=input.value
      mutation.mutate({id,status})
      toast.success("The oreder status has been changed!")
  } 
  if (isPending || status === "loading") return 'Loading...'

  return (
    <div className='p-4 lg:px-20 xl:px-40'>
        <table className='w-full border-separate border-spacing-3'>
          <thead>
            <tr className='text-left'>
              <th className='hidden md:block'>Order ID</th>
              <th>Date</th>
              <th>Price</th>
              <th  className='hidden md:block'>Products</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
         { data.map((item:OrderType)=> (
          <tr className={`text-sm md:text-base ${item.status !== "delivered" && "bg-red-50" }`} key={item.id}>
              <td  className='hidden md:block py-6 px-1'>{item.id}</td>
              <td  className='py-6 px-1'>{item.createdAt.toString().slice(0,10)}</td>
              <td  className='py-6 px-1'>{item.price}</td>
              <td  className='hidden md:block py-6 px-1'>{item.products[0].title}</td>
              {session?.user.isAdmin ?(
                  <td>
                    <form onSubmit={(e)=>handleUpdate(e,item.id)} className='flex items-center justify-center gap-4'>
                      <input placeholder={item.status} className='p-2 ring-red-100 ring-1 rounded-md' />
                      <button className='bg-red-500 p-2 rounded-full' >
                        <CiEdit  className='text-white w-5 h-5' size={6}/>
                      </button>
                    </form>
                  </td>
              ):(
                <td  className='py-6 px-1'>{item.status}</td>
              )}
            </tr>)) }
          </tbody>
        </table>
    </div>
  )
}

export default OrderPage
