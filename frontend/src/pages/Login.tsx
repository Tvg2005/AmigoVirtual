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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if profile exists, create if it doesn't
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.email || 'Usuário'
            });

          if (createError) {
            console.warn('Error creating profile:', createError);
          }
        }
      }
      
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
      <div className="w-1/2 flex flex-col justify-center items-center px-8 relative overflow-hidden bg-white">
        {/* Imagem no canto superior esquerdo */}
        <img
          src='/img-canto.png'
          alt="Decorative corner"
          className="absolute top-0 left-0 w-32 h-32 object-cover"
        />

        {/* Logo */}
        <img src='/Robot2.png' alt="Logo Amigo Sênior" className="w-24 h-24 mb-4 z-10" />

        <h2 className="text-3xl font-bold mb-6 z-10">Login</h2>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#82A9D4] hover:bg-[#6B8DB8] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem cadastro?{' '}
              <Link to="/register" className="text-black font-bold underline decoration-[#FFD700]">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Right side */}
      <div className="w-1/2 h-screen overflow-hidden bg-white">
        <img
          src="/img-idosos.png"
          alt="Idosos"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}