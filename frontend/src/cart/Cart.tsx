import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { getCart } from './serves/GetCard'
import type { cartitem } from './serves/types'
import { deletItem } from './serves/DeletItemCart'
import toast from 'react-hot-toast'

export default function Cart() {
  const queryClient=useQueryClient()
//////display cart
    let{data}=useQuery({
        queryKey:['get cart'],
        queryFn:getCart,
        
    })

const allitems=data
console.log(allitems)
//////////////delet item
let{mutate:deletprod}=useMutation({
  mutationFn:deletItem,
  onSuccess:()=>{
    toast.success('Deleted done')
    queryClient.invalidateQueries({
      queryKey:['get cart']
    })

  }

})


  return (
    <>
    <div className="container mx-auto px-4 py-10">
  <div className="grid md:grid-cols-3 gap-6">

    {/* 🛒 TABLE */}
    <div className="md:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-chart-1 text-gray-600">
          <tr className='text-center'>
            <th className=" p-4">Product</th>
            <th className=" p-4">Qty</th>
            <th className=" p-4">buy</th>
            <th className=" p-4">Delet</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {allitems?.map((elem:cartitem)=>
            <tr className="hover:bg-gray-50  pt-5 transition text-center">
            
            <td className="font-semibold">مش لاقي الاسم عشان احطه</td>

            {/* 🔢 Qty */}
            <td>
              <div className="flex items-center gap-2 bg-gray-100 w-fit px-2 py-1 rounded-full">

                <span className="px-2 font-medium">{elem.quantity}</span>
              
              </div>
            </td>

            {/* 💰 buy */}
            <td className="font-semibold   p-4 text-green-600 flex justify-center items-center">
 <button className="w-full bg-chart-5 text-white py-3 rounded-xl hover:bg-gray-800 transition">
        Checkout
      </button>            </td>

            {/* ❌ Delete */}
            <td>
              <div className='text-center'>
                 <button onClick={()=>{deletprod(elem.id)}} className="text-red-500 hover:text-red-700 transition text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-center">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

              </button>

              </div>
             
            </td>
          </tr>

          )}

          

        </tbody>
      </table>
    </div>

    {/* 🧾 SUMMARY */}
    <div className="bg-white rounded-2xl shadow-md p-6 h-fit border border-gray-200">

      <h2 className="text-xl font-semibold mb-4">
        Order Summary
      </h2>

      <div className="flex justify-between mb-3 text-gray-600">
        <span>Items</span>
        <span>3</span>
      </div>

      <div className="flex justify-between mb-4 text-gray-600">
        <span>Total</span>
        <span className="font-bold text-lg text-green-600">$3597</span>
      </div>

      <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
        Checkout
      </button>
    </div>

  </div>
</div>
    </>

  )
}
