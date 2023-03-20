import axios from "axios";
import { useState } from "react";
import { AiTwotoneStar } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import "./login.css";

export default function Login({ setShowLogin,myStorage,setCurrentUser }) {
  const [error, setError] = useState(false);
  const [userName,setUserName] = useState(null)
  const [password,setPassword] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: userName,
      password: password
    };

    try {

      const res=await axios.post("http://localhost:8800/api/users/login", user);
      myStorage.setItem("user",res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false)
      setError(false);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <AiTwotoneStar className="logoIcon" />
        <span>Login Now</span>
      </div>
      <form
       onSubmit={handleSubmit}
       >
        <input autoFocus placeholder="username"
         onChange={(e)=>setUserName(e.target.value)}
          />
        
        <input
          type="password"
          min="6"
          placeholder="password"
          onChange={(e)=>setPassword(e.target.value)}
          />
        <button className="loginBtn" type="submit">
          Log in
        </button>
       
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <MdCancel
        className="loginCancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
}