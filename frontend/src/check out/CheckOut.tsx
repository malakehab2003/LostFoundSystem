import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder } from './servicePayment/createOrder';
import toast from 'react-hot-toast';
import { adressid } from './servicePayment/address';
import { getCart } from '@/cart/serves/GetCard';
import { paymentOnline } from './servicePayment/paymentOnline';
import { createorderItems } from '@/order/createOrderItems';

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckOut() {
    // Stripe hooks
    const stripe = useStripe();
    const elements = useElements();
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State
    const [receive_typee, Setreceive_type] = useState('');
    const [payment_typee, Setpayment_type] = useState('');
    const [idadress, Setidadress] = useState('');
    const [totalprice, setTotalprice] = useState(0);
    const [cartProducts, setCartProducts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Query for user addresses
    const { data: adressUser, isLoading: addressLoading } = useQuery({
        queryKey: ['addres'],
        queryFn: adressid,
        enabled: !!localStorage.getItem('token'), // فقط إذا كان المستخدم مسجل دخول
    });

    // Load cart data
    useEffect(() => {
        const loadCart = async () => {
            try {
                const cart = await getCart();
                console.log('Cart data:', cart);

                let items = [];
                if (cart?.items) items = cart.items;
                else if (cart?.cart) items = cart.cart;
                else if (Array.isArray(cart)) items = cart;

                if (items.length === 0) {
                    toast.error('Your cart is empty');
                    navigate('/cart');
                    return;
                }

                let total = 0;
                const products = [];

                for (const item of items) {
                    const price = item.product?.price || item.price || 0;
                    const quantity = item.quantity || 1;
                    const productId = item.product_id || item.product?.id;

                    if (!productId) {
                        console.warn('Product missing ID:', item);
                        continue;
                    }

                    total += price * quantity;

                    products.push({
                        productId: productId,
                        quantity: quantity,
                        color: item.color || null,
                        size: item.size || null
                    });
                }

                setTotalprice(total);
                setCartProducts(products);
                
                if (products.length === 0) {
                    toast.error('No valid products in cart');
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                toast.error('Failed to load cart');
            }
        };

        loadCart();
    }, [navigate]);

    // Create order items mutation
    const { mutateAsync: orderCreate } = useMutation({
        mutationFn: createorderItems,
       
        onError: (error) => {
            console.error('Failed to create order items:', error);
            toast.error("Failed to create order items");
            throw error;
        }
    });

    // Order creation mutation
    const { mutateAsync: createOrderMutation } = useMutation({
        mutationFn: createOrder,
        onError: (error) => {
            console.error('Order creation error:', error);
            toast.error(error?.message || "Failed to create order");
        }
    });

    // Payment mutation
    const { mutateAsync: processPayment , data:paymentstring} = useMutation({
        mutationFn: paymentOnline,
       
        onError: (error) => {
            console.error('Payment error:', error);
            toast.error(error?.message || "Payment processing failed");
            throw error;
        }
    });

    // Process card payment
    const processCardPayment = async (clientSecret) => {
        if (!stripe || !elements) {
            throw new Error("Stripe not initialized");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            throw new Error("Card element not found");
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    // يمكنك إضافة معلومات العميل هنا
                    // name: customerName,
                    // email: customerEmail,
                },
            },
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        if (result.paymentIntent.status !== "succeeded") {
            throw new Error("Payment was not successful");
        }

        return result;
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validation
        if (!receive_typee) {
            toast.error("Please select delivery type");
            return;
        }
        
        if (!payment_typee) {
            toast.error("Please select payment method");
            return;
        }
        
        if (totalprice <= 0) {
            toast.error("Your cart is empty");
            return;
        }
        
        if (!idadress && receive_typee === 'delivery') {
            toast.error("Please select an address for delivery");
            return;
        }

        if (payment_typee === 'card' && (!stripe || !elements)) {
            toast.error("Payment system is loading. Please try again.");
            return;
        }

        setIsProcessing(true);
        const loadingToast = toast.loading("Processing your order...");

        try {
            // Step 1: Create order
            const orderValues = {
                total_price: totalprice,
                receive_type: receive_typee,
                payment_type: payment_typee,
                address_id: receive_typee === 'delivery' ? Number(idadress) : null,
                promo_code_id: 0
            };

            const orderResponse = await createOrderMutation(orderValues);
            
            if (!orderResponse?.order?.id) {
                throw new Error("Failed to create order");
            }

            const newOrderId = orderResponse.order.id;
            setOrderId(newOrderId);
            localStorage.setItem('idOrder', newOrderId.toString());

            // Step 2: Create order items
            if (cartProducts.length > 0) {
                await orderCreate(newOrderId);
            }

            // Step 3: Process payment if needed
            if (payment_typee === 'card') {
                toast.loading("Redirecting to payment...", { id: loadingToast });
                
                const paymentData = await processPayment({ products: cartProducts });
                
                if (!paymentData?.clientSecret) {
                    throw new Error("No client secret received");
                }

                await processCardPayment(paymentData.clientSecret);
                
                toast.success("Payment successful! Order confirmed ✅", { id: loadingToast });
                
                // Clear cart and redirect
                queryClient.invalidateQueries({ queryKey: ['get cart'] });
                setTimeout(() => navigate("/orders"), 1500);
            } else {
                // Cash payment
                toast.success("Order created successfully! ✅", { id: loadingToast });
                queryClient.invalidateQueries({ queryKey: ['get cart'] });
                setTimeout(() => navigate("/orders"), 1500);
            }
            
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || "Something went wrong", { id: loadingToast });
            
            // If order was created but payment failed, you might want to handle that
            if (orderId && payment_typee === 'card') {
                toast.error("Order saved but payment failed. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle card element errors
    const handleCardError = (error) => {
        if (error.error) {
            toast.error(error.error.message);
        }
    };

    if (addressLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }
console.log('paymentstring',paymentstring)
    return (
        <div className="w-full max-w-xl mx-auto p-6 md:p-8 border border-gray-100 rounded-2xl shadow-2xl bg-white mt-10 md:mt-20 mb-10 md:mb-20 transition-all duration-300">
    <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Checkout</h2>

    {/* Order Summary */}
    <div className="bg-gray-50/80 rounded-xl p-5 space-y-3 mb-8">
        <div className="flex justify-between items-center">
            <span className="text-gray-600 text-lg">Total Items:</span>
            <span className="font-bold text-xl text-gray-800 bg-white px-4 py-1 rounded-full shadow-sm">{cartProducts.length}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
            <span className="text-gray-600 text-lg">Total Price:</span>
            <span className="font-black text-3xl text-emerald-600 tracking-tight">{totalprice.toFixed(2)} EGP</span>
        </div>
    </div>

    {/* Form Fields */}
    <div className="space-y-6">
        {/* Delivery Type */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Type <span className="text-red-500">*</span></label>
            <Select onValueChange={Setreceive_type} value={receive_typee}>
                <SelectTrigger className="w-full border-gray-300 focus:border-gray-500 rounded-xl py-6 shadow-sm">
                    <SelectValue placeholder="Select delivery type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="delivery">🚚 Home Delivery</SelectItem>
                    <SelectItem value="pickup">🏬 Store Pickup</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Address - Show only for delivery */}
        {receive_typee === 'delivery' && (
            <div className="animate-in fade-in duration-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address <span className="text-red-500">*</span></label>
                <Select onValueChange={Setidadress} value={idadress}>
                    <SelectTrigger className="w-full border-gray-300 focus:border-gray-500 rounded-xl py-6 shadow-sm bg-white">
                        <SelectValue placeholder="Select your address" />
                    </SelectTrigger>
                    <SelectContent>
                        {adressUser?.addresses?.map((a) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                                📍 {a.address}
                            </SelectItem>
                        ))}
                        <SelectItem>
                            <button onClick={()=>{navigate('/dashboard/address')}}>Add Address </button>
                            </SelectItem>
                    </SelectContent>
                    
                </Select>
            </div>
        )}

        {/* Payment Method */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method <span className="text-red-500">*</span></label>
            <Select onValueChange={Setpayment_type} value={payment_typee}>
                <SelectTrigger className="w-full border-gray-300 focus:border-gray-500 rounded-xl py-6 shadow-sm">
                    <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cash">💵 Cash on Delivery</SelectItem>
                    <SelectItem value="card">💳 Credit / Debit Card (Online)</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Stripe Card Element */}
        {payment_typee === "card" && (
            <div className="mt-4 animate-in fade-in duration-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Details</label>
                <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-gray-200">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#1f2937',
                                    '::placeholder': {
                                        color: '#9ca3af',
                                    },
                                },
                                invalid: {
                                    color: '#dc2626',
                                },
                            },
                        }}
                        onChange={handleCardError}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    🔒 Your card information is secure and encrypted
                </p>
            </div>
        )}
    </div>

    {/* Submit Button */}
    <button
        onClick={handleSubmit}
        disabled={isProcessing || (payment_typee === 'card' && (!stripe || !elements))}
        className="w-full mt-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
        {isProcessing ? (
            <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
            </span>
        ) : (
            `Confirm Order • ${totalprice.toFixed(2)} EGP`
        )}
    </button>

    {/* Note */}
    <p className="text-xs text-gray-400 text-center mt-6">
        By confirming your order, you agree to our Terms of Service
    </p>
</div>
    );
}