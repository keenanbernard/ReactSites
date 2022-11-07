import React, {useEffect, useState} from 'react';
import {Badge, Card, Col, Row, Table} from 'react-bootstrap';
import {motion} from "framer-motion";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../Atoms/Pagination/Pagination";
import MyRecognitionsDetail from "./MyRecognitionsDetail";
import './MyRecognitions.css';

function MyRecognitions(props) {

    const [recognitions, setRecognitions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(50);
    const [show, setShow] = useState(false);
    const [peerId, setPeerId] = useState();
    const [totalRecognitions, setTotalRecognitions] = useState();

    // Get and set total recognitions from middleware
    const getUserRecognitions = async () => {
        setIsLoading(true);
        const response = await fetch(`${props.host}/getDigiHighFiveCounts?id=${props.userid}`);
        let data = await response.json();

        if (data[0].TOTALPEERCARDS > 0) {
            const response = await fetch(`${props.host}/UserPeerToPeer?id=${props.userid}`);
            let data = await response.json();
            setRecognitions(data);
            setTotalRecognitions(data.length);
            setIsLoading(false);
        } else {
            setTotalRecognitions(0);
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getUserRecognitions();
    }, []);

    const getIdValue = (value) => event => {
        setShow(true);
        setPeerId(value);
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = recognitions.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
            <Row>
                <Col md={12}>
                    <Card.Title className='recogHistoryLabel'><span className='recogLabel'>My</span> <span className='recogCentralText'>High-Fives</span><span className='ms-2'> <Badge pill bg="primary">{totalRecognitions}</Badge>{' '}</span></Card.Title>
                    <img className='recogDivider' src={teamSpacing} alt={'Hi'}/>

                    {isLoading ? <LoadingSpinner /> : <Card>
                        <Card.Body>
                            <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                <thead className='peerNominationsTh'>
                                <tr>
                                    <th>PEER TO PEER ID</th>
                                    <th className='spotlightWidth'>NOMINATOR</th>
                                    <th className='spotlightWidth'>NOMINEE</th>
                                    <th>E-CARD CATEGORY</th>
                                    <th>SUBMISSION DATE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {totalRecognitions > 0 && currentPost?.map((val, index) => (
                                  <tr className='myHighFiveTr' key={index}>
                                      <td onClick={getIdValue(val.PEERTOPEERID)} className='peerNomID'>{val.PEERTOPEERID}</td>
                                      <td className='nomWidth'>{val.SENDERDISPLAYNAME}</td>
                                      <td className='nomWidth'>{val.RECEIVERDISPLAYNAME}</td>
                                      <td className='nomWidth'>{val.CARDNAME}</td>
                                      <td>{val.DATECREATED}</td>
                                  </tr>
                                ))}
                                {show && <MyRecognitionsDetail peernomid={peerId} host={props.host} show={show} onHide={() => setShow(false)}/>}
                                </tbody>
                            </Table>

                            {totalRecognitions < 1 && <p className='noDepartment'>You have not sent or received any peer cards</p>}

                            {totalRecognitions > postsPerPage && <Pagination postsPerPage={postsPerPage} totalPosts={recognitions.length} paginate={paginate} />}
                        </Card.Body>
                    </Card>}
                </Col>
                <div className="defSpacing"></div>
            </Row>
        </motion.div>
    )
}

export default MyRecognitions;
