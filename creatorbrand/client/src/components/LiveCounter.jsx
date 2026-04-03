import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useWaitlistStore } from '../stores/waitlistStore'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    const start = prevRef.current
    const end = value
    if (start === end) return

    const duration = 600
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
      else prevRef.current = end
    }

    requestAnimationFrame(tick)
  }, [value])

  return <span>{display.toLocaleString()}</span>
}

export default function LiveCounter() {
  const { creators, brands, fetchCounts, setFromSocket } = useWaitlistStore()
  const socket = useSocket()

  useEffect(() => {
    fetchCounts()
    socket.emit('waitlist:subscribe')
    socket.on('waitlist:update', setFromSocket)
    return () => socket.off('waitlist:update', setFromSocket)
  }, [fetchCounts, socket, setFromSocket])

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-8">
      <div className="text-center">
        <div className="text-4xl font-bold text-brand-600">
          <AnimatedNumber value={creators} />
        </div>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Creators joined
        </div>
      </div>
      <div className="w-px h-12 bg-gray-200 hidden sm:block" />
      <div className="text-center">
        <div className="text-4xl font-bold text-brand-600">
          <AnimatedNumber value={brands} />
        </div>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Brands joined
        </div>
      </div>
    </div>
  )
}

