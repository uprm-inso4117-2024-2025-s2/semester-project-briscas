import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { captureLogs } from './utils/logStore';
captureLogs(); // <-- this captures console.log BEFORE anything renders

//import are already done
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile'
import RegisterPage from './pages/RegisterPage'
import SignInPage from './pages/SignInPage';
import HelpRules from './pages/HelpRules'
import GameBoard from './pages/GameBoard';


const router = createBrowserRouter([
  //add navbar to everypage to navagate back and forth
  {
    path: '/',
    element: <Home/>
  },
  { 
    path:'/Settings',
    element: <Settings/>
  },
  { 
    path:'/GameBoard',
    element: <GameBoard/>
  },
  
  {
    path: '/HelpRules',
    element: <HelpRules/>
  },
  {
   path: '/Profile',
   element: <Profile/>
  },
  {
    path: '/Register',
    element: <RegisterPage/>
  },
  
  {
    path: '/SignIn',
    element: <SignInPage/>
  }
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
      <RouterProvider router={router} />
  </React.StrictMode>
);
