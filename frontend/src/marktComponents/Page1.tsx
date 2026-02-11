import React, { useEffect, useState } from 'react'
import { callItem } from './CallAllItem'
import CardItem from './CardItem'

export default function Page1() {
  let[allItem , SetAllItem]=useState(null)
 async function dataApi() {
  const resp= await callItem()
  SetAllItem(resp.data)
  console.log(resp.data)
  
 }
 useEffect(()=>{
   dataApi()


 },[])
  
  return (<>
  <div className="flex flex-wrap min:h-screen pt-20 bg-amber-100 ">
    <div className='w-0 md:w-1/4 pt-20'>
    <div className='w-5/6 mx-auto'>
      <div className='flex flex-wrap justify-between items-center'>
    <p className='font-bold pt-7'>Availability</p><i className="fa-solid fa-plus"></i>
    </div>
    <hr />
    <div className='flex flex-wrap justify-between items-center'>
    <p className='font-bold pt-7'>Price</p><i className="fa-solid fa-plus"></i>
    </div>
    
    <hr  />
     <div className='flex flex-wrap justify-between items-center'>
    <p className='font-bold pt-7'>Sort by</p><i className="fa-solid fa-plus"></i>
    </div>
    </div>
  
    
    </div>
    <div className="w-full md:w-3/4 ">
    <div className='flex flex-wrap'>
      {allItem?allItem.map((elem)=>{ return <CardItem elem={elem} />}):"loading"}
    </div>
    </div>
  </div>
  </>
  )
}
