import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Card, Col, Row, Table} from "react-bootstrap";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import {Link} from "react-router-dom";
import './NominationReview.css';

const QuarterlyReview = (props) => {

  const [quarterlyReviews, setQuarterlyReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [totalQuarterlyReviews, setTotalQuarterlyReviews] = useState();


  const getQuarterlyRevisions = async () => {
    setIsLoading(true);
    const response = await fetch(`${props.host}/QuarterlyReviewCount?id=${props.graphdata.id}`);
    let data = await response.json();
    if (data[0].TOTALREVIEWALS > 0) {
        const response = await fetch(`${props.host}/QuarterlyNominationReview?id=${props.graphdata.id}`);
        let data = await response.json();
        setQuarterlyReviews(data);
        setTotalQuarterlyReviews(data.length)
        setIsLoading(false);
    } else {
      setTotalQuarterlyReviews(0);
      setIsLoading(false);
    }
    // setIsLoading(false);
  }

  useEffect(() => {
    getQuarterlyRevisions();
  }, []);

  return (
    <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
      <Row>
        <Card.Title className='nominationReviewLabel'><span className='reviewLabel'>Quarterly Nomination</span> <span className='reviewText'>Reviewal</span></Card.Title>
        <img className='reviewDivider' src={teamSpacing} alt={'Hi'}/>
        <Col md={11} style={{margin: "0 auto"}}>

          {isLoading ? <LoadingSpinner /> : <Card>
            <Card.Body>
              <Table bordered hover responsive style={{backgroundColor: "white"}}>
                <thead className='peerNominationsTh'>
                  <tr>
                    <th  className='reviewNomID'>NOMINATION ID</th>
                    <th className='reviewColumn'>NOMINEE</th>
                    <th className='reviewColumn'>SUBMISSION DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {totalQuarterlyReviews > 0 && quarterlyReviews?.map((val, index) => (
                      <tr className='reviewTr' key={index}>
                        <td className=''><Link className='nomReviewLink' to={`/QuarterlyNomRevision?id=${val.NOMINATIONS_ID}`}>{val.NOMINATIONS_ID}</Link></td>
                        <td className=''>{val.NOMINEE_NAME}</td>
                        <td className=''>{val.DATE_CREATED}</td>
                      </tr>
                  ))}
                </tbody>
              </Table>

              {totalQuarterlyReviews < 1 && <p className='noDepartment'>YOU DO NOT HAVE ANY SENT BACK QUARTERLY REVIEWS</p>}
            </Card.Body>
          </Card>
          }
        </Col>
        <div className="defSpacing"></div>
      </Row>
    </motion.div>
  )
}

export default QuarterlyReview;