import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatsContext } from "../context/ChatsContext";

function Chats() {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatsContext);
  const [chats, setChats] = useState({});

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "usersChat", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    // Check if the device is a tablet based on the screen width
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
      <div className="chats">
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="userchat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Chats;
