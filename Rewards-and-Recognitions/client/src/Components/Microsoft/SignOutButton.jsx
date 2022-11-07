import React, {useEffect, useState} from "react";
import { useMsal } from "@azure/msal-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ButtonGroup, NavDropdown, OverlayTrigger, Tooltip} from "react-bootstrap";
import {admins} from "../Pages/LandingPage/Filtered Users";
import MyProfilePhoto from "../Atoms/ProfilePhoto/MyProfilePhoto";
import "../Organisms/NavigationBar/NavigationBar.css";
import './SignOutButton.css';

function handleLogout(instance) {
    localStorage.removeItem('UserToken');
    instance.logoutRedirect().catch(e => {
        console.error(e);
    });
}

export const SignOutButton = (props) => {
    const {instance, accounts} = useMsal();
    const history = useLocation();
    const name = accounts[0] && accounts[0].name;
    const id = props.userid;
    const style = {border: '1px solid #ececec'}
    const biReport = 'https://app.powerbi.com/groups/me/reports/e96901ee-405c-4418-930b-912c92412498/ReportSection?ctid=a209cfec-d685-41c4-8e6f-4a4c0917c8ea';
    const [hidden, setHidden] = useState(true);
    const [spotlight, setSpotlight] = useState(true);
    const [quarterly, setQuarterly] = useState(true);
    const [yearly, setYearly] = useState(true);
    const [reviews, setReviews] = useState(true);

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const adminSection = async () => {
        if(admins.includes(name)){
            setHidden(false);
        } else {
            setHidden(true);
        }
    }

    // Get returned submissions
    const getUserRevisions = async () => {
        const response = await fetch(`${props.host}/myReviews?id=${id}`);
        let data = await response.json();
        if (data[0].SPOTLIGHTCOUNT > 0){
            setSpotlight(false);
            setReviews(false);
        }
        if (data[0].QUARTERLYCOUNT > 0){
            setQuarterly(false);
            setReviews(false);
        }
        if (data[0].YEARLYCOUNT > 0){
            setYearly(false);
            setReviews(false);
        }
    }

    useEffect(() => {
        adminSection();
    }, []);

    useEffect(() => {
        getUserRevisions();
    }, [history.pathname]);

    return (
        <>

            {<OverlayTrigger
                trigger={["hover", ""]}
                rootClose
                key={'left'}
                placement={'left'}
                overlay={
                    <Tooltip id={`tooltip-left`}>
                        My Account
                    </Tooltip>
                }
            >

                <NavDropdown
                    align="end" id="basic-nav-dropdown" style={style}
                    title={<MyProfilePhoto mstoken={props.mstoken}/> }>

                    <div className="mb-2">
                        {['start'].map((direction) => (

                            <NavDropdown
                                as={ButtonGroup}
                                key={direction}
                                id={`dropdown-button-drop-${direction}`}
                                drop={direction}
                                title={` My History `}
                                className='myHistory'
                            >
                              <Link to="MyRecognitions"><NavDropdown.Item as="div">My High-Fives</NavDropdown.Item></Link>
                                <NavDropdown.Divider />
                              <Link to="NominationView"><NavDropdown.Item as="div">My Nominations</NavDropdown.Item></Link>
                            </NavDropdown>
                        ))}
                    </div>

                  <div className="mb-2">
                    {['start'].map((direction) => (

                      <NavDropdown
                        as={ButtonGroup}
                        key={direction}
                        id={`dropdown-button-drop-${direction}`}
                        drop={direction}
                        title={` Reviewal `}
                        className='myHistory'
                        hidden={reviews}
                      >
                        <Link to="SpotlightReview"><NavDropdown.Item hidden={spotlight} as="div">Spotlight</NavDropdown.Item></Link>
                          {!spotlight && <NavDropdown.Divider />}
                        <Link to="QuarterlyReview"><NavDropdown.Item hidden={quarterly} as="div">Quarterly Nominations</NavDropdown.Item></Link>
                          {!yearly && <NavDropdown.Divider />}
                        <Link to="AnnualReview"><NavDropdown.Item hidden={yearly} as="div">Annual Nominations</NavDropdown.Item></Link>
                      </NavDropdown>
                    ))}
                  </div>
                    {<div className="mb-2" hidden={hidden}>
                        {['start'].map((direction) => (
                            <NavDropdown
                                as={ButtonGroup}
                                key={direction}
                                id={`dropdown-button-drop-${direction}`}
                                drop={direction}
                                title={` Admin Panel `}
                                className='adminPanel'

                            >
                                <div className="biReports" onClick={() => openInNewTab(biReport)}><NavDropdown.Item as="div">BI REPORTS</NavDropdown.Item></div>
                                    <NavDropdown.Divider />
                                <Link to="PeerToPeer"><NavDropdown.Item as="div">Digi High-Fives</NavDropdown.Item></Link>
                                    <NavDropdown.Divider />
                                <Link to="OnTheSpot"><NavDropdown.Item as="div">Digi Spotlights</NavDropdown.Item></Link>
                                    <NavDropdown.Divider />
                                <Link to="IAmDigi"><NavDropdown.Item as="div">I AM DIGI</NavDropdown.Item></Link>
                            </NavDropdown>
                        ))}
                    </div>}
                    <NavDropdown.Item onClick={() => handleLogout(instance)}>Sign Out</NavDropdown.Item>
                    <style type='text/css'>
                        #basic-nav-dropdown > div > img {

                    }
                    </style>
                </NavDropdown>
            </OverlayTrigger>}
        </>
    );
}