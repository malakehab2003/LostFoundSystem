import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './comp/home/Layout'
import About from './comp/home/About'
import Home from './comp/home/Home'


const rou= createBrowserRouter([
  {path:'', element:<Layout/> , children:[
    {index:true , element:<Home/>},
    {path:'about' , element:<About/>}
  ]}
])
function App() {


  return (
    <>
     <RouterProvider router={rou}/>
    </>
  )
}

export default App
