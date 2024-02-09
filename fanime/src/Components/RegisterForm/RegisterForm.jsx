import React, {useState, useRef, useEffect} from 'react'; 
import './RegisterForm.css';
import { FaLock, FaUser, FaRegEyeSlash, FaRegEye} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const RegisterForm = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [conPass, setConPass] = useState("");
    
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const conPassRef = useRef(null);

    let [viewPass, setViewPass] = useState(false);
    let [viewConPass, setViewConPass] = useState(false);

    const handleSubmit = e =>{
        e.preventDefault();
        setName(nameRef.current.value)
        setEmail(emailRef.current.value);
        setPass(passRef.current.value);
        setConPass(conPassRef.current.value)
        window.alert(name + " " + email + " " + pass + " " + conPass);
    };

    const handleNameChange = e => {
        setName(e.target.value);
    };

    const handleEmailChange = e => {
        setEmail(e.target.value);
    };

    const handlePassChange = e => {
        setPass(e.target.value);
    };

    const handleConPassChange= e => {
        setConPass(e.target.value);
    };

  return (
    <div className='wrapper'>
    <form onSubmit={handleSubmit}>
        <h1>Register Account</h1>
        <div className='inputbox'>
            <input ref={nameRef} onChange={handleNameChange} value={name} placeholder='Username' id='Username'/>
            <FaUser className='icon'/>
        </div>
        <div className='inputbox'>
            <input ref={emailRef} onChange={handleEmailChange} value={email} type="email" placeholder='Email' id='email' name='email'/>
            <MdEmail  className='icon'/>
        </div>
        <div className='inputbox'>
            <input ref={passRef} onChange={handlePassChange} value={pass} type = {viewPass ? "password" : "text"} placeholder='Password' id='pass'/>
            {viewPass ? <FaRegEyeSlash onClick={() => setViewPass(!viewPass)} className='icon'/> : <FaRegEye onClick={() => setViewPass(!viewPass)} className='icon'/>}
        </div>
        <div className='inputbox'>
        <input ref={conPassRef} onChange={handleConPassChange} value={conPass} type = {viewConPass ? "password" : "text"} placeholder='Confirm Password' id='pass'/>
            {viewConPass ? <FaRegEyeSlash onClick={() => setViewConPass(!viewConPass)} className='icon'/> : <FaRegEye onClick={() => setViewConPass(!viewConPass)} className='icon'/>}
        </div>

        <button id='login-button' type='submit'>Register</button>
        
        <div className='register'>
            <p>Have an account? <button onClick={() => props.onFormSwitch('login')}>Login</button></p>
        </div>
    </form>
</div>
  )
}
