import React, { useState } from "react";
import google from "../assets/google-logo-9824.png";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
function Login() {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      setErr(false);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setDisabled(false);
      setErr(true);
      if (err.code === "auth/invalid-credential") {
        setErrMessage("email or password is wrong");
      } else {
        setErrMessage("something went wrong");
      }
    }
  };

  const ContinueWithGoole = async () => {
    try {
      setErr(false);
      const rsp = await signInWithPopup(auth, googleProvider);

      const userDocRef = doc(db, "users", rsp.user.uid);

      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        setErr(true);
        setErrMessage("this user does not exist. please register");
        return;
      }
      navigate("/");
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
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <button
              type="submit"
              disabled={disabled}
              className={disabled ? "disabled loginbtn" : "loginbtn"}
            >
              {disabled ? <div class="spinner"></div> : "Sign In"}
            </button>
          </form>
          <span className="or">or</span>
          <button
            className="google"
            onClick={ContinueWithGoole}
            disabled={disabled}
          >
            <img src={google} alt="icon" />
            Continue with Google
          </button>
          <p>
            You don't have an account? <Link to={"/register"}>Register</Link>
          </p>
          {err && <span className="err">{errMessage}</span>}
        </div>
      </div>
    </>
  );
}

export default Login;
