import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { getCart } from './serves/GetCard'
import type { cartitem } from './serves/types'
import { deletItem } from './serves/DeletItemCart'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Uptada } from './serves/updataCart'

export default function Cart() {
  const navagite =useNavigate()
 ////////
  const queryClient=useQueryClient()
  
//////display cart
    let{data}=useQuery({
        queryKey:['get cart'],
        queryFn:getCart
        
    })

const allitems=data
console.log('allitems', allitems)
//////////////delet item
let{mutate:deletprod}=useMutation({
  mutationFn:deletItem,
  onSuccess:()=>{
    toast.success('Deleted done')
    queryClient.invalidateQueries({
      queryKey:['get cart']
    })

  }

}
)
/////////total price fun
function total_Price() {
  if (!allitems) return 0;

  let sum = 0;

  for (let i = 0; i < allitems.length; i++) {
    sum += allitems[i].product.price * allitems[i].quantity;
  }

  return sum;
}

const totalPrice = total_Price() || 0;
console.log(totalPrice)


 function buutonCheckout(){
    navagite('/check out',{state:totalPrice })
  }

 

  ////////////////////////updata
  let{mutate:UpdataQUT ,data:ss}=useMutation({
      mutationFn:Uptada,
      onSuccess:(ss)=>{
        toast.success(ss?.message)
        console.log(ss)
    queryClient.invalidateQueries({
      queryKey: ['get cart']
    })
      },
    onError:()=>{
      toast.error('erro')
              console.log(ss)

    }  

    
    })
 console.log(ss)
  return (
    <>
 <div className="mx-auto max-w-4xl px-4 py-10">

  <div className="space-y-8">

    {/* 🛒 CART TABLE */}
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

      <div className="px-6 py-5 border-b bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Your Shopping Cart</h2>
        <p className="text-sm text-gray-500">Review your items before checkout</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr className="text-center">
              <th className="p-4">Product</th>
              <th className="p-4">Name</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Price</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {allitems?.map((elem: cartitem) => (
              <tr key={elem.id} className="hover:bg-gray-50 transition text-center">

                {/* Product */}
                <td className="p-4">
                  <Link
                    to={`/shop/products/${elem.product_id}`}
                    className="flex items-center justify-center gap-3"
                  >
                    <img
                      src={elem.product.image[0]}
                      className="w-12 h-12 object-cover rounded-xl border"
                      alt=""
                    />
                  </Link>
                </td>

                {/* Name */}
                <td className="p-4 font-medium text-gray-700">
                  {elem.product.name}
                </td>

                {/* Qty */}
                <td className="p-4">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">

                      <span
                        onClick={() => {
                          UpdataQUT({
                            product_id: elem.product_id,
                            cart_id: elem.id,
                            operation: "sub"
                          })
                        }}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow cursor-pointer"
                      >
                        -
                      </span>

                      <span className="font-semibold">
                        {elem.quantity}
                      </span>

                      <span
                        onClick={() => {
                          UpdataQUT({
                            product_id: elem.product_id,
                            cart_id: elem.id,
                            operation: "add"
                          })
                        }}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow cursor-pointer"
                      >
                        +
                      </span>

                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="p-4 font-semibold text-green-600">
                  {elem.product.price}
                </td>

                {/* Delete */}
                <td className="p-4">
                 <button
  onClick={() => deletprod(elem.id)}
  className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition shadow-sm"
>
  🗑️
</button>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>

    {/* 🧾 SUMMARY (BELOW) */}
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 w-full">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Order Summary
      </h2>

      <div className="space-y-4 text-gray-600">

        <div className="flex justify-between">
          <span>Items</span>
          <span className="font-medium">{allitems?.length}</span>
        </div>

        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span className="font-bold text-green-600">
            {total_Price()} EGP
          </span>
        </div>

      </div>

      <button
        onClick={buutonCheckout}
        className="mt-6 w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition font-medium"
      >
        Proceed to Checkout
      </button>

    </div>

  </div>
</div>
    </>

  )
}
