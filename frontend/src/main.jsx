import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { AuthProvider } from './contexts/userContext.jsx'
import HomePage from './pages/Homepage.jsx'
import Videos from './pages/Videos.jsx'
import ChannelProfile from './components/Channel.jsx'
import ChannelList from './components/ChannelList.jsx'
import CreateVideo from './components/videoForms/UploadVideo.jsx'
import UpdateVideo from './components/videoForms/UpdateVideo.jsx'
import CreateChannel from './components/channelForms/CreateChannel.jsx'
import UpdateChannel from './components/channelForms/UpdateChannel.jsx'
import UpdateProfile from './components/userActions/UserUpdate.jsx'
const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/watch/:id",
                element: <Videos />,
            },
            {
                path: "/channel",
                children:[
                    {
                        index: true,
                        element: <ChannelList />
                        
                    },
                    {
                        path:":channelId",
                        element:<ChannelProfile/>
                    }
                ]
            },
            {
                path: "/studio",
                children: [
                    {
                        path: "CreateVideo",
                        element: <CreateVideo/>
                    },
                    {
                        path: "updateVideo",
                        element: <UpdateVideo />
                    },{
                        path:"updateChannel",
                        element:<UpdateChannel/>
                    }
                    ,{
                        path:"createChannel",
                        element:<CreateChannel/>
                    },{
                        path:"updateProfile",
                        element:<UpdateProfile/>
                    }
                    
                ]
            },
        ]

    },

    {
        path: "/login",
        element: <AuthProvider><Login /></AuthProvider>
    }, {
        path: "/register",
        element: <AuthProvider><Register /></AuthProvider>
    }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={appRouter} />
)
