import type { payment } from "./typesCkeckOut"

export async function paymentOnline(vaules:payment ) {
       const token=localStorage.getItem("token")
    const resp=await fetch('http://localhost:5000/api/payment/create-payment',{
        method:'POST',
         headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(vaules)
    })
    
  
    const data =await resp.json()
    return data

    
}