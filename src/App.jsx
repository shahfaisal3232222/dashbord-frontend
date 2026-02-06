import React from "react";
import { Route , Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Authenticated from "./routes/Authenticated";
function App() {

  return (
   <div>
    <Routes>
      <Route path='/' element={<LoginPage  />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route  path='/home' element={<Authenticated><HomePage /></Authenticated>}/>
    </Routes>
   </div>
  )
}

export default App;
