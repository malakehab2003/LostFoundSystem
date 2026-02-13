import React from 'react'
import type { allprod } from './types'
import { useNavigate } from 'react-router-dom'

export default function CardItem({elem}:{elem:allprod}) {
  const navagite = useNavigate();
  return (<>
   <div onClick={()=>{
    navagite('/singleitem',{
      state:{id:elem.id}
    })
   }} className='w-full lg:w-1/4 md:w-1/3 sm:w-1/2   '>
   <div className='m-4 rounded-2xl shadow shadow-gray-500 shadow-2xl bg-white '>
    <img src={elem.imageCover} className='rounded-2xl ' alt="" />
   <p className='ps-1 font-bold' >{elem.title.split(' ').slice(0,2).join(' ')}</p>
   <p className=' ps-1'>{elem.price}$</p>
   
   </div>
   

   </div>

  </>
  )
}
