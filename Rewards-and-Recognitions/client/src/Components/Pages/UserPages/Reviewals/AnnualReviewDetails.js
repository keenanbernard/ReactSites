import React, {Fragment, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {Breadcrumb, Button, Card, Col, FloatingLabel, Form, Row, Table} from "react-bootstrap";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import {Link, useSearchParams} from "react-router-dom"
import {NotificationContainer, NotificationManager} from "react-notifications";
import axios from "axios";
import './NominationDetail.css'


function AnnualRevisionPage(props) {
    const [sendBackDetails, setSendBackDetails] = useState();
    const [commentValue, setCommentValue] = useState();
    const [nominee, setNominee] = useState();
    const [updatedCommentValue, setUpdatedCommentValue] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [justificationPDF, setJustificationPDF] = useState('');
    const [downloadTitle, setDownloadTitle] = useState('');
    const [nominatorId, setNominatorId] = useState(props.graphdata.id);

    // Limit Application Size and File Type
    const [fileTypeAccepted, setFileTypeAccepted] = useState(true);
    const [fileSizeAccepted, setFileSizeAccepted] = useState(true);
    const [fileData, setFileData] = useState();

    const [, setNomCommentIsInvalidOnSub] = useState(false);
    const [, setFileDataIsInvalidOnSub] = useState(false);

    const nominatorCommentIsValid = updatedCommentValue.trim() !== '';
    const justificationFileIsValid = fileData !== undefined;

    const [linkIsValid, setLinkIsValid] = useState(false);

    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    let formIsInvalid = true;

    const navigate = useNavigate();

    if (nominatorCommentIsValid && justificationFileIsValid && fileTypeAccepted && fileSizeAccepted) {
        formIsInvalid = false;
    }


    const getAnnualReviewDetailedCount = async () => {
        const response = await fetch(`${props.host}/AnnualReviewDetailCount?id=${id}`);
        let data = await response.json();
        if (data[0].TOTALANNUAL > 0) {
            setLinkIsValid(true);
            getNominationReviewDetails();
            getCurrentNominationBlob();
            getLogComments();
        } else {
           navigate("/");
        }
    }

    const getNominationReviewDetails = async () => {
        setIsLoading(prevValue => ++prevValue);
        const response = await fetch(`${props.host}/YearlyNomDetails?id=${id}`);
        let data = await response.json();
        setSendBackDetails(data);
        setNominee(data[0].NOMINEE_NAME);
        setDownloadTitle(data[0].NOMINEE_NAME);
        setNominatorId(data[0].NOMINATOR_ID);
        setCommentValue(data[0].COMMENTS);
        setUpdatedCommentValue(data[0].COMMENTS);
        setIsLoading(prevValue => --prevValue);
    }

    if (nominatorId !== props.graphdata.id) {
       navigate("/");
    }

    const getCurrentNominationBlob = async () => {
        const response = await fetch(`${props.host}/YearlyNomBlob?id=${id}`);
        let data = await response.json();
        setJustificationPDF(data);
    }

    const getLogComments = async () => {
        setIsLoading(prevValue => ++prevValue);
        const response = await fetch(`${props.host}/YearlyLogHistory?id=${id}`);
        let data = await response.json();
        setReviewComment(data[0].COMMENTS);
        setIsLoading(prevValue => --prevValue);
    }

    useEffect(() => {
        getAnnualReviewDetailedCount();
    },[]);

    const commentSectionHandler = event => {
        if (updatedCommentValue.trim() !== '') {
            setNomCommentIsInvalidOnSub(false);
        }
        setUpdatedCommentValue(event.target.value);
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


    const updateNomination = (event) => {
        event.preventDefault();
        const subject = 'Resubmission: YN-' + id;
        const hrMessage = 'A DIGI Annual nomination for ' + nominee + ' has been re-submitted for your review and approval.';

        if (!nominatorCommentIsValid) {
            setNomCommentIsInvalidOnSub(true);
        }

        if (!justificationFileIsValid) {
            setFileDataIsInvalidOnSub(true);
        }

        if (!nominatorCommentIsValid || !justificationFileIsValid) {
            console.log('FORM NOT VALID');
            return;
        }

        fetch(`${props.host}/AnnualNomResubmission`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                commentValue: updatedCommentValue,
                justificationFile: fileData,
                nomId: id,
                updatedStatus: 'Received',
                workflow: 0
            })
        }).then((resp) => {
            setDisabled(true);
            axios.post(`${props.host}/EmailNotification`, {
                recieverEmail: 'hrdept@livedigi.com', peerMessage: hrMessage, subject: subject
            }).then(
                NotificationManager.success('You have successfully updated nomination YN-' + id, 'SUCCESS', 1000)
            )
            setTimeout(function () {
                navigate("/");
            }, 1000);
        }).catch(err => {
            NotificationManager.error('Unable to Update Nomination YN-' + id + ' , Contact Admin', 'ERROR', 5000);
            console.log('ERROR:', err);
        });

    }


    return (
        <>
            {(linkIsValid && nominatorId === props.graphdata.id) &&
                <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}}
                            exit={{opacity: 0, transition: {duration: 0.2}}}>
                    {isLoading ? <LoadingSpinner style={{marginTop: "8rem"}}/> : <> <Row>

                        <Col md={2}>
                            <Breadcrumb className='breadcrumb'>
                                {sendBackDetails && sendBackDetails.map((val) => {
                                    return (
                                        <Fragment key={val.NOMINATIONS_ID}>
                                            <Breadcrumb.Item active key={val.NOMINATIONS_ID}><Link to="/AnnualReview">Annual
                                                Nominations</Link> / {val.NOMINATIONS_ID}</Breadcrumb.Item>
                                        </Fragment>
                                    )
                                })}
                            </Breadcrumb>
                        </Col>

                        <div className="workflowSpacing"></div>

                        <Col md={8} style={{margin: "0 auto"}}>
                            <Card style={{border: "0.2rem solid #ececec"}}>
                                <Card.Header style={{background: "white"}}> <Card.Title
                                    className='nominationLabel updateText'><span className='nomLabels'>Update</span>
                                    <span className='nomTexts'>Annual Nomination</span></Card.Title></Card.Header>
                                <Card.Body style={{background: "white"}}>
                                    <label className='mb-1'>Nominee:</label>
                                    <p className='form-control'>{nominee}</p>
                                    <label htmlFor="" className="mb-1">Your Comments:</label>
                                    <FloatingLabel controlId="floatingTextarea2">
                                        <Form.Control disabled={disabled} as="textarea" defaultValue={commentValue}
                                                      onChange={commentSectionHandler} placeholder="Custom Message"
                                                      className="mb-3" style={{height: '120px', paddingTop: "1rem"}}/>
                                    </FloatingLabel>
                                    <Form.Group controlId="formFile">
                                        <Form.Control disabled={disabled} type="file" onChange={handleJustification}/>
                                    </Form.Group>
                                    <label className='mb-2 mt-3 me-2'>View your previous justification: </label>
                                    <a className='btn btn-sm btn-secondary' download={`${downloadTitle} Justification`}
                                       href={justificationPDF} title={downloadTitle}> Download Justification </a>
                                    <Form onSubmit={updateNomination}>
                                        <Button id='' disabled={formIsInvalid} style={{float: "right"}} type='submit'
                                                className='mt-3'>Update Submission</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                            <Table bordered responsive style={{backgroundColor: "white", marginTop: "5%"}}>
                                <thead className='tableHeading'>
                                <tr>
                                    <th>HR FEEDBACK</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{reviewComment}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row> </>}
                    <NotificationContainer/>
                </motion.div>
            }
        </>
    )
}

export default AnnualRevisionPage;