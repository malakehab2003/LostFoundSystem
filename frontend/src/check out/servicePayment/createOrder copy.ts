import type { checkOut_resp } from "./typesCkeckOut"

export async function createOrder(vaules:checkOut_resp ) {
       const token=localStorage.getItem("token")
    const resp=await fetch('http://localhost:5000/api/order/create',{
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