import { useState } from 'react';
import { Dumbbell, Zap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(username);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-gym-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gym-gold rounded-full mix-blend-screen blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gym-red rounded-full mix-blend-screen blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Dumbbell className="w-16 h-16 text-gym-gold drop-shadow-lg" strokeWidth={1.5} />
              <div className="absolute inset-0 animate-glow rounded-full"></div>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-gym-gold mb-2 tracking-wider drop-shadow-lg" style={{ letterSpacing: '0.1em' }}>
            GYM FREAK
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-gym-gold via-gym-red to-gym-gold mx-auto mb-4"></div>
          <p className="text-gym-silver text-lg font-light tracking-wider">POWERED BY AI</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gym-gold text-sm font-bold tracking-widest">
              ATHLETE NAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-gym-dark border-2 border-gym-gold text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gym-red transition-all duration-300 placeholder-gray-500 font-semibold"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gym-gold opacity-50">
                <Zap size={20} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full bg-gradient-to-r from-gym-gold to-gym-red text-gym-black font-bold py-3 rounded-lg text-lg tracking-widest hover:shadow-lg hover:shadow-gym-gold/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 uppercase"
          >
            {isLoading ? 'LOADING...' : 'ENTER THE ARENA'}
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center text-gym-silver text-sm">
          <p className="flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gym-gold"></span>
            NO PAIN. NO GAIN.
            <span className="w-8 h-px bg-gym-gold"></span>
          </p>
          <p className="font-light text-xs uppercase tracking-widest text-gray-600">
            Real-time posture detection • AI rep counting • Form correction
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gym-gold via-gym-red to-gym-gold opacity-50"></div>
    </div>
  );
}
