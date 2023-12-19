import React, { useContext } from "react";
import video from "../assets/video-call.png";
import add from "../assets/add-friend.png";
import more from "../assets/more.png";
import back from "../assets/back-arrow.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatsContext } from "../context/ChatsContext";
function Chat() {
  const { data } = useContext(ChatsContext);
  return data.user?.displayName ? (
    <div className="chat">
      <div className="chatInfo">
        <span>
          <img
            src={back}
            alt=""
            className="back"
            onClick={() => {
              document.querySelector(".chat").style.display = "none";
              document.querySelector(".sidebar").style.display = "block";
            }}
          />
          {data.user?.displayName}
        </span>
        <div className="chatInfoIcons">
          <img src={video} alt="" />
          <img src={add} alt="" />
          <img src={more} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  ) : (
    <div className="noChat chat">
      <span>Select or find a friend to start a chat</span>
    </div>
  );
}

export default Chat;
