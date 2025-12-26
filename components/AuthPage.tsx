import { useState } from 'react';
import { Logo } from './Logo';
import { SignUpForm } from '@/types';

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (form: SignUpForm) => Promise<void>;
}

export const AuthPage = ({ onSignIn, onSignUp }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const getErrorMessage = (error: string) => {
    if (error.includes('auth/invalid-email')) return 'Invalid email address';
    if (error.includes('auth/user-not-found')) return 'No account found with this email';
    if (error.includes('auth/wrong-password')) return 'Incorrect password';
    if (error.includes('auth/email-already-in-use')) return 'Email already in use';
    if (error.includes('auth/weak-password')) return 'Password should be at least 6 characters';
    if (error.includes('auth/too-many-requests')) return 'Too many attempts. Please try again later';
    if (error.includes('auth/network-request-failed')) return 'Network error. Check your connection';
    if (error.includes('auth/invalid-credential')) return 'Invalid email or password';
    if (error.includes('Passwords do not match')) return 'Passwords do not match';
    if (error.includes('Password must be at least 6 characters')) return 'Password must be at least 6 characters';
    return 'An error occurred. Please try again';
  };

  const handleSignIn = async () => {
    if (!signInForm.email || !signInForm.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSignIn(signInForm.email, signInForm.password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(getErrorMessage(err.message));
      } else {
        setError('Failed to sign in. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpForm.firstName || !signUpForm.lastName || !signUpForm.email || !signUpForm.phone || !signUpForm.password || !signUpForm.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSignUp(signUpForm);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(getErrorMessage(err.message));
      } else {
        setError('Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !loading) {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4"><Logo /></div>
          <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-gray-400">{isSignUp ? 'Start your learning journey today' : 'Continue your learning journey'}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
          )}
          {isSignUp ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                  <input type="text" value={signUpForm.firstName} onChange={(e) => setSignUpForm({...signUpForm, firstName: e.target.value})} placeholder="Alex" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                  <input type="text" value={signUpForm.lastName} onChange={(e) => setSignUpForm({...signUpForm, lastName: e.target.value})} placeholder="Thompson" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input type="email" value={signUpForm.email} onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})} placeholder="your@email.com" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                <input type="tel" value={signUpForm.phone} onChange={(e) => setSignUpForm({...signUpForm, phone: e.target.value})} placeholder="+234 XXX XXX XXXX" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                <input type="password" value={signUpForm.password} onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
                <input type="password" value={signUpForm.confirmPassword} onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})} onKeyPress={(e) => handleKeyPress(e, handleSignUp)} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} />
              </div>
              <button onClick={handleSignUp} disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">{loading ? 'Creating Account...' : 'Create Account'}</button>
              <p className="text-center text-sm text-gray-400">Already have an account? <button onClick={() => { setIsSignUp(false); setError(''); setSignInForm({ email: '', password: '' }); }} className="text-blue-400 hover:text-blue-300 transition-colors duration-300" disabled={loading}>Sign In</button></p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input type="email" value={signInForm.email} onChange={(e) => setSignInForm({...signInForm, email: e.target.value})} placeholder="your@email.com" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                <input type="password" value={signInForm.password} onChange={(e) => setSignInForm({...signInForm, password: e.target.value})} onKeyPress={(e) => handleKeyPress(e, handleSignIn)} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-300" disabled={loading} autoComplete="current-password" />
              </div>
              <button onClick={handleSignIn} disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">{loading ? 'Signing In...' : 'Sign In'}</button>
              <p className="text-center text-sm text-gray-400">Don&apos;t have an account? <button onClick={() => { setIsSignUp(true); setError(''); setSignUpForm({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' }); }} className="text-blue-400 hover:text-blue-300 transition-colors duration-300" disabled={loading}>Sign Up</button></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};