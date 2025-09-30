// app/page.jsx (Next.js 13+ with App Router)
'use client';

import { useState, useEffect } from 'react';
import { userSessionCookieName } from '@/lib/constant';
import Link from 'next/link';
import PublishedSpacesList from './ui/root/spaces';


export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {

    // Check user login status (this is a placeholder, replace with actual logic)
    const userLoggedIn = document.cookie.includes(userSessionCookieName);
    setIsUserLoggedIn(userLoggedIn);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-r from-black via-gray-800 to-gray-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Find Your Perfect Space</h1>
        <p className="max-w-2xl mb-6 text-lg">
          Rent coworking spaces, meeting rooms, or event halls with ease and flexibility.
        </p>
        {isUserLoggedIn ? (
          <div className="flex space-x-4">
            <Link href='/user' className="px-6 py-3 bg-white text-black font-semibold rounded-xl shadow hover:bg-gray-100">
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href='/user/login' className="px-6 py-3 bg-white text-black font-semibold rounded-xl shadow hover:bg-gray-100">
              Log In
            </Link>
          </div>
        )}
      </section>

      {/* Featured Spaces Section */}
      <PublishedSpacesList />


      {/* CTA Section */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Space?</h2>
        <p className="mb-6 text-lg">Find and book the perfect spot in minutes.</p>
        <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} Creative Tech Village. All rights reserved.</p>
      </footer>
    </main>
  );
}
