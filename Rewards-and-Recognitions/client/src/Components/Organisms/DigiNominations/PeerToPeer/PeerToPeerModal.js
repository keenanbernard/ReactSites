import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom"
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from "axios";
import PeerCards from "./PeerCardsCarousel/PeerCards";
import './PeerToPeerModal.css';
import 'react-notifications/lib/notifications.css';

function PeerToPeerNom(props) {
    const animatedComponents = makeAnimated();
    const navigate = useNavigate();

    // Get Users from Graph Explorer
    const [users, setUsers] = useState([]);
    const [, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const currentUserID = props.graphdata.id;
    const yammerToken = props.ymtoken;


    let formIsInvalid = true;

    useEffect(() => {
        setUsers(props.graphuser);
    }, [props.graphuser]);

    // Handle Input Change
    const handleInputChange = value => {
        setInputValue(value);
    }

    // Handle Selection
    const handleChange = value => {
        setSelectedValue(value);
    }

    //Peer PeerCards Array & useStates
    const peerToPeerCards = [
        { label: 'Brightening the Day', value: 'Brightening the Day', id: 1 },
        { label: 'Finding Creative Solutions', value: 'Finding Creative Solutions', id: 2},
        { label: 'Going Above and Beyond', value: 'Going Above and Beyond', id: 3 },
        { label: 'Making it happen', value: 'Making it happen', id: 4 },
        { label: 'Supportive Team Player', value: 'Supportive Team Player', id: 5 },
        { label: 'Working Behind the Scenes', value: 'Working Behind the Scenes', id: 6 }
    ]

    peerToPeerCards.map(opt => ({ label: opt, value: opt, id: opt }));
    const [cardOption, setCardOption] = useState(null);
    const [peerMessage, setPeerMessage] = useState('');
    const [, setConfirmMessage] = useState('Send a Peer card to a colleague');

    // Insert Details
    const senderId = currentUserID;
    let receiverId = ''
    let recieverEmail = null
    if (selectedValue !== null) {receiverId = selectedValue.id;}
    const peerCardId = cardOption;
    const dateCreated = new Date().toLocaleString('en-US', {hour12: false,});
    if (selectedValue !== null) recieverEmail = selectedValue.mail;

    // Form Validation
    const peerCardValueIsValid = cardOption !== null;
    const peerValueIsValid = selectedValue !== '';
    const peerMessageIsValid = peerMessage.trim() !== '';
    if (peerCardValueIsValid && peerValueIsValid && peerMessageIsValid) formIsInvalid = false;

    //Insert Peer to Peer information & Trigger Email notification via Fetch Post Function
    const getPeerDetails = (event) => {
        event.preventDefault();

        if (!peerCardValueIsValid || !peerValueIsValid || !peerMessageIsValid) {
            setErrorMessage(true);
            return;
        }

        const confirmSend = window.confirm('Would you like to submit this card to your peer? Click OK to confirm submission of this card.');
        const recieverSubject = 'You have received an I AM DIGI E-Card';
        const recieverMessage = `Hello!

You have received an I AM DIGI E-Card.

To see it, click here:
https://172.21.56.34/MyRecognitions

There''s something special about that E-Card feeling. We invite you to make a co-worker''s day and send one.

Thank you!`;

        const currentUserEmail = props.graphdata.mail;
        const currentUserMessage = `Your DIGI High Five Card has been posted to I AM DIGI. Click on link below to view:
        https://web.yammer.com/main/org/belizetelemedia.net/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIxMTcwNDMzODg0MTYifQ/all`;
        const currentUserSubject = 'You have sent an I AM DIGI E-Card.';

        if (confirmSend) {

            if (peerMessage === '' || recieverEmail === null || cardOption === null) {
                NotificationManager.error('Unable to send Peer Card. ALL FIELDS ARE REQUIRED.', 'ALERT', 5000);
                setCardOption(null);
                setSelectedValue(null);
                setPeerMessage(null);
                return;
            }

            fetch(`${props.host}/InsertPeerToPeer`, {
                method: "POST",  headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }, body: JSON.stringify({
                    senderId: senderId, receiverId: receiverId, peerCardId: peerCardId, peerMessage: peerMessage, dateCreated: dateCreated
                })
            }).then((response) => {
                if (response.status === 200) {
                    setConfirmMessage('YOU HAVE SENT A PEER CARD');
                    NotificationManager.success('You have successfully sent a Peer Card', 'SUCCESS');
                    axios.post(`${props.host}/EmailNotification`, {recieverEmail: recieverEmail,  peerMessage: recieverMessage, subject: recieverSubject }).then(() => {
                        axios.post(`${props.host}/EmailNotification`, {recieverEmail: currentUserEmail,  peerMessage: currentUserMessage, subject: currentUserSubject })
                    }).catch(err=>{
                        NotificationManager.error('Unable to send Peer Card Email, Contact Admin', 'ERROR: ' + err, 5000);
                    }).then(() => {
                        navigate("/");
                    }).then(() => {
                        axios.post(`${props.host}/YammerPost`, {yammerToken: yammerToken,  peerMessage: peerMessage, recieverEmail: recieverEmail  }).then(() => {
                        }).catch(err=>{
                            NotificationManager.error('Unable to make a Yammer Post, Contact Admin', 'ERROR: ' + err, 5000);
                        })
                    })
                }
            }).catch(err => {
                setConfirmMessage('ERROR SENDING CARD. CONTACT ADMIN');
                NotificationManager.error('Unable to send Peer Card, Contact Admin', 'ERROR: ' + err, 5000);
            });

            setCardOption(null);
            setSelectedValue('');
            setPeerMessage('');
        }
    }

    return (
        <div>
        <Modal {...props} fullscreen="true" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body className='peerCardBody'>
                <PeerCards/>
                <p className='alertMessage'>All fields are required to submit a High-Five recognition!</p>
                <Select name='options'
                    components={animatedComponents}
                    options={peerToPeerCards}
                    onChange={(event) => {setCardOption(event.id)}}
                    placeholder='Select Card'
                />
                <div className='userCardSpacing' />
                <div>
                    <Select
                        placeholder='Select Peer'
                        value={selectedValue}
                        classNamePrefix='lp-copy-sel'
                        getOptionLabel={e=> e.displayName}
                        getOptionValue={e=> e.id}
                        onInputChange={handleInputChange}
                        onChange={handleChange}
                        options={users && users}
                    />
                </div>
                <div className='userCardSpacing' />
                <FloatingLabel controlId="floatingTextarea2" label="Custom Message">
                    <Form.Control as="textarea" value={peerMessage} onChange={(event) => {setPeerMessage(event.target.value)}} placeholder="Custom Message" style={{ height: '120px' }} />
                </FloatingLabel>
                {errorMessage && <p className='alertMessage mt-2 mb-0'>Ensure fields are not empty!</p>}
            </Modal.Body>

            <Modal.Footer>
                <form action="client/src/Components/Organisms/DigiNominations/PeerToPeerNominations/PeerToPeerModal.js" onSubmit={getPeerDetails} >
                    <Button disabled={formIsInvalid} type='submit' className='submitPeerToPeer' variant="danger" onClick={props.onHide}>Submit</Button>
                </form>
            </Modal.Footer>
        </Modal>
            <NotificationContainer/>
        </div>
    );
}

export default PeerToPeerNom;