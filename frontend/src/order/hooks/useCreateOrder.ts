// order/hooks/useCreateOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../../check out/servicePayment/createOrder';
import { createorderItems } from '../createOrderItems';
import { paymentOnline } from '../../check out/servicePayment/paymentOnline';
import { getCart } from '../../cart/serves/GetCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface CreateOrderValues {
    total_price: number;
    receive_type: string;
    payment_type: string;
    address_id: number;
    promo_code_id: number;
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const getCartProducts = async () => {
        const cart = await getCart();
        if (!cart) return [];
        return cart.map((item: any) => ({
            productId: item.product_id,
            quantity: item.quantity
        }));
    };

    const mutation = useMutation({
        mutationFn: async (values: CreateOrderValues) => {
            // الخطوة 1: إنشاء الأوردر
            const orderResponse = await createOrder(values);
            
            if (orderResponse?.message === "Order created successfully" && orderResponse?.order?.id) {
                toast.success("Order created successfully");
                
                // خزن الـ order ID
                localStorage.setItem('idOrder', orderResponse.order.id.toString());
                
                // الخطوة 2: إنشاء items الأوردر
                await createorderItems(orderResponse.order.id);
                
                // الخطوة 3: جلب المنتجات من الكارت
                const products = await getCartProducts();
                
                // الخطوة 4: معالجة الدفع لو أونلاين
                if (values.payment_type === 'card') {
                    const paymentResponse = await paymentOnline({ products });
                    if (paymentResponse?.url) {
                        window.location.href = paymentResponse.url;
                    }
                } else {
                    toast.success('Order placed successfully!');
                    setTimeout(() => navigate('/my-orders'), 1500);
                }
                
                // تحديث الكاش
                queryClient.invalidateQueries({ queryKey: ['get all orders'] });
                queryClient.invalidateQueries({ queryKey: ['get cart'] });
                
                return orderResponse;
            }
            
            // معالجة الأخطاء
            if (orderResponse?.err === "Address is requried") {
                toast.error('Address is required');
                navigate('/dashboard/address');
            } else {
                toast.error(orderResponse?.err || 'Error creating order');
            }
            
            throw new Error(orderResponse?.err || 'Error creating order');
        },
    });

    return {
        createOrder: mutation.mutate,
        createOrderAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error,
        orderData: mutation.data,
    };
}