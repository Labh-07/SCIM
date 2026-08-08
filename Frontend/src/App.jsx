import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LogIn from "./sections/Login/LogIn";
import ResidentHome from "./sections/RresidentHome2/pages/ResidentHome";
import SignUp from "./sections/Login/SignUp";
import ResidentDetails from "./sections/Login/ResidentDetails";
import SuccessPhe from "./sections/Login/SuccessPage";
import { AuthProvider } from "./sections/RresidentHome2/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/homeResident" element={<ResidentHome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resident-details" element={<ResidentDetails />} />
          <Route path="/success" element={<SuccessPhe />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
