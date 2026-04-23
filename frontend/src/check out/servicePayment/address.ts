
export async function adressid( ) {
       const token=localStorage.getItem("token")
       console.log('token ',token)
    
    const resp=await fetch('http://localhost:5000/api/address/list',{
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