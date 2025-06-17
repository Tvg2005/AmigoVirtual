import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  birthDate: string;
  cpf: string;
  email: string;
  address: string;
  cep: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: '',
    cpf: '',
    email: '',
    address: '',
    cep: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            birth_date: formData.birthDate,
            cpf: formData.cpf,
            address: formData.address,
            cep: formData.cep,
            phone: formData.phone
          }
        }
      });

      if (authError) throw authError;

      // The trigger will automatically create the profile
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the profile with additional information
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: formData.fullName,
            // Add other profile fields if needed
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.warn('Profile update error:', profileError);
          // Don't throw here as the main registration was successful
        }
      }
      
      // Redirecionar diretamente para dashboard após registro bem-sucedido
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex bg-[#BAD1E6]">
      <div className="w-full z-10 flex flex-col md:flex-row items-center justify-center">
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="text-center">
            <img src="/Icon.png" alt="WiseConnect Logo" className="w-50 h-40 mx-auto" />
          </div>
        </div>

        <div className="md:w-1/2 w-full bg-white rounded-2xl shadow-xl m-4 p-8 max-w-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Cadastro</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome Completo<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data Nascimento<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  CPF<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Endereço<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  CEP<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Senha<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirmar senha<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-xl shadow-sm text-sm"
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div className="flex flex-col items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-[#82A9D4] text-white rounded-xl hover:bg-[#6B8DB8] transition-colors duration-300 shadow disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Salvar'}
              </button>

              <div className="text-center">
                <span className="text-sm">Já possui cadastro? </span>
                <Link
                  to="/login"
                  className="text-black font-bold underline decoration-[#FFD700]"
                >
                  Voltar
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}