// order/hooks/useUpdateOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '../updateOrder';
import type { UpdateOrderValues } from '../updateOrder';
import toast from 'react-hot-toast';

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ orderId, values }: { orderId: number; values: UpdateOrderValues }) => {
            const response = await updateOrder(orderId, values);
            
            if (response?.message === "Order updated successfully") {
                toast.success("Order updated successfully");
                
                queryClient.invalidateQueries({ queryKey: ['get all orders'] });
                queryClient.invalidateQueries({ queryKey: ['get all user orders'] });
                
                return response;
            } else {
                toast.error(response?.err || "Failed to update order");
                throw new Error(response?.err || "Failed to update order");
            }
        },
    });

    return {
        updateOrder: (orderId: number, values: UpdateOrderValues) => {
            mutation.mutate({ orderId, values });
        },
        updateOrderAsync: (orderId: number, values: UpdateOrderValues) => {
            return mutation.mutateAsync({ orderId, values });
        },
        isLoading: mutation.isPending,
        error: mutation.error,
        data: mutation.data,
    };
}