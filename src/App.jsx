import React from "react";
import { Route , Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import Authenticated from "./routes/authenticated";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/HomePage";
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
