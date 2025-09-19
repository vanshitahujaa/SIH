import { useAppSelector } from '../store';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error, token } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return {
    user,
    isAuthenticated,
    loading,
    error,
    token,
    isAdmin,
    isUser,
  };
};