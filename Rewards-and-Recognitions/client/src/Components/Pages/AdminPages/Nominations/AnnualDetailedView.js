import React, {Fragment, useEffect, useState} from 'react';
import {Link, useSearchParams, useNavigate} from "react-router-dom"
import {useMsal} from "@azure/msal-react";
import {Breadcrumb, Col,  ListGroup, Row, Table} from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {NotificationContainer, NotificationManager} from "react-notifications";
import axios from "axios";
import { motion } from "framer-motion";
import StepperWorkflow from "../../../Atoms/WorkflowIndicator/StepperWorkflow";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import "./NominaitonsDetailedView.css";
import {admins} from "../../LandingPage/Filtered Users";


function YearlyNominationDetails(props) {

    const {accounts} = useMsal();
    const currentUser = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    const [statusLabel, setStatusLabel] = useState();
    const [category, setCategory] = useState();
    const [index, setIndex] = useState( 0);
    const [justificationPDF, setJustificationPDF] = useState('');
    const [downloadTitle, setDownloadTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [yearlyNomination, setYearlyNomination] = useState([]);
    const [assignee, setAssignee] = useState('Unassigned');
    const [yearlyLogHistory, setYearlyLogHistory] = useState([]);
    const [totalHistCount, setTotalHistCount] = useState();
    const [linkIsValid, setLinkIsValid] = useState(false);


    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    let result;
    let resultValue;
    let comments;


    const getCurrentNominationCount = async () => {
        const response = await fetch(`${props.host}/AnnualDetailViewCountAdmin?id=${id}`);
        let data = await response.json();
        if (data[0].ANNUALDETAIL > 0) {
            setLinkIsValid(true);
            getCurrentNomination();
            getCurrentNominationBlob();
            getYearlyHistCount();
        } else {
            navigate("/");
        }
    }

    useEffect(() => {
        if (!admins.includes(currentUser)) {
            navigate("/");
        }
        getCurrentNominationCount();
    },[]);


    const getCurrentNomination = async () => {
        setIsLoading(prevValue => ++prevValue);
        const response = await fetch(`${props.host}/YearlyNomDetailsAdmin?id=${id}`);
        let data = await response.json();
        setYearlyNomination(data);
        setStatusLabel(data[0].CURRENT_STATUS);
        setCategory(data[0].NOMINATION_CATEGORY);
        setIndex(data[0].WORKFLOW_STATUS);
        setDownloadTitle(data[0].NOMINEE_NAME);
        setIsLoading(prevValue => --prevValue);
    }


    const getCurrentNominationBlob = async () => {
        const response = await fetch(`${props.host}/YearlyNomBlob?id=${id}`);
        let data = await response.json();
        setJustificationPDF(data);
    }


    const getYearlyHistCount = async () => {
        const response = await fetch(`${props.host}/getYearlyHistoryCount?id=${id}`);
        let data = await response.json();
        setTotalHistCount(data[0].COUNTRESULT);
        if (data[0].COUNTRESULT > 0) {
            setIsLoading(prevValue => ++prevValue);

            fetch(`${props.host}/YearlyLogHistory?id=${id}`).then((response) => response.json()).then((data) => setYearlyLogHistory(data));

            fetch(`${props.host}/YearlyLogDetails?id=${id}`).then((response) => response.json()).then((data) => setAssignee(data[0].ASSIGNEE_NAME));
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
            const nomineeSubject = 'You have been nominated for a Digi Annual Award!';
            const nominatorMessage = 'Your submitted Quarterly Nomination QN-' + id + ' was ' + resultValue + '.';
            const nomineeApprovalMessage = `Congratulations! You have been chosen as this Fiscal Year's recipient of the ` + category + ` Annual Award. Please email hr.livedigi.com within 72 hours of this notification for more information on claiming your award.`;


            fetch(`${props.host}/UpdateYearlyStatus?id=${id}`, {
                method: "POST", headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }, body: JSON.stringify({
                    nomID: id, nomStatus: resultValue, nomIndex: result
                })
            }).then(() => {
                axios.post(`${props.host}/YearlyLog`, {
                    qnid: qnid,
                    qnindex: result,
                    currentUserID: currentUserID,
                    logdate: logdate,
                    currentUser: currentUser,
                    logStatus: resultValue,
                    adminComments: comments
                });
            }).catch(err => {
                NotificationManager.error('Unable to update quarterly log, Contact Admin', 'ERROR: ' + err, 5000);
            });


            if (result === 5) {
                axios.get(`${props.host}/getYearlyNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        NotificationManager.success('This nomination has been successfully approved', 'SUCCESS');
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
                    }
                }).catch(err => {
                    NotificationManager.error('Connection Failed, Contact Admin', 'ERROR: ' + err, 5000);
                })
            } else if (result === 4) {
                axios.get(`${props.host}/getYearlyNominatorEmail?id=${id}`).then(resp => {
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
            }
        } else {
            window.location.reload()
        }
    }

    return (
        <>
            { admins.includes(currentUser) && <>
            {linkIsValid && <>
                {isLoading > 0 ? <LoadingSpinner style={{marginTop: "8rem"}}/> :
                    <motion.div className="container-fluid" initial={{opacity: 0}} animate={{opacity: 1}}
                                exit={{opacity: 0, transition: {duration: 0.2}}}>
                        <Row>
                            <Col md={2} className='pt-2 freeSpace'>
                                <Breadcrumb className='breadcrumb'>
                                    {yearlyNomination && yearlyNomination.map((val) => {
                                        return (
                                            <Fragment key={val.NOMINATIONS_ID}>
                                                <Breadcrumb.Item active key={val.NOMINATIONS_ID}><Link
                                                    to="/YearlyNominations">Nominations</Link> / {val.NOMINATIONS_ID}
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
                                    {yearlyNomination && yearlyNomination.map((val) => {

                                        return (
                                            <Fragment key={val.NOMINATIONS_ID}>
                                                <p><b>Nominator: </b><span
                                                    key={val.NOMINATIONS_ID}>{val.NOMINATOR_NAME}</span></p>
                                                <p><b>Nominator's Job
                                                    Title: </b><span>{val.NOMINATOR_POSITION_TITLE}</span></p>
                                                <p><b>Nominator's Department: </b><span>{val.NOMINATOR_DIVISION}</span>
                                                </p>
                                                <p><b>Nominator's Division: </b><span>{val.NOMINATOR_DIVISION}</span>
                                                </p>
                                                <p><b>Nomination Category: </b><span>{val.NOMINATION_CATEGORY}</span>
                                                </p>
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
                                {yearlyNomination && yearlyNomination.map((val) => {
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
                            <h5>Yearly Nomination History</h5>
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
                                {yearlyLogHistory?.map((val, index) => (
                                    <tr key={index}>
                                        <td>{val.YEARLYNOMINTION_LOG_ID}</td>
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
                        <p></p>
                        <NotificationContainer/>
                    </motion.div>}
                </>}

                </>
            }
        </>
    )
}

export default YearlyNominationDetails;
