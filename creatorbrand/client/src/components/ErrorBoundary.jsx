import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl border border-red-100 shadow-sm p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Something went wrong</p>
            <p className="text-sm text-gray-600 mb-4 break-words">{String(this.state.error?.message || this.state.error)}</p>
            <button
              type="button"
              className="text-sm bg-brand-500 text-white px-4 py-2 rounded-lg"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
