import RequireAuth from 'components/RequireAuth';
import { Login, Register } from 'pages/Auth';
import Chat from 'pages/Chat';
import Home from 'pages/Home';
import Posts from 'pages/Post';
import Profile from 'pages/Profile';
import Setting from 'pages/Setting';
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
            <Route
               path="/:username"
               element={
                  <RequireAuth>
                     <Profile />
                  </RequireAuth>
               }
            />
            <Route
               path="/chat"
               element={
                  <RequireAuth>
                     <Chat />
                  </RequireAuth>
               }
            >
               <Route
                  path="/chat/:conversationId"
                  element={
                     <RequireAuth>
                        <Chat />
                     </RequireAuth>
                  }
               ></Route>
            </Route>
            <Route
               path="/p/:postId"
               element={
                  <RequireAuth>
                     <Posts />
                  </RequireAuth>
               }
            />
            <Route
               path="/setting"
               element={
                  <RequireAuth>
                     <Setting />
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
