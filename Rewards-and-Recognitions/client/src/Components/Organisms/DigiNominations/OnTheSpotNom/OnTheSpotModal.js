import React, {useEffect, useState} from "react";
import {useMsal} from "@azure/msal-react";
import Select from "react-select";
import {NotificationManager} from "react-notifications";
import axios from "axios";
import {Button, Card, Col, FloatingLabel, Form, Modal, Row, Table} from "react-bootstrap";
import './OnTheSpotModal.css';
import teamSpacing from "../../../MiscellaneousImages/HR-portal-divider.png";
import onTheSpotBanner from "./OnTheSpotImages/Digi RR on the spot.webp";
import Pagination from "../../../Atoms/Pagination/Pagination";

function OnTheSpotNom(props) {
    //Nomination Values
    let mySelectedTeam = [];
    let statuses = [];
    let nomineeNames = [];
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    const {accounts} = useMsal();
    const name = accounts[0] && accounts[0].name;

    // Set Insert Information
    const [, setInputValue] = useState(null);
    const [directReports, setDirectReports] = useState([]);
    const [division, setDivision] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [nomComment, setNomComment] = useState('');
    const [fileData, setFileData] = useState();

    // Get user division
    const getDivision = async () => {
        const response = await fetch(`${props.host}/getDivision?id=${props.graphdata.id}`);
        let data = await response.json();
        setDivision(data[0].DIVISION);
    }

    useEffect(() => {
        setDirectReports(props.directreports);
        getDivision();
    }, [props.directreports]);

    // Only if Submit Spotlight is disabled in console.
    const [selectedValueIsInvalidOnSub, setSelectedValueIsInvalidOnSub] = useState(false);
    const [nomCommentIsInvalidOnSub, setNomCommentIsInvalidOnSub] = useState(false);
    const [fileDataIsInvalidOnSub, setFileDataIsInvalidOnSub] = useState(false);
    const [commentSizeIsInvalidOnSub, setCommentSizeIsInvalidOnSub] = useState(false);


    // Form Validation
    const directReportSelectIsValid = selectedValue !== '';
    const nominatorCommentIsValid = nomComment.trim() !== '';
    const justificationFileIsValid = fileData !== undefined;
    const commentSizeIsValid = nomComment.length < 161;


    // Limit Application Size and File Type
    const [fileTypeAccepted, setFileTypeAccepted] = useState(true);
    const [fileSizeAccepted, setFileSizeAccepted] = useState(true);

    let formIsInvalid = true;

    if (directReportSelectIsValid && nominatorCommentIsValid && justificationFileIsValid && fileTypeAccepted && fileSizeAccepted && commentSizeIsValid) {
        formIsInvalid = false;
    }

    // Handle Input Change
    const handleInputChange = value => {
        setInputValue(value);
    }

    // Handle Direct Report Selection
    const directReportChangeHandler = value => {
        setSelectedValue(value);
        setSelectedValueIsInvalidOnSub(false);
    }

    for (const key in selectedValue) {
        mySelectedTeam.push({
            id: selectedValue[key].id,
            nomineename: selectedValue[key].displayName,
            nomineepositiontitle: selectedValue[key].jobTitle,
            nomineeEmail: selectedValue[key].mail
        });
    }

    // Handle Comment Section
    const commentSectionHandler = event => {
        if (nomComment.trim() !== '') {
            setNomCommentIsInvalidOnSub(false);
        }
        setNomComment(event.target.value);
    }

    // Handle File Upload
    function handleJustification(event) {
        setFileTypeAccepted(true);
        setFileSizeAccepted(true);

        if (!event.target.files[0]) {
            setFileData(undefined);
            return;
        }

        const file = event.target.files[0];

        if (file) {
            setFileDataIsInvalidOnSub(false);
            const fileType = file.type;
            const fileSize = file.size;

            if (fileType !== 'application/pdf') {
                setFileTypeAccepted(false);
                return;
            }

            if (fileSize > 10e6) {
                setFileSizeAccepted(false);
                return;
            }
        }

        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            setFileData(reader.result);
        });
        reader.readAsDataURL(file);
    }

    const comment = nomComment;
    const Created = new Date().toLocaleString('en-US', {hour12: false,});
    let groupID = '';
    let managerMessage = '';
    let hrMessage = '';

    const submitSpotlight = (event) => {
        event.preventDefault();

        if (mySelectedTeam.length > 1) groupID = 'G-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1);

        if (!directReportSelectIsValid) setSelectedValueIsInvalidOnSub(true);

        if (!nominatorCommentIsValid) setNomCommentIsInvalidOnSub(true);

        if (!justificationFileIsValid) setFileDataIsInvalidOnSub(true);

        if (!commentSizeIsValid) setCommentSizeIsInvalidOnSub(true)

        if (!directReportSelectIsValid || !nominatorCommentIsValid || !justificationFileIsValid || !commentSizeIsValid) return;

        let operationsCompleted = 0;

        function execution() {
            ++operationsCompleted;
            if (operationsCompleted === mySelectedTeam.length) endGame(2000);
        }

        for (let i = 0; i < mySelectedTeam.length; i++) {
            fetch(`${props.host}/SpotLightCount?id=${mySelectedTeam[i].id}`)
                .then((response) => response.json())
                .then((data) => {
                    let confirmMessage;
                    if (data[0].SPOTLIGHTS > 1) {
                        confirmMessage = window.confirm(mySelectedTeam[i].nomineename + ' has already received the acceptable number of DIGI Spotlight Awards for this fiscal year. Click Continue if you wish to proceed with approval.');
                        if (!confirmMessage){
                            NotificationManager.info('Nomination cancelled for ' + mySelectedTeam[i].nomineename, 'STATUS', 2000);
                            setTimeout(function () {
                                execution();
                            }, 2000);
                            return
                        }
                    }

                        fetch(`${props.host}/insertOnTheSpot`, {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                nominatorid: props.graphdata.id,
                                nominatorname: name,
                                nominatorpositiontitle: props.graphdata.jobTitle,
                                nominatordepartment: props.graphdata.department,
                                nominatordivision: division,
                                nomineeId: mySelectedTeam[i].id,
                                nomineename: mySelectedTeam[i].nomineename,
                                nomineepositiontitle: mySelectedTeam[i].nomineepositiontitle,
                                nomineedepartment: props.graphdata.department,
                                nomineedivision: division,
                                comment: comment,
                                justifications: fileData,
                                currentstatus: 'Received',
                                Created: Created,
                                workflowstatus: 0,
                                groupID: groupID
                            })
                        }).then((response) => {
                            statuses.push({
                                status: response.status
                            });
                            nomineeNames.push({
                                name: mySelectedTeam[i].nomineename
                            });
                            execution();
                        }).catch(() => {
                            statuses.push({
                                status: 400
                            });
                            execution();
                        });
                }).catch(() => {
                statuses.push({
                    status: 500
                });
                execution();
            });
        }

        function endGame(timeOut) {
            setTimeout(function () {
                let nominees = nomineeNames.map(function (elem) {
                    return elem.name;
                }).join(", ");


                const subject = 'Digi Spotlight Award!';

                if (nomineeNames.length >= 2){
                    managerMessage = 'Thank you for nominating ' + nominees + ' for a DIGI Spotlight Award. Your nomination has been submitted to HR for review and approval. Group ID: ' + groupID;
                    hrMessage = 'A DIGI Spotlight Award nomination for ' + nominees + ' has been submitted for your review and approval. Group ID: ' + groupID;
                } else {
                    managerMessage = 'Thank you for nominating ' + nominees + ' for a DIGI Spotlight Award. Your nomination has been submitted to HR for review and approval.';
                    hrMessage = 'A DIGI Spotlight Award nomination for ' + nominees + ' has been submitted for your review and approval.';
                }

                if (statuses[0].status !== 200) {
                    NotificationManager.error('Unable to send Spotlight Nomination, Contact Admin', 'Error Code: ' + statuses[0].status, 5000);
                    return
                }

                NotificationManager.success('You have successfully nominated ' + nominees + ' for a Digi Spotlight award', 'SUCCESS');
                axios.post(`${props.host}/EmailNotification`, {
                    recieverEmail: 'hrdept@livedigi.com', peerMessage: hrMessage, subject: subject
                }).then(() => {
                    axios.post(`${props.host}/EmailNotification`, {
                        recieverEmail: props.graphdata.mail,
                        peerMessage: managerMessage,
                        subject: subject
                    })
                }).catch(err => {
                    NotificationManager.error('Unable to send Spotlight Email, Contact Admin', 'ERROR: ' + err, 5000);
                })
            }, timeOut);
        }

        setInputValue(null);
        setNomComment('');
        setFileData(undefined);
        setSelectedValue('');
        setDivision('')
    }

    if (selectedValue.displayName === undefined) {
    }

    // Apply error classes conditionally
    const directReportSel = selectedValueIsInvalidOnSub ? 'p-copy-sel errorBorder' : 'lp-copy-sel';
    const commentsFilled = nomCommentIsInvalidOnSub ? 'errorBorder' : '';
    const fileUploaded = fileDataIsInvalidOnSub ? 'mb-2 errorBorder' : 'mb-2';
    const fileSize = nomComment.length >= 160 ? 'mt-1 mb-0 error-text' : 'mt-1 mb-0 normalText';

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = directReports.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered id='onTheSpotNum'>
            <Modal.Header className='onTheSpotBanner' style={{padding: 0}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <img className='spotlightBanner' src={onTheSpotBanner} alt={'On The Spot'} style={{width: '100%'}} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title className='myTeamTitle'>My
                                    <span className='myTeamTitleText'> Direct Reports</span>
                                    <br></br>
                                    <img className='teamDivider' src={teamSpacing} alt={'Team Spacing'}/>
                                </Card.Title>
                                <Table>
                                    <tbody>
                                    {currentPost?.map((val, index) => (
                                        <tr key={index}>
                                            <td>{val.displayName}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>

                                <Pagination postsPerPage={postsPerPage} totalPosts={directReports.length} paginate={paginate} />


                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <div>
                            <p className='text-muted nomTextInfo'>Hi, {name}. When you submit this form, HR will be notified of this nomination. <span className='error-text'>All fields are required to submit.</span></p>

                            <p style={{fontWeight: "bold"}}>Select the name of the direct report you are nominating. </p>

                            <Select
                                placeholder='Select Direct Report'
                                value={selectedValue}
                                classNamePrefix={directReportSel}
                                getOptionLabel={e=> e.displayName}
                                getOptionValue={e=> e.id}
                                onInputChange={handleInputChange}
                                onChange={directReportChangeHandler}
                                options={directReports && directReports}
                                isMulti
                            />

                            {selectedValueIsInvalidOnSub && <p className='mt-1 mb-0 error-text'>Direct Report must be selected</p>}
                        </div>
                        <div className='userCardSpacing' />

                        <FloatingLabel controlId="floatingTextarea2" label="Enter your comments">
                            <Form.Control as="textarea" maxLength={160} onChange={commentSectionHandler} className={commentsFilled} value={nomComment} placeholder="Custom Message" style={{ height:'120px'}}/>
                        </FloatingLabel>

                        {!commentSizeIsInvalidOnSub && <p className={fileSize}>{nomComment.length} of 160 characters</p>}

                        {commentSizeIsInvalidOnSub && <p className='mt-1 mb-0 error-text'>Maximum comment size is 160 characters</p>}

                        {nomCommentIsInvalidOnSub && <p className='mt-1 mb-0 error-text'>Ensure a comment has been entered</p>}

                        <div className='userCardSpacing' />

                        <Form.Group controlId="formFile" >
                            <Form.Control type="file" className={fileUploaded} onChange={handleJustification} />
                        </Form.Group>

                        {(fileTypeAccepted && fileSizeAccepted && !fileDataIsInvalidOnSub) && <p className={'mb-0 text-muted infoMessage'}>Only PDFs accepted. Max file size of 10MB</p>}

                        {fileDataIsInvalidOnSub && <p className='mb-0 error-text '>Ensure a PDF has been attached</p>}

                        {!fileTypeAccepted && <p className='mb-0 error-text errorPos'>Only PDF Applications allowed</p>}

                        {!fileSizeAccepted && <p className='mb-0 error-text errorPos'>Maximum File Size of 10MB</p>}

                        <Modal.Footer id='otsSubmit'>
                            <form onSubmit={submitSpotlight}>
                                <Button disabled={formIsInvalid} id='otsSubmitBtn' type='submit' className='submitPeerToPeer ' variant="danger"  onClick={props.onHide}>Submit Spotlight</Button>
                            </form>
                        </Modal.Footer>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default OnTheSpotNom;