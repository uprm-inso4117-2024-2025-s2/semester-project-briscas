import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';


//import are already done
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
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
  
  // {
  //   path: '/HelpRules',
  //   element: <HelpRules/>
  // },
  // {
  //   path: '/Profile',
  //   element: <Profile/>
  // },
  // {
  //   path: '/Register',
  //   element: <Register/>
  // },
  
  // {
  //   path: '/SignIn',
  //   element: <SignIn/>
  // }

  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
      <RouterProvider router={router} />
  </React.StrictMode>
);
