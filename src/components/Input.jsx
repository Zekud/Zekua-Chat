import React, { useState, useContext } from "react";

import addimage from "../assets/add-photo-alternate.png";
import send from "../assets/send.png";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { ChatsContext } from "../context/ChatsContext";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase";
function Input() {
  const [text, setText] = useState("");
  const [img, setImage] = useState(null);
  const { data } = useContext(ChatsContext);
  const { currentUser } = useContext(AuthContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (err) => {
          // Handle unsuccessful uploads
          console.error("Error uploading file: ", err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );

      await updateDoc(doc(db, "usersChat", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: text ? text : "image",
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "usersChat", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text: text ? text : "image",
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setImage(null);
      setText("");
    } else {
      const messagesRef = doc(db, "chats", data.chatId);

      await updateDoc(messagesRef, {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, "usersChat", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "usersChat", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      setImage(null);
      setText("");
    }
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          name="attach"
          id="attach"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="attach">
          <img src={addimage} alt="" id="attach" />
        </label>
        <img src={send} alt="" onClick={handleSend} />
      </div>
    </div>
  );
}

export default Input;
