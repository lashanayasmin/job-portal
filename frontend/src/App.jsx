import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/EmployerDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(getMe());
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute role="employer">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute role="employer">
              <EditJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function DashboardRouter() {
  const { user } = useSelector((state) => state.auth);
  if (user?.role === 'employer') return <EmployerDashboard />;
  return <SeekerDashboard />;
}
