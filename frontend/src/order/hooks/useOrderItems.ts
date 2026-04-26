// order/hooks/useOrderItems.ts
import { useQuery } from '@tanstack/react-query';
import { getOrderItems } from '../getOrderItems';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    product?: {
        id: number;
        name: string;
        price: number;
        image?: string[];
    };
}

export function useOrderItems(orderId: number | null) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['get order items', orderId],
        queryFn: async () => {
            if (!orderId) return { items: [] };
            localStorage.setItem('idOrder', orderId.toString());
            const result = await getOrderItems();
            console.log('✅ Order items fetched for orderId:', orderId, result);
            return result;
        },
        enabled: !!orderId,
        staleTime: 5 * 60 * 1000,
    });

    const items: OrderItem[] = data?.items || [];
    const totalItems = items.length;
    
    const orderTotal = items.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
    }, 0);

    const orderAddress = data?.order?.address?.address;

    return {
        items,
        isLoading,
        error,
        refetch,
        totalItems,
        orderTotal,
        orderAddress,
        // ✅ منتجات جاهزة للعرض
        productsList: items.map(item => ({
            id: item.product?.id,
            name: item.product?.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.product?.price || 0,
            subtotal: (item.product?.price || 0) * item.quantity,
            image: item.product?.image?.[0]
        }))
    };
}