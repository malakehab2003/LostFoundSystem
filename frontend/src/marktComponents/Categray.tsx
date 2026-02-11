import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Categray() {

  const navgate=useNavigate()
  return (<>
  <p className='text-center text-3xl'>catagery</p>
 <div onClick={()=>{navgate('/page1')}} className="h-screen flex flex-wrap  pt-30 ">
<div className='w-full sm:w-1/2 md:w-1/4 p-2 relative '>
<img   src='./src/assets/elastic-wristband-on-kid.webp' alt="" className='w-full rounded-2xl shadow shadow-black  shadow-5xl'/>
<p className='absolute bottom-1/7 md:bottom-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white text-center'> shop for loved </p>
</div>
<div className='w-full sm:w-1/2 md:w-1/4 p-2 relative'>
<img   src='./src/assets/keychain-on-bikekeys.webp' alt="" className='w-full rounded-2xl shadow shadow-black  shadow-5xl'/>
<p className='absolute bottom-1/7 md:bottom-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white text-center'> shop for items</p>

</div>
<div className='w-full sm:w-1/2 md:w-1/4 p-2 relative'>
<img   src='./src/assets/metal-tag-on-dog-collar.webp' alt="" className='w-full rounded-2xl shadow shadow-black  shadow-5xl'/>
<p className='absolute bottom-1/7 md:bottom-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white text-center'> shop for pets</p>

</div>
<div className='w-full sm:w-1/2 md:w-1/4 p-2 relative'>
<img   src='./src/assets/label-on-suitcase.webp' alt="" className='w-full rounded-2xl shadow shadow-black  shadow-5xl'/>
<p className='absolute bottom-1/7 md:bottom-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white text-center'> shop for luggage</p>

</div>
 </div>

  </>
  )
}
