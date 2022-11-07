import React from "react";
import NavigationBar from "../Organisms/NavigationBar/NavigationBar";
import Navigation from "../Atoms/Navigation/Navigation";

export const ProfileData = (props) => {

    //Server Connections
    const localHost = 'http://localhost:3001';
    const prodHost = 'https://172.21.56.32:3010';
    const testHost = 'https://172.21.56.34:3012';
    const host = localHost;

    return (
        <div id="profile-div">
            <NavigationBar mstoken={props.mstoken} userid={props.graphdata.id} host={host}/>
            <Navigation graphdata={props.graphdata} mstoken={props.mstoken} ymtoken={props.ymtoken} host={host}/>
        </div>
    );
};


