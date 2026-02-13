import Categray from '@/marktComponents/Categray'
import { Button } from '@heroui/react'
import React from 'react'

export default function Home() {
  return (<>
  <div className='w-full h-screen flex flex-col flex-wrap justify-center items-center  text-white bg-chart-5 '>
    <div className='text-center text-6xl pt-20'>
      <i className="fa-solid fa-location-dot"></i>
    </div>
    <p className='text-center text-6xl  mt-15 '>
      We are here to help <br /> you find your lost items
    </p>
     <p className='text-center text-4xl  mt-10'>
Day3 is a free and easy way to search 300K+ lost
 and found <br></br> thinks to help them return home.    </p>
 <div className=' flex gap-16 text-center pt-15 '>
 <Button size='lg'  className='bg-black  text-white'>Lost</Button>
  <Button size='lg' color="secondary">found</Button>
  
  </div>

  </div>
  <Categray/>
  </>
  )
}
