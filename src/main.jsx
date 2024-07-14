import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignInPage from './routes/SignInPage.jsx'
import SignUpPage from './routes/SignUpPage.jsx'
import UserPage from './routes/UserPage.jsx'
import GuestPage from './routes/GuestPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'sign-in',
        element: <SignInPage />,
      },
      {
        path: 'sign-up',
        element: <SignUpPage />,
      },
      {
        path: 'user-page',
        element: <UserPage />,
      },
      {
        path: 'guest-page',
        element: <GuestPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
