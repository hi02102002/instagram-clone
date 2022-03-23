import AuthProvider from 'context/auth.context';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.render(
   <BrowserRouter>
      <AuthProvider>
         <App />
      </AuthProvider>
   </BrowserRouter>,
   document.getElementById('root')
);
