import axios from "axios";

export async function callItem(){
    
    let{data}=await axios.get('https://ecommerce.routemisr.com/api/v1/products')
     return data
   
}

export async function singleItem(id){
    
    let{data}=await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
     return data
   
}