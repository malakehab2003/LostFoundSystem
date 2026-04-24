import { createContext, useState } from "react";

// إنشاء context
export const OrderContext = createContext();

// Provider
export function OrderContextProvider({ children }) {
  const [order, setOrder] = useState(null);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
}