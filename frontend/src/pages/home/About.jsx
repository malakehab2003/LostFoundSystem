import React from 'react'

export default function About() {
  return (<>
  
   <div className=' vh-100'>
    <div className='flex justify-content-center align-content-center vh-100'>
      <div className='container '>
      <div className="row justify-content-between align-items-center">
         <div className="col-md-4">
          <div>
            <img src="./src/assets/2.png" className='w-100' alt="" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="inner">
            <p className='h1 ff'>Always On - in Case<br></br>They Wander Off</p>
            <p className='h4 text-success'>sign up now in case they go missig later</p>
               <div className=' mt-5'>
               <span className='h1 text-black border-bottom border-success border-5'> Register things for free</span>

               </div>
             
          </div>
        </div>
       
      </div>

    </div>
    
    </div>
    
    
    
    
  </div>
  
  
  
  </>
    
  )
}
