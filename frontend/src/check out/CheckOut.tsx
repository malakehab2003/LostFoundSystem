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
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder } from './servicePayment/createOrder';
import toast from 'react-hot-toast';
import { adressid } from './servicePayment/address';
import { getCart } from '@/cart/serves/GetCard';
import { paymentOnline } from './servicePayment/paymentOnline';
import { createorderItems } from '@/order/createOrderItems';
export default function CheckOut() {
    const location =useLocation();
    const navagite =useNavigate()
const totalprice = location.state?.totalPrice || 0    
console.log(totalprice)
    ////////////
    let {data:adressUser}=useQuery({
      queryKey:['addres'],
      queryFn:adressid,
    

    })

    console.log('adrees', adressUser)
   ///////////
   
 let [receive_typee,Setreceive_type]=useState('')
  let [payment_typee,Setpayment_type]=useState('')
   let [idadress,Setidadress]=useState(0)
   
     console.log('id' , idadress)

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
    address_id: idadress,
    promo_code_id: 0
}
//////////////create order Items
  const queryClientOrderItems=useQueryClient()
   const queryClient=useQueryClient()

let{data:massageOrder,mutate:orderCreate}=useMutation({
      mutationFn:createorderItems,
      onSuccess:()=>{
queryClientOrderItems.invalidateQueries({
      queryKey:['get all orders']})

queryClient.invalidateQueries({
      queryKey:['get cart']})      
      }

    })
//////////////////
const { mutate: order,data:orders } = useMutation({
  mutationFn: createOrder,

  onSuccess: async (resp) => {

    if (resp?.message === "Order created successfully") {
      toast.success("Order created successfully")
      orderCreate(resp?.order?.id)
    const xx = await getpaymentValues(); // ✅ استنى البيانات
 
       
          payment({products:xx})
        
    }
    else if(resp?.err === "Missing requried fields") {
            toast.error('Missing requried fields')

      
    }  else if(resp?.err === "Address is requried") {
          toast.error('Address is requried')
          navagite('/dashboard/address')
      
    }
    else{
      toast.error('errrrror')
    }
  }
})
////////////////payment
console.log('xx', xx)
if (orders?.order?.id) {
  console.log('orders', orders.order.id);
  localStorage.setItem('idOrder', orders.order.id.toString());
}
///////////////////
console.log("strip",paymentResp)
console.log('order',orders)
console.log('message',massageOrder)
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

  {/* Receive Type */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-600">Delivery Type</label>
    <Select required onValueChange={(value) => Setreceive_type(value)}>
      <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm hover:border-gray-300 transition">
        <SelectValue placeholder="Choose delivery method" />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-lg">
        <SelectGroup>
          <SelectItem value="delivery" className="py-2">🚚 Delivery</SelectItem>
          <SelectItem value="pickup" className="py-2">🏪 Pickup</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>

  {/* Payment Type */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-600">Payment Method</label>
    <Select required onValueChange={(value) => Setpayment_type(value)}>
      <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm hover:border-gray-300 transition">
        <SelectValue placeholder="Choose payment method" />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-lg">
        <SelectGroup>
          <SelectItem value="cash" className="py-2">💵 Cash</SelectItem>
          <SelectItem value="card" className="py-2">💳 Online</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>

  {/* Address */}
  <div className="md:col-span-2 space-y-2">
    <label className="text-sm font-medium text-gray-600">Address</label>
    <Select required onValueChange={(value) => Setidadress(value)}>
      <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm hover:border-gray-300 transition">
        <SelectValue placeholder="Select your address" />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-lg max-h-60 overflow-y-auto">
        <SelectGroup>
          {adressUser?.addresses?.map((item) => (
            <SelectItem
              key={item.id}
              value={item.id}
              className="py-2 hover:bg-gray-100 rounded-lg"
            >
              📍 {item.address}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>

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
