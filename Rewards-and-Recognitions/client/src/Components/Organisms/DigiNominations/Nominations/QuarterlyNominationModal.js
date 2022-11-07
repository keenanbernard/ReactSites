import {Button, FloatingLabel, Form, Modal, Row, Col} from "react-bootstrap";
import React, {useState, useEffect} from 'react';
import Select from "react-select";
import {useMsal} from "@azure/msal-react";
import {NotificationManager} from "react-notifications";
import axios from "axios";
import './NominationModals.css';
import quarterlyBanner from "./Nomination Images/Digi RR Quarterly.png";
import FormCategories from "./FormCategories/FormCategories";
import MessageDetails from "./FormCategories/MessageDetails";

function QuarterlyNomination(props) {
    const {accounts} = useMsal();
    const name = accounts[0] && accounts[0].name;
    const [users, setUsers] = useState([]);
    const [salesP, setSalesP] = useState(true);
    const [creditP, setCreditP] = useState(true);

    useEffect(() => {
        setUsers(props.graphuser);
        setSalesP(props.sales);
        setCreditP(props.credit);
        getDivision();
    }, [props.graphuser, props.sales, props.credit]);


    // Set Insert Information
    const [, setInputValue] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [division, setDivision] = useState('');
    const [nomComment, setNomComment] = useState('');
    const [fileData, setFileData] = useState();
    const [valueCategory, setValueCategory] = useState('');

    // Get user division
    const getDivision = async () => {
        const response = await fetch(`${props.host}/getDivision?id=${props.graphdata.id}`);
        let data = await response.json();
        setDivision(data[0].DIVISION);
    }

    // Only if Submit Spotlight is disabled in console.
    const [selectedValueIsInvalidOnSub, setSelectedValueIsInvalidOnSub] = useState(false);
    const [nomCommentIsInvalidOnSub, setNomCommentIsInvalidOnSub] = useState(false);
    const [fileDataIsInvalidOnSub, setFileDataIsInvalidOnSub] = useState(false);
    const [nominationCategoryIsInvalidOnSub, setNominationCategoryIsInvalidOnSub] = useState(false);
    const [commentSizeIsInvalidOnSub, setCommentSizeIsInvalidOnSub] = useState(false);

    // Form Validation
    const quarterlyNomineeIsValid = selectedValue !== '';
    const nominationCategoryIsValid = valueCategory !== '';
    const nominatorCommentIsValid = nomComment.trim() !== '';
    const justificationFileIsValid = fileData !== undefined;
    const commentSizeIsValid = nomComment.length < 161;

    // Limit Application Size and File Type
    const [fileTypeAccepted, setFileTypeAccepted] = useState(true);
    const [fileSizeAccepted, setFileSizeAccepted] = useState(true);

    let formIsInvalid = true;

    if (quarterlyNomineeIsValid && nominationCategoryIsValid && nominatorCommentIsValid && justificationFileIsValid && fileTypeAccepted && fileSizeAccepted && commentSizeIsValid) {
        formIsInvalid = false;
    }

    // Handle Input Change
    const handleInputChange = value => {
        setInputValue(value);
    }

    // Handle Direct Report Selection
    const quarterlyNomineeChangeHandler = value => {
        setSelectedValue(value);
        setSelectedValueIsInvalidOnSub(false);
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

    // Get & Set Value of Radio Button Clicked
    const getNominationCategory = (event) => {
        setNominationCategoryIsInvalidOnSub(false);
        setValueCategory(event.target.value);
    }

    const nomineedepartment = 'Engineering';
    const nomineedivision = 'COO';
    const qcreated = new Date().toLocaleString('en-US', {hour12: false,});
    const qacat = valueCategory;

    let nomineeEmail = null;

    if (selectedValue !== null) {
        nomineeEmail = selectedValue.mail;
    }

    const getNominations = (event) => {
        event.preventDefault();
        let nomDiv;
        let nomDept;

        const subject = 'Digi Quarterly Awards!'
        const currenUserEmail = props.graphdata.mail;
        const hrMessage = 'A ' + qacat + ' nomination for ' + selectedValue.displayName + ' has been submitted for review.';
        const currentUserMessage = 'Thank you for nominating ' + selectedValue.displayName + ' for the ' + qacat + ' award. Your nomination has been submitted to the Employee Recognition Committee for review.';
        const nomineeMessage = `We are excited to announce that you have been nominated by ` + name + ` for this Quarter Year''s ` + qacat + ` Quarterly Award. Winners will be announced on the I AM DIGI Recognition Portal.`;

        if (!quarterlyNomineeIsValid) setSelectedValueIsInvalidOnSub(true);

        if (!nominationCategoryIsValid) setNominationCategoryIsInvalidOnSub(true);

        if (!nominatorCommentIsValid) setNomCommentIsInvalidOnSub(true);

        if (!justificationFileIsValid) setFileDataIsInvalidOnSub(true);

        if (!commentSizeIsValid) setCommentSizeIsInvalidOnSub(true)

        if (!quarterlyNomineeIsValid || !nominatorCommentIsValid || !justificationFileIsValid || !nominationCategoryIsValid || !commentSizeIsValid ) return;

        fetch(`${props.host}/getDivision?id=${selectedValue.id}`)
            .then((response) => response.json())
            .then((data) => {
                nomDiv = data[0].DIVISION;
                nomDept = data[0].DEPARTMENT;
            }).then(() => {
            fetch(`${props.host}/InsertQuarterlyNominations`, {
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
                    nomineeid: selectedValue.id,
                    nomineename: selectedValue.displayName,
                    nomineepositiontitle: selectedValue.jobTitle,
                    nomineedepartment: nomDept,
                    nomineedivision: nomDiv,
                    comment: nomComment,
                    justifications: fileData,
                    currentstatus: 'Received',
                    dateCreated3: qcreated,
                    workflowstatus: 0,
                    qacat: qacat
                })
            }).then((response) => {
                if (response.status === 200) {
                    NotificationManager.success('You have successfully sent a Digi Quarterly Nomination', 'SUCCESS');
                    axios.post(`${props.host}/EmailNotification`, {recieverEmail: nomineeEmail,  peerMessage: nomineeMessage, subject: subject
                    }).then(() => {
                        axios.post(`${props.host}/EmailNotification`, {recieverEmail: currenUserEmail,  peerMessage: currentUserMessage, subject: subject })
                    }).then(() => {
                        axios.post(`${props.host}/EmailNotification`, {recieverEmail: 'hrdept@livedigi.com',  peerMessage: hrMessage, subject: subject })
                    }).catch(err=>{
                        NotificationManager.error('Unable to send Quarterly Notification, Contact Admin', 'ERROR: ' + err, 5000);
                    })
                }
            }).catch(err => {
                NotificationManager.error('Unable to send Quarterly Nomination, Contact Admin', 'ERROR: ' + err, 5000);
            });
        }).catch(err => {
            NotificationManager.error('Unable to connect, Contact Admin', 'ERROR: ' + err, 5000);
        })

        setInputValue(null);
        setNomComment('');
        setFileData(undefined);
        setSelectedValue('');
        setValueCategory('');
    }

    // Nomination Categories
    const digiChampion = 'Digi Champion';
    const digiCustomerFirst = 'Digi Customer First';
    const digiInnovation = 'Digi Innovation';
    const digiFiveStarHonors = 'Digi Five Star Honors';
    const digiSalesFrontrunner = 'Digi Sales Frontrunner';
    const digiCreditExcellence = 'Digi Credit Excellence';

    // Apply error classes conditionally
    const quarterlyNomineeSel = selectedValueIsInvalidOnSub ? 'p-copy-sel errorBorder' : 'lp-copy-sel';
    const commentsFilled = nomCommentIsInvalidOnSub ? 'errorBorder' : '';
    const fileUploaded = fileDataIsInvalidOnSub ? 'mb-2 errorBorder' : 'mb-2';
    const fileSize = nomComment.length >= 160 ? 'mt-1 mb-0 error-text' : 'mt-1 mb-0 normalText';

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header className='quarterlyBanner' style={{padding: 0}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <img className='' src={quarterlyBanner} alt={'Quarterly Awards'} style={{width: '100%'}} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={12}>
                        <div>
                            <p className='text-muted nomTextInfo'>Hi, {props.graphdata.displayName}. When you submit this form, HR will be notified of this nomination. <span className='error-text'>All fields are required to submit.</span></p>

                            <p style={{fontWeight: "bold"}}>Select the co-worker you are nominating. </p>
                            <Select
                                placeholder='Select Nominee'
                                value={selectedValue}
                                classNamePrefix={quarterlyNomineeSel}
                                getOptionLabel={e=> e.displayName}
                                getOptionValue={e=> e.id}
                                onInputChange={handleInputChange}
                                onChange={quarterlyNomineeChangeHandler}
                                options={users && users}
                            />
                            {selectedValueIsInvalidOnSub && <p className='mt-1 mb-0 error-text'>Direct Report must be selected</p>}
                        </div>
                        <div className='userCardSpacing' />

                        <FormCategories type='radio' id='CorporateBehaviors' name='corporateCategories' corpTrait={digiChampion} message=' - Promotes and demonstrate corporate behaviors that support individual, groups, divisions, and departments in achieving the Company’s mission, vision, and values' value={digiChampion} onChange={getNominationCategory} />

                        <FormCategories type='radio' id='CustomerService' name='corporateCategories' corpTrait={digiCustomerFirst} message=' - Exemplifies a “customer first” mindset daily; demonstrating excellence in service and support provided to internal/external customers' value={digiCustomerFirst} onChange={getNominationCategory} />

                        <FormCategories type='radio' id='ProcessImprovement' name='corporateCategories' corpTrait={digiInnovation} message=' - Applied valuable ideas/approaches/solutions to develop new or improved processes, methods, systems, programs or services which resulted in monetary savings or significant operational efficiencies' value={digiInnovation} onChange={getNominationCategory} />

                        <FormCategories type='radio' id='Leadership' name='corporateCategories' corpTrait={digiFiveStarHonors} message=' - Exemplifies excellence in leadership involving people, events, programs, projects and/or teams. Significant leadership skills such as the ability to lead and guide staff, develop staff talents and successfully manage an efficient and effective department at the highest level' value={digiFiveStarHonors} onChange={getNominationCategory} />

                        <FormCategories hidden={salesP.hiddenSales} type='radio' id='Sales' name='corporateCategories' corpTrait={digiSalesFrontrunner} message=' - Met and exceeded sales targets for quarter by the highest percentile.' value={digiSalesFrontrunner} onChange={getNominationCategory} />

                        <FormCategories hidden={creditP.hiddenCredit} type='radio' id='Collections' name='corporateCategories' corpTrait={digiCreditExcellence} message=' - Met and exceeded collection targets for quarter by the highest percentile.' value={digiCreditExcellence} onChange={getNominationCategory} />

                        <MessageDetails messageResults={valueCategory} />

                        {nominationCategoryIsInvalidOnSub && <p className='mt-1 error-text'>A category must be selected</p>}

                        <FloatingLabel controlId="floatingTextarea2" label="Custom Message">
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
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <form onSubmit={getNominations}>
                    <Button disabled={formIsInvalid} id='otsSubmitBtn' type='submit' className='submitPeerToPeer' variant="danger"  onClick={props.onHide}>Submit</Button>
                </form>
            </Modal.Footer>
        </Modal>
    )
}

export default QuarterlyNomination;
