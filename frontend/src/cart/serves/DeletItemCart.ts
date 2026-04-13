
export async function deletItem(id:number) {
       const token=localStorage.getItem("token")
    
    const resp=await fetch(`http://localhost:5000/api/cart/delete/${id}`,{
        method:'DELETE',
         headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    })
    
  
    const data =await resp.json()
    console.log(data)
    return data

    
}