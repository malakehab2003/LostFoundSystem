import { useQuery } from '@tanstack/react-query'
import { getorders } from './getOrders'

export default function Order() {
    let{data}=useQuery({
        queryKey:['get all orders'],
        queryFn:getorders
    })
    console.log(data)




  return (<>
<div className='w-3/4 mx-auto py-10'>
  
  <p className='text-center text-6xl font-bold mb-10 text-gray-800'>
    Orders
  </p>

  <div className="bg-white max-w-md mx-auto p-8 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
    
    <h5 className="mb-6 text-2xl font-semibold text-center text-gray-700">
      Details Order
    </h5>
      {data?<div className="space-y-4 text-gray-600 text-lg">

      <p className="flex justify-between">
        <span className="font-medium">Name</span>
        <span>{data.order.user.name}</span>
      </p>

      <p className="flex justify-between">
        <span className="font-medium">Total Price</span>
        <span className="text-green-600 font-semibold">
          {data.order.total_price}
        </span>
      </p>

      <p className="flex justify-between">
        <span className="font-medium">Payment type</span>
        <span className="capitalize">
          {data.order.payment_type}
        </span>
      </p>

      <p className="flex justify-between">
        <span className="font-medium">Order status</span>
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
          {data.order.order_status}
        </span>
      </p>

    </div>  :'no reslt'}
    

  </div>

</div>

  </>
  )
}
