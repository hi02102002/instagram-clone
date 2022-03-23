import ScreenLoader from 'components/ScreenLoader';
import {
   createUserWithEmailAndPassword,
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signOut,
   User,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';

interface IAuthContext {
   user: null | User;
   login: (email: string, password: string) => any;
   signUp: (email: string, password: string) => any;
   logout: () => any;
}

const defaultState: IAuthContext = {
   login: () => {},
   signUp: () => {},
   logout: () => {},
   user: null,
};

export const AuthContext = createContext<IAuthContext>(defaultState);

const AuthProvider: React.FC = ({ children }) => {
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   const login = async (email: string, password: string) => {
      return await signInWithEmailAndPassword(auth, email, password);
   };

   const logout = async () => {
      return await signOut(auth);
   };

   const signUp = async (email: string, password: string) => {
      const { user } = await createUserWithEmailAndPassword(
         auth,
         email,
         password
      );

      return user;
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         setCurrentUser(user);
         setLoading(false);
      });

      return () => {
         unsubscribe();
      };
   }, []);

   const value = {
      user: currentUser,
      login,
      logout,
      signUp,
   };
   return (
      <AuthContext.Provider value={value}>
         {loading ? <ScreenLoader /> : children}
      </AuthContext.Provider>
   );
};

export default AuthProvider;
