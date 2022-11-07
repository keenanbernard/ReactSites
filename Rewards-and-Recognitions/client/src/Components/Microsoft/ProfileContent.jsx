import {useMsal} from "@azure/msal-react";
import {useEffect, useState} from "react";
import {loginRequest, myMSALObj, requestObj} from "./authConfig";
import {callMsGraph} from "./graph";
import {ProfileData} from "./ProfileData";

function ProfileContent() {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [userToken, setUserToken] = useState();
    const [yammerToken, setyammerToken] = useState();

    const name = accounts[0] && accounts[0].name;

    useEffect(() => {
        RequestProfileData();
    }, [userToken, instance]);

    useEffect(() => {
        signIn();
    }, []);

    function signIn() {
        myMSALObj.loginPopup(requestObj).then(function (loginResponse) {
            //Call Yammer APIs using the token in the response
            acquireTokenPopupAndcallYammerAPI();
        }).catch(function (error) {
            //Please check the console for errors
            console.log(error);
        });
    }

    function RequestProfileData() {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };
        instance.acquireTokenSilent(request).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
            const token = response.accessToken;
            setUserToken(token);
        }).catch((e) => {
            console.log(e);
            instance.acquireTokenSilent(request).then((response) => {
                callMsGraph(response.accessToken).then(response => setGraphData(response));
                const token = response.accessToken;
                setUserToken(token);
            });
        });
    }

    function acquireTokenPopupAndcallYammerAPI() {
        //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
        myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
            const yToken = tokenResponse.accessToken;
            setyammerToken(yToken);
        }).catch(function (error) {
            // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
            // Call acquireTokenPopup(popup window)
            if (requiresInteraction(error.errorCode)) {
                myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
                    const yToken = tokenResponse.accessToken;
                    setyammerToken(yToken);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        });
    }

     const requiresInteraction = errorMessage => {
        if (!errorMessage || !errorMessage.length) {
            return false;
        }
        return (
            errorMessage.indexOf("consent_required") > -1 ||
            errorMessage.indexOf("interaction_required") > -1 ||
            errorMessage.indexOf("login_required") > -1
        );
    };

    return (
        <>
            { graphData ?
                <ProfileData graphdata={graphData} mstoken={userToken} ymtoken={yammerToken}/>
                :
                ''
            }
        </>
    );
}

export default ProfileContent;
