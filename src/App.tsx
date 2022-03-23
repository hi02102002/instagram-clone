import RequireAuth from 'components/RequireAuth';
import { Login, Register } from 'pages/Auth';
import Home from 'pages/Home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

function App() {
   return (
      <div className="App">
         <Routes>
            <Route
               path="/"
               element={
                  <RequireAuth>
                     <Home />
                  </RequireAuth>
               }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
         </Routes>
      </div>
   );
}

export default App;
