import React, {useState} from "react";
import './NavPage.css';
import {LoginForm} from '../LoginForm/LoginForm';
import {RegisterForm} from '../RegisterForm/RegisterForm';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';

export const NavPage = () => {
    const [open, setOpen] = useState(false);
    const handleRegOpen = () => {
      setCurrentForm('register');
      setOpen(true);
    };
    const handleLoginOpen = () => {
      setCurrentForm('login');
      setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) =>{
        setCurrentForm(formName);
    };
  return (
    <div>
    <nav>
        <div id="lid">
          <div id="logo_icon">
          <RxHamburgerMenu class="fa-solid fa-bars" id="hamburger"/>
            <div id="logo"><div id="logo1">Fanime</div><div id="logo2">.tv</div></div>
          </div>
          <div id="dropdown">
            <ul id="d_links">
              <li><a href="#home">Home</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
        </div>
        <div id='midDiv'>
          <ul id="midlinks">
            <li><a href="#home">Home</a></li>
            <li><a href="#news">News</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>
        <form id="app" action="#">
          <div id="searchHolder">
            <button id='signlogBtn' onClick={handleRegOpen}>Sign-Up</button>
            <button id='signlogBtn' onClick={handleLoginOpen}>Login</button>
          <div id="search">
            <input id="bar" type="text" placeholder=""></input>
            <button id="iconButton"><IoSearch id="icon" class="fa-solid fa-magnifying-glass"/></button>
          </div>
          </div>
        </form>
        </nav>
        <Modal id="modal"
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
        >
          {currentForm === 'login' ? <LoginForm onFormSwitch={toggleForm}/> : <RegisterForm onFormSwitch={toggleForm}/>}
        </Modal>
        </div>
  )
}

export default NavPage;