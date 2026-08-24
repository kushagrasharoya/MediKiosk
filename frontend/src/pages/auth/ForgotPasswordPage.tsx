import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#D7EAEE] via-[#F7FBFC] to-[#9FD8E1]/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-md mb-1">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D837F]">MediKiosk</h1>
          <p className="text-xs font-semibold text-slate-500">Account Recovery</p>
        </div>

        <Card className="p-8 space-y-5">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-[#102A43]">Reset Instructions Sent</h3>
              <p className="text-xs text-slate-600">
                If an account exists for <span className="font-semibold text-[#1D837F]">{email}</span>, password reset instructions have been sent.
              </p>
              <Link to="/login" className="inline-block pt-2 text-xs font-bold text-[#1D837F] hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#102A43]">Forgot your password?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered email address or phone number to reset your password.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#102A43] block mb-1">
                  Email / Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.kumar@example.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] pl-10"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full py-3">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="text-center pt-3 border-t border-[#D7EAEE]">
            <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-[#1D837F] inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
