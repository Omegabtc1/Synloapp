export default function StatBlock({ label, value, delta, icon }) {
  const isPositive = delta >= 0
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        {icon && <span className="text-gray-300 text-lg">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {delta !== undefined && (
        <div className={`text-xs mt-1 font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}
          {delta}% from last month
        </div>
      )}
    </div>
  )
}

