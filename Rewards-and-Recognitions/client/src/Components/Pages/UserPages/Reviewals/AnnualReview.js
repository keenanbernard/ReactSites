import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Card, Col, Row, Table} from "react-bootstrap";
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import {Link} from "react-router-dom";
import './NominationReview.css';

const AnnualReview = (props) => {

  const [annualReviews, setAnnualReviews] = useState();
  const [totalAnnualReviews, setTotalAnnualReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);


    const getAnnualReviewCount = async () => {
    setIsLoading(true);
    const response = await fetch(`${props.host}/AnnualReviewCount?id=${props.graphdata.id}`);
    let data = await response.json();
    if (data[0].TOTALREVIEWALS > 0) {
        setIsLoading(true);
        const response = await fetch(`${props.host}/YearlyNominationReview?id=${props.graphdata.id}`);
        let data = await response.json();
        setAnnualReviews(data);
        setTotalAnnualReviews(data.length);
        setIsLoading(false);
    } else {
      setTotalAnnualReviews(0);
      setIsLoading(false);

    }

    setIsLoading(false);
  }

  useEffect(() => {
    getAnnualReviewCount();
  }, []);

  return (
      <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.2}}}>
        <Row>
          <Card.Title className='nominationReviewLabel'><span className='reviewLabel'>Annual Nomination</span> <span className='reviewText'>Reviewal</span></Card.Title>
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
                  {totalAnnualReviews > 0 && annualReviews.map((val, index) => (
                      <tr className='reviewTr' key={index}>
                        <td className=''><Link className='nomReviewLink' to={`/AnnualRevision?id=${val.NOMINATIONS_ID}`}>{val.NOMINATIONS_ID}</Link></td>
                        <td className=''>{val.NOMINEE_NAME}</td>
                        <td className=''>{val.DATE_CREATED}</td>
                      </tr>
                  ))}
                  </tbody>
                </Table>

                {totalAnnualReviews < 1 && <p className='noDepartment'>YOU DO NOT HAVE ANY SENT BACK ANNUAL REVIEWS</p>}

              </Card.Body>
            </Card>
            }
          </Col>
          <div className="defSpacing"></div>
        </Row>
      </motion.div>
  )
}

export default AnnualReview;