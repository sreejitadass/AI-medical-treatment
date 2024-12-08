import React, { useEffect } from "react";
import { useStateContext } from "../context"; // Importing the context
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // Importing the user icon

const Profile = () => {
  const { currentUser, fetchUserByEmail } = useStateContext(); // Destructuring necessary values from context
  const email = "user-email@example.com"; // Replace with the actual user's email (use Privy or context for dynamic value)

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserByEmail(email); // Fetch user by email from the context
  }, [email, fetchUserByEmail]);

  if (!currentUser) {
    return <div>Loading...</div>; // Return loading state until user data is fetched
  }

  return (
    <div className="py-30 my-50 flex min-h-screen items-center justify-center bg-[#13131a]">
      <div className="w-full max-w-sm rounded-xl bg-[#1c1c24] p-10 shadow-xl">
        {/* Profile Header */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#4acd8d]">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-white" />
          </div>
        </div>

        {/* User Info */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-semibold text-white">
            {currentUser.username}
          </h3>
          <p className="text-md text-gray-400">{currentUser.createdBy}</p>
        </div>

        {/* Age and Location */}
        <div className="space-y-1 text-center">
          <p className="text-base text-gray-300">{currentUser.age}</p>
          <p className="text-base text-gray-300">{currentUser.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
