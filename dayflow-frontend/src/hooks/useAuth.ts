import { useAuthStore } from '../store/authStore';
import { login as loginApi, logout as logoutApi } from '../api/auth';

export const useAuth = () => {
  const { user, isAuthenticated, login: setLogin, logout: setLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      setLogout();
    }
  };

  return {
    user,
    isAuthenticated,
    login: setLogin,
    logout: handleLogout,
  };
};
