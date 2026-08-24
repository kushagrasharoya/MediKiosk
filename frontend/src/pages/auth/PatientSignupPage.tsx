import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Activity, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const PatientSignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setError('You must accept the medical data terms and consent to register.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await register(
        {
          name: fullName,
          dob,
          sex,
          phone,
          email,
        },
        'patient'
      );
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create patient account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#D7EAEE] via-[#F7FBFC] to-[#9FD8E1]/40">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-md mb-1">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D837F]">MediKiosk</h1>
          <p className="text-xs font-semibold text-slate-500">Create Patient Clinical Account</p>
        </div>

        <Card className="p-8 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#D7EAEE]">
            <div className="w-9 h-9 rounded-full bg-[#D7EAEE] text-[#1D837F] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A43]">Patient Registration</h2>
              <p className="text-xs text-slate-500">Enter personal & identification info</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">Gender</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
                />
              </div>
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

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 rounded text-[#1D837F] focus:ring-[#3EAEB1]"
              />
              <label htmlFor="consent" className="text-xs text-slate-600 leading-tight">
                I consent to the collection and AI processing of my clinical data for medical intake.
              </label>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-3 mt-2">
              Create Patient Account
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-[#D7EAEE] text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login/patient" className="font-bold text-[#1D837F] hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
