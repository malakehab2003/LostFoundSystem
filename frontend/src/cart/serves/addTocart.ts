import type { sendValues } from "./types";

export async function addToCart( vaules:sendValues) {
       const token=localStorage.getItem("token")
    const resp=await fetch('http://localhost:5000/api/cart/addProduct',{
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