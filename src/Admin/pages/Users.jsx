import UserTable from "../Components/UserTable";

const Users = () => {
  // Dummy data
  const users = [
    {
      _id: "1",
      name: "Mukesh Kumar",
      email: "mukesh@example.com",
      referralCode: "X823887",
      status: "Active"
    },
    {
      _id: "2",
      name: "Ravi Sharma",
      email: "ravi@example.com",
      referralCode: "X912345",
      status: "Inactive"
    },
    {
      _id: "3",
      name: "Anjali Mehra",
      email: "anjali@example.com",
      referralCode: "X765432",
      status: "Pending"
    },
    {
      _id: "4",
      name: "Sunil Yadav",
      email: "sunil@example.com",
      referralCode: "X554433",
      status: "Active"
    },
    {
      _id: "5",
      name: "Pooja Verma",
      email: "pooja@example.com",
      referralCode: "X998877",
      status: "Inactive"
    },
    {
      _id: "6",
      name: "Aman Singh",
      email: "aman@example.com",
      referralCode: "X112233",
      status: "Active"
    },
    {
      _id: "7",
      name: "Suman Joshi",
      email: "suman@example.com",
      referralCode: "X334455",
      status: "Pending"
    },
    {
      _id: "8",
      name: "Karan Patel",
      email: "karan@example.com",
      referralCode: "X667788",
      status: "Active"
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <UserTable users={users} />
    </div>
  );
};

export default Users;
