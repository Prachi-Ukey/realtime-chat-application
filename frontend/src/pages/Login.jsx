import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      console.log("EMAIL ENTERED:", email);
console.log("LOGIN RESPONSE USER:", res.data.user);
console.log("LOGIN RESPONSE EMAIL:", res.data.user.email);
console.log("LOGIN RESPONSE NAME:", res.data.user.name);

localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

const savedUser = JSON.parse(localStorage.getItem("user"));

console.log("SAVED USER:", savedUser);
console.log("SAVED EMAIL:", savedUser.email);
console.log("SAVED NAME:", savedUser.name);

      alert("Login Successful");

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
 "user",
 JSON.stringify(res.data.user)
);

      navigate("/chat");

    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>Login</h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>

  );
}

export default Login;