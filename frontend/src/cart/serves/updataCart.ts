import type {  updataValue } from "./types";

export async function Uptada( vaules:updataValue) {
       const token=localStorage.getItem("token")
    const resp=await fetch('http://localhost:5000/api/cart/update/quantity',{
        method:'PUT',
         headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(vaules)
    })
    
  
    const data =await resp.json()
    return data

    
}