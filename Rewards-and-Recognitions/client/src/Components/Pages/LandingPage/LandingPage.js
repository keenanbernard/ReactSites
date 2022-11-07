import React, {useEffect, useState} from 'react';
import {useMsal} from "@azure/msal-react";
import {Button, Card, Col, Row} from 'react-bootstrap';
import {Link, useLocation} from "react-router-dom";
import {motion} from "framer-motion";
import {annualNominators, blacklist, creditNominators, salesNominators} from "./Filtered Users";
import Banner from "../../Atoms/Banner/Banner";
import MyProfilePhoto from "../../Atoms/ProfilePhoto/MyProfilePhoto";
import Activities from "../../Atoms/RecentActivitiesCarousel/RecentActivities";
import PeerToPeerNom from '../../Organisms/DigiNominations/PeerToPeer/PeerToPeerModal';
import OnTheSpotNom from "../../Organisms/DigiNominations/OnTheSpotNom/OnTheSpotModal";
import QuarterlyNomination from "../../Organisms/DigiNominations/Nominations/QuarterlyNominationModal";
import YearlyNomination from "../../Organisms/DigiNominations/Nominations/YearlyNominationModal";
import MyTeam from "../../Atoms/MyTeam/MyTeam";
import Footer from "../../Organisms/NavigationFooter/Footer";
import teamSpacing from "../../MiscellaneousImages/HR-portal-divider.png";
import './LandingPage.css';

