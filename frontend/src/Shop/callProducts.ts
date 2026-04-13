export async function AllItems() {
    const resp=await fetch('http://localhost:5000/api/product/list')
    
  
    const data =await resp.json()
    return data

    
}