'use client'
import React from 'react'
import Link from 'next/link';
import { useSession } from 'next-auth/react'

const NavBar = () => {
  const {status} = useSession()
  //status:  1.authenticated 2. unauthenticated 3. loading

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="w-full px-4">
        <div className="relative flex items-center h-16">
          
          {/* Logo/Brand - far left */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">♔</div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              StrataChess
            </span>
          </Link>

          {/* Navigation Links - truly centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-500
               hover:to-amber-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Home
            </Link>

            {/* Quick Play Button - always visible */}
            <Link href="/gameVsStockfish" className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 hover:from-orange-500 hover:to-amber-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105">
              Quick Play ⚡
            </Link>
          </div>

          {/* Auth Section - far right */}
          {(status === 'loading' || status === 'authenticated') && (
            <div className="ml-auto flex items-center space-x-3">
              {status === 'loading' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              )}
              
              {status === "authenticated" && (
                <Link 
                  href="/api/auth/signout" 
                  className="px-4 py-2 bg-white border-2 border-orange-300 text-orange-600 font-medium rounded-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-lg"
                >
                  Sign Out
                </Link>
              )}
            </div>
          )}

        </div>

        {/* Mobile Menu - Hidden by default, you can add state to toggle */}
        <div className="md:hidden border-t border-orange-100 py-2 hidden">
          <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">Home</Link>
          <Link href="/gameVsStockfish" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">Quick Play ⚡</Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar