import { io } from 'socket.io-client'

let socketInstance = null

export function useSocket() {
  if (!socketInstance) {
    const url = (import.meta.env.VITE_SOCKET_URL || '').trim() || window.location.origin
    socketInstance = io(url, {
      path: '/socket.io',
      withCredentials: true,
      autoConnect: true
    })
  }
  return socketInstance
}

