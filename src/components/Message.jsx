import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatsContext } from "../context/ChatsContext";

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatsContext);

  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>
          {new Date().getTime() - message.date.toDate().getTime() < 60000
            ? "Just now"
            : message.date.toDate().toLocaleTimeString()}
        </span>
      </div>
      <div className="messageContent">
        {message.img && <img src={message.img} alt="" />}
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
}

export default Message;
