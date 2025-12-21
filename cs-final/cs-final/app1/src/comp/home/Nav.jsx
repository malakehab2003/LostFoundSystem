import React from 'react'

export default function Nav() {
  return (<>

  <nav className="navbar navbar-expand-lg bg-body-tertiary ">
  <div className="container ">
    <a className="navbar-brand fs-3 text-success" >ضايع</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <div className="flex"></div>
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item  ps-2">
          <a className="nav-link " aria-current="page" >Something Lost</a>
        </li>
        <li className="nav-item  ms-2">
          <a className="nav-link " >Something Found</a>
        </li> 
         <li className="nav-item  ps-2">
          <a className="nav-link " >How to help</a>
        </li>
        <li className="nav-item  ps-2">
          <a className="nav-link " >Shop</a>
        </li>
       
        
      </ul>
      <button className=' bg-light text-success border-0 ms-5 ps-5'><i class="fa-solid fa-user"></i>sign in</button>
      <button className='btn main text-light rounded-5'>Donate</button>
      
    </div>
  </div>
</nav>

  </>)
  
}
