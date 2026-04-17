import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/lib/AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Only connect if we have a token
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"], // Optimization: usually faster
    });

    setSocket(newSocket);

    // Cleanup: Disconnect when user logs out or app unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
