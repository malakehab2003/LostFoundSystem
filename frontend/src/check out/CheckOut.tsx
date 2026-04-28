import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder } from './servicePayment/createOrder';
import toast from 'react-hot-toast';
import { adressid } from './servicePayment/address';
import { getCart } from '@/cart/serves/GetCard';
import { paymentOnline } from './servicePayment/paymentOnline';
import { createorderItems } from '@/order/createOrderItems';

export default function CheckOut() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State variables
    const [receive_typee, Setreceive_type] = useState('');
    const [payment_typee, Setpayment_type] = useState('');
    const [idadress, Setidadress] = useState<number>(0);
    const [totalprice, setTotalprice] = useState(0);
    const [cartProducts, setCartProducts] = useState([]);

    // Get user addresses
    const { data: adressUser, isLoading: addressLoading } = useQuery({
        queryKey: ['addres'],
        queryFn: adressid,
    });

    // Load cart and calculate total
    useEffect(() => {
        const loadCart = async () => {
            try {
                const cart = await getCart();
                console.log('Cart data:', cart);
                
                // Extract items based on response structure
                let items = [];
                if (cart?.items) {
                    items = cart.items;
                } else if (cart?.cart) {
                    items = cart.cart;
                } else if (Array.isArray(cart)) {
                    items = cart;
                }
                
                // Calculate total
                let total = 0;
                const products = [];
                
                for (const item of items) {
                    const price = item.product?.price || item.price || 0;
                    const quantity = item.quantity || 1;
                    total += price * quantity;
                    
                    products.push({
                        productId: item.product_id || item.product?.id,
                        quantity: quantity,
                        color: item.color,
                        size: item.size
                    });
                }
                
                setTotalprice(total);
                setCartProducts(products);
                console.log('Total price:', total);
                console.log('Products for order:', products);
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };
        
        loadCart();
    }, []);

    // Payment mutation
    const { mutate: payment, data: paymentResp } = useMutation({
        mutationFn: paymentOnline
    });

    // Create order items mutation
    const queryClientOrderItems = useQueryClient();
    const queryClient = useQueryClient();

    const { mutate: orderCreate } = useMutation({
        mutationFn: createorderItems,
        onSuccess: () => {
            queryClientOrderItems.invalidateQueries({ queryKey: ['get all orders'] });
            queryClient.invalidateQueries({ queryKey: ['get cart'] });
        },
        onError: (error) => {
            console.error('Error creating order items:', error);
            toast.error('Failed to create order items');
        }
    });

    // Main order mutation
    const { mutate: order, data: orders, isPending: isCreatingOrder } = useMutation({
        mutationFn: createOrder,
        onSuccess: async (resp) => {
            console.log('Order API response:', resp);
            
            if (resp?.message === "Order created successfully" && resp?.order?.id) {
                toast.success("Order created successfully");
                
                const orderId = resp.order.id;
                localStorage.setItem('idOrder', orderId.toString());
                
                // Create order items with cart products
                await orderCreate(orderId);
                
                // Process payment if online
                if (payment_typee === 'card' || payment_typee === 'online') {
                    if (cartProducts.length > 0) {
                        payment({ products: cartProducts });
                        toast.loading('Redirecting to payment...');
                    } else {
                        toast.success('Order placed successfully!');
                        setTimeout(() => navigate('/orders'), 1500);
                    }
                } else {
                    toast.success('Order placed successfully!');
                    setTimeout(() => navigate('/orders'), 1500);
                }
            } else if (resp?.err === "Missing requried fields") {
                toast.error('Missing required fields. Please check all fields.');
            } else if (resp?.err === "Address is requried") {
                toast.error('Address is required');
                navigate('/dashboard/address');
            } else {
                toast.error(resp?.err || 'Error creating order');
            }
        },
        onError: (error: any) => {
            console.error('Order mutation error:', error);
            toast.error(error?.message || 'Something went wrong');
        }
    });

    // Store order ID in localStorage
    if (orders?.order?.id) {
        console.log('Order ID saved:', orders.order.id);
        localStorage.setItem('idOrder', orders.order.id.toString());
    }

    const handleSubmit = () => {
        // Validate all fields
        if (!receive_typee) {
            toast.error('Please select delivery type');
            return;
        }
        if (!payment_typee) {
            toast.error('Please select payment method');
            return;
        }
        if (receive_typee === 'delivery' && !idadress) {
            toast.error('Please select an address');
            return;
        }
        if (totalprice <= 0) {
            toast.error('Cart is empty');
            return;
        }
        
        const orderValues = {
            total_price: totalprice,
            receive_type: receive_typee,
            payment_type: payment_typee,
            address_id: idadress,
            promo_code_id: 0
        };
        
        console.log('Submitting order:', orderValues);
        order(orderValues);
    };

    if (addressLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto rounded-3xl shadow-xl p-8 border bg-white border-gray-100 mt-20">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Checkout
            </h2>

            {/* Summary */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500">
                    <span>Items</span>
                    <span className="font-medium">{cartProducts.length}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">{totalprice} EGP</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-6"></div>

            {/* Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {/* Receive Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Delivery Type *</label>
                    <Select required onValueChange={(value) => Setreceive_type(value)}>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm">
                            <SelectValue placeholder="Choose delivery method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="delivery">🚚 Delivery</SelectItem>
                                <SelectItem value="pickup">🏪 Pickup</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Payment Method *</label>
                    <Select required onValueChange={(value) => Setpayment_type(value)}>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm">
                            <SelectValue placeholder="Choose payment method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="cash">💵 Cash</SelectItem>
                                <SelectItem value="card">💳 Online</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <Select required onValueChange={(value) => Setidadress(Number(value))}>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm">
                            <SelectValue placeholder="Select your address" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                            <SelectGroup>
                                {adressUser?.addresses?.map((item: any) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        📍 {item.address}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {receive_typee === 'delivery' && !idadress && (
                        <p className="text-red-500 text-xs mt-1">Address is required for delivery</p>
                    )}
                </div>
            </div>

            {/* Button */}
            <button
                onClick={handleSubmit}
                disabled={isCreatingOrder || totalprice === 0}
                className="w-full bg-black text-white py-3 rounded-2xl text-lg font-semibold hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isCreatingOrder ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                    </div>
                ) : totalprice === 0 ? (
                    'Cart is empty'
                ) : (
                    `Confirm Order • ${totalprice} EGP`
                )}
            </button>
        </div>
    );
}