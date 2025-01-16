import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome to My Website
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Feature 1
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Description of your first amazing feature goes here.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Feature 2
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Description of your second amazing feature goes here.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Feature 3
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Description of your third amazing feature goes here.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
} 