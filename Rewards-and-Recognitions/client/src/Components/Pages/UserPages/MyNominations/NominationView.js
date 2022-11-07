import React from 'react';
import {Link} from "react-router-dom";
import {Button, Card, Col, Row} from 'react-bootstrap';
import { motion } from "framer-motion";
import './NominationView.css';

function NominationView() {

    return (
        <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
            <Row>
                <Card.Title className='nvLabel'><span className='nvsLabel'>My</span> <span className='nvText'>Nominations</span></Card.Title>
            </Row>
            <Row>
                <Col md={6} className=''>
                    <Link className='nvLink' to={`/MyQuarterlyNominations`}>
                        <Button className='nomViewButton' variant="danger">Quarterly Nominations</Button>
                    </Link>
                </Col>
                <Col md={6} className=''>
                    <Link className='nvLink' to={`/MyYearlyNominations`}>
                        <Button className='nomViewButton' variant="danger">Annual Nominations</Button>
                    </Link>
                </Col>
            </Row>
        </motion.div>
    )
}

export default React.memo(NominationView);
