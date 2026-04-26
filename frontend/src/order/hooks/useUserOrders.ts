// order/hooks/useUserOrders.ts
import { useQuery } from '@tanstack/react-query';

export interface Order {
    id: number;
    user_id: number;
    total_price: number;
    receive_type: 'delivery' | 'pickup';
    payment_type: 'cash' | 'card';
    order_status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    address_id?: number;
    promo_code_id?: number;
    created_at?: string;
    updated_at?: string;
    user?: {
        id: number;
        name: string;
        email?: string;
    };
    address?: {
        id: number;
        name: string;
        address: string;
    };
    promocode?: {
        id: number;
        code: string;
        discount: string;
    };
}

export function useUserOrders(isAdmin: boolean = false, userId?: number) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['get all orders', userId, isAdmin],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            
            // لو أدمن وجيب كل الأوردرات
            let url = 'http://localhost:5000/api/order/getMyorders';
            
            if (isAdmin) {
                // لو فيه userId محدد جيب أوردرات المستخدم ده
                if (userId) {
                    url = `http://localhost:5000/api/order/getOrders?user_id=${userId}`;
                } else {
                    // جيب كل الأوردرات (من غير filter)
                    url = 'http://localhost:5000/api/order/getOrders';
                }
            }
            
            const resp = await fetch(url, {
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const data = await resp.json();
            console.log('Orders response:', data);
            return data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const orders: Order[] = data?.orders || [];
    const totalOrders = orders.length;

    // فلترة حسب الحالة
    const getOrdersByStatus = (status: Order['order_status']) => {
        return orders.filter(order => order.order_status === status);
    };

    // فلترة حسب المستخدم
    const getOrdersByUser = (userId: number) => {
        return orders.filter(order => order.user_id === userId);
    };

    // البحث بالاسم
    const searchOrdersByName = (searchTerm: string) => {
        if (!searchTerm) return orders;
        const term = searchTerm.toLowerCase();
        return orders.filter(order => 
            order.user?.name?.toLowerCase().includes(term) ||
            order.user?.email?.toLowerCase().includes(term)
        );
    };

    // جلب أوردر معين
    const getOrderById = (orderId: number) => {
        return orders.find(order => order.id === orderId);
    };

    return {
        orders,
        isLoading,
        error,
        refetch,
        totalOrders,
        getOrdersByStatus,
        getOrdersByUser,
        getOrderById,
        searchOrdersByName,  // ✅ دالة البحث الجديدة
    };
}