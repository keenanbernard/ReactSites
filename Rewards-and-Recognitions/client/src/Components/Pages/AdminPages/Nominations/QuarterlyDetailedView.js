import React, {Fragment, useEffect, useState} from 'react';
import {Link, useSearchParams, useNavigate} from "react-router-dom"
import {useMsal} from "@azure/msal-react";
import {Breadcrumb, Col, ListGroup, Row, Table} from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {motion} from "framer-motion";
import StepperWorkflow from "../../../Atoms/WorkflowIndicator/StepperWorkflow";
import "./NominaitonsDetailedView.css";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import axios from "axios";
import {admins} from "../../LandingPage/Filtered Users";


function QuarterlyNomDetails(props) {

    const {accounts} = useMsal();
    const currentUser = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    const [statusLabel, setStatusLabel] = useState();
    const [category, setCategory] = useState();
    const [index, setIndex] = useState( 0);
    const [justificationPDF, setJustificationPDF] = useState('');
    const [downloadTitle, setDownloadTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quarterlyNomination, setQuarterlyNomination] = useState([]);
    const [quarterlyLogHistory, setQuarterlyLogHistory] = useState([]);
    const [assignee, setAssignee] = useState('Unassigned');
    const [totalHistCount, setTotalHistCount] = useState();
    const [linkIsValid, setLinkIsValid] = useState(false)


    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    let result;
    let resultValue;
    let comments;

    const getQuarterlyNominationCount = async () => {
        const response = await fetch(`${props.host}/QuarterlyDetailViewCountAdmin?id=${id}`);
        let data = await response.json();
        if (data[0].QUARTERLYDETAIL > 0) {
            setLinkIsValid(true);
            getCurrentNomination();
            getCurrentNominationBlob();
            getQuarterlyHistCount();
        } else {
            navigate("/");
        }
    }

    useEffect(() => {
        if (!admins.includes(currentUser)) {
            navigate("/");
        }

        getQuarterlyNominationCount();
    },[]);


    const getCurrentNomination = async () => {
        setIsLoading(prevValue => ++prevValue);
        const response = await fetch(`${props.host}/QuarterlyNomDetails?id=${id}`);
        let data = await response.json();
        setQuarterlyNomination(data);
        setStatusLabel(data[0].CURRENT_STATUS);
        setCategory(data[0].NOMINATION_CATEGORY);
        setIndex(data[0].WORKFLOW_STATUS);
        setDownloadTitle(data[0].NOMINEE_NAME);
        setIsLoading(prevValue => --prevValue);
    }

    const getCurrentNominationBlob = async () => {
        const response = await fetch(`${props.host}/QuarterlyNomBlob?id=${id}`);
        let data = await response.json();
        setJustificationPDF(data);
    }

    const getQuarterlyHistCount = async () => {
        const response = await fetch(`${props.host}/getQuarterlyHistoryCount?id=${id}`);
        let data = await response.json();
        setTotalHistCount(data[0].COUNTRESULT);
        if (data[0].COUNTRESULT > 0) {
            setIsLoading(prevValue => ++prevValue);

            fetch(`${props.host}/QuarterlyLogHistory?id=${id}`).then((response) => response.json()).then((data) => setQuarterlyLogHistory(data));

            fetch(`${props.host}/QuarterlyLogDetails?id=${id}`).then((response) => response.json()).then((data) => setAssignee(data[0].ASSIGNEE_NAME));
            setIsLoading(prevValue => --prevValue);
        }
    }


    const statuses = [
        {label: 'Received', value: 'Received', id: 0},
        {label: 'Reviewing', value: 'Reviewing', id: 1},
        {label: 'Send Back', value: 'Send Back', id: 2},
        {label: 'Hold', value: 'Hold', id: 3},
        {label: 'Not Approved', value: 'Not Approved', id: 4},
        {label: 'Approved', value: 'Approved', id: 5}];


    if (index === 4) {
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].id < 4 || statuses[i].id > 4) {
                Object.assign(statuses[i], {isDisabled: true});
            }
        }
    }

    if (index === 5) {
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].id <= 5) {
                Object.assign(statuses[i], {isDisabled: true});
            }
        }
    }

    const animatedComponents = makeAnimated();

    const handleChange = (value) => {
        const confirmSend = window.confirm('Click "OK" to confirm this selection.');

        if (value.label === 'Send Back'){
            comments = prompt("Enter Comment");
            if (comments === null || comments === ''){
                NotificationManager.error('You must enter a valid comment', 'ERROR', 1000);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
                return;
            }
            NotificationManager.success('This nomination has been sent back', 'SUCCESS');
        } else {
            comments = '';
        }

        if (confirmSend) {
            result = value.id;
            resultValue = value.label
            setIndex(result);
            setStatusLabel(resultValue);
            setAssignee(currentUser);

            const currentUserID = props.userid;
            const qnid = id;
            const logdate = new Date().toLocaleString('en-US', {hour12: false,});
            const nominatorSubject = 'Approval Status of QN-' + id;
            const nomineeSubject = 'You have been nominated for a Digi Yearly Award!';
            const nominatorMessage = 'Your submitted Quarterly Nomination QN-' + id + ' was ' + resultValue + '.';
            const nomineeApprovalMessage = `Congratulations! You have been chosen as this Quarter recipient of the ` + category + ` Quarterly Award. As a quarterly winner, you have gained an entry as a nominee for this year''s Annual Award. Please email hr.livedigi.com within 72 hours of this notification for more information on claiming your award.`;
            const nomineeSentBackMessage = `The following DIGI Quarterly Award nomination has been sent back for your revision. Note comments below for your action. Navigate to the REVIEWAL section of the portal to modify your submission. Please re-submit nomination within 72 hours of this notification to avoid nomination being dismissed.`;

            fetch(`${props.host}/UpdateQuarterlyStatus?id=${id}`, {
                method: "POST", headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }, body: JSON.stringify({
                    nomID: id, nomStatus: resultValue, nomIndex: result
                })
            }).then(() => {
                axios.post(`${props.host}/QuarterlyLog`, {
                    qnid: qnid,
                    qnindex: result,
                    currentUserID: currentUserID,
                    logdate: logdate,
                    currentUser: currentUser,
                    logStatus: resultValue,
                    adminComments: comments
                })
            }).catch(err => {
                NotificationManager.error('Unable to update quarterly log, Contact Admin', 'ERROR: ' + err, 5000);
            });

            if (result === 5) {
                axios.get(`${props.host}/getQuarterlyNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NTEMAIL,
                            peerMessage: nominatorMessage,
                            subject: nominatorSubject
                        }).catch(err => {
                            NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                        })
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NEEMAIL,
                            peerMessage: nomineeApprovalMessage,
                            subject: nomineeSubject
                        }).catch(err => {
                            NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                        })
                        fetch(`${props.host}/InsertYearlyNominations`, {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                nominatorid: quarterlyNomination[0].NOMINATOR_ID,
                                nominatorname: quarterlyNomination[0].NOMINATOR_NAME,
                                nominatorpositiontitle: quarterlyNomination[0].NOMINATOR_POSITION_TITLE,
                                nominatordepartment: quarterlyNomination[0].NOMINATOR_DEPARTMENT,
                                nominatordivision: quarterlyNomination[0].NOMINATOR_DIVISION,
                                nomineeid: quarterlyNomination[0].NOMINEE_ID,
                                nomineename: quarterlyNomination[0].NOMINEE_NAME,
                                nomineepositiontitle: quarterlyNomination[0].NOMINEE_POSITION_TITLE,
                                nomineedepartment: quarterlyNomination[0].NOMINEE_DEPARTMENT,
                                nomineedivision: quarterlyNomination[0].NOMINEE_DIVISION,
                                comment: quarterlyNomination[0].COMMENTS,
                                justifications: quarterlyNomination[0].JUSTIFICATION,
                                currentstatus: 'Received',
                                yncreation: quarterlyNomination[0].DATE_CREATED,
                                workflowstatus: 0,
                                qacat: quarterlyNomination[0].NOMINATION_CATEGORY
                            })
                        }).then((response) => {
                            if (response.status === 200) {
                                NotificationManager.success(quarterlyNomination[0].NOMINEE_NAME + ' has been successfully entered into the Annual Nomination', 'SUCCESS');
                            }
                        }).catch(err => {
                            NotificationManager.error('Unable to submit Annual Nomination, Contact Admin', 'ERROR: ' + err, 5000);;
                        });
                    }
                }).catch(err => {
                    NotificationManager.error('Connection Failed, Contact Admin', 'ERROR: ' + err, 5000);
                })
            } else if (result === 4) {
                axios.get(`${props.host}/getQuarterlyNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        NotificationManager.info('This nomination has been successfully closed', 'SUCCESS');
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NTEMAIL,
                            peerMessage: nominatorMessage,
                            subject: nominatorSubject
                        }).catch(err => {
                            NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                        })
                    }
                }).catch(err => {
                    NotificationManager.error('Connection failed, Contact Admin', 'ERROR: ' + err, 5000);
                })
            } else if (result === 2) {
                axios.get(`${props.host}/getQuarterlyNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NTEMAIL,
                            peerMessage: nomineeSentBackMessage,
                            subject: nominatorSubject
                        }).catch(err => {
                            NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                        })
                    }
                }).catch(err => {
                    NotificationManager.error('Connection failed, Contact Admin', 'ERROR: ' + err, 5000);
                })
            }
        }  else {
            window.location.reload()
        }
    }


    return (
        <>
            {admins.includes(currentUser) && <>
            {linkIsValid && <>
                {isLoading > 0 ? <LoadingSpinner style={{marginTop: "8rem"}}/> :

                    <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}}
                        exit={{opacity: 0, transition: {duration: 0.2}}}>
                    <Row>
                        <Col md={2} className='pt-2 freeSpace'>
                            <Breadcrumb className='breadcrumb'>
                                {quarterlyNomination && quarterlyNomination.map((val) => {
                                    return (
                                        <Fragment key={val.NOMINATIONS_ID}>
                                            <Breadcrumb.Item active key={val.NOMINATIONS_ID}><Link
                                                to="/QuarterlyNominations">Nominations</Link> / {val.NOMINATIONS_ID}
                                            </Breadcrumb.Item>
                                        </Fragment>
                                    )
                                })}
                            </Breadcrumb>
                        </Col>

                        <StepperWorkflow index={index}/>
                        <div className="workflowSpacing"></div>
                        <Col md={6} className=''>
                            <ListGroup variant="flush">
                                {quarterlyNomination && quarterlyNomination.map((val) => {

                                    return (
                                        <Fragment key={val.NOMINATIONS_ID}>
                                            <p><b>Nominator: </b><span
                                                key={val.NOMINATIONS_ID}>{val.NOMINATOR_NAME}</span></p>
                                            <p><b>Nominator's Job Title: </b><span>{val.NOMINATOR_POSITION_TITLE}</span>
                                            </p>
                                            <p><b>Nominator's Department: </b><span>{val.NOMINATOR_DIVISION}</span></p>
                                            <p><b>Nominator's Division: </b><span>{val.NOMINATOR_DIVISION}</span></p>
                                            <p><b>Nomination Category: </b><span>{val.NOMINATION_CATEGORY}</span></p>
                                            <p><b>Nominator's Comments: </b><span>{val.COMMENTS}</span></p>
                                            <p><b>Nominee: </b><span>{val.NOMINEE_NAME}</span></p>
                                            <p><b>Nominated On: </b><span>{val.DATE_CREATED}</span></p>
                                            <p><b>Assignee: </b><span>{assignee}</span></p>
                                            <p><b>Status: </b><span>{statusLabel}</span></p>
                                            <p><b>Justification: </b><span> <a className='btn btn-sm btn-secondary'
                                                                               download={`${downloadTitle} Justification`}
                                                                               href={justificationPDF}
                                                                               title={downloadTitle}>Download Justification </a></span>
                                            </p>
                                        </Fragment>
                                    )
                                })}
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            {quarterlyNomination && quarterlyNomination.map((val) => {
                                return (
                                    <Fragment key={val.NOMINATIONS_ID}>
                                        <Select
                                            name='options'
                                            components={animatedComponents}
                                            options={statuses}
                                            onChange={handleChange}
                                            placeholder={val.CURRENT_STATUS}
                                            className="workflowSelect"
                                        />
                                        <p></p>
                                    </Fragment>
                                )
                            })}
                        </Col>
                    </Row>

                        <hr/>

                        <Row>
                            <h5>Quarterly Nomination History</h5>
                            <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                <thead className='tableHeading'>
                                <tr>
                                    <th>LOG ID</th>
                                    <th>REPRESENTATIVE</th>
                                    <th>STATUS</th>
                                    <th>DATE REVIEWED</th>
                                    <th>DATE UPDATED</th>
                                    <th>COMMENTS</th>
                                </tr>
                                </thead>
                                <tbody>
                                {quarterlyLogHistory?.map((val, index) => (
                                    <tr key={index}>
                                        <td>{val.QUARTERLYNOMINTION_LOG_ID}</td>
                                        <td>{val.ASSIGNEE_NAME}</td>
                                        <td>{val.WORKFLOW_STATUS}</td>
                                        <td>{val.DATE_FROM}</td>
                                        <td>{val.DATE_TO}</td>
                                        <td>{val.COMMENTS}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            {totalHistCount < 1 &&
                                <p className='noDepartment'>No changes have been logged for this nomination</p>}
                        </Row>
                        <NotificationContainer/>
                        <div id='freeSpace3'></div>
                    </motion.div>}
                </>
                }</>
            }
       </>
    )
}

export default QuarterlyNomDetails;
