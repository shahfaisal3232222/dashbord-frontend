import { Navigate } from "react-router";

function Authenticated({children}) {
  
    const token = localStorage.getItem("token")
    return token ? children : <Navigate to="/" />
  
}

export default Authenticated;