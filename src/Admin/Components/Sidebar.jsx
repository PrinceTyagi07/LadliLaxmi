import { Link } from 'react-router-dom';

const Sidebar=()=> {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/payments">Payments</Link>
        <Link to="/admin/withdraws">Withdraws</Link>
        <Link to="/admin/reports">Reports</Link>
      </nav>
    </div>
  );
}
export default Sidebar;