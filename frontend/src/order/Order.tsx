// order/Order.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from './getOrders';
import { getOrderItems } from './getOrderItems';

export default function Order() {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    
    // ✅ جلب كل الطلبات (لأدمن)
    let { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['get all orders'],
        queryFn: getOrders
    });
    
    // ✅ جلب منتجات الطلب المحدد
    let { data: orderItems, isLoading: itemsLoading } = useQuery({
        queryKey: ['get order items', selectedOrderId],
        queryFn: () => getOrderItems(selectedOrderId as number),
        enabled: !!selectedOrderId  // بيشتغل بس لما تختار طلب
    });
    
    console.log('All orders:', ordersData);
    console.log('Selected order items:', orderItems);
    
    // استخراج مصفوفة الطلبات
    const orders = ordersData?.orders || [];
    
    if (ordersLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className='w-full mx-auto py-6 md:py-10 px-4 md:px-6'>
            {/* Header Section */}
            <div className="text-center mb-8 md:mb-12">
                <p className='text-4xl md:text-6xl font-bold text-gray-800 inline-block border-b-4 border-blue-500 pb-2'>
                    Orders Management
                </p>
                <p className="text-gray-500 mt-2">Total Orders: {orders.length}</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    
                    {/* القسم الأيمن: قائمة كل الطلبات */}
                    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-1 w-12 bg-blue-500 rounded-full mr-3"></div>
                            <h5 className="text-xl md:text-2xl font-semibold text-gray-700">
                                All Orders
                            </h5>
                            <div className="h-1 w-12 bg-blue-500 rounded-full ml-3"></div>
                        </div>
                        
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {orders.map((order: any) => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrderId(order.id)}
                                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                        selectedOrderId === order.id
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-bold text-gray-800">Order #{order.id}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    order.order_status === 'delivered' 
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.order_status === 'processing'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : order.order_status === 'cancelled'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                👤 {order.user?.name || 'Unknown User'}
                                            </p>
                                            <div className="flex gap-3 text-xs text-gray-400 mt-2">
                                                <span>📅 {new Date(order.created_at).toLocaleDateString()}</span>
                                                <span>📦 {order.receive_type === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-600 font-bold text-lg">
                                                ${order.total_price}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize mt-1">
                                                💳 {order.payment_type}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* القسم الأيسر: تفاصيل الطلب والمنتجات */}
                    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-1 w-12 bg-green-500 rounded-full mr-3"></div>
                            <h5 className="text-xl md:text-2xl font-semibold text-gray-700">
                                Order Details
                            </h5>
                            <div className="h-1 w-12 bg-green-500 rounded-full ml-3"></div>
                        </div>

                        {!selectedOrderId ? (
                            <div className="text-center py-20 text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p>Select an order to view details</p>
                            </div>
                        ) : itemsLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Loading items...</p>
                            </div>
                        ) : (
                            <>
                                {/* معلومات الطلب */}
                                {(() => {
                                    const selectedOrder = orders.find((o: any) => o.id === selectedOrderId);
                                    return (
                                        <div className="space-y-4 text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">
                                            <h6 className="font-bold text-gray-700 mb-2 text-center">Order Information</h6>
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Order ID:</span>
                                                <span className="text-gray-800">#{selectedOrder?.id}</span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Customer:</span>
                                                <span className="text-gray-800">{selectedOrder?.user?.name || 'N/A'}</span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Total Price:</span>
                                                <span className="text-green-600 font-bold">${selectedOrder?.total_price}</span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Payment Type:</span>
                                                <span className="capitalize">{selectedOrder?.payment_type}</span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Receive Type:</span>
                                                <span className="capitalize">{selectedOrder?.receive_type}</span>
                                            </div>
                                            
                                            {selectedOrder?.address && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Address:</span>
                                                    <span className="text-gray-800 text-sm text-right">{selectedOrder.address.address}</span>
                                                </div>
                                            )}
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Order Status:</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    selectedOrder?.order_status === 'delivered'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {selectedOrder?.order_status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="font-medium">Created At:</span>
                                                <span className="text-gray-600 text-sm">
                                                    {new Date(selectedOrder?.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* منتجات الطلب */}
                                <div>
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="h-1 w-8 bg-green-500 rounded-full mr-2"></div>
                                        <h6 className="text-lg font-semibold text-gray-700">Order Items</h6>
                                        <div className="h-1 w-8 bg-green-500 rounded-full ml-2"></div>
                                    </div>

                                    {orderItems?.items?.length > 0 ? (
                                        <div className="space-y-3 max-h-[350px] overflow-y-auto">
                                            {orderItems.items.map((item: any, index: number) => (
                                                <div key={index} className="border border-gray-200 rounded-xl p-3 hover:bg-gray-50">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="font-medium text-gray-700">Product:</span>
                                                        <span className="text-gray-800">{item?.product?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="font-medium text-gray-700">Price:</span>
                                                        <span className="text-green-600 font-bold">${item?.product?.price}</span>
                                                    </div>
                                                    {item?.color && (
                                                        <div className="flex justify-between mb-2">
                                                            <span className="font-medium text-gray-700">Color:</span>
                                                            <span className="text-gray-800">{item.color}</span>
                                                        </div>
                                                    )}
                                                    {item?.size && (
                                                        <div className="flex justify-between mb-2">
                                                            <span className="font-medium text-gray-700">Size:</span>
                                                            <span className="text-gray-800">{item.size}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="font-medium text-gray-700">Quantity:</span>
                                                        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                                                            {item?.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                                            <p>No items found in this order</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}