// order/getOrderItems.ts
export async function getOrderItems() {
    const token = localStorage.getItem("token");
    const idOrder = localStorage.getItem("idOrder");
    
    console.log('Fetching items for order ID:', idOrder);
    
    if (!idOrder) {
        console.warn('No order ID found');
        return { items: [] };
    }
    
    try {
        const resp = await fetch(`http://localhost:5000/api/order/item/list/${idOrder}`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        
        const data = await resp.json();
        console.log('getOrderItems response:', data);
        
        // ✅ التأكد من أن البيانات تحتوي على items مع product details
        if (data?.items) {
            console.log('Products found:', data.items.length);
            data.items.forEach((item: any, idx: number) => {
                console.log(`Product ${idx + 1}:`, item.product?.name, 'Quantity:', item.quantity);
            });
        }
        
        return data;
    } catch (error) {
        console.error('Error in getOrderItems:', error);
        return { items: [] };
    }
}