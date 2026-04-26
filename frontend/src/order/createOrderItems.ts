
export async function createorderItems(id:number) {
       const token=localStorage.getItem("token")
       
    const resp=await fetch(`http://localhost:5000/api/order/item/create`,{
        method:'POST',
         headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({order_id:id})
    })
    
  
    const data =await resp.json()
    console.log(data)
    return data

    
}