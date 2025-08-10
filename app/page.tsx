import { Span } from "next/dist/trace";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions); //returns object || null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent mb-4">
                Welcome to StrataChess
                {session && <span className="block text-4xl mt-2 text-gray-700">Hello, {session.user!.name}!</span>}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Master the game of kings with our interactive chess platform. Play, learn, and improve your skills.
              </p>
            </div>

            {/* Chess Board Visual */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-64 h-64 grid grid-cols-8 gap-0 border-4 border-orange-400 rounded-lg overflow-hidden shadow-2xl">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`w-8 h-8 ${
                          isLight 
                            ? 'bg-gradient-to-br from-orange-100 to-amber-100' 
                            : 'bg-gradient-to-br from-orange-300 to-amber-400'
                        }`}
                      />
                    );
                  })}
                </div>
                {/* Floating chess pieces */}
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">♔</div>
                <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>♛</div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Play Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚔️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Play Chess</h3>
                <p className="text-gray-600 mb-6">Challenge players from around the world or practice against AI opponents.</p>
                <button className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Playing
                </button>
              </div>

              {/* Learn Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Learn & Improve</h3>
                <p className="text-gray-600 mb-6">Master chess strategies with our comprehensive tutorials and puzzles.</p>
                <button className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Learning
                </button>
              </div>

              {/* Analyze Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Game Analysis</h3>
                <p className="text-gray-600 mb-6">Review your games with powerful analysis tools and improve your play.</p>
                <button className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Analyze Games
                </button>
              </div>
            </div>

            {/* Stats Section (if user is logged in) */}
            {session && (
              <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-orange-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Chess Journey</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">1,247</div>
                    <div className="text-gray-600">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">856</div>
                    <div className="text-gray-600">Puzzles Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">1,532</div>
                    <div className="text-gray-600">Current Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">Gold</div>
                    <div className="text-gray-600">League</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}