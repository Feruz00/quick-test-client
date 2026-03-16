import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import { SocketContext } from './SocketContext';

export default function SocketProvider({ children }) {
  const user = useAuthStore((state) => state.user);
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.data?.id) return;

    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || window.location.origin,
      {
        withCredentials: true,
        transports: ['websocket'],
        query: {
          id: user.data.id,
          role: user.data.role,
        },
      }
    );

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user?.data?.id, user?.data?.role]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
