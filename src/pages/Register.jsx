import React, { useState } from "react";
import img from "../assets/photo-icon.png";
import google from "../assets/google-logo-9824.png";
import { auth, googleProvider, storage, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
function Register() {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      setErr(false);
      const rsp = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `${displayName} + ${rsp.user.uid}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (err) => {
          setErr(true);
          console.error("Error uploading file: ", err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(rsp.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", rsp.user.uid), {
              uid: rsp.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "usersChat", rsp.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (err) {
      setDisabled(false);
      setErr(true);
      if (err.code === "auth/email-already-in-use") {
        setErrMessage("email already in use login instead");
      } else {
        setErrMessage("something went wrong");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      setDisabled(true);
      setErr(false);

      const rsp = await signInWithPopup(auth, googleProvider);
      const userDocRef = doc(db, "users", rsp.user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(doc(db, "users", rsp.user.uid), {
          uid: rsp.user.uid,
          displayName: rsp.user.displayName,
          email: rsp.user.email,
          photoURL: rsp.user.photoURL,
        });

        await setDoc(doc(db, "usersChat", rsp.user.uid), {});

        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErr(true);
      setErrMessage("something went wrong");
      setDisabled(false);
    }
  };
  return (
    <>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Zekua Chat</span>
          <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="user name" />
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <img src={img} alt="icon" />
              <span>Add an avatar</span>
            </label>
            {file && <span className="success">Image uploaded!!</span>}
            <button
              type="submit"
              disabled={disabled}
              className={disabled ? "disabled" : ""}
            >
              {disabled ? <div class="spinner"></div> : "Sign up"}
            </button>
          </form>
          <span className="or">or</span>
          <button
            className="google"
            onClick={signInWithGoogle}
            disabled={disabled}
          >
            <img src={google} alt="icon" />
            Sign in with Google
          </button>
          <p>
            You do have an account? <Link to={"/login"}>Login</Link>
          </p>
          {err && <span className="err">{errMessage}</span>}
        </div>
      </div>
    </>
  );
}

export default Register;
