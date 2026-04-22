import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, Sun } from 'lucide-react';
import { logout } from '../api/auth';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout(); // clears token + solarops_farms (history stays)
    navigate('/');
  };

  const navItems = [
    { name: 'Console', path: '/console' },
    { name: 'Panel Farm View', path: '/farm-view' },
    { name: 'Upload', path: '/upload' },
    { name: 'Panels & Defects', path: '/panels' },
    { name: 'History', path: '/history' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <motion.nav
      className="bg-white border-b border-[var(--solar-border)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-[#fde68a] to-[#d97706] rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-5 h-5 text-white" />
              </motion.div>
              <Link to="/console" className="text-xl font-semibold text-[var(--solar-navy)]">
                SolarOps
              </Link>
            </motion.div>
            <div className="flex gap-1">
              {navItems.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isActive(link.path)
                        ? 'bg-[#08306b] text-white'
                        : 'text-[#4292c6] hover:bg-[#eff6ff]'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[#4292c6] hover:bg-[#eff6ff] rounded-md transition-colors font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}