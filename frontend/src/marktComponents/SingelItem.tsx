import React, { useEffect, useState } from 'react'
import { singleItem } from './CallAllItem'
import { useLocation } from 'react-router-dom'
import { button } from '@heroui/react';

export default function SingelItem() {
    const location = useLocation();
    const { id } = location.state;

     let[singleprod , Setsingleprod]=useState(null)
    async function dataApi() {
     const resp= await singleItem(id)
     Setsingleprod(resp.data)
     console.log(resp.data)
     
    }
    useEffect(()=>{
      dataApi()
   
   
    },[])
  return (<>
  {singleprod? <div className="flex flex-wrap h-screen pt-44" >
    <div className='w-1/2 '>
    <div className='m-4  flex justify-center items-center'>
 <img src={singleprod.imageCover} alt=""  className='w-full h-[550px] rounded-2xl'/>
    </div>
        
    </div>
     
      <div className='w-1/2 pt-24 flex flex-col items-start justify-evenly bg-primary-50 rounded-2xl '>
      <p className='font-bold ps-3'>{singleprod.title}</p>
      {singleprod.sold?<p className='bg-red-500 rounded-2xl w-[30px]'>sold out</p> :null}
      
      <p className='ps-3'><span className='font-bold'>description : </span> {singleprod.description}</p>
      <p className='ps-3'><span className='font-bold'>brand : </span> {singleprod.brand.name}</p>

      <p className='font-bold ps-3 '>price : {singleprod.price} $</p>
      <button className='bg-amber-300 rounded-2xl w-1/2 mx-auto'>add to card</button>
      </div>
      

  </div>:'Loading...'}
 
  </>
  )
}
