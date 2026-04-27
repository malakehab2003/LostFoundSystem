// check out/CheckOut.tsx
import React, { useState } from 'react';
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
import type { CheckOutValues } from './typesCkeckOut';

export default function CheckOut() {
    const location = useLocation();
    const navigate = useNavigate();
    const totalprice = location.state?.totalPrice || 0;

    // State variables
    const [receive_typee, Setreceive_type] = useState('');
    const [payment_typee, Setpayment_type] = useState('');
    const [idadress, Setidadress] = useState<number>(0);

    console.log('totalprice:', totalprice);

    // Get user addresses
    const { data: adressUser } = useQuery({
        queryKey: ['addres'],
        queryFn: adressid,
    });

    console.log('addresses:', adressUser);

    // Payment mutation
    const { mutate: payment, data: paymentResp } = useMutation({
        mutationFn: paymentOnline
    });

    // Get cart products for payment
    async function getpaymentValues() {
        const cart = await getCart();
        console.log('cart:', cart);

        const products = [];
        for (let i = 0; i < cart?.length; i++) {
            products.push({
                productId: cart[i].product_id,
                quantity: cart[i].quantity
            });
        }
        return products;
    }

    // Order values
    const values = {
        total_price: totalprice,
        receive_type: receive_typee,
        payment_type: payment_typee,
        address_id: idadress,
        promo_code_id: 0
    };

    // Create order items mutation
    const queryClientOrderItems = useQueryClient();
    const queryClient = useQueryClient();

    const { data: massageOrder, mutate: orderCreate } = useMutation({
        mutationFn: createorderItems,
        onSuccess: () => {
            queryClientOrderItems.invalidateQueries({ queryKey: ['get all orders'] });
            queryClient.invalidateQueries({ queryKey: ['get cart'] });
        }
    });

    // Main order mutation
    const { mutate: order, data: orders, isPending: isCreatingOrder } = useMutation({
        mutationFn: createOrder,
        onSuccess: async (resp) => {
            if (resp?.message === "Order created successfully") {
                toast.success("Order created successfully");
                
                // Create order items
                await orderCreate(resp?.order?.id);
                
                // Get cart products for payment
                const products = await getpaymentValues();
                
                // Process payment if online
                if (payment_typee === 'card') {
                    payment({ products });
                    toast.loading('Redirecting to payment...');
                } else {
                    toast.success('Order placed successfully!');
                    setTimeout(() => {
                        navigate('/my-orders');
                    }, 1500);
                }
            } else if (resp?.err === "Missing requried fields") {
                toast.error('Missing required fields');
            } else if (resp?.err === "Address is requried") {
                toast.error('Address is required');
                navigate('/dashboard/address');
            } else {
                toast.error(resp?.err || 'Error creating order');
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Something went wrong');
        }
    });

    // Store order ID in localStorage
    if (orders?.order?.id) {
        console.log('Order ID:', orders.order.id);
        localStorage.setItem('idOrder', orders.order.id.toString());
    }

    console.log('Payment response:', paymentResp);
    console.log('Order response:', orders);
    console.log('Order items response:', massageOrder);

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
                    <span className="font-medium">
                        {adressUser?.cart?.length || 0}
                    </span>
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
                    <label className="text-sm font-medium text-gray-600">Delivery Type</label>
                    <Select required onValueChange={(value) => Setreceive_type(value)}>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm hover:border-gray-300 transition">
                            <SelectValue placeholder="Choose delivery method" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-lg">
                            <SelectGroup>
                                <SelectItem value="delivery" className="py-2">🚚 Delivery</SelectItem>
                                <SelectItem value="pickup" className="py-2">🏪 Pickup</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Payment Method</label>
                    <Select required onValueChange={(value) => Setpayment_type(value)}>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm hover:border-gray-300 transition">
                            <SelectValue placeholder="Choose payment method" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-lg">
                            <SelectGroup>
                                <SelectItem value="cash" className="py-2">💵 Cash</SelectItem>
                                <SelectItem value="card" className="py-2">💳 Online</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <Select required onValueChange={(value) => Setidadress(Number(value))}>
                        <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 shadow-sm hover:border-gray-300 transition">
                            <SelectValue placeholder="Select your address" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            <SelectGroup>
                                {adressUser?.addresses?.map((item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                        className="py-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        📍 {item.address}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Button */}
            <button
                onClick={() => {
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
                    order(values);
                }}
                disabled={isCreatingOrder}
                className="w-full bg-black text-white py-3 rounded-2xl text-lg font-semibold hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isCreatingOrder ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                    </div>
                ) : (
                    'Confirm Order'
                )}
            </button>
        </div>
    );
}