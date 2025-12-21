import React from 'react'
import Nav from './Nav'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (<>
  <Nav/>
 <Outlet/>
  
<Footer/>
  </>

  )
}
