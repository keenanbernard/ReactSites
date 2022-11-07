import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {Button, Card, Col, Row} from 'react-bootstrap';
import { motion } from "framer-motion";
import './IAMDIGI.css';
import {useMsal} from "@azure/msal-react";
import {admins} from "../../LandingPage/Filtered Users";
import { useNavigate } from "react-router-dom";

function IAMDIGI() {

    const {accounts} = useMsal();

    const name = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    useEffect(() => {
        if (!admins.includes(name)) {
            navigate("/");
        }
    },[]);


    return (
        <>
            {admins.includes(name) &&
                <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}}
                            exit={{opacity: 0, transition: {duration: 0.2}}}>
                    <Row>
                        <Card.Title className='iadLabel'><span className='iadsLabel'>I AM DIGI</span> <span
                            className='iadText'>Nominations</span></Card.Title>
                    </Row>
                    <Row>
                        <Col md={6} className=''>
                            <Link className='iadLink' to={`/QuarterlyNominations`}>
                                <Button className='iamdigiButton' variant="danger">Quarterly Nominations</Button>
                            </Link>
                        </Col>
                        <Col md={6} className=''>
                            <Link className='iadLink' to={`/YearlyNominations`}>
                                <Button className='iamdigiButton' variant="danger">Annual Nominations</Button>
                            </Link>
                        </Col>
                    </Row>
                </motion.div>
            }
        </>
    )
}

export default React.memo(IAMDIGI);
