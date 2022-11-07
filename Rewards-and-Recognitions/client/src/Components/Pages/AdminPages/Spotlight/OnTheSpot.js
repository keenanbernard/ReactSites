import React, {Fragment, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Pagination from "../../../Atoms/Pagination/Pagination";
import {Badge, Breadcrumb, Button, Card, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import { motion } from "framer-motion";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import './OnTheSpot.css';
import {useMsal} from "@azure/msal-react";
import {admins} from "../../LandingPage/Filtered Users";
import { useNavigate } from "react-router-dom";

function OnTheSpot(props) {

    const {accounts} = useMsal();

    const name = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    const animatedComponents = makeAnimated();

    const [departments, setDepartments] = useState([]);
    const [onTheSpot, setOnTheSpot] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [searchedName, setSearchedName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(50);

    let totalSpotlightAmount;

    //Pagination formula
    let currentPost;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const paginate = pageNumber => setCurrentPage(pageNumber);


    const handleInputChange = value => {
        setInputValue(value);
    }

    const handleChange = value => {
        setSelectedValue(value);
    }

    const setNameHandler = event => {
        setSearchedName(event.target.value);
    }

    const resetFilter = () => {
        setSelectedValue('');
        setSearchedName('');
    }

    const getHighFiveCount = async () => {
        setIsLoading(true);
        const response = await fetch(`${props.host}/SpotlightCountAdmin`);
        let data = await response.json();
        if (data[0].TOTALSPOTLIGHTS > 0) {
            const response = await fetch(`${props.host}/OnTheSpot`);
            let data = await response.json();
            setOnTheSpot(data);
            setIsLoading(false);
        } else {
            setOnTheSpot(0);
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
            navigate ('/');
        }
        getHighFiveCount();
        getAllDepartments()
    }, []);


    if (onTheSpot.length > 0) {
        if (selectedValue !== '') {
            currentPost = onTheSpot.filter((val => {
                return val.NOMINATOR_DEPARTMENT === selectedValue.DEPARTMENT
            }));
            currentPost.sort((a, b) => b.DATE_CREATED - a.DATE_CREATED);
            totalSpotlightAmount = currentPost.length;
        } else if (searchedName !== '') {
            currentPost = onTheSpot.filter((val => {
                return ((val.NOMINATOR_NAME).toLowerCase()).includes(searchedName.toLowerCase()) || (val.NOMINEE_NAME).toLowerCase().includes(searchedName.toLowerCase())}));
            currentPost.sort((a, b) => b.DATE_CREATED - a.DATE_CREATED);
            totalSpotlightAmount = currentPost.length;
        } else {
            currentPost = onTheSpot.slice(indexOfFirstPost, indexOfLastPost);
            totalSpotlightAmount = currentPost.length
        }
    }


    return (
        <>
            {admins.includes(name) &&
                <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}}
                            exit={{opacity: 0, transition: {duration: 0.2}}}>

                    {isLoading ? <LoadingSpinner/> : <Row>
                        <Col md={2} className='pt-2 freeSpace'>
                            <Breadcrumb className='breadcrumb'>
                                <Fragment>
                                    <Breadcrumb.Item active><Link to="/">Home</Link> / Spotlight </Breadcrumb.Item>
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
                                        <Card.Title className='otpLabel'><span className='otsLabel'>Spotlight</span>
                                            <span className='otsText'> Nominations</span><span className='ms-2'> <Badge
                                                pill
                                                bg="primary">{totalSpotlightAmount > 0 ? totalSpotlightAmount : 0}</Badge>{' '}</span></Card.Title>
                                        <img className='otpDivider' src={teamSpacing} alt={'Recent Spotlight'}/>
                                    </Col>
                                    <Col>
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
                                    </Col>
                                </Row>
                            </div>

                            <Card className='otpCard'>
                                <Card.Body>
                                    <div/>

                                    <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                        <thead className='tableHeading'>
                                        <tr>
                                            <th>SPOTLIGHT ID</th>
                                            <th className='spotlightWidth'>NOMINATOR</th>
                                            <th className='spotlightWidth'>NOMINEE</th>
                                            <th>DEPARTMENT</th>
                                            <th>SUBMISSION</th>
                                            <th>STATUS</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {totalSpotlightAmount > 0 && currentPost?.map((val, index) => (
                                            <tr key={index}>
                                                <td className='tdPos'><Link className='otsLink'
                                                                            to={`/DetailedView?id=${val.ON_THE_SPOT_ID}`}>{val.ON_THE_SPOT_ID}</Link>
                                                </td>
                                                <td className=''>{val.NOMINATOR_NAME}</td>
                                                <td className=''>{val.NOMINEE_NAME}</td>
                                                <td>{val.NOMINATOR_DEPARTMENT}</td>
                                                <td>{val.DATE_CREATED}</td>
                                                <td className=''>{val.CURRENTSTATUS}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                    {totalSpotlightAmount === undefined &&
                                        <p className='noDepartment'>NO NOMINATIONS HAVE BEEN SUBMITTED AS YET </p>}

                                    {totalSpotlightAmount < 1 &&
                                        <p className='noDepartment'>NO NOMINATIONS HAVE BEEN SUBMITTED </p>}

                                    {totalSpotlightAmount > postsPerPage &&
                                        <Pagination postsPerPage={postsPerPage} totalPosts={onTheSpot.length}
                                                    paginate={paginate}/>}

                                </Card.Body>
                            </Card>

                        </Col>
                        <Col md={2} id='freeSpace2' className=''>
                        </Col>
                    </Row>
                    }
                </motion.div>
            }
        </>
    )
}

export default React.memo(OnTheSpot);
