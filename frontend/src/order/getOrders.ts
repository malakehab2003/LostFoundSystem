
export async function getorders() {
       const token=localStorage.getItem("token")
       const idOrder=localStorage.getItem("idOrder")
       console.log(idOrder)
    const resp=await fetch(`http://localhost:5000/api/order/getOrder/${idOrder}`,{
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