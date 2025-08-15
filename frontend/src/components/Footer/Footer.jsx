import React from 'react'
import './Footer.css'
import { assets } from '../../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img style={{ width: ' 50px' }} src={assets.logo} alt="" />
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus illo laboriosam asperiores dolorum ratione, libero adipisci porro accusamus minima animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, eaque! Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, ad.</p>
                    <div className="footer-social-icons">
                       <a href="https://www.facebook.com/share/1BgeJ22hHL/" target='_blank'><img src={assets.facebook_icon} alt="" /></a> 
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-right">
                    <h2>COMPANY</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><a href="#explore-menu">Menu</a></li>
                        <li><a href="#app-download">Mobile App</a></li>
                        <li><a href="#footer">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-content-center">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+91 9801974041</li>
                        <li>rahi@quickfood.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>Copyright 2025 © QuickFood.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
