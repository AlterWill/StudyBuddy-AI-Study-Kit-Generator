import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Sign Up</h2>
        
        <form className="space-y-4" id="signup-form">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-zinc-600 text-white rounded-md font-medium hover:bg-zinc-500 transition-colors"
          >
            Sign Up
          </button>
        </form>
        
        <p className="mt-6 text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <a href="/auth/signin" className="font-medium text-zinc-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const formData = new FormData(form)
  
  const response = await fetch('/api/auth/[...nextauth]', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'signup',
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
    })
  })
  
  const data = await response.json()
  
  if (data.success) {
    window.location.href = '/auth/signin'
  } else {
    alert(data.error || 'Signup failed')
  }
})