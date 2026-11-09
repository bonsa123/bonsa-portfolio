import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import Button from '../components/ui/Button'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/admin/login', { password })
      if (res.data.success) {
        sessionStorage.setItem('admin_auth', 'true')
        navigate('/admin/dashboard')
      }
    } catch {
      setError('Incorrect password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-5">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent mb-4">
            <Lock size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary">Admin Panel</h1>
          <p className="text-secondary text-sm mt-1">Bonsa Muluneh — Portfolio Manager</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block font-mono text-xs text-muted uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-muted text-xs mt-6">
          <a href="/" className="hover:text-accent transition-colors">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  )
}
