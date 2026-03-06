import { Navigate, Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useCurrentUser } from '../pages/Login/useLogin';
import useAuthStore from '../store/authStore';
import SocketProvider from './SocketProvider';

function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-10 text-center w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="text-blue-500 text-5xl animate-spin">
              <LoadingOutlined />
            </div>
          </div>

          <h2 className="text-white text-xl font-semibold mb-2">
            Verifying...
          </h2>

          <p className="text-gray-400 text-sm">
            Please wait while we securely check your authentication.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.data.role === 'admin' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }
  if (
    user.data.role === 'manager' &&
    !location.pathname.startsWith('/manager')
  ) {
    return <Navigate to="/manager" replace />;
  }

  if (user.data.role === 'participant') {
    if (!location.pathname.startsWith('/competition')) {
      return <Navigate to={`/competition/${user.data.event.join}`} replace />;
    }
  }
  return <Outlet />;
}

export default ProtectedRoute;
