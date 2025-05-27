import {React,useEffect, useState  }from 'react'
import UserSidebar from '../components/Profile/userSidebar'
import axios  from "axios"
import Main from '../components/Profile/main'

const Profile = () => {
  
    const [user, setUser] = useState(null);
    // const userId = localStorage.getItem("userId"); // Assumes user ID is stored here
  const userId ="68331a883b83f9270554b112"
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:4001/api/v1/profile/getprofile/${userId}`
          );
          
          setUser(data.profile);
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }
      };
      if (userId) fetchData();
    }, [userId]);
  
    if (!user) return <div className="text-center mt-20 text-xl">Loading...</div>;
  
  return (
    <div>
      <div className="flex justify-between ">
        <UserSidebar user={user} />
        <Main  user={user} />
      </div>
    </div>
  )
}

export default Profile