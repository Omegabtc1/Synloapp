import { io } from 'socket.io-client'

let socketInstance = null

export function useSocket() {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      autoConnect: true
    })
  }
  return socketInstance
}

