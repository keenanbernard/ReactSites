 import React, {Fragment, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import './MyRecognitionsDetail.css';
import {Card} from "primereact/card";
import {useMsal} from "@azure/msal-react";
import PeerCard1 from '../../../PeerCards/Brighten the day - WIDE.webp'
import PeerCard2 from '../../../PeerCards/Finding Creative Solutions - WIDE.webp'
import PeerCard3 from '../../../PeerCards/above and beyond gif1.webp'
import PeerCard4 from '../../../PeerCards/Digi RR Making things happen - NEW.webp'
import PeerCard5 from '../../../PeerCards/TEAM WORK.webp'
import PeerCard6 from '../../../PeerCards/Behind the scenes.webp'
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";


const MyRecognitionsDetail = (props) => {

  const id = props.peernomid;

  const {accounts} = useMsal();
  const name = accounts[0] && accounts[0].name;

  const [isLoading, setIsLoading] = useState(false);
  const [highFiveDetails, setHighFiveDetails] = useState([]);


  const getPeerNominationDetail = async () => {
    setIsLoading(true);
    const response = await fetch(`${props.host}/getUserRecognitionDetail?id=${id}`);
    let data = await response.json();
    setHighFiveDetails(data)
    console.log(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getPeerNominationDetail();
  },[id])

  return (
    <Modal {...props} size='lg'>
      {isLoading ? <span style={{marginBottom: "6rem"}}><LoadingSpinner /> </span> : <>
        <Modal.Header className='peerDetailModalHeader'>
          <Modal.Title className='highFiveDetails recogHistoryLabel'> <span className='recogCentralText' id='headerPeer'> My High Five Details - PID {id}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <Card className='userHighFiveDetails'>
            {highFiveDetails?.map((val, index) => {
              return (
                <Fragment key={index}>
                  <p className='eCardCategory'><b>E-CARD Category: </b>{val.CARDNAME}</p>
                  <img className='peerNominationDetailImg mb-3' src={val.PEERCARDID === 1 ? PeerCard1 : '' || val.PEERCARDID === 2 ? PeerCard2 : '' || val.PEERCARDID === 3 ? PeerCard3 : '' || val.PEERCARDID === 4 ? PeerCard4 : '' || val.PEERCARDID === 5 ? PeerCard5 : '' || val.PEERCARDID === 6 ? PeerCard6 : '' } style={{width: '75%'}} />

                  <p className='eCardDetailsText'><b>Nominator: </b>{val.SENDERDISPLAYNAME === name ? 'YOU' :  val.SENDERDISPLAYNAME}</p>
                  <p className='eCardDetailsText'><b>E-Card Message: </b>{val.SENDERMESSAGE}</p>
                  <p className='eCardDetailsText'><b>Nominee: </b>{val.RECEIVERDISPLAYNAME === name ? 'YOU' :  val.RECEIVERDISPLAYNAME}</p>
                  <p className='eCardDetailsText'><b>Department: </b>{val.DEPARTMENT}</p>

                  <p className='eCardDetailsText'><b>Date Sent: </b>{val.DATECREATED}</p>
                </Fragment>
              )
            })}
          </Card>

        </Modal.Body>
      </>
      }
    </Modal>
  )
}

export default MyRecognitionsDetail;
