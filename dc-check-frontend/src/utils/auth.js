import jwtDecode from 'jwt-decode';
import { USER_ROLES } from './constants';

export const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role === USER_ROLES.ADMIN;
  } catch (error) {
    return false;
  }
};

export const requireAdmin = (Component) => {
  return function WithAdminCheck(props) {
    if (!isAdmin()) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component {...props} />;
  };
}; 