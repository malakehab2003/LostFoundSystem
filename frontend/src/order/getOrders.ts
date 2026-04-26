// order/getOrders.ts
export async function getOrders() {
    const token = localStorage.getItem("token");
    
    const resp = await fetch('http://localhost:5000/api/order/getMyorders', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    
    const data = await resp.json();
    console.log('getOrders response:', data);
    return data;
}