import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#D7EAEE] via-[#F7FBFC] to-[#9FD8E1]/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-md mb-1">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D837F]">MediKiosk</h1>
          <p className="text-xs font-semibold text-slate-500">Reset Password</p>
        </div>

        <Card className="p-8 space-y-5">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-[#102A43]">Password Reset Successful</h3>
              <p className="text-xs text-slate-600">
                Your MediKiosk password has been updated. You can now log in with your new password.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Proceed to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-[#102A43]">Set New Password</h2>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
                />
              </div>

              <Button type="submit" className="w-full py-3">
                Reset Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
