import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Eye, EyeOff, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const DoctorLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('dr.sharma@medikiosk.health');
  const [password, setPassword] = useState('docpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, 'doctor');
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid doctor credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1D837F]/10 via-[#F7FBFC] to-[#3EAEB1]/20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-md mb-1">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D837F]">MediKiosk</h1>
          <p className="text-xs font-semibold text-slate-500">Doctor & Clinician Portal</p>
        </div>

        <Card className="p-8 space-y-5 border-l-4 border-l-[#1D837F]">
          <div className="flex items-center gap-3 pb-3 border-b border-[#D7EAEE]">
            <div className="w-9 h-9 rounded-full bg-[#1D837F] text-white flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A43]">Doctor Login</h2>
              <p className="text-xs text-slate-500">Clinical case review and verification</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Medical Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:outline-none focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:outline-none focus:ring-2 focus:ring-[#3EAEB1] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link to="/forgot-password" className="text-[#1D837F] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-3">
              Sign In as Doctor
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-[#D7EAEE] text-xs text-slate-500">
            Need a clinician account?{' '}
            <Link to="/signup/doctor" className="font-bold text-[#1D837F] hover:underline">
              Register Doctor Account
            </Link>
          </div>
        </Card>

        <div className="text-center">
          <Link to="/login" className="text-xs text-slate-500 hover:text-[#1D837F]">
            ← Return to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
};
