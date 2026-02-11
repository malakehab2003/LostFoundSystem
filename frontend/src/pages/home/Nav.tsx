import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {Button} from "@heroui/button";
export default function Nav() {
  let[nav,setnav]=useState(false)
  function toogle(){
    if(nav==true){
      setnav(false)
    }
    else{
      setnav(true)
    }
  }
  return (<>
 {nav? <ul className='flex flex-col pt-12'>
    <li>
     <NavLink to=''>something lost</NavLink>
    </li>
    <hr />
    <li>
     <NavLink to=''>something found</NavLink>
    </li>
    <hr />
    <li>
     <NavLink to=''>How to help</NavLink>
    </li>
    <hr />
    <li>
     <NavLink to='/shop'>shop</NavLink>
    </li>
  </ul>:null}
 <nav className='flex justify-around items-center bg-white fixed top-0 w-full h-14' >
  <svg onClick={toogle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 sm:hidden block">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>


 <div><p className='text-3xl text-black'>ضايغ</p></div>
 <div className='hidden sm:block'>
  <ul className='flex gap-4'>
    <li>
     <NavLink to=''>something lost</NavLink>
    </li>
    <li>
     <NavLink to=''>something found</NavLink>
    </li>
    <li>
     <NavLink to=''>How to help</NavLink>
    </li>
    <li>
     <NavLink to='/shop'>shop</NavLink>
    </li>
  </ul>
 </div>

 <div className='flex gap-5 items-center'>
  <div><Link to=''> sign in</Link></div>
  <Button color="secondary">Donate</Button>
   </div>
  
 </nav>

  </>)
  
}
