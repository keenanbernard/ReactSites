import React from "react";
import { Link } from 'react-router-dom';
import "./Footer.css";
import icon from "./YammerIcon.png";

function Footer() {

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const sendEmail = (email) => {
        var email = email;
        var subject = 'HR Rewards and Recognitions';
        window.location.href = "mailto:"+email+"?subject="+subject;
    }

    const hrYammer = 'https://web.yammer.com/main/org/belizetelemedia.net/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIzNDA4MTY2OTEyMCJ9/new';

    return (
        <div className="footer">
            <div className="container">
                <div className="footer-row">
                    <div className="footer-col">
                        <h4>company</h4>
                        <ul>
                            <li><Link to='/AboutTheProgram'>About The Program</Link></li>
                            <li><Link to='/EmployeeMilestone'>Employee Milestones</Link></li>
                            <li><Link to='/'>privacy policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>contact us</h4>
                        <ul>
                            <li onClick={() => sendEmail('spascascio@livedigi.com')}>Shara Pascacio</li>
                            <li onClick={() => sendEmail('fcal@livedigi.com')}>Florentino Cal</li>
                            <li onClick={() => sendEmail('egarbutt@livedigi.com')}>Ellen Borland</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>follow us</h4>
                        <div className="social-links">
                            <div onClick={() => openInNewTab(hrYammer)}>
                                <i>
                                    <img className='socialImage' src={icon} alt={'yammer'} style={{width: '100%', height: '100%'}}/>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;