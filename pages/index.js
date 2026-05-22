import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ========== LOGGED IN DASHBOARD ==========
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">MyApp</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user.name}</span>
              <button
                onClick={logout}
                className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">You are logged in as {user.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">Profile</h3>
              <p className="mt-2 text-gray-600">Complete your profile settings.</p>
              <Link href="/profile" className="text-blue-600 hover:underline mt-4 inline-block">Go to Profile →</Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="mt-2 text-gray-600">Manage your password and 2FA.</p>
              <Link href="/settings" className="text-blue-600 hover:underline mt-4 inline-block">Settings →</Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">Activity</h3>
              <p className="mt-2 text-gray-600">View your recent login history.</p>
              <Link href="/activity" className="text-blue-600 hover:underline mt-4 inline-block">View Activity →</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ========== LANDING PAGE FOR VISITORS ==========
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-extrabold text-blue-600">MyApp</h1>
          <div className="flex space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Log in</Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Build something great
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          A modern, secure platform with lightning-fast authentication. Start your journey in minutes.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg transition">
            Get started free
          </Link>
          <Link href="/login" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure by default</h4>
              <p className="text-gray-600">HTTP-only cookies, bcrypt passwords, and JWT tokens keep your data safe.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Blazing fast</h4>
              <p className="text-gray-600">Serverless edge functions ensure your app loads quickly anywhere.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Scalable</h4>
              <p className="text-gray-600">From 10 to 10 million users, the architecture grows with you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (optional) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Trusted by developers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <p className="text-gray-600 italic">"The authentication system is rock-solid. I integrated it in under an hour."</p>
              <p className="mt-4 font-semibold text-gray-900">— Jane, Full-Stack Developer</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <p className="text-gray-600 italic">"Deployed on Vercel with zero config. My users love the speed."</p>
              <p className="mt-4 font-semibold text-gray-900">— Alex, Startup Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to start?</h3>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users who trust our platform.</p>
          <Link href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-lg">
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between">
          <p>© 2026 MyApp. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
