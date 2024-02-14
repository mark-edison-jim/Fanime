import React, {useState, useRef, useEffect} from 'react'; 
import './LoginForm.css';
import { FaLock, FaUser, FaRegEyeSlash, FaRegEye} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const LoginForm = (props) => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const emailRef = useRef(null);
    const passRef = useRef(null);

    let [viewPass, setViewPass] = useState(false);

    const handleSubmit = e =>{
        e.preventDefault();
        setEmail(emailRef.current.value);
        setPass(passRef.current.value);
        window.alert(email + " " + pass);
    };

    const handleEmailChange = e => {
        setEmail(e.target.value);
    };

    const handlePassChange = e => {
        setPass(e.target.value);
    };


  return (
    <div className='wrapper'>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className='inputbox'>
                <input ref={emailRef} onChange={handleEmailChange} value={email} type="email" placeholder='Email' id='email' name='email'/>
                <MdEmail  className='icon'/>
            </div>
            <div className='inputbox'>
                <input ref={passRef} onChange={handlePassChange} value={pass} type = {viewPass ? "password" : "text"} placeholder='Password' id='pass'/>
                {/* <FaLock  className='icon'/> */}
                {viewPass ? <FaRegEyeSlash onClick={() => setViewPass(!viewPass)} className='icon'/> : <FaRegEye onClick={() => setViewPass(!viewPass)} className='icon'/>}
            </div>
            <div className='remember'>
                <label><input type="checkbox" />Remember me</label>
                <a href="#">Recover Password</a>
            </div>

            <button id='login-button' type='submit'>Login</button>

            <div className='register'>
                <p>Don't have an account? <button onClick={() => props.onFormSwitch('register')}>Register</button></p>
            </div>
        </form>
    </div>
  )
}

export default LoginForm;