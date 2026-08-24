import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const DoctorSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(
        {
          name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
          email,
          phone,
        },
        'doctor'
      );
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create doctor account.');
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
          <p className="text-xs font-semibold text-slate-500">Clinician Registration</p>
        </div>

        <Card className="p-8 space-y-5 border-l-4 border-l-[#1D837F]">
          <div className="flex items-center gap-3 pb-3 border-b border-[#D7EAEE]">
            <div className="w-9 h-9 rounded-full bg-[#1D837F] text-white flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A43]">Register Doctor Account</h2>
              <p className="text-xs text-slate-500">Access patient summary reviews</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">Doctor Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Ananya Sharma"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">Medical Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.sharma@medikiosk.health"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 91234 56789"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-3">
              Register as Doctor
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-[#D7EAEE] text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login/doctor" className="font-bold text-[#1D837F] hover:underline">
              Doctor Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
