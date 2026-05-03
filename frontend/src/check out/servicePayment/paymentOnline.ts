import type { payment } from "./typesCkeckOut";

export async function paymentOnline(values: payment) {
  const token = localStorage.getItem("token");

  const resp = await fetch(
    "http://localhost:5000/api/payment/create-payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }
  );

  // 🔴 مهم جدًا: check response
  if (!resp.ok) {
    const errorText = await resp.text();
    console.log("PAYMENT ERROR RESPONSE:", errorText);
    throw new Error("Payment API failed");
  }

  const data = await resp.json();

  console.log("PAYMENT RESPONSE:", data);

  return data;
}