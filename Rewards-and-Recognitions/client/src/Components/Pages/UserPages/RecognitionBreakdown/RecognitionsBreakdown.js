import React, {Fragment, useEffect, useState, useId} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {motion} from "framer-motion";
import './RecognitionsBreakdown.css';
import PeerCard1 from "../../../PeerCards/Digi RR brighten my day.webp"
import PeerCard2 from '../../../PeerCards/Digi RR Finding creative solutions.webp';
import PeerCard3 from '../../../PeerCards/Digi RR going above and beyond.webp';
import PeerCard4 from '../../../PeerCards/Digi RR Making things happen.webp';
import PeerCard5 from '../../../PeerCards/Digi RR Supportive Team Player.webp';
import PeerCard6 from '../../../PeerCards/Digi RR Behind the scenes.webp';
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";

function RecognitionsBreakdown(props) {
    // Set ID & Current date variables
    const [recognitions, setRecognitions] = useState([]);
    const [recognitionsReceived, setRecognitionsReceived] = useState([]);
    const imagesID = useId();

    const [isLoading, setIsLoading] = useState(false);

    const getUserHighFivesRec = async () => {
        setIsLoading(true);
        const response = await fetch(`${props.host}/getDigiHighFiveCountsReceived?id=${props.userid}`);
        let data = await response.json();
        if (data[0].TOTALHIGHFIVESREC > 0) {
            setIsLoading(true);
            const response = await fetch(`${props.host}/myRecognitionCount?id=${props.userid}`);
            let data = await response.json();
            setRecognitions(data);
            setRecognitionsReceived(data.length);
            setIsLoading(false);
        } else {
            setRecognitionsReceived(0);
            setIsLoading(false);

        }
        setIsLoading(false);
    }

    useEffect(() => {
        getUserHighFivesRec();
    }, []);

    return (
        <motion.div className="container-fluid" id="breakdownContainer" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
            {isLoading ? <LoadingSpinner /> : <> <Row className="mainrow">
                <Card.Title className='recogBreakdownLabel'><span className='recogsBreakdowLabel'>Recognition</span> <span className='recogBreakdownText'>Breakdown</span></Card.Title>
                <img className='recogBreakdownDivider' src={teamSpacing} alt={'Hi'}/>
                <div/>
                {recognitionsReceived > 0 && recognitions.map((val) => {
                    return (
                        <Fragment key={imagesID}>
                            <div  key={val.PEERTOPEERID} className="row" style={{margin: "0 auto"}}>
                                <div className="column">
                                    <img src={PeerCard1} style={{width: '100%'}} alt='Brightening the Day' />
                                    <Col key={val.PEERTOPEERID} className='colNominationsGiven'><span className='nomGivenCount'>{val.PEERONE}</span><span className='nominationsText'>Recieved</span></Col>
                                </div>
                                <div className="column">
                                    <img src={PeerCard2} style={{width: '100%'}} alt='Finding Creative Solutions' />
                                    <Col key={val.PEERTOPEERID} className='colNominationsGiven'><span className='nomGivenCount'>{val.PEERTWO}</span><span className='nominationsText'>Recieved</span></Col>
                                </div>
                                <div className="column">
                                    <img src={PeerCard3} style={{width: '100%'}} alt='Going Above & Beyond' />
                                    <Col key={val.PEERTOPEERID} className='colNominationsGiven'><span className='nomGivenCount'>{val.PEERTHREE}</span><span className='nominationsText'>Recieved</span></Col>
                                </div>
                                <div className="column">
                                    <img src={PeerCard4} style={{width: '100%'}} alt='Making it Happen' />
                                    <Col key={val.PEERTOPEERID} className='colNominationsGiven'><span className='nomGivenCount'>{val.PEERFOUR}</span><span className='nominationsText'>Recieved</span></Col>
                                </div>
                                <div className="column">
                                    <img src={PeerCard5} style={{width: '100%'}} alt='Supportive Team Player' />
                                    <Col key={val.PEERTOPEERID} className='colNominationsGiven'><span className='nomGivenCount'>{val.PEERFIVE}</span><span className='nominationsText'>Recieved</span></Col>
                                </div>
                                <div className="column">
                                    <img src={PeerCard6} style={{width: '100%'}} alt='Working Behind the Scenes'/>
                                    <Col key={val.PEERTOPEERID} className='colNominationsGiven'><span className='nomGivenCount'>{val.PEERSIX}</span><span className='nominationsText'>Recieved</span></Col>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}

                {recognitionsReceived < 1 && <Fragment key={imagesID}>
                    <div  key={0} className="row" style={{margin: "0 auto"}}>
                        <div className="column">
                            <img src={PeerCard1} style={{width: '100%'}} alt='Brightening the Day' />
                            <Col key={1} className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recieved</span></Col>
                        </div>
                        <div className="column">
                            <img src={PeerCard2} style={{width: '100%'}} alt='Finding Creative Solutions' />
                            <Col key={2} className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recieved</span></Col>
                        </div>
                        <div className="column">
                            <img src={PeerCard3} style={{width: '100%'}} alt='Going Above & Beyond' />
                            <Col key={3} className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recieved</span></Col>
                        </div>
                        <div className="column">
                            <img src={PeerCard4} style={{width: '100%'}} alt='Making it Happen' />
                            <Col key={4} className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recieved</span></Col>
                        </div>
                        <div className="column">
                            <img src={PeerCard5} style={{width: '100%'}} alt='Supportive Team Player' />
                            <Col key={5} className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recieved</span></Col>
                        </div>
                        <div className="column">
                            <img src={PeerCard6} style={{width: '100%'}} alt='Working Behind the Scenes'/>
                            <Col key={6} className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recieved</span></Col>
                        </div>
                    </div>
                </Fragment> }

            </Row>
            </>

            }

        </motion.div>
    )
}

export default RecognitionsBreakdown;