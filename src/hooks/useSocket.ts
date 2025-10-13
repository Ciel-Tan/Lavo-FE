// useSocket.js
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket({ token }: { token?: string } = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Prefer configured URL, fallback to same origin
    const url = (import.meta as any)?.env?.VITE_SOCKET_URL || (import.meta as any)?.env?.VITE_API_URL || window.location.origin;
    const s = io(url, {
      auth: { token },
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = s;
    setSocket(s);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);

    return () => {
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [token]);

  return { socket, connected };
}
