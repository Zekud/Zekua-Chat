import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">Zekua Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="profile" />
        <span>{currentUser.displayName} </span>
        <button onClick={() => signOut(auth)}>Log Out</button>
      </div>
    </div>
  );
}

export default NavBar;
