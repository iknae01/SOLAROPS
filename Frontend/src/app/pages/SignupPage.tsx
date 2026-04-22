import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Sun, Mail, Lock, CheckCircle, XCircle, Eye, EyeOff, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { register } from '../api/auth';

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (pass: string) => {
    setPasswordValidation({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const isPasswordValid = Object.values(passwordValidation).every(v => v);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!isPasswordValid) {
      setError('Password does not meet all security requirements');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);

      // Show success message
      setSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-[#f0f9ff] to-[#ecfeff] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[#bfdbfe] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#a5f3fc] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#bae6fd] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [-100, 100, -100],
          y: [-100, 100, -100],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        {/* Signup Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-[#dbeafe]"
          whileHover={{ y: -6, boxShadow: "0 30px 60px -12px rgba(59, 130, 246, 0.3)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-[#1e40af] via-[#0e7490] to-[#0891b2] p-10 text-center relative overflow-hidden">
            {/* Animated pattern overlay */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '24px 24px']
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear'
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              }}
            />

            {/* Logo */}
            <motion.div
              className="relative z-10 w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{
                rotate: [0, -10, 10, -10, 0],
                scale: 1.1
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-10 h-10 text-[#d97706]" />
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-white relative z-10 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Create Account
            </motion.h2>

            <motion.div
              className="flex items-center justify-center gap-2 text-[#dbeafe] text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </motion.div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-[#334155] mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <Mail className="w-5 h-5 text-[#3b82f6]" />
                  </motion.div>
                  <motion.input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#eff6ff]/50 border-2 border-[#dbeafe] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="engineer@solarops.com"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-[#334155] mb-2">
                  Password
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <Lock className="w-5 h-5 text-[#3b82f6]" />
                  </motion.div>
                  <motion.input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full pl-11 pr-12 py-3.5 bg-[#eff6ff]/50 border-2 border-[#dbeafe] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="Create a secure password"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748b] hover:text-[#3b82f6] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {capsLockOn && passwordFocused && (
                    <motion.div
                      className="absolute left-0 top-full mt-1 flex items-center gap-1 text-xs text-[#f59e0b] font-medium"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>Caps Lock is ON</span>
                    </motion.div>
                  )}
                </div>

                {/* Password Requirements */}
                {password && (
                  <motion.div
                    className="mt-3 space-y-1 bg-[#eff6ff] p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <p className="text-xs font-semibold text-[#334155] mb-2">Password Requirements:</p>
                    <PasswordRequirement met={passwordValidation.length} text="At least 8 characters" />
                    <PasswordRequirement met={passwordValidation.uppercase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordValidation.lowercase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordValidation.number} text="One number" />
                    <PasswordRequirement met={passwordValidation.special} text="One special character (!@#$%^&*)" />
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#334155] mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <Lock className="w-5 h-5 text-[#3b82f6]" />
                  </motion.div>
                  <motion.input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    className="w-full pl-11 pr-12 py-3.5 bg-[#eff6ff]/50 border-2 border-[#dbeafe] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="Re-enter your password"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748b] hover:text-[#3b82f6] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {capsLockOn && confirmPasswordFocused && (
                    <motion.div
                      className="absolute left-0 top-full mt-1 flex items-center gap-1 text-xs text-[#f59e0b] font-medium"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>Caps Lock is ON</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-[#fef2f2] border-2 border-[#fecaca] text-[#b91c1c] px-4 py-3 rounded-xl text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-[#f0fdf4] border-2 border-[#bbf7d0] text-[#16a34a] px-4 py-3 rounded-xl text-sm font-medium"
                >
                  Account created successfully! Redirecting to sign in...
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1e40af] via-[#0e7490] to-[#0891b2] text-white py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={loading ? undefined : { scale: 1.03, y: -2 }}
                whileTap={loading ? undefined : { scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </span>

                {/* Shimmer effect on button */}
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />

                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>
            </form>

            {/* Login Link */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-sm text-[#64748b]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#2563eb] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#3b82f6] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle className="w-4 h-4 text-[#16a34a]" />
      ) : (
        <XCircle className="w-4 h-4 text-[#94a3b8]" />
      )}
      <span className={`text-xs ${met ? 'text-[#16a34a] font-semibold' : 'text-[#64748b]'}`}>
        {text}
      </span>
    </div>
  );
}
