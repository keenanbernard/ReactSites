import React, {useEffect, useState} from 'react';
import {Badge, Card, Col, Row, Table} from 'react-bootstrap';
import { motion } from "framer-motion";
import './MyNominations.css';
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../Atoms/Pagination/Pagination";

function MyYearlyNominations(props) {

    const [nominations, setNominations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [totalNominations, setTotalNominations] = useState();


    // Get Nominations from middleware
    const getUserNominations = async () => {
        setIsLoading(true);
        const response = await fetch(`${props.host}/getUserYearlyNomCounts?id=${props.graphdata.id}`);
        let data = await response.json();
        console.log(data[0].USERYEARNOMS);
        if (data[0].USERYEARNOMS > 0) {
            const response = await fetch(`${props.host}/UserYearlyNom?id=${props.graphdata.id}`);
            let data = await response.json();
            setNominations(data);
            setTotalNominations(data.length);
            setIsLoading(false);
        } else {
            setTotalNominations(0);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getUserNominations();
    }, []);


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = nominations.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <motion.div className="container-fluid" id="nomPage" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
            <Row>
                <Col md={12}>
                    <Card.Title className='nomHistoryLabel'><span className='nomLabel'>My</span> <span className='nomCentralText'>Yearly Nominations</span><span className='ms-2'> <Badge pill bg="primary">{totalNominations}</Badge>{' '}</span></Card.Title>
                    <img className='nomDivider' src={teamSpacing} alt={'Hi'}/>

                    {isLoading ? <LoadingSpinner /> : <Card>
                        <Card.Body>
                            <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                <thead className='peerNominationsTh'>
                                <tr>
                                    <th>NOMINATION</th>
                                    <th className='spotlightWidth'>NOMINATOR</th>
                                    <th className='spotlightWidth'>NOMINEE</th>
                                    <th>NOMINATION CATEGORY</th>
                                    <th>SUBMISSION</th>
                                    <th>STATUS</th>
                                </tr>
                                </thead>
                                <tbody>
                                {totalNominations > 0 && currentPost?.map((val, index) => (
                                    <tr className='myNomTr' key={index}>
                                        <td className='qNomID'>{val.NOMINATIONS_ID}</td>
                                        <td className='nomWidth'>{val.SENDERDISPLAYNAME}</td>
                                        <td className='nomWidth'>{val.RECEIVERDISPLAYNAME}</td>
                                        <td className='nomWidth'>{val.NOMINATION_CATEGORY}</td>
                                        <td>{val.DATECREATED}</td>
                                        <td>{val.CURRENT_STATUS}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>

                            {totalNominations < 1 && <p className='noDepartment'>You have not sent or received any annual nominations</p>}

                            {totalNominations > postsPerPage && <Pagination postsPerPage={postsPerPage} totalPosts={nominations.length} paginate={paginate} />}

                        </Card.Body>
                    </Card>}

                </Col>

                <div className="defSpacing"></div>
            </Row>
        </motion.div>
    )
}

export default MyYearlyNominations;
