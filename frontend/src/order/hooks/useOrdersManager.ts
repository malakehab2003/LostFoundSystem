// order/hooks/useOrdersManager.ts
import { useState, useCallback, useEffect } from 'react';
import { useUserOrders } from './useUserOrders';
import { useOrderItems } from './useOrderItems';
import type { Order } from './useUserOrders';
import type { OrderItem } from './useOrderItems';

interface UseOrdersManagerReturn {
    // Orders list
    orders: Order[];
    isLoadingOrders: boolean;
    ordersError: Error | null;
    totalOrders: number;
    refetchOrders: () => void;
    
    // Selected order
    selectedOrderId: number | null;
    setSelectedOrderId: (id: number | null) => void;
    selectedOrder: Order | undefined;
    
    // Order items
    orderItems: OrderItem[];
    isLoadingItems: boolean;
    itemsError: Error | null;
    orderTotal: number;
    orderAddress?: string;
    totalItems: number;
    refetchItems: () => void;
    
    // Filtered orders (by status)
    getOrdersByStatus: (status: Order['order_status']) => Order[];
    getOrdersCountByStatus: (status: Order['order_status']) => number;
    
    // Utilities
    refreshAll: () => void;
}

export function useOrdersManager(): UseOrdersManagerReturn {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    
    // Get all orders
    const {
        orders,
        isLoading: isLoadingOrders,
        error: ordersError,
        refetch: refetchOrders,
        totalOrders
    } = useUserOrders();
    
    // Get selected order object
    const selectedOrder = orders.find(order => order.id === selectedOrderId);
    
    // Get items for selected order
    const {
        items: orderItems,
        isLoading: isLoadingItems,
        error: itemsError,
        refetch: refetchItems,
        totalItems,
        orderTotal,
        orderAddress
    } = useOrderItems(selectedOrderId);
    
    // Filter orders by status
    const getOrdersByStatus = useCallback((status: Order['order_status']) => {
        return orders.filter(order => order.order_status === status);
    }, [orders]);
    
    const getOrdersCountByStatus = useCallback((status: Order['order_status']) => {
        return orders.filter(order => order.order_status === status).length;
    }, [orders]);
    
    // Refresh everything
    const refreshAll = useCallback(() => {
        refetchOrders();
        if (selectedOrderId) {
            refetchItems();
        }
    }, [refetchOrders, refetchItems, selectedOrderId]);
    
    // Auto-refresh items when selected order changes
    useEffect(() => {
        if (selectedOrderId) {
            refetchItems();
        }
    }, [selectedOrderId, refetchItems]);
    
    return {
        // Orders list
        orders,
        isLoadingOrders,
        ordersError,
        totalOrders,
        refetchOrders,
        
        // Selected order
        selectedOrderId,
        setSelectedOrderId,
        selectedOrder,
        
        // Order items
        orderItems,
        isLoadingItems,
        itemsError,
        orderTotal,
        orderAddress,
        totalItems,
        refetchItems,
        
        // Filtered orders
        getOrdersByStatus,
        getOrdersCountByStatus,
        
        // Utilities
        refreshAll
    };
}