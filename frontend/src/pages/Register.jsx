import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();


  const handleRegister = async (e)=>{

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );


      console.log(res.data);


      alert("Registration Successful");


      navigate("/");


    } catch(error){

  console.log(
    "REGISTER ERROR:",
    error.response?.data
  );

  alert(
    error.response?.data?.message ||
    "Registration Failed"
  );

}

  };


  return (

    <div className="login-page">


      <div className="login-card">


        <h1>Register</h1>


        <form onSubmit={handleRegister}>


          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e)=>
              setName(e.target.value)
            }
          />


          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
          />


          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
          />


          <button type="submit">
            Register
          </button>


        </form>


        <p>

          Already have an account?

          <Link to="/">
            Login
          </Link>

        </p>


      </div>

    </div>

  );

}


export default Register;