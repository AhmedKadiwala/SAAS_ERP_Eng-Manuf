import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginCard = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await signIn(formData?.email, formData?.password);
      
      if (signInError) {
        if (signInError?.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError?.message?.includes('Failed to fetch') || 
                   signInError?.message?.includes('AuthRetryableFetchError')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        } else {
          setError(signInError?.message || 'Sign in failed. Please try again.');
        }
        return;
      }

      // Success - user will be redirected by auth state change
      navigate('/main-dashboard');
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError') ||
          err?.name === 'TypeError' && err?.message?.includes('fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Login error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError?.message?.includes('Invalid login credentials')) {
          setError('Demo credentials are not available. Please check your Supabase project setup.');
        } else if (signInError?.message?.includes('Failed to fetch') || 
                   signInError?.message?.includes('AuthRetryableFetchError')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        } else {
          setError(signInError?.message || 'Sign in failed. Please try again.');
        }
        return;
      }

      // Success - user will be redirected by auth state change
      navigate('/main-dashboard');
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError') ||
          err?.name === 'TypeError' && err?.message?.includes('fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Demo login error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="Building2" size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground mt-2">Sign in to ModernERP</p>
      </div>
      {/* Demo Credentials Card */}
      <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-border/50">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Info" size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Demo Credentials</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-foreground">Admin User</div>
              <div className="text-muted-foreground">admin@modernerp.com</div>
              <div className="text-muted-foreground font-mono text-xs">ModernERP2024!</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDemoLogin('admin@modernerp.com', 'ModernERP2024!')}
              disabled={isLoading}
              className="text-xs"
            >
              Use
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-foreground">Manager</div>
              <div className="text-muted-foreground">manager@modernerp.com</div>
              <div className="text-muted-foreground font-mono text-xs">ModernERP2024!</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDemoLogin('manager@modernerp.com', 'ModernERP2024!')}
              disabled={isLoading}
              className="text-xs"
            >
              Use
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-foreground">Team Member</div>
              <div className="text-muted-foreground">user@modernerp.com</div>
              <div className="text-muted-foreground font-mono text-xs">ModernERP2024!</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDemoLogin('user@modernerp.com', 'ModernERP2024!')}
              disabled={isLoading}
              className="text-xs"
            >
              Use
            </Button>
          </div>
        </div>
      </div>
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-destructive text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(error)}
                  className="text-destructive/70 hover:text-destructive text-xs mt-1 underline"
                >
                  Copy error message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData?.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData?.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border border-border bg-background"
              disabled={isLoading}
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || loading}
        >
          {isLoading || loading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              <Icon name="LogIn" size={16} className="mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <Icon name="Mail" size={16} className="mr-2" />
          Google
        </Button>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <Icon name="Github" size={16} className="mr-2" />
          GitHub
        </Button>
      </div>
      {/* Sign Up Link */}
      <div className="text-center mt-6">
        <span className="text-muted-foreground text-sm">
          Don't have an account?{' '}
        </span>
        <button
          type="button"
          className="text-primary hover:underline text-sm font-medium"
          disabled={isLoading}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginCard;