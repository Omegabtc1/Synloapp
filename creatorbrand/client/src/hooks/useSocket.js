import { io } from 'socket.io-client'

let socketInstance = null
let noopSocketInstance = null

function getNoopSocket() {
  if (!noopSocketInstance) {
    const noop = () => {}
    noopSocketInstance = { emit: noop, on: noop, off: noop }
  }
  return noopSocketInstance
}

// Prod static hosts: without VITE_SOCKET_URL, connecting to same origin hits SPA HTML on /socket.io and can crash React.
export function useSocket() {
  const configured = (import.meta.env.VITE_SOCKET_URL || '').trim()
  if (import.meta.env.PROD && !configured) {
    return getNoopSocket()
  }

  if (!socketInstance) {
    const url = configured || window.location.origin
    socketInstance = io(url, {
      path: '/socket.io',
      withCredentials: true,
      autoConnect: true
    })
  }
  return socketInstance
}
