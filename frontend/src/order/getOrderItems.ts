
export async function getorderItems() {
       const token=localStorage.getItem("token")
       const idOrder=localStorage.getItem("idOrder")
       console.log(idOrder)
    const resp=await fetch(`http://localhost:5000/api/order/item/list/${idOrder}`,{
        method:'GET',
         headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    })
    
  
    const data =await resp.json()
    console.log(data)
    return data

    
}