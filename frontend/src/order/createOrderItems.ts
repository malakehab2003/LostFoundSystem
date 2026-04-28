// order/createOrderItems.ts
export interface OrderItemData {
    order_id: number;
    items: Array<{
        product_id: number;
        quantity: number;
        color?: string;
        size?: string;
    }>;
}

export async function createorderItems(orderId: number, items: any[]) {
    const token = localStorage.getItem("token");
    
    if (!items || !Array.isArray(items)) {
        console.error('Items is not an array:', items);
        items = []; // أو return error
    }

    const body = {
        order_id: orderId,
        items: items.map((item: any) => ({
            product_id: item.productId,
            quantity: item.quantity
        }))
    };
    
    console.log('Creating order items with body:', body);
    
    const resp = await fetch('http://localhost:5000/api/order/item/create', {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    });
    
    const data = await resp.json();
    console.log('createorderItems response:', data);
    return data;
}