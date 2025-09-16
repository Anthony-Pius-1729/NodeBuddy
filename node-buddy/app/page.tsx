import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">
            🎉 JWT Authentication Successfully Implemented!
          </h2>
          <div className="space-y-3 text-sm text-green-700 dark:text-green-300">
            <p><strong>✅ API Endpoints:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• <code>POST /api/auth/register</code> - User registration</li>
              <li>• <code>POST /api/auth/login</code> - User login</li>
              <li>• <code>GET /api/protected</code> - Protected route example</li>
              <li>• <code>POST /api/protected</code> - Protected route with data</li>
            </ul>
            
            <p><strong>✅ Features Included:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• JWT token generation and verification</li>
              <li>• Password hashing with bcrypt</li>
              <li>• Middleware for route protection</li>
              <li>• TypeScript types and client utilities</li>
              <li>• Input validation and error handling</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            🚀 Quick Test Commands
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Register a new user:</p>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                curl -X POST http://localhost:3000/api/auth/register \<br/>
                -H "Content-Type: application/json" \<br/>
                -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'
              </code>
            </div>
            
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Login:</p>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                curl -X POST http://localhost:3000/api/auth/login \<br/>
                -H "Content-Type: application/json" \<br/>
                -d '{"email":"john@example.com","password":"Password123"}'
              </code>
            </div>

            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Access protected route:</p>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                curl -X GET http://localhost:3000/api/protected \<br/>
                -H "Authorization: Bearer YOUR_JWT_TOKEN"
              </code>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>⚠️ Note:</strong> This implementation uses in-memory storage for demo purposes. 
            In production, replace the userStore with a proper database (MongoDB, PostgreSQL, etc.).
          </p>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <span>JWT Auth Backend Ready</span>
        <span>•</span>
        <span>NodeBuddy</span>
      </footer>
    </div>
  );
}
