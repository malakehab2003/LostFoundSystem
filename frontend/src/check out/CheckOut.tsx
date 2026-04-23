import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder } from './servicePayment/createOrder';
import toast from 'react-hot-toast';
import { adressid } from './servicePayment/address';
import { getCart } from '@/cart/serves/GetCard';
import { paymentOnline } from './servicePayment/paymentOnline';
export default function CheckOut() {
    const location =useLocation();
const totalprice = location.state?.totalPrice || 0    
console.log(totalprice)
    ////////////
    let {data:adressUser}=useQuery({
      queryKey:['addres'],
      queryFn:adressid,
    

    })

    console.log('adrees', adressUser)
   ///////////
    const id= adressUser?.addresses?.[0]?.id
     console.log(id)
 let [receive_typee,Setreceive_type]=useState('')
  let [payment_typee,Setpayment_type]=useState('')

 console.log(payment_typee)
 /////////////////////
 let[xx,setxx]=useState(null)
let{mutate:payment ,data:paymentResp}=useMutation({
  mutationFn:paymentOnline

})
/////////////
async function getpaymentValues() {
  let cart = await getCart();

  console.log(cart);

  let ss = [];

  for (let i = 0; i < cart?.length; i++) {
    ss.push({
      productId: cart[i].product_id,
      quantity: cart[i].quantity
    });
      
  }

  return ss; // ✅ رجّع بدل setState
}
///////////////////////
 let values={
    total_price:44,
    receive_type: receive_typee,
    payment_type: payment_typee,
    address_id: id,
    promo_code_id: 0
}

const { mutate: order } = useMutation({
  mutationFn: createOrder,

  onSuccess: async (resp) => {

    if (resp?.message === "Order created successfully") {
      toast.success("Order created successfully")
      
    const xx = await getpaymentValues(); // ✅ استنى البيانات
 
       
          payment({products:xx})
        
    }
  }
})
////////////////payment
console.log('xx', xx)

///////////////////
console.log("njknk",paymentResp)

  return (<>


<div className="w-full max-w-xl mx-auto rounded-3xl shadow-xl p-8 border bg-white border-gray-100 mt-20">

  {/* Title */}
  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
    Checkout
  </h2>

  {/* Summary */}
  <div className="space-y-4 mb-6">

    <div className="flex justify-between text-gray-500">
      <span>Items</span>
      <span className="font-medium">3</span>
    </div>

    <div className="flex justify-between text-lg font-bold">
      <span>Total</span>
      <span className="text-green-600">{totalprice} EGP</span>
    </div>

  </div>

  {/* Divider */}
  <div className="border-t border-gray-100 my-6"></div>

  {/* Selects */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

    <Select onValueChange={(value) => Setreceive_type(value)}>
      <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-11">
        <SelectValue placeholder="Delivery type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Receive Type</SelectLabel>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="pickup">Pickup</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select onValueChange={(value) => Setpayment_type(value)}>
      <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-11">
        <SelectValue placeholder="Payment method" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Payment Type</SelectLabel>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="card">Online</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

  </div>

  {/* Button */}
  <button
    onClick={() => { order(values) }}
    className="w-full bg-black text-white py-3 rounded-2xl text-lg font-semibold hover:bg-gray-800 active:scale-[0.99] transition"
  >
    Confirm Order
  </button>

</div>
       

    
  </>
   
  )
}
