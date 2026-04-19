import { io, Socket } from "socket.io-client";
import { useContext, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { SocketContext } from "@/lib/SocketContext";

export function useSocket() {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return socketRef;
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
}
