// HamburgerMenu.js
import React from 'react';
import './App.css';

const HamburgerMenu = ({ isOpen, toggleMenu }) => {
  return (
    <div class="container nav-container">
            <input class="checkbox" type="checkbox" name="" id="" />
    <div className={`hamburger-lines ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div> 
        
    </div>
  );
};

export default HamburgerMenu;