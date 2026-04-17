import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";

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
