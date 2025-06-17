import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Redirecionar diretamente para dashboard após login bem-sucedido
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="w-1/2 flex flex-col justify-center items-center px-8 relative overflow-hidden">
        {/* Imagem no canto superior esquerdo */}
        <img
          src='/img-canto.png'
          alt="Decorative corner"
          className="absolute top-0 left-0 w-16 h-24 object-cover"
        />

        {/* Logo */}
        <img src='../../public/Robot2.png' alt="WiseConnect Logo" className="w-20 h-16 mb-3 z-10" />

        <h2 className="text-2xl font-bold mb-4 z-10">Login</h2>

       <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4 z-10 bg-transparent">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-xs">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-1.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#82A9D4] hover:bg-[#6B8DB8] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              Não tem cadastro?{' '}
              <Link to="/register" className="text-black font-bold underline decoration-[#FFD700]">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Right side */}
      <div className="w-1/2 h-screen overflow-hidden">
        <img
          src="/img-idosos.png"
          alt="Idosos"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}