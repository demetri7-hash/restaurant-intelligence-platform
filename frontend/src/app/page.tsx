export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Restaurant Intelligence Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Next.js + Koyeb PostgreSQL Setup Complete! 🎉
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span>
              <span>Next.js 14+ with TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span>
              <span>Koyeb PostgreSQL Database</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span>
              <span>Prisma ORM Configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span>
              <span>TailwindCSS Styling</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-xl">🔄</span>
              <span>Database Connection Test (Next)</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Database:</strong> restaurant_intelligence<br/>
              <strong>Host:</strong> Koyeb PostgreSQL<br/>
              <strong>Status:</strong> Ready for testing
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
