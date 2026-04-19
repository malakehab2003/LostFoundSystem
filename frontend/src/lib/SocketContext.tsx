import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "./socket";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const newSocket = getSocket(token);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      // Don't disconnect, just cleanup listeners
      newSocket.off("connect");
      newSocket.off("disconnect");
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context.socket;
};

export const useSocketConnected = (): boolean => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketConnected must be used within SocketProvider");
  }
  return context.isConnected;
};
