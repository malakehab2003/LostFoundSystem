import {  useQuery } from '@tanstack/react-query'
import { getorders } from './getOrders'
import { getorderItems } from './getOrderItems'

export default function Order() {
    let{data}=useQuery({
        queryKey:['get all orders'],
        queryFn:getorders
    })
    console.log('order',data)
/////////////oreder items
    let{data:orderItems}=useQuery({
        queryKey:['get all orders items'],
        queryFn:getorderItems
    })
    console.log('order items',orderItems)
    //////////////create order items
    

  return (<>
<div className='w-full md:w-3/4 mx-auto py-6 md:py-10 px-4 md:px-0'>
  
  {/* Header Section */}
  <div className="text-center mb-8 md:mb-12">
    <p className='text-4xl md:text-6xl font-bold text-gray-800 inline-block border-b-4 border-blue-500 pb-2'>
      Order
    </p>
  </div>

  {/* Grid Layout - Stack on mobile, side by side on large screens */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
    
    {/* Order Details Card */}
    <div className="bg-white max-w-md lg:max-w-full mx-auto w-full p-6 md:p-8 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      
      <div className="flex items-center justify-center mb-6">
        <div className="h-1 w-12 bg-blue-500 rounded-full mr-3"></div>
        <h5 className="text-xl md:text-2xl font-semibold text-gray-700">
          Details Order
        </h5>
        <div className="h-1 w-12 bg-blue-500 rounded-full ml-3"></div>
      </div>

      {data ? (
        <div className="space-y-4 md:space-y-5 text-gray-600 text-base md:text-lg">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-medium flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Name
            </span>
            <span className="text-gray-800 font-medium">{data.order.user.name}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-medium flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Total Price
            </span>
            <span className="text-green-600 font-bold text-lg md:text-xl">
              ${data.order.total_price}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-medium flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Payment type
            </span>
            <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
              {data.order.payment_type}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-medium flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Order status
            </span>
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm shadow-sm">
              {data.order.order_status}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>no result</p>
        </div>
      )}
    </div>

    {/* Order Items Section */}
    <div className="bg-white max-w-md lg:max-w-full mx-auto w-full p-6 md:p-8 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      
      <div className="flex items-center justify-center mb-6">
        <div className="h-1 w-12 bg-green-500 rounded-full mr-3"></div>
        <h5 className="text-xl md:text-2xl font-semibold text-gray-700">
          Details Order Items
        </h5>
        <div className="h-1 w-12 bg-green-500 rounded-full ml-3"></div>
      </div>

      {orderItems?.items?.length > 0 ? (
        <div className="space-y-4 md:space-y-6 max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2">
          {orderItems?.items?.map((item, index) => (
            <div key={index} className="space-y-3 text-gray-600 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors duration-200">
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500 text-sm md:text-base">Name product</span>
                <span className="text-gray-800 font-semibold text-sm md:text-base">{item?.product.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500 text-sm md:text-base">Price product</span>
                <span className="text-green-600 font-bold text-base md:text-lg">
                  ${item?.product.price}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-500 text-sm md:text-base">Product quantity</span>
                <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-blue-100 text-blue-700 font-bold rounded-full text-sm md:text-base">
                  {item?.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>no result</p>
        </div>
      )}
    </div>
  </div>
</div>
  </>
  )
}
