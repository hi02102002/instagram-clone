import { useAuth } from 'hooks';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth: React.FC = ({ children }) => {
   const { user } = useAuth();
   let location = useLocation();
   if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   return <>{children}</>;
};

export default RequireAuth;
