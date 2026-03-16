import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [error,setError] = useState("");

const login = async ()=>{

  if(!email || !password){
    setError("Enter email and password");
    return;
  }

  try{

    const res = await axios.post(
      "https://engineermodule.onrender.com/login",
      {
        email: email,
        password: password
      }
    );

    if(res.data.success){

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/");

    }else{
      setError("Invalid Email or Password");
    }

  }catch(err){

    console.log("Login error:",err);

    setError("Server error. Try again.");

  }

};

return(

<div className="login-box">

<h3>CRM Login</h3>

{error && (
<p style={{color:"red"}}>
{error}
</p>
)}

<input
type="email"
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

</div>

);

}

export default Login;