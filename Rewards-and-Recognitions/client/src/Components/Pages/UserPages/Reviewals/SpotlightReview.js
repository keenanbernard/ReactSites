import React, {useEffect, useState} from "react";
import './SpotlightReview.css';
import {Badge, Card, Col, Row, Table} from 'react-bootstrap';
import {motion} from "framer-motion";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import MyRecognitionsDetail from "../MyRecognitionsPage/MyRecognitionsDetail";
import Pagination from "../../../Atoms/Pagination/Pagination";
import {Link} from "react-router-dom";

function SpotlightReview(props) {

  const [spotlightReviews, setSpotlightReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [totalSpotlightReviews, setTotalSpotlightReviews] = useState();



  const getSpotlightReviewCount = async () => {
    setIsLoading(true);
    const response = await fetch(`${props.host}/SpotlightReviewCount?id=${props.graphdata.id}`);
    let data = await response.json();
    if (data[0].TOTALREVIEWALS > 0) {
        const response = await fetch(`${props.host}/SpotLightNominationSendBack?id=${props.graphdata.id}`);
        let data = await response.json();
        setSpotlightReviews(data);
        setTotalSpotlightReviews(data.length);
        setIsLoading(false);
    } else {
      setTotalSpotlightReviews(0);
      setIsLoading(false);

    }
    setIsLoading(false);
  }

  useEffect(() => {
    getSpotlightReviewCount();
  }, []);


  return (
    <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
      <Row>
        <Card.Title className='recogHistoryLabel'><span className='recogLabel'>Spotlight</span> <span className='recogCentralText'>Reviewals</span></Card.Title>
        <img className='recogDivider' src={teamSpacing} alt={'Hi'}/>
        <Col md={11} style={{margin: "0 auto"}}>

          {isLoading ? <LoadingSpinner /> : <Card>
            <Card.Body>
              <Table bordered hover responsive style={{backgroundColor: "white"}}>
                <thead className='peerNominationsTh'>
                <tr>
                  <th>SPOTLIGHT ID</th>
                  <th className=''>NOMINEE</th>
                  <th className=''>SUBMISSION DATE</th>
                </tr>
                </thead>
                <tbody>
                {totalSpotlightReviews > 0 && spotlightReviews.map((val, index) => (
                  <tr className='myHighFiveTr' key={index}>
                    <td className=''><Link className='otsLink' to={`/SpotlightReviewDetail?id=${val.ON_THE_SPOT_ID}`}>{val.ON_THE_SPOT_ID}</Link></td>
                    <td className=''>{val.NOMINEE_NAME}</td>
                    <td className=''>{val.DATE_CREATED}</td>
                  </tr>
                ))}

                </tbody>
              </Table>

              {totalSpotlightReviews < 1 && <p className='noDepartment'>YOU DO NOT HAVE ANY SENT BACK SPOTLIGHT REVIEWS</p>}

              {/*<Pagination postsPerPage={postsPerPage} totalPosts={recognitions.length} paginate={paginate}/>*/}
            </Card.Body>
          </Card>
          }

        </Col>

        <div className="defSpacing"></div>
      </Row>
    </motion.div>
  )
}

export default SpotlightReview