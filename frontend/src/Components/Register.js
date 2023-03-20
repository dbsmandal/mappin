import axios from "axios";
import { useState } from "react";
import { AiTwotoneStar } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import "./register.css";

export default function Register({ setShowRegister,setShowLogin }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: userName,
      email: email,
      password: password,
    };

    try {
      await axios.post("http://localhost:8800/api/users/register", newUser);
      setError(false);
      setSuccess(true);
      setTimeout(() => {
        setShowRegister(false)
        setShowLogin(true)
      }, 4000);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="registerlogo">
        <AiTwotoneStar className="logoIcon" />
        <span>Register Now</span>
      </div>
      <form
        onSubmit={handleSubmit}
      >
        <input autoFocus placeholder="username"
          onChange={(e) => setUserName(e.target.value)} />
        <input type="email" placeholder="email"
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password"
          min="6"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)} />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <MdCancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}