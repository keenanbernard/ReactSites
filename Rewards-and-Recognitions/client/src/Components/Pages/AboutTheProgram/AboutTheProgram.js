import React from 'react';
import {motion} from "framer-motion";
import {Row} from 'react-bootstrap';
import programBanner from "./Images/AboutTheProgram.png";
import './AbourTheProgram.css';

function AboutTheProgram() {

    return (
        <motion.div className="container-fluid" id="programDiv" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
            <Row className='bannerImageRow'>
                <img className='programImage' src={programBanner} alt={'Banner 1'} style={{width: '60%', paddingTop: 16}}/>

                <p className='firstSentence'>The "I AM DIGI" Recognition Program provides an opportunity to acknowledge and reward the contribution of employees who lead by example, embrace our corporate behaviors and ambitiously work towards the achievement of the company's goals and key initiatives.</p>
            </Row>
        </motion.div>
    )
}

export default AboutTheProgram;