function LandingPage(props) {
    const [users, setUsers] = useState([]);
    const [directReports, setDirectReports] = useState([]);
    const [peerToPeerShow, setPeerToPeerShow] = useState(false);
    const [onTheSpotShow, setOnTheSpotShow] = useState(false);
    const [nominationsShow, setNominationsShow] = useState(false);
    const [yearlyNominationsShow, setYearlyNominationsShow] = useState(false);
    const [givenNominations, setGivenNominations] = useState([]);

    //Set Hidden & Disabled Values
    const [hiddenValSL, setHiddenValSL] = useState(true);
    const [disabledValSL, setDisabledValSL] = useState(true);
    const [hiddenValYN, setHiddenValYN] = useState(true);
    const [disabledYN, setDisabledYN] = useState(true);
    const [hiddenSales, setHiddenSales] = useState(true);
    const [hiddenCredit, setHiddenCredit] = useState(true);
    const [cardsSent, setCardsSent] = useState();

    // Get History, ID & Image
    const {accounts} = useMsal();
    const history = useLocation();
    const name = accounts[0] && accounts[0].name;
    const id = props.graphdata.id;

    // Set Tokens & Bearers
    const token = props.mstoken;
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);
    headers.append("ConsistencyLevel", "eventual");
    const options = { method: "GET", headers: headers};

    // Get & Filter Users from Azure AD
    const getUsers = async () => {
        const response = (await fetch('https://graph.microsoft.com/v1.0/users?$filter=jobTitle ne null and accountEnabled eq true&$count=true&$top=999', options));
        let data = await response.json();
        let allUsers = data.value.filter(val => {return val.displayName !== name && !blacklist.includes(val.jobTitle)});
        setUsers(allUsers.sort((a,b)=> (a.displayName > b.displayName ? 1 : -1)));
    }

    // Get Direct Reports using Azure AD
    const getMyDirectReports = async () => {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/directReports', options);
        let data = await response.json();
        if(data.value.length >= 1){
            setDirectReports(data.value.sort((a,b)=> (a.givenName > b.givenName ? 1 : -1)));
            setHiddenValSL(false);
            setDisabledValSL(false);
        }
    }

    const getMyHighFives = async () => {
        const response = await fetch(`${props.host}/getMyHighFives?id=${id}`);
        let data = await response.json();
        if (data[0].TOTALHIGHFIVES > 0) {
            const response = await fetch(`${props.host}/myRecognitionHistory?id=${id}`);
            let data = await response.json();
            setGivenNominations(data);
            setCardsSent(data.length)
        } else {
            setGivenNominations(0);
        }
    }

    const enablingPermissions = async () => {
        if(annualNominators.includes(name)){
            setHiddenValYN(false);
            setDisabledYN(false);
        }
        if(salesNominators.includes(name)){
            setHiddenSales(false);
        }
        if(creditNominators.includes(name)){
            setHiddenCredit(false);
        }
    }

    useEffect(() => {
        getUsers();
        enablingPermissions();
    }, [token]);

    useEffect(() => {
        getMyHighFives();
    }, [history]);

    useEffect(() => {
        getMyDirectReports();
    }, [hiddenValSL]);

    return (
        <>
            <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
                <Row className="landing-page">
                    <Col md={8} className=''>
                        <Banner/>
                        <div className='activitiesLabel pt-3'>
                            <p>RECENT
                                <span className='recentActivitiesText'> ACTIVITIES</span>
                                <br></br>
                                <img className='activitiesDivider' src={teamSpacing} alt={'Hi'}/>
                            </p>
                        </div>
                        <Activities host={props.host} history={history}/>
                    </Col>
                    <Col md={4} id='recogEventArea' className='pt-0'>
                        <Card className='userProfile'>
                            <div className='userProfilePhoto'>
                                <MyProfilePhoto mstoken={props.mstoken}/>
                            </div>
                            <Card.Body>
                                <div className='userRecognitions'>
                                    <Card.Title><span className='currentUserName'>{name}</span></Card.Title>
                                    <div className='userCardSpacing'></div>
                                    {cardsSent > 0 && givenNominations.map((val) => {
                                        return (
                                        <Row key={Math.random()}>
                                            <Col className='colNominationsGiven'><span className='nomGivenCount'>{val.SENT}</span><span className='nominationsText'>Recognitions <br/> Given</span></Col>
                                            <Col className='colNominationsReceived'><Link to="RecognitionBreakdown"><span className='nomReceivedCount'>{val.RECEIVED}</span></Link><span className='nominationsText'>Recognitions <br/> Received</span></Col>
                                        </Row>
                                        )
                                    })}

                                    {givenNominations < 1 && <Row> <Col className='colNominationsGiven'><span className='nomGivenCount'>0</span><span className='nominationsText'>Recognitions <br/> Given</span></Col>
                                        <Col className='colNominationsReceived'><Link to="RecognitionBreakdown"><span className='nomReceivedCount'>0</span></Link><span className='nominationsText'>Recognitions <br/> Received</span></Col></Row>
                                    }

                            <Card.Header>
                                <Card.Title className='recogCentralLabel'><span className='recogLabel'>RECOGNITION</span> <span className='recogCentralText'>CENTRAL</span></Card.Title>
                            </Card.Header>
                            <Card.Body className=''>
                                <Button variant="primary" className='nominationButton' id='fistNominationButton' onClick={() => setPeerToPeerShow(true)}>Digi High-Five</Button>
                                <PeerToPeerNom graphdata={props.graphdata} graphuser={users} ymtoken={props.ymtoken} host={props.host} show={peerToPeerShow} onHide={() => setPeerToPeerShow(false)} />
                                <Button variant="primary" className='nominationButton' hidden={hiddenValSL} disabled={disabledValSL} onClick={() => setOnTheSpotShow(true)}>Digi Spotlight</Button>
                                <OnTheSpotNom graphdata={props.graphdata} directreports={directReports} mstoken={props.mstoken} host={props.host} show={onTheSpotShow} onHide={() => setOnTheSpotShow(false)} />
                                <Button variant="primary" className='nominationButton' onClick={() => setNominationsShow(true)}>I AM DIGI Quarterly Awards</Button>
                                <QuarterlyNomination graphdata={props.graphdata} graphuser={users} host={props.host} sales={{hiddenSales}} credit={{hiddenCredit}} show={nominationsShow} onHide={() => setNominationsShow(false)} />
                                <Button variant="primary" className='nominationButton' hidden={hiddenValYN} disabled={disabledYN} onClick={() => setYearlyNominationsShow(true)}>I AM DIGI Annual Awards</Button>
                                <YearlyNomination graphdata={props.graphdata} graphuser={users} host={props.host} sales={{hiddenSales}} credit={{hiddenCredit}} show={yearlyNominationsShow} onHide={() => setYearlyNominationsShow(false)} />
                            </Card.Body>
                            </div>
                            </Card.Body>
                        </Card>
                        <div className='userCardSpacing'></div>
                        <MyTeam graphdata={props.graphdata} mstoken={props.mstoken}/>
                    </Col>
                </Row>
            </motion.div>
            <div style={{marginTop: "15px"}}></div>
            <Footer/>
        </>
    )
}

export default LandingPage;
