import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import { createContext } from "react";

import { AuthProvider } from "./contexts/userContext";
// const UserContext = createContext({
//   userName:""
// });

function App() {
  return (
<AuthProvider>
  <div>
      <Header/>
      <Outlet/>
    </div>
  
</AuthProvider>
  );
}

export default App;
