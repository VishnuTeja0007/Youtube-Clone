import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store/store';
import Loading from './components/Loading.jsx'

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/Homepage.jsx'));
const Videos = lazy(() => import('./pages/Videos.jsx'));
const ChannelProfile = lazy(() => import('./components/Channel.jsx'));
const ChannelList = lazy(() => import('./components/ChannelList.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

import CreateVideo from './components/videoForms/UploadVideo.jsx'
import UpdateVideo from './components/videoForms/UpdateVideo.jsx'
import CreateChannel from './components/channelForms/CreateChannel.jsx'
import UpdateChannel from './components/channelForms/UpdateChannel.jsx'
import UpdateProfile from './components/userActions/UserUpdate.jsx'
import UserLibrary from './components/userActions/ManageUser.jsx'
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
                    },{
                        path:"manageAccount",
                        element:<UserLibrary/>
                    }
                    
                ]
            },
        ]

    },

    {
        path: "/login",
        element: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading Login..." />}>
                    <Login />
                </Suspense>
            </Provider>
        )
    }, {
        path: "/register",
        element: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading Register..." />}>
                    <Register />
                </Suspense>
            </Provider>
        )
    }
])

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={appRouter} />
    </Provider>
)
