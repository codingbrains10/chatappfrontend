import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import ForgotPassword from './components/ForgotPassword';
import OtpVerification from './components/OtpVerification';
// import Profile from './components/dashboard/MiniDrawer';
import ResetPassword from './components/ResetPassword';
import MiniDrawer from './components/dashboard/MiniDrawer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/profile" element={<MiniDrawer />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
