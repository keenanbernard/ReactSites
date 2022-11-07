import React, {Fragment, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Pagination from "../../../Atoms/Pagination/Pagination";
import {Badge, Breadcrumb, Button, Card, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import { motion } from "framer-motion";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import './Nominations.css';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {useMsal} from "@azure/msal-react";
import {admins} from "../../LandingPage/Filtered Users";
import { useNavigate } from "react-router-dom";


function QuarterlyNominationHR(props) {

    const {accounts} = useMsal();

    const name = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    let currentPost;

    const animatedComponents = makeAnimated();

    const [quarterly, setQuarterly] = useState([]);
    const [, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(50);
    const [selectedValue, setSelectedValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [searchedName, setSearchedName] = useState('');


    // Pagination
    let totalQuarterlyAmount = quarterly.length;

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

    const getQuarterlyNominationCount = async () =>  {
        setIsLoading(true);
        const response = await fetch(`${props.host}/QuarterlyNominationCount`);
        let data = await response.json();
        if (data[0].TOTALQUARTNOMS > 0) {
            const response = await fetch(`${props.host}/QuartelyNominations`);
            let data = await response.json();
            setQuarterly(data);
            setIsLoading(false);
        } else {
            setQuarterly(0);
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

        getQuarterlyNominationCount();
        getAllDepartments();
    }, []);

    if (totalQuarterlyAmount > 0) {
        if (selectedValue !== '') {
            currentPost = quarterly.filter((val => {
                return val.NOMINATOR_DEPARTMENT === selectedValue.DEPARTMENT
            }));
            currentPost.sort((a, b) => b.DATE_CREATED - a.DATE_CREATED);
            totalQuarterlyAmount = currentPost.length;
        } else if (searchedName !== '') {
            currentPost = quarterly.filter((val => {
                return ((val.NOMINATOR_NAME).toLowerCase()).includes(searchedName.toLowerCase()) || (val.NOMINEE_NAME).toLowerCase().includes(searchedName.toLowerCase())}));
            currentPost.sort((a, b) => b.DATE_CREATED - a.DATE_CREATED);
            totalQuarterlyAmount = currentPost.length;
        } else {
            currentPost = quarterly.slice(indexOfFirstPost, indexOfLastPost);
            totalQuarterlyAmount = currentPost.length
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
                                    <Breadcrumb.Item active><Link to="/IAMDIGI">Back</Link> / Quarterly
                                        Nominations</Breadcrumb.Item>
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
                            <Row>
                                <Col>
                                    <Card.Title className='otpLabel'><span className='otsLabel'>Quarterly</span> <span
                                        className='otsText'>Nominations</span><span className='ms-2'> <Badge pill
                                                                                                             bg="primary">{totalQuarterlyAmount > 0 ? totalQuarterlyAmount : 0}</Badge>{' '}</span>
                                    </Card.Title>
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

                            <Card className='otpCard'>
                                <Card.Body>
                                    <div/>
                                    <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                        <thead className='tableHeading'>
                                        <tr>
                                            <th>NOMINATION</th>
                                            <th className='spotlightWidth'>NOMINATOR</th>
                                            <th className='spotlightWidth'>NOMINEE</th>
                                            <th>DEPARTMENT</th>
                                            <th>SUBMISSION</th>
                                            <th>STATUS</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {totalQuarterlyAmount > 0 && currentPost?.map((val, index) => (
                                            <tr key={val.NOMINATIONS_ID}>
                                                <td className='tdPos'><Link className='otsLink'
                                                                            to={`/QuarterlyDetailedView?id=${val.NOMINATIONS_ID}`}>{val.NOMINATIONS_ID}</Link>
                                                </td>
                                                <td className='nomWidth'>{val.NOMINATOR_NAME}</td>
                                                <td className='nomWidth'>{val.NOMINEE_NAME}</td>
                                                <td>{val.NOMINATOR_DEPARTMENT}</td>
                                                <td>{val.DATE_CREATED}</td>
                                                <td className='statusWidth'>{val.CURRENT_STATUS}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                    {totalQuarterlyAmount === undefined &&
                                        <p className='noDepartment'>NO QUARTERLY NOMINATIONS HAVE BEEN SUBMITTED </p>}

                                    {totalQuarterlyAmount < 1 &&
                                        <p className='noDepartment'>NO NOMINATIONS SUBMITTED </p>}

                                    {totalQuarterlyAmount > postsPerPage &&
                                        <Pagination postsPerPage={postsPerPage} totalPosts={totalQuarterlyAmount}
                                                    paginate={paginate}/>}

                                </Card.Body>
                            </Card>

                        </Col>

                        <Col md={2} id='freeSpace2' className='pt-4'>
                        </Col>
                    </Row>
                    }
                </motion.div>
            }
        </>
    )
}

export default React.memo(QuarterlyNominationHR);
