import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { AuthProvider } from './contexts/userContext.jsx'
import HomePage from './pages/Homepage.jsx'

const appRouter=createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<HomePage/>
            },{
            path:"/watch",
            element:<VideoPlayer/>
            }
        ]
    },
    
    {
        path:"/login",
        element:<AuthProvider><Login/></AuthProvider>
    },{
        path:"/register",
        element:<AuthProvider><Register/></AuthProvider>
    }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={appRouter} />
)
