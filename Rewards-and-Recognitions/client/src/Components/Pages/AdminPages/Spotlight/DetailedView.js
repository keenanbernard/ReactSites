import React, {Fragment, useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom"
import {useMsal} from "@azure/msal-react";
import {Breadcrumb, Col, ListGroup, Row, Table} from "react-bootstrap";
import Select from "react-select";
import {NotificationContainer, NotificationManager} from "react-notifications";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { motion } from "framer-motion";
import StepperWorkflow from "../../../Atoms/WorkflowIndicator/StepperWorkflow";
import "./DetailedView.css";
import LoadingSpinner from "../../../Atoms/LoadingSpinner/LoadingSpinner";
import {admins} from "../../LandingPage/Filtered Users";
import { useNavigate } from "react-router-dom";


function DetailedView(props) {

    const {accounts} = useMsal();
    const currentUser = accounts[0] && accounts[0].name;

    const navigate = useNavigate();

    const [statusLabel, setStatusLabel] = useState();
    const [nominee, setNominee] = useState();
    const [nominator, setNominator] = useState();
    const [index, setIndex] = useState();
    const [justificationPDF, setJustificationPDF] = useState('');
    const [downloadTitle, setDownloadTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nomination, setNomination] = useState([]);
    const [currentApprover, setCurrentApprover] = useState('Unassigned');
    const [, setTotalSpotlightCount] = useState();
    const [spotlightLogHistory, setSpotlightLogHistory] = useState([]);
    const [totalHistCount, setTotalHistCount] = useState();
    const [linkIsValid, setLinkIsValid] = useState(false);

    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    let result;
    let resultValue;
    let comments;

    const getSpotlightCount = async () => {
        const response = await fetch(`${props.host}/getSpotlightDetailCount?id=${id}`);
        let data = await response.json();
        if (data[0].TOTALSPOTCOUNT > 0) {
            setLinkIsValid(true);
            getCurrentNomination();
            getCurrentNominationBlob();
            getSpotHistCount();
        } else {
            navigate("/");
        }
    }

    const getCurrentNomination = async () => {
        setIsLoading(prevValue => ++prevValue);
        const response = await fetch(`${props.host}/OnTheSpotDetails?id=${id}`);
        let data = await response.json();
        setNomination(data);
        setStatusLabel(data[0].CURRENTSTATUS);
        setNominee(data[0].NOMINEE_NAME);
        setNominator(data[0].NOMINATOR_NAME);
        setIndex(data[0].WORKFLOW_STATUS);
        setDownloadTitle(data[0].NOMINEE_NAME);
        setIsLoading(prevValue => --prevValue);
    }

    useEffect(() => {
        if (!admins.includes(currentUser)) {
            navigate("/");
        }
        getSpotlightCount();
    },[]);


    const getCurrentNominationBlob = async () => {
        const response = await fetch(`${props.host}/OnTheSpotDetailsBlob?id=${id}`);
        let data = await response.json();
        setJustificationPDF(data);
    }


    const getSpotHistCount = async () => {
        const response = await fetch(`${props.host}/getSpotlightHistoryCount?id=${id}`);
        let data = await response.json();
        setTotalSpotlightCount(data[0].COUNTRESULT);
        setTotalHistCount(data[0].COUNTRESULT);
        if (data[0].COUNTRESULT > 0) {
            setIsLoading(prevValue => ++prevValue);
            fetch(`${props.host}/OnTheSpotWorkFlowHistory?id=${id}`).then((response) => response.json()).then((data) => setSpotlightLogHistory(data));
            fetch(`${props.host}/SpotLightLogDetails?id=${id}`).then((response) => response.json()).then((data) => setCurrentApprover(data[0].ASSIGNEE_NAME));
            setIsLoading(prevValue => --prevValue);

        }
        setIsLoading(prevValue => --prevValue);
    }

    const items = [
      {label: 'Received', value: 'Received', id: 0},
      {label: 'Reviewing', value: 'Reviewing', id: 1},
      {label: 'Send Back', value: 'Send Back', id: 2},
      {label: 'Hold', value: 'Hold', id: 3},
      {label: 'Not Approved', value: 'Not Approved', id: 4},
      {label: 'Approved', value: 'Approved', id: 5}];

    // const preventPreviousOption = () => {
    //     for (let i = 0; i < items.length; i++) {
    //         if (items[i].id <= index) {
    //             Object.assign(items[i], {isDisabled: true});
    //         }
    //     }
    // }

    if (index === 4) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id < 4 || items[i].id > 4) {
                Object.assign(items[i], {isDisabled: true});
            }
        }
    }

    if (index === 5) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id <= 5) {
                Object.assign(items[i], {isDisabled: true});
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
            setCurrentApprover(currentUser);

            const currentUserID = props.userid;
            const logdate = new Date().toLocaleString('en-US', {hour12: false,});
            const nomineeSubject = 'You have been nominated for a Spotlight Award!';
            const nomineeApprovalMessage = `You were nominated for a DIGI Spotlight Award by ` + nominator + `. Your nomination has been reviewed and approved. Please email hr@livedigi.com within 72 hours of this notification for more information on claiming your award.`;
            const nominatorSubject = 'Approval Status of SN-' + id;
            const nominatorSendBackMessage = 'The following DIGI Spotlight Award nomination has been sent back for your revision. Note comments below for your action. Navigate to the REVIEWAL section of the portal to modify your submission. Please re-submit nomination within 72 hours of this notification to avoid nomination being dismissed';
            const nominatorApprovalMessage = 'Your DIGI Spotlight Award nomination for ' + nominee + ' has been reviewed and approved.';
            const nominatorDeclinedMessage = 'Your DIGI Spotlight Award nomination for ' + nominee + ' has been reviewed and is declined. Please note comments below.';
            const hrSendBackMessage = 'A DIGI Spotlight Award nomination for ' + nominee + ' has been re-submitted for your review and approval.';

            axios.post(`${props.host}/SpotlightLog`, {
                sid: id,
                index: result,
                currentUserID: currentUserID,
                logdate: logdate,
                currentUser: currentUser,
                updatedStatus: resultValue,
                adminComments: comments
            }).then(() => {
                console.log('SUCCESS');
            }).catch(err => {
                NotificationManager.error('Unable to update spotlight log, Contact Admin', 'ERROR: ' + err, 5000);
            });

            if (result === 5) {
                axios.get(`${props.host}/getSpotlightNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NTEMAIL,
                            peerMessage: nominatorApprovalMessage,
                            subject: nominatorSubject
                        })
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NEEMAIL,
                            peerMessage: nomineeApprovalMessage,
                            subject: nomineeSubject
                        })
                    }
                }).catch(err => {
                    NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                })
            } else if (result === 4) {
                axios.get(`${props.host}/getSpotlightNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NTEMAIL,
                            peerMessage: nominatorDeclinedMessage,
                            subject: nominatorSubject
                        })
                    }
                }).catch(err => {
                    NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                })
            } else if (result === 2) {
                axios.get(`${props.host}/getSpotlightNominatorEmail?id=${id}`).then(resp => {
                    if (resp.status === 200) {
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: resp.data[0].NTEMAIL,
                            peerMessage: nominatorSendBackMessage,
                            subject: nominatorSubject
                        })
                        axios.post(`${props.host}/EmailNotification`, {
                            recieverEmail: 'hrdept@livedigi.com',
                            peerMessage: hrSendBackMessage,
                            subject: nominatorSubject
                        })
                    }
                }).catch(err => {
                    NotificationManager.error('Unable to send Email, Contact Admin', 'ERROR: ' + err, 5000);
                })
            }
        } else {
            window.location.reload()
        }
    }

    const updateOnTheSpotStatus = () => {
        console.log('Update on The Spot Status function running...')

        fetch(`${props.host}/updateOnTheSpotStatus?id=${id}`, {
            method: "POST",  headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }, body: JSON.stringify({
                onTheSpotId: id, updatedStatus: statusLabel, indexValue: index
            })
        }).then((response) => {
            console.log('Response: ' , response);
        }).catch(err => {
            console.log('Error:', err);
        });
    } ;

    useEffect(() => {
        updateOnTheSpotStatus();
    }, [index, statusLabel]);


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
                                      {nomination && nomination.map((val) => {
                                          return (
                                              <Fragment key={val.ON_THE_SPOT_ID}>
                                                  <Breadcrumb.Item active key={val.ON_THE_SPOT_ID}><Link
                                                      to="/OnTheSpot">Nominations</Link> / {val.ON_THE_SPOT_ID}
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
                                      {nomination && nomination.map((val) => {

                                          return (
                                              <Fragment key={val.ON_THE_SPOT_ID}>
                                                  <p><b>Nominator: </b><span
                                                      key={val.ON_THE_SPOT_ID}>{val.NOMINATOR_NAME}</span>
                                                  </p>
                                                  <p><b>Nominator's Job
                                                      Title: </b><span>{val.NOMINATOR_POSITION_TITLE}</span></p>
                                                  <p><b>Nominator's Department: </b><span>{val.NOMINATOR_DIVISION}</span>
                                                  </p>
                                                  <p><b>Nominator's Division: </b><span>{val.NOMINATOR_DIVISION}</span></p>
                                                  <p><b>Nominator's Comments: </b><span>{val.COMMENTS}</span></p>
                                                  <p><b>Nominee: </b><span>{val.NOMINEE_NAME}</span></p>
                                                  <p><b>Nominated On: </b><span>{val.DATE_CREATED}</span></p>
                                                  <p><b>Assignee: </b><span>{currentApprover}</span></p>
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
                                  {nomination && nomination.map((val) => {
                                      return (
                                          <Fragment key={val.ON_THE_SPOT_ID}>
                                              <Select
                                                  name='options'
                                                  components={animatedComponents}
                                                  options={items}
                                                  onChange={handleChange}
                                                  placeholder={val.CURRENTSTATUS}
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
                              <h5>Spotlight History</h5>
                              <Table bordered hover responsive style={{backgroundColor: "white"}}>
                                  <thead className='tableHeading'>
                                  <tr>
                                      <th>LOG ID</th>
                                      <th>REPRESENTATIVE</th>
                                      <th>STATUS</th>
                                      <th>DATE REVIEWED</th>
                                      <th>DATE UPDATED</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {spotlightLogHistory?.map((val, index) => (
                                      <tr key={index}>
                                          <td>{val.SPOTLIGHT_LOG_ID}</td>
                                          <td>{val.ASSIGNEE_NAME}</td>
                                          <td>{val.WORKFLOW_STATUS}</td>
                                          <td>{val.DATE_FROM}</td>
                                          <td>{val.DATE_TO}</td>
                                      </tr>
                                  ))}
                                  </tbody>
                              </Table>
                              {totalHistCount < 1 &&
                                  <p className='noDepartment'>No changes have been logged for this nomination</p>}
                          </Row>
                          <NotificationContainer/>
                          <p></p>
                      </motion.div>}

              </>} </>
          }
      </>
    )
}

export default DetailedView;
