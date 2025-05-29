export default function UserTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-[#141628] rounded shadow">
        <thead className="b">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Referral Code</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.referralCode}</td>
              <td className="py-2 px-4">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
