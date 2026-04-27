// pages/AdminOrders.tsx
import { useState, useMemo, Fragment } from 'react';
import { useUserOrders } from '@/order/hooks/useUserOrders';
import { useUpdateOrder } from '@/order/hooks/useUpdateOrder';
import { useOrderItems } from '@/order/hooks/useOrderItems';
import toast from 'react-hot-toast';
import type { Order } from '@/order/hooks/useUserOrders';

const PRIMARY_COLOR = '#7F22FE';

export default function AdminOrders() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [filterUserId, setFilterUserId] = useState<string>('');
    const [searchByName, setSearchByName] = useState<string>('');
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    
    const { 
        orders, 
        isLoading, 
        error, 
        refetch,
        searchOrdersByName
    } = useUserOrders(true);
    
    const { updateOrder, isLoading: isUpdating } = useUpdateOrder();
    
    // ✅ جلب منتجات الأوردر المفتوح فقط
    const { 
        productsList, 
        isLoading: isLoadingItems,
        orderTotal: itemsOrderTotal,
        totalItems
    } = useOrderItems(expandedOrderId);
    
    const [updateForm, setUpdateForm] = useState({
        order_status: '',
        payment_type: '',
        receive_type: '',
        total_price: ''
    });

    // تطبيق الفلاتر
    const filteredOrders = useMemo(() => {
        let result = orders;
        
        if (filterUserId) {
            result = result.filter(order => order.user_id === Number(filterUserId));
        }
        
        if (searchByName) {
            result = searchOrdersByName(searchByName);
        }
        
        return result;
    }, [orders, filterUserId, searchByName, searchOrdersByName]);

    // إحصائيات
    const stats = {
        total: filteredOrders.length,
        processing: filteredOrders.filter(o => o.order_status === 'processing').length,
        shipped: filteredOrders.filter(o => o.order_status === 'shipped').length,
        delivered: filteredOrders.filter(o => o.order_status === 'delivered').length,
        cancelled: filteredOrders.filter(o => o.order_status === 'cancelled').length,
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: PRIMARY_COLOR }}></div>
                    <p className="mt-4 text-gray-500">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-red-500 mb-4">{error.message}</p>
                <button 
                    onClick={() => refetch()}
                    className="px-6 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const handleUpdateOrder = (order: Order) => {
        setSelectedOrder(order);
        setUpdateForm({
            order_status: order.order_status,
            payment_type: order.payment_type,
            receive_type: order.receive_type,
            total_price: order.total_price.toString()
        });
        setShowUpdateModal(true);
    };

    const submitUpdate = () => {
        if (!selectedOrder) return;
        
        updateOrder(selectedOrder.id, {
            order_status: updateForm.order_status as any,
            payment_type: updateForm.payment_type as any,
            receive_type: updateForm.receive_type as any,
            total_price: Number(updateForm.total_price)
        });
        
        setShowUpdateModal(false);
        setTimeout(() => {
            refetch();
            toast.success('Orders list refreshed');
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing': return '⏳';
            case 'shipped': return '🚚';
            case 'delivered': return '✅';
            case 'cancelled': return '❌';
            default: return '📦';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="w-full px-4 py-6 md:px-8 md:py-10">
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: PRIMARY_COLOR }}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Orders Management
                        </h1>
                    </div>
                    <p className="text-gray-500">Manage and track all customer orders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4" style={{ borderLeftColor: PRIMARY_COLOR }}>
                        <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                        <p className="text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>{stats.total}</p>
                        <p className="text-xs text-gray-400 mt-2">All time</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-yellow-400">
                        <p className="text-sm text-gray-500 mb-1">Processing</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.processing}</p>
                        <p className="text-xs text-gray-400 mt-2">Awaiting action</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-500 mb-1">Shipped</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.shipped}</p>
                        <p className="text-xs text-gray-400 mt-2">On the way</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-green-400">
                        <p className="text-sm text-gray-500 mb-1">Delivered</p>
                        <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                        <p className="text-xs text-gray-400 mt-2">Completed</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-red-400">
                        <p className="text-sm text-gray-500 mb-1">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                        <p className="text-xs text-gray-400 mt-2">Cancelled</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Filter by Name */}
                            <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center w-full">
                                <div className="flex items-center gap-2 min-w-fit">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <label className="text-sm font-medium text-gray-700">Customer Name:</label>
                                </div>
                                <input
                                    type="text"
                                    value={searchByName}
                                    onChange={(e) => setSearchByName(e.target.value)}
                                    placeholder="Search by customer name..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                                    style={{ focusRingColor: PRIMARY_COLOR }}
                                />
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => refetch()}
                                className="px-5 py-2 rounded-xl text-white transition-all hover:opacity-90 flex items-center gap-2"
                                style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                            {(filterUserId || searchByName) && (
                                <button
                                    onClick={() => {
                                        setFilterUserId('');
                                        setSearchByName('');
                                    }}
                                    className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Products</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <Fragment key={order.id}>
                                        <tr className="hover:bg-purple-50/30 transition-all duration-200 group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm font-semibold text-gray-900">#{order.id}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white text-sm font-medium">
                                                        {order.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-700 font-medium">{order.user?.name || `User #${order.user_id}`}</span>
                                                        {order.user?.email && (
                                                            <p className="text-xs text-gray-400">{order.user.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* ✅ عمود المنتجات */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition"
                                                >
                                                    <span>📦</span>
                                                    <span>{expandedOrderId === order.id ? 'Hide Products' : 'View Products'}</span>
                                                    <svg className={`w-4 h-4 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                
                                                {/* ✅ عرض المنتجات عند التوسيع */}
                                                {expandedOrderId === order.id && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        {isLoadingItems ? (
                                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                                                                Loading products...
                                                            </div>
                                                        ) : productsList && productsList.length > 0 ? (
                                                            <div className="space-y-2">
                                                                <div className="text-xs font-semibold text-gray-500 mb-2">
                                                                    {totalItems} product{totalItems !== 1 ? 's' : ''} in this order:
                                                                </div>
                                                                {productsList.map((product, idx) => (
                                                                    <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                                                            <span className="font-medium text-gray-800">{product.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="text-gray-500">Qty: <span className="font-semibold">{product.quantity}</span></span>
                                                                            <span className="text-gray-500">Price: ${product.price.toFixed(2)}</span>
                                                                            <span className="text-purple-600 font-semibold">Subtotal: ${product.subtotal.toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <div className="flex justify-end pt-2 mt-2 border-t border-gray-200">
                                                                    <span className="text-sm font-semibold text-purple-600">
                                                                        Total: ${itemsOrderTotal.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-400 text-center py-2">No products found</p>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold" style={{ color: PRIMARY_COLOR }}>
                                                    ${Number(order.total_price).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                                                    {order.payment_type === 'card' ? '💳' : '💵'} {order.payment_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                                    {order.receive_type === 'delivery' ? '🚚' : '🏪'} {order.receive_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(order.order_status)}`}>
                                                    {getStatusIcon(order.order_status)} {order.order_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleUpdateOrder(order)}
                                                    className="px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90 flex items-center gap-1"
                                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-lg">
                                No orders found matching your filters
                            </p>
                        </div>
                    )}
                </div>

                {/* Update Modal */}
                {showUpdateModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: PRIMARY_COLOR }}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Update Order #{selectedOrder.id}</h3>
                                </div>
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                    <select
                                        value={updateForm.order_status}
                                        onChange={(e) => setUpdateForm({ ...updateForm, order_status: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50"
                                        style={{ focusRingColor: PRIMARY_COLOR }}
                                    >
                                        <option value="processing">⏳ Processing</option>
                                        <option value="shipped">🚚 Shipped</option>
                                        <option value="delivered">✅ Delivered</option>
                                        <option value="cancelled">❌ Cancelled</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                                    <select
                                        value={updateForm.payment_type}
                                        onChange={(e) => setUpdateForm({ ...updateForm, payment_type: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50"
                                        style={{ focusRingColor: PRIMARY_COLOR }}
                                    >
                                        <option value="cash">💵 Cash</option>
                                        <option value="card">💳 Card</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
                                    <select
                                        value={updateForm.receive_type}
                                        onChange={(e) => setUpdateForm({ ...updateForm, receive_type: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50"
                                        style={{ focusRingColor: PRIMARY_COLOR }}
                                    >
                                        <option value="delivery">🚚 Delivery</option>
                                        <option value="pickup">🏪 Pickup</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={updateForm.total_price}
                                        onChange={(e) => setUpdateForm({ ...updateForm, total_price: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50"
                                        style={{ focusRingColor: PRIMARY_COLOR }}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={submitUpdate}
                                    disabled={isUpdating}
                                    className="flex-1 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Order'}
                                </button>
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}