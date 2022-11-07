import React, {Fragment, useEffect, useState} from 'react';
import {useMsal} from "@azure/msal-react";

import { Link } from "react-router-dom";
import makeAnimated from 'react-select/animated';
import Select from "react-select";
import {Badge, Breadcrumb, Button, Card, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import { motion } from "framer-motion";
import Pagination from "../../../Atoms/Pagination/Pagination";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import './PeerToPeer.css';
import {admins} from "../../LandingPage/Filtered Users";
import { useNavigate } from "react-router-dom";


function PeerToPeer(props) {
    const {accounts} = useMsal();

    const name = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    const animatedComponents = makeAnimated();

    const [peerCardsSent, setPeerCardsSent] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [searchedName, setSearchedName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(50);

    //Pagination formula
    let currentPost;
    let totalPeerAmount  = peerCardsSent.length;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Handle Input Change
    const handleInputChange = value => {
        setInputValue(value);
    }

    const setNameHandler = event => {
        setSearchedName(event.target.value);
    }

    // Handle Selection
    const handleChange = value => {
        setSelectedValue(value);
    }

    const resetFilter = () => {
        setSelectedValue('');
        setSearchedName('');
    }

    const getHighFiveCount = async () => {
        setIsLoading(true);
        const response = await fetch(`${props.host}/HighFiveCount`);
        let data = await response.json();
        if (data[0].TOTALHIGHFIVE > 0) {
            const response = await fetch(`${props.host}/getAllPeerToPeer`);
            let data = await response.json();
            setPeerCardsSent(data);
            setIsLoading(false);
        } else {
            setPeerCardsSent(0);
        }
        setIsLoading(false);
    }

    const getAllDepartments = async () => {
        const response = await fetch(`${props.host}/getAllDepartmentsHR`);
        let data = await response.json();
        setDepartments(data);
    }

    useEffect(() => {
        if (!admins.includes(name)) {
            navigate("/");
        }
        getHighFiveCount();
        getAllDepartments();
    }, []);


    if (totalPeerAmount > 0) {
        if (selectedValue !== '') {
            currentPost = peerCardsSent.filter((val => {
                return val.DEPARTMENT === selectedValue.DEPARTMENT}));
            currentPost.sort((a, b) => b.DATECREATED - a.DATECREATED);
            totalPeerAmount = currentPost.length;
        }  else if (searchedName !== '') {
            currentPost = peerCardsSent.filter((val => {
                return ((val.SENDERDISPLAYNAME).toLowerCase()).includes(searchedName.toLowerCase()) || (val.RECEIVERDISPLAYNAME).toLowerCase().includes(searchedName.toLowerCase())}));
            currentPost.sort((a, b) => b.DATECREATED - a.DATECREATED);
            totalPeerAmount = currentPost.length;
        } else {
            currentPost = peerCardsSent.slice(indexOfFirstPost, indexOfLastPost);
        }
    }


    return (
        <>
            {admins.includes(name) && <>
                { isLoading ? <LoadingSpinner/> : <>
                    <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}}
                                exit={{opacity: 0, transition: {duration: 0.2}}}>

                        <Row>
                            <Col md={2} className='pt-2 freeSpace'>
                                <Breadcrumb className='breadcrumb'>
                                    <Fragment>
                                        <Breadcrumb.Item active><Link to="/">Home</Link> / Peer to Peer
                                        </Breadcrumb.Item>
                                    </Fragment>
                                </Breadcrumb>

                                <Select
                                    name='options'
                                    components={animatedComponents}
                                    options={departments && departments}
                                    value={selectedValue}
                                    onChange={handleChange}
                                    onInputChange={handleInputChange}
                                    placeholder='Filter Department'
                                    getOptionLabel={e => e.DEPARTMENT}
                                    getOptionValue={e => e.ID}
                                />

                                <div className="d-grid gap-2 mt-2">
                                    <Button onClick={resetFilter} variant="danger" size="md">
                                        Clear Filter
                                    </Button>
                                </div>

                            </Col>
                            <Col md={10} className=''>
                                <div className=''>
                                    <Row>
                                        <Col>
                                            <Card.Title className='ppLabel'><span className='otsLabel'>Peer</span> <span
                                                className='otsText'>Cards</span><span className='ms-2'> <Badge pill
                                                                                                               bg="primary">{totalPeerAmount > 0 ? totalPeerAmount : 0}</Badge>{' '}</span></Card.Title>
                                            <img className='otpDivider' src={teamSpacing} alt={'Recent Spotlight'}/>
                                        </Col>
                                        <Col className='searchNameAlignment mt-2'>
                                            <InputGroup className="filterUser">
                                                <Form.Control
                                                    className='filterUserInput'
                                                    aria-label="Default"
                                                    aria-describedby="inputGroup-sizing-default"
                                                    placeholder='Search by Nominator or Nominee'
                                                    onChange={setNameHandler}
                                                    value={searchedName}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </div>

                                <Card>
                                    <Card.Body>
                                        <div/>
                                        <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                            <thead style={{backgroundColor: "red", color: "white"}}>
                                            <tr>
                                                <th>NOMINATOR</th>
                                                <th>E-CARD CATEGORY</th>
                                                <th>NOMINEE</th>
                                                <th>DEPARTMENT</th>
                                                <th>SUBMISSION DATE</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {totalPeerAmount > 0 && currentPost?.map((val, index) => (
                                                <tr key={index}>
                                                    <td className='peerColWidth'>{val.SENDERDISPLAYNAME}</td>
                                                    <td className='peerColWidth'>{val.CARDNAME}</td>
                                                    <td className='peerColWidth'>{val.RECEIVERDISPLAYNAME}</td>
                                                    <td>{val.DEPARTMENT}</td>
                                                    <td>{val.DATECREATED}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>

                                        {totalPeerAmount === undefined &&
                                            <p className='noDepartment'>NO PEER CARDS HAVE BEEN SENT </p>}

                                        {totalPeerAmount < 1 && <p className='noDepartment'>NO PEER CARDS SENT </p>}

                                        {totalPeerAmount > postsPerPage &&
                                            <Pagination postsPerPage={postsPerPage} totalPosts={totalPeerAmount}
                                                        paginate={paginate}/>}

                                    </Card.Body>
                                </Card>

                            </Col>
                            <Col md={2} id='freeSpace2' className='pt-4'>
                            </Col>
                        </Row>
                    </motion.div>
                </>}
            </>}
        </>
    )
}

export default PeerToPeer;
