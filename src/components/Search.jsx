import React, { useEffect, useState, useContext } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatsContext } from "../context/ChatsContext";

function Search() {
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);

  const { dispatch } = useContext(ChatsContext);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async (e) => {
    setErr(false);
    const userRef = collection(db, "users");
    const q = query(
      userRef,
      where("displayName", ">=", userName),
      where("displayName", "<=", userName + "\uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      const foundUsers = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.uid !== currentUser.uid) {
          foundUsers.push({ ...userData, id: doc.id });
        }
      });

      setUsers(foundUsers);
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  useEffect(() => {
    const delayTime = setTimeout(() => {
      if (userName.trim() !== "") {
        handleSearch();
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(delayTime);
  }, [userName]);

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    const rsp = await getDoc(doc(db, "chats", combinedId));

    if (!rsp.exists()) {
      await setDoc(doc(db, "chats", combinedId), { messages: [] });
      await updateDoc(doc(db, "usersChat", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "usersChat", user.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    }

    setUserName("");
    setUsers([]);

    dispatch({ type: "CHANGE_USER", payload: user });

    const isTablet = window.matchMedia("(max-width: 768px)").matches;

    if (isTablet) {
      // Select the sidebar element using its class name
      const sidebarElement = document.querySelector(".sidebar");
      const chatElement = document.querySelector(".chat");

      // Apply the 'none' display style to hide the sidebar
      sidebarElement.style.display = "none";
      chatElement.style.display = "block";
    }
  };
  return (
    <>
      <div className="search">
        <div className="searchform">
          <input
            type="text"
            placeholder="Find User"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          {err && <span>User not found!</span>}
          {users.map((user) => (
            <div
              className="userchat"
              key={user.id}
              onClick={(e) => {
                handleSelect(user);
              }}
            >
              <img src={user.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{user.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Search;
