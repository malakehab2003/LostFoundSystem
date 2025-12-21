import React from 'react'

export default function Home() {
  return (<>
  
  <div className='main vh-100'>
    <div className='flex justify-content-center align-content-center vh-100'>
      <div className='container '>
      <div className="row">
        <div className="col-md-8">
          <div className="inner">
            <p className='h1 ff'>We are here to help <br/>
            you find your lot items </p>
            <p className='h4 '>Day3 is a free and easy way to  search 300K+ lost and found<br></br>
               thinks to help them return home.</p>
               <div className='flex justify-content-between mt-5'>
                 <button className='btn border-dark bg-success text-light col-2  '> lost</button>   
              <button className='btn border-dark bg-light text-success col-2 ms-3 '> found</button>

               </div>
             
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <img src="./src/assets/1.png" className='w-100' alt="" />
          </div>
        </div>
      </div>

    </div>
    
    </div>
    
    
    
    
  </div>
  
  
  </>
    
  )
}
