import { Navigate } from 'react-router-dom';
import { JSX, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: string }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

//   if (auth.user.role !== role) {
//     return <Navigate to="/unauthorized" replace />;
//   }

  return children;
};

export default ProtectedRoute;
