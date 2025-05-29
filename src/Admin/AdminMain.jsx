// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Payments from './pages/Payments';
import Withdraws from './pages/Withdraws';
import Reports from './pages/Reports';
import Sidebar from './Components/Sidebar';


function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 min-h-screen">{children}</div>
    </div>
  );
}

const AdminMain = () =>  {
  const isAdmin = true; // Replace with real auth logic

  return (
    
      <Routes>

        {/* <Route path="/" element={<AdminLayout />} /> */}
        {/* <Route path="/admin/login" element={<Login />} /> */}

        {isAdmin ? (
          <>
            <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
            <Route path="/admin/payments" element={<AdminLayout><Payments /></AdminLayout>} />
            <Route path="/admin/withdraws" element={<AdminLayout><Withdraws /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/admin/login" />} />
        )}
      </Routes>
    
  );
}

export default AdminMain