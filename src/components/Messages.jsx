import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatsContext } from "../context/ChatsContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
function Messages() {
  const { data } = useContext(ChatsContext);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const getMessages = () => {
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => {
        unsub();
      };
    };
    data.chatId && getMessages();
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((message) => {
        return <Message key={message.id} message={message} />;
      })}
    </div>
  );
}

export default Messages;
