import { useEffect, useState } from 'react';
import {
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  KeyOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useLogin } from './useLogin';
import { useNavigate } from 'react-router';
import useAuthStore from '../../store/authStore';
const LoginPage = () => {
  // hooks
  useEffect(() => {
    document.title = 'Login | Quick test';
  }, []);

  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // values
  const [form, setForm] = useState({
    username: import.meta.env.DEV ? 'user1' : '',
    password: import.meta.env.DEV ? 'test12345' : '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Events
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(form, {
      onSuccess: (user) => {
        setUser(user);
        navigate('/', { replace: true });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br  from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-white ">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>

            <div className="relative ">
              <UserOutlined className="absolute left-4 top-1/2 -translate-y-1/2  " />

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={isPending}
                placeholder="Enter your username"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>

            <div className="relative">
              <KeyOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 " />

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={isPending}
                required
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition "
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full mb-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer
              ${
                isPending
                  ? 'bg-blue-500 cursor-not-allowed opacity-80'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }
            `}
          >
            {isPending && <LoadingOutlined className="animate-spin text-lg" />}
            {isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
