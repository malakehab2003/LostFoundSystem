// order/updateOrder.ts
export interface UpdateOrderValues {
    total_price?: number;
    order_status?: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    receive_type?: 'delivery' | 'pickup';
    payment_type?: 'cash' | 'card';
    address_id?: number;
    promo_code_id?: number;
}

export async function updateOrder(orderId: number, values: UpdateOrderValues) {
    const token = localStorage.getItem("token");
    
    const resp = await fetch(`http://localhost:5000/api/order/updateOrder/${orderId}`, {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values)
    });
    
    const data = await resp.json();
    console.log('updateOrder response:', data);
    return data;
}