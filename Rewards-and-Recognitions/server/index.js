const express = require('express');
const https = require('https')
const app = express();
const cors = require('cors');
const oracledb = require('oracledb');
const fs = require('fs');
const bodyParser = require("body-parser");
const {json} = require("express");


app.use(cors());
app.use( bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({
    limit: '30mb',
    extended: true
}));

let connection;

if (process.platform === 'darwin') {
    try {
        oracledb.initOracleClient({libDir: process.env.HOME + '/Downloads/instantclient_19_8'});
    } catch (err) {
        console.log(err);
    }
}

const hrSchema = {user: 'REWARDS_ADMIN', password: 'R3Ward5', connectionString: '172.21.56.30/HRRWRDS_DEV'};
const midwareSchema = {user: 'midware', password: 'midware', connectionString: '172.21.56.30/mdlw_dev'};
const midwareTestSchema = {user: 'midware', password: 'midware', connectionString: '172.21.56.33/mdlw_tst'};
/*const options = {pfx: fs.readFileSync('C:\\BTLcerts\\star_belizetelemedia_net_2023_3.pfx'), passphrase: 'password'};
var httpsServer = https.createServer(options, app);*/

app.listen(3001, () => {
    console.log('Success... Server Running');
});

/*httpsServer.listen(3003);*/
// *************************************** GET DATA QUERIES  ***************************************

// Get Count of Current Users given and received PEER TO PEER Recognitions
async function getMyHighFives (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALHIGHFIVES FROM PEER_TO_PEER ptp WHERE ptp.SENDERID=:id OR ptp.RECEIVERID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getMyHighFives', function (req, res) {
    //get query by id
    let id = req.query.id;

    getMyHighFives(req, res, id).then(() => {
        console.log(res.data);
    });
});



// Get Count of Current Users given and received PEER TO PEER Recognitions
async function myRecognitionHistory (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT  
            (SELECT count(*)FROM PEER_TO_PEER ptp WHERE ptp.SENDERID=:id) AS SENT,
            (SELECT count(*) FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id) AS RECEIVED 
            FROM PEER_TO_PEER ptp FETCH NEXT 1 ROWS ONLY`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/myRecognitionHistory', function (req, res) {
    //get query by id
    let id = req.query.id;

    myRecognitionHistory(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get all Departments for Filters
async function getAllDepartmentsHR (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT * FROM USER_DEPARTMENTS ORDER BY DEPARTMENT`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        // console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getAllDepartmentsHR', function (req, res) {
    getAllDepartmentsHR(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Count of Current Users given and received PEER TO PEER Recognitions
async function myReviews (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT
(SELECT count(*) FROM ON_THE_SPOT ots WHERE ots.CURRENTSTATUS = 'Send Back' AND ots.NOMINATOR_ID=:id) AS SPOTLIGHTCOUNT, 
(SELECT count(*) FROM QUARTERLY_NOMINATIONS qn WHERE qn.current_status = 'Send Back' AND qn.NOMINATOR_ID=:id) AS QUARTERLYCOUNT, 
(SELECT count(*)  FROM YEARLY_NOMINATIONS yn WHERE yn.current_status = 'Send Back' AND yn.NOMINATOR_ID=:id) AS YEARLYCOUNT
FROM USERS u WHERE u.USERID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/myReviews', function (req, res) {
    //get query by id
    let id = req.query.id;

    myReviews(req, res, id).then(() => {
        console.log(res.data);
    });
});


//Get User Division
async function getDivision (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT u.DIVISION, u.DEPARTMENT FROM users u WHERE u.USERID =:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getDivision', function (req, res) {
    //get query by id
    let id = req.query.id;

    getDivision(req, res, id).then(() => {
        console.log(res.data);
    });
});


// ******************* Digi HIGH-FIVES  *******************
// Get ALL Digi HIGH-FIVES
async function getRecentDigiHighFives (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT p2p.PEERTOPEERID, p2p.SENDERID, p2p.RECEIVERID, p2p.MESSAGE AS SENDERMESSAGE, p2p.PEERCARDID, users.USERID, users.GIVENNAME AS SENDERGIVENNAME, users.SURNAME AS SENDERSURNAME, USERSREC.GIVENNAME AS RECEIVERGIVENNAME, USERSREC.SURNAME AS RECEIVERSURNAME FROM peer_to_peer p2p JOIN peer_cards pc on p2p.peercardid = pc.peercardid JOIN USERS users ON p2p.SENDERID = users.USERID JOIN USERS USERSREC ON p2p.RECEIVERID = USERSREC.USERID ORDER BY p2p.PEERTOPEERID desc FETCH NEXT 15 ROWS ONLY`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}


app.get('/RecentActivities', function (req, res) {
    getRecentDigiHighFives(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Count of Current Users given and received Digi HIGH-FIVES
async function myDigiHighFives (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT  
            (SELECT count(*)FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id AND ptp.PEERCARDID = 1) AS peerone,
            (SELECT count(*) FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id AND ptp.PEERCARDID = 2) AS peertwo ,
            (SELECT count(*)FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id AND ptp.PEERCARDID = 3) AS peerthree,
            (SELECT count(*)FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id AND ptp.PEERCARDID = 4) AS peerfour,
            (SELECT count(*)FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id AND ptp.PEERCARDID = 5) AS peerfive,
            (SELECT count(*)FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id AND ptp.PEERCARDID = 6) AS peersix
            FROM PEER_TO_PEER ptp FETCH NEXT 1 ROWS ONLY`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/myRecognitionCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    myDigiHighFives(req, res, id).then(() => {
        console.log(res.data);
    });
});



// Get Current User's Digi HIGH-FIVES
async function getTotalHighFives (req, res) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS TOTALHIGHFIVES FROM PEER_TO_PEER ptp`,
          [],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getTotalHighFives', function (req, res) {
    //get query by id

    getTotalHighFives(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Current Users Digi HIGH-FIVES counts
async function getDigiHighFiveCounts (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALPEERCARDS FROM PEER_TO_PEER ptp WHERE ptp.SENDERID=:id OR ptp.RECEIVERID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getDigiHighFiveCounts', function (req, res) {
    //get query by id
    let id = req.query.id;

    getDigiHighFiveCounts(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Current Users Digi HIGH-FIVES counts Received
async function getDigiHighFiveCountsReceived (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALHIGHFIVESREC FROM PEER_TO_PEER ptp WHERE ptp.RECEIVERID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getDigiHighFiveCountsReceived', function (req, res) {
    //get query by id
    let id = req.query.id;

    getDigiHighFiveCountsReceived(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Current Users Digi HIGH-FIVES
async function getDigiHighFives (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT p2p.PEERTOPEERID, TO_CHAR(TO_DATE(p2p.DATECREATED, 'MM-DD-YYYY HH24:MI:SS'),'DD Mon YYYY') AS DATECREATED, pc.CARDNAME, users.DISPLAYNAME AS SENDERDISPLAYNAME, USERSREC.DISPLAYNAME AS RECEIVERDISPLAYNAME FROM peer_to_peer p2p JOIN peer_cards pc on p2p.peercardid = pc.peercardid JOIN USERS users ON p2p.SENDERID = users.USERID JOIN USERS USERSREC ON p2p.RECEIVERID = USERSREC.USERID WHERE senderid=:id OR p2p.receiverid=:id ORDER BY p2p.PEERTOPEERID DESC`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/UserPeerToPeer', function (req, res) {
    //get query by id
    let id = req.query.id;

    getDigiHighFives(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Total Peer To Peer Count for HR
async function HighFiveCount (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALHIGHFIVE FROM PEER_TO_PEER ptp`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/HighFiveCount', function (req, res) {

    HighFiveCount(req, res).then(() => {
        console.log(res.data);
    });
});


// Get all Digi HIGH-FIVES HR View
async function getDigiHighFivesHR (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT TO_CHAR(TO_DATE(p2p.DATECREATED, 'MM-DD-YYYY HH24:MI:SS'),'DD Mon YYYY') AS DATECREATED, pc.CARDNAME, users.DEPARTMENT, users.DISPLAYNAME AS SENDERDISPLAYNAME, USERSREC.DISPLAYNAME AS RECEIVERDISPLAYNAME FROM peer_to_peer p2p JOIN peer_cards pc on p2p.peercardid = pc.peercardid JOIN USERS users ON p2p.SENDERID = users.USERID JOIN USERS USERSREC ON p2p.RECEIVERID = USERSREC.USERID ORDER BY p2p.PEERTOPEERID DESC`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        // console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getAllPeerToPeer', function (req, res) {
    getDigiHighFivesHR(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Current Users Digi HIGH-FIVES Details for Modal
async function getUserDigiHighFivesDetail (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT p2p.MESSAGE AS SENDERMESSAGE, TO_CHAR(TO_DATE(p2p.DATECREATED, 'MM-DD-YYYY HH24:MI:SS'),'DD Mon YYYY') AS DATECREATED,  pc.PEERCARDID, pc.CARDNAME, users.DEPARTMENT, users.DISPLAYNAME AS SENDERDISPLAYNAME, USERSREC.DISPLAYNAME AS RECEIVERDISPLAYNAME FROM peer_to_peer p2p JOIN peer_cards pc on p2p.peercardid = pc.peercardid JOIN USERS users ON p2p.SENDERID = users.USERID JOIN USERS USERSREC ON p2p.RECEIVERID = USERSREC.USERID WHERE p2p.PEERTOPEERID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getUserRecognitionDetail', function (req, res) {
    //get query by id
    let id = req.query.id;

    getUserDigiHighFivesDetail(req, res, id).then(() => {
        console.log(res.data);
    });
});


// ******************* Spotlight  *******************
// Get Spotlight count for nominee
async function SpotLightCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT count(*) AS spotlights FROM ON_THE_SPOT ots WHERE ots.NOMINEE_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotLightCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    SpotLightCount(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get All Send Back count for spotlight nominations for individual nominator
async function SpotlightReviewCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS TOTALREVIEWALS FROM ON_THE_SPOT ots WHERE ots.NOMINATOR_ID=:id AND ots.CURRENTSTATUS = 'Send Back'`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotlightReviewCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    SpotlightReviewCount(req, res, id).then(() => {
        console.log(res.data);
    });
});



// Get All Send Back spotlight nominations for individual manager
async function SpotLightNominationSendBack (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT ots.ON_THE_SPOT_ID, ots.NOMINEE_NAME, TO_CHAR(TO_DATE(DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED FROM ON_THE_SPOT ots WHERE NOMINATOR_ID =:id AND CURRENTSTATUS = 'Send Back'`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotLightNominationSendBack', function (req, res) {
    //get query by id
    let id = req.query.id;

    SpotLightNominationSendBack(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Updates Spotlight Nominations Send Back details
async function updateOnTheSpotDetailSendBack (req, res) {

    // const currentUserID = req.body.currentUserID;
    const spotlightID = req.body.updateSpotlight;
    const justifications = Buffer.from(req.body.justificationFile);
    const comment = req.body.commentValue;
    const status = req.body.status;
    const workflow = req.body.workflow;

    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');
        console.log('DATA:', comment);

        var result = await connection.execute(
          `UPDATE REWARDS_ADMIN.ON_THE_SPOT SET COMMENTS = :a, JUSTIFICATION = :b, CURRENTSTATUS = :c, WORKFLOW_STATUS = :d WHERE ON_THE_SPOT_ID = :e`,
          {
              a: comment,
              b: justifications,
              c: status,
              d: workflow,
              e: spotlightID
          },{autoCommit: true});

        connection.commit();


        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/spotlightResubmission', function (req, res) {

    updateOnTheSpotDetailSendBack(req, res).then(() => {
        console.log(req.body);
    });
});


// Get All Send Back spotlight nominations for individual manager
async function SpotLightNomSendBackDetail (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT ots.ON_THE_SPOT_ID, ots.NOMINEE_NAME, ots.CURRENTSTATUS, TO_CHAR(TO_DATE(DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED FROM ON_THE_SPOT ots WHERE NOMINATOR_ID =:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotLightNomSendBackDetail', function (req, res) {
    //get query by id
    let id = req.query.id;

    SpotLightNomSendBackDetail(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Total Spotlight Count for HR
async function SpotlightCountAdmin (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALSPOTLIGHTS FROM ON_THE_SPOT ots`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotlightCountAdmin', function (req, res) {

    SpotlightCountAdmin(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Individual Spotlight Nominations HR
async function getOnTheSpotRecognitions (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT ON_THE_SPOT_ID, TO_CHAR(TO_DATE(DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED, NOMINATOR_NAME, NOMINEE_NAME, NOMINATOR_DEPARTMENT, CURRENTSTATUS FROM ON_THE_SPOT ots ORDER BY ON_THE_SPOT_ID DESC`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}


app.get('/OnTheSpot', function (req, res) {
    getOnTheSpotRecognitions(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Count for Spotlight Detailed View
async function getSpotlightDetailCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS TOTALSPOTCOUNT FROM ON_THE_SPOT ots WHERE ots.ON_THE_SPOT_ID=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getSpotlightDetailCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    getSpotlightDetailCount(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get count for Spotlight Detailed View for valid ID and status is send back
async function SpotlightReviewDetailCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS SPOTLIGHTSENTBACK FROM ON_THE_SPOT ots WHERE ots.ON_THE_SPOT_ID=:id AND ots.CURRENTSTATUS = 'Send Back' `,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotlightReviewDetailCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    SpotlightReviewDetailCount(req, res, id).then(() => {
        console.log(res.data);
    });
});




// Get selected Spotlight Nomination
async function OnTheSpotDetails (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT ots.ON_THE_SPOT_ID, ots.NOMINATOR_ID, ots.NOMINATOR_NAME, ots.NOMINATOR_POSITION_TITLE, ots.NOMINATOR_DEPARTMENT, ots.NOMINATOR_DIVISION, ots.NOMINEE_ID, ots.NOMINEE_NAME, ots.NOMINEE_POSITION_TITLE, ots.NOMINEE_DEPARTMENT, ots.NOMINEE_DIVISION, ots.COMMENTS, ots.CURRENTSTATUS, ots.WORKFLOW_STATUS, ots.DATE_CREATED FROM ON_THE_SPOT ots WHERE ots.ON_THE_SPOT_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/OnTheSpotDetails', function (req, res) {
    //get query by id
    let id = req.query.id;

    OnTheSpotDetails(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Spotlight Log Details
async function SpotLightLogDetails (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT SPOTLIGHT_LOG_ID, ASSIGNEE_NAME FROM SPOTLIGHT_LOG sl WHERE sl.SPOTLIGHT_ID=:id ORDER BY sl.SPOTLIGHT_LOG_ID DESC FETCH NEXT 1 ROWS ONLY`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/SpotLightLogDetails', function (req, res) {
    //get query by id
    let id = req.query.id;

    SpotLightLogDetails(req, res, id).then(() => {
        console.log(res.data);
    });
});

// Get Count of Yearly Nomination Log History
async function getSpotlightHistoryCount(req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS COUNTRESULT FROM SPOTLIGHT_LOG sl WHERE sl.SPOTLIGHT_ID=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getSpotlightHistoryCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    getSpotlightHistoryCount(req, res, id).then(() => {
        console.log(res.data);
    });
});



// Get JUSTIFICATION BLOB FROM Spotlight Nomination
async function OnTheSpotDetailsBlob (req, res, id) {

    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        oracledb.fetchAsBuffer = [ oracledb.BLOB ];

        var result = await connection.execute(
          `SELECT JUSTIFICATION FROM ON_THE_SPOT ots WHERE ots.ON_THE_SPOT_ID=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            const b = Buffer.from(result.rows[0].JUSTIFICATION);
            res.json(b.toString());
        }
    }
}

app.get('/OnTheSpotDetailsBlob', function (req, res) {
    //get query by id
    let id = req.query.id;

    OnTheSpotDetailsBlob(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Spotlight LOG History
async function OnTheSpotWorkFlowHistory (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT sl.SPOTLIGHT_LOG_ID, sl.ASSIGNEE_NAME, sl.DATE_FROM, sl.DATE_TO, sl.WORKFLOW_STATUS, sl.COMMENTS FROM SPOTLIGHT_LOG sl WHERE sl.SPOTLIGHT_ID=:id ORDER BY sl.SPOTLIGHT_LOG_ID DESC`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/OnTheSpotWorkFlowHistory', function (req, res) {
    //get query by id
    let id = req.query.id;

    OnTheSpotWorkFlowHistory(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Count of Current Users Spotlight Nominations
async function getSpotlightNomineeCount (req, res, id) {

    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT count(*) AS COUNTRESULT FROM SPOTLIGHT_NOMINATION sn WHERE sn.SPOTLIGHT_NOMINEE=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log('THE ID: ', id);


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getSpotlightNomineeCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    getSpotlightNomineeCount(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Nominator Email for Spotlight Awards
async function getSpotlightNominatorEmail (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT u.MAIL AS NTEMAIL, (SELECT u.MAIL AS NTEMAIL FROM USERS u, ON_THE_SPOT ots WHERE u.DISPLAYNAME  = ots.NOMINEE_NAME  AND ots.ON_THE_SPOT_ID=:id) AS NEEMAIL FROM USERS u, ON_THE_SPOT ots WHERE u.USERID = ots.NOMINATOR_ID AND ots.ON_THE_SPOT_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getSpotlightNominatorEmail', function (req, res) {
    //get query by id
    let id = req.query.id;

    getSpotlightNominatorEmail(req, res, id).then(() => {
        console.log(res.data);
    });
});


// ******************* Quarterly Nominations  *******************

// Get Total QuarterlyNominations Count for HR
async function QuarterlyNominationCount (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALQUARTNOMS FROM QUARTERLY_NOMINATIONS qn`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyNominationCount', function (req, res) {

    QuarterlyNominationCount(req, res).then(() => {
        console.log(res.data);
    });
});



// Get Individual Quarterly Nominations HR
async function getQuarterlyNominations (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT NOMINATIONS_ID, TO_CHAR(TO_DATE(DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED, NOMINATOR_NAME, NOMINEE_NAME, NOMINATOR_DEPARTMENT, CURRENT_STATUS, WORKFLOW_STATUS FROM QUARTERLY_NOMINATIONS qn ORDER BY NOMINATIONS_ID DESC`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}


app.get('/QuartelyNominations', function (req, res) {
    getQuarterlyNominations(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Current User's Quarterly Nominations
async function getUserQuartNomCounts (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS USERQUARTNOMS FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATOR_ID=:id OR qn.NOMINEE_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getUserQuartNomCounts', function (req, res) {
    //get query by id
    let id = req.query.id;

    getUserQuartNomCounts(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Current Users Quarterly Nominations
async function getUserQuarterlyNominations (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT qn.NOMINATIONS_ID, TO_CHAR(TO_DATE(qn.DATE_CREATED , 'MM-DD-YYYY HH24:MI:SS'), 'DD Mon YYYY') AS DATECREATED, qn.CURRENT_STATUS, qn.NOMINATION_CATEGORY, users.DISPLAYNAME AS SENDERDISPLAYNAME, USERSREC.DISPLAYNAME AS RECEIVERDISPLAYNAME FROM QUARTERLY_NOMINATIONS qn JOIN USERS users ON qn.NOMINATOR_ID = users.USERID JOIN USERS USERSREC ON qn.NOMINEE_NAME = USERSREC.DISPLAYNAME WHERE qn.NOMINATOR_ID =:id OR qn.NOMINEE_id =:id ORDER BY qn.NOMINATIONS_ID DESC`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/UserQuarterlyNom', function (req, res) {
    //get query by id
    let id = req.query.id;

    getUserQuarterlyNominations(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Count of Quarterly Nomination Log History
async function getQuarterlyHistoryCount(req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS COUNTRESULT FROM QUARTERLYNOMINTION_LOG ql  WHERE ql.QUARTERLYNOMINTION_ID=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getQuarterlyHistoryCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    getQuarterlyHistoryCount(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Quarterly nominations Reviewal count for Nominations ID and Status is Send Back
async function QuarterlyReviewDetailCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALQUARTERLY FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATIONS_ID=:id AND qn.CURRENT_STATUS = 'Send Back'`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyReviewDetailCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyReviewDetailCount(req, res, id).then(() => {
        console.log(res.data);
    });
});



// Get Count for Quarterly Nominations Detailed View Admin Panel
async function QuarterlyDetailViewCountAdmin (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS QUARTERLYDETAIL FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATIONS_ID = :id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyDetailViewCountAdmin', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyDetailViewCountAdmin(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get selected Quarterly Nomination
async function QuarterlyNomDetails (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT * FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATIONS_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyNomDetails', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyNomDetails(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Quarterly Log Details
async function QuarterlyLogDetails (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT QUARTERLYNOMINTION_LOG_ID, ASSIGNEE_NAME FROM QUARTERLYNOMINTION_LOG ql WHERE ql.QUARTERLYNOMINTION_ID =:id ORDER BY ql.QUARTERLYNOMINTION_LOG_ID  DESC FETCH NEXT 1 ROWS ONLY`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyLogDetails', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyLogDetails(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get JUSTIFICATION BLOB FROM Quarterly Nomination
async function QuarterlyNomBlob (req, res, id) {

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        oracledb.fetchAsBuffer = [ oracledb.BLOB ];

        var result = await connection.execute(
            `SELECT JUSTIFICATION FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATIONS_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            const b = Buffer.from(result.rows[0].JUSTIFICATION);
            res.json(b.toString());
        }
    }
}

app.get('/QuarterlyNomBlob', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyNomBlob(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Nominator Email for Quarterly Awards
async function getQuarterlyNominatorEmail (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT u.MAIL AS NTEMAIL, (SELECT uT.MAIL FROM USERS uT, QUARTERLY_NOMINATIONS qnT WHERE uT.DISPLAYNAME = qnT.NOMINEE_NAME AND qnT.NOMINATIONS_ID=:id) AS NEEMAIL FROM USERS u, QUARTERLY_NOMINATIONS qn WHERE u.USERID = qn.NOMINATOR_ID AND qn.NOMINATIONS_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getQuarterlyNominatorEmail', function (req, res) {
    //get query by id
    let id = req.query.id;

    getQuarterlyNominatorEmail(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Quarterly Log History
async function QuarterlyLogHistory (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT ql.QUARTERLYNOMINTION_LOG_ID, ql.ASSIGNEE_NAME, ql.DATE_FROM, ql.DATE_TO, ql.WORKFLOW_STATUS, ql.COMMENTS FROM QUARTERLYNOMINTION_LOG ql WHERE ql.QUARTERLYNOMINTION_ID=:id ORDER BY ql.QUARTERLYNOMINTION_LOG_ID DESC`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyLogHistory', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyLogHistory(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get All Send Back quarterly nominations for individual nominator
async function QuarterlyReviewCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS TOTALREVIEWALS FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATOR_ID=:id AND qn.CURRENT_STATUS = 'Send Back'`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyReviewCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyReviewCount(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get All Send Back quarterly nominations for individual manager
async function QuarterlyNominationReview (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT qn.NOMINATIONS_ID, qn.NOMINEE_NAME, TO_CHAR(TO_DATE(qn.DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED FROM QUARTERLY_NOMINATIONS qn WHERE qn.NOMINATOR_ID =:id AND qn.CURRENT_STATUS = 'Send Back'`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/QuarterlyNominationReview', function (req, res) {
    //get query by id
    let id = req.query.id;

    QuarterlyNominationReview(req, res, id).then(() => {
        console.log(res.data);
    });
});


//Update Quarterly Nomination (Resubmission)
async function QuarterlyNomResubmission (req, res) {

    const comment = req.body.commentValue;
    const justifications = Buffer.from(req.body.justificationFile);
    const nomId = req.body.nomId;
    const updatedStatus = req.body.updatedStatus;
    const workflow = req.body.workflow;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');
        console.log('DATA:', comment);

        var result = await connection.execute(
            `UPDATE REWARDS_ADMIN.QUARTERLY_NOMINATIONS SET COMMENTS = :a, JUSTIFICATION = :b, CURRENT_STATUS = :c, WORKFLOW_STATUS = :d WHERE NOMINATIONS_ID = :e`,
            {
                a: comment,
                b: justifications,
                c: updatedStatus,
                d: workflow,
                e: nomId
            },{autoCommit: true});

        connection.commit();


        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/QuarterlyNomResubmission', function (req, res) {

    QuarterlyNomResubmission(req, res).then(() => {
        console.log(req.body);
    });
});


// ******************* Yearly Nominations  *******************

// Get Total Yearly Nominations Count for HR
async function YearlyNominationCount (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALYEARLYNOMS FROM YEARLY_NOMINATIONS yn`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/YearlyNominationCount', function (req, res) {

    YearlyNominationCount(req, res).then(() => {
        console.log(res.data);
    });
});


// Get Individual Yearly Nominations HR
async function getYearlyNominations (req, res) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT NOMINATIONS_ID, TO_CHAR(TO_DATE(DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED, NOMINATOR_NAME, NOMINEE_NAME, NOMINATOR_DEPARTMENT, CURRENT_STATUS, WORKFLOW_STATUS  FROM YEARLY_NOMINATIONS yn ORDER BY yn.NOMINATIONS_ID DESC`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}


app.get('/YearlyNominations', function (req, res) {
    getYearlyNominations(req, res).then(() => {
        console.log(res.data);
    });
});




// Get Count of Yearly Nomination Log History
async function getYearlyHistoryCount(req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS COUNTRESULT FROM YEARLYNOMINTION_LOG yl WHERE yl.YEARLYNOMINTION_ID=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getYearlyHistoryCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    getYearlyHistoryCount(req, res, id).then(() => {
        console.log(res.data);
    });
});



// Get Current User's Quarterly Nominations
async function getUserYearlyNomCounts (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS USERYEARNOMS FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATOR_ID=:id OR yn.NOMINEE_ID=:id`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getUserYearlyNomCounts', function (req, res) {
    //get query by id
    let id = req.query.id;

    getUserYearlyNomCounts(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Current User's Yearly Nominations
async function getUserYearlyNominations (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT yn.NOMINATIONS_ID, TO_CHAR(TO_DATE(yn.DATE_CREATED , 'MM-DD-YYYY HH24:MI:SS'), 'DD Mon YYYY') AS DATECREATED, yn.CURRENT_STATUS, yn.NOMINATION_CATEGORY, users.DISPLAYNAME AS SENDERDISPLAYNAME, USERSREC.DISPLAYNAME AS RECEIVERDISPLAYNAME FROM YEARLY_NOMINATIONS yn JOIN USERS users ON yn.NOMINATOR_ID = users.USERID JOIN USERS USERSREC ON yn.NOMINEE_NAME = USERSREC.DISPLAYNAME WHERE yn.NOMINATOR_ID=:id OR yn.NOMINEE_ID=:id ORDER BY yn.NOMINATIONS_ID DESC`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});


    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/UserYearlyNom', function (req, res) {
    //get query by id
    let id = req.query.id;

    getUserYearlyNominations(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Annual nominations Reviewal count for Nominations ID and Status is Send Back
async function AnnualReviewDetailCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS TOTALANNUAL FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATIONS_ID=:id AND yn.CURRENT_STATUS = 'Send Back'`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/AnnualReviewDetailCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    AnnualReviewDetailCount(req, res, id).then(() => {
        console.log(res.data);
    });
});






// Get Count for Annual Nominations Detailed View Admin Panel
async function AnnualDetailViewCountAdmin (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT COUNT(*) AS ANNUALDETAIL FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATIONS_ID = :id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/AnnualDetailViewCountAdmin', function (req, res) {
    //get query by id
    let id = req.query.id;

    AnnualDetailViewCountAdmin(req, res, id).then(() => {
        console.log(res.data);
    });
});






// Get selected Yearly Nomination
async function YearlyNomDetailsAdmin (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT * FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATIONS_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/YearlyNomDetailsAdmin', function (req, res) {
    //get query by id
    let id = req.query.id;

    YearlyNomDetailsAdmin(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get selected Yearly Nomination
async function YearlyNomDetails (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT * FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATIONS_ID=:id AND yn.CURRENT_STATUS = 'Send Back'`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/YearlyNomDetails', function (req, res) {
    //get query by id
    let id = req.query.id;

    YearlyNomDetails(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Yearly Log Details
async function YearlyLogDetails (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT YEARLYNOMINTION_LOG_ID , ASSIGNEE_NAME FROM YEARLYNOMINTION_LOG yl WHERE yl.YEARLYNOMINTION_ID =:id ORDER BY yl.YEARLYNOMINTION_LOG_ID DESC FETCH NEXT 1 ROWS ONLY`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/YearlyLogDetails', function (req, res) {
    //get query by id
    let id = req.query.id;

    YearlyLogDetails(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get JUSTIFICATION BLOB FROM Yearly Nomination
async function YearlyNomBlob (req, res, id) {

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        oracledb.fetchAsBuffer = [ oracledb.BLOB ];

        var result = await connection.execute(
            `SELECT JUSTIFICATION FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATIONS_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            const b = Buffer.from(result.rows[0].JUSTIFICATION);
            res.json(b.toString());
        }
    }
}

app.get('/YearlyNomBlob', function (req, res) {
    //get query by id
    let id = req.query.id;

    YearlyNomBlob(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get Nominator Email for Yearly Awards
async function getYearlyNominatorEmail (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT u.MAIL AS NTEMAIL, (SELECT uT.MAIL FROM USERS uT, YEARLY_NOMINATIONS ynT WHERE uT.DISPLAYNAME = ynT.NOMINEE_NAME AND ynT.NOMINATIONS_ID=:id) AS NEEMAIL FROM USERS u, YEARLY_NOMINATIONS yn WHERE u.USERID = yn.NOMINATOR_ID AND yn.NOMINATIONS_ID=:id`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/getYearlyNominatorEmail', function (req, res) {
    //get query by id
    let id = req.query.id;

    getYearlyNominatorEmail(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get selected Yearly Nomination
async function YearlyLogHistory (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT yl.YEARLYNOMINTION_LOG_ID, yl.ASSIGNEE_NAME, yl.DATE_FROM, yl.DATE_TO, yl.WORKFLOW_STATUS, yl.COMMENTS FROM YEARLYNOMINTION_LOG yl WHERE yl.YEARLYNOMINTION_ID=:id ORDER BY yl.YEARLYNOMINTION_LOG_ID DESC`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/YearlyLogHistory', function (req, res) {
    //get query by id
    let id = req.query.id;

    YearlyLogHistory(req, res, id).then(() => {
        console.log(res.data);
    });
});


// Get All Send Back quarterly nominations for individual manager
async function AnnualReviewCount (req, res, id) {
    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `SELECT COUNT(*) AS TOTALREVIEWALS FROM YEARLY_NOMINATIONS yn WHERE yn.NOMINATOR_ID=:id AND yn.CURRENT_STATUS = 'Send Back'`,
          [id],
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/AnnualReviewCount', function (req, res) {
    //get query by id
    let id = req.query.id;

    AnnualReviewCount(req, res, id).then(() => {
        console.log(res.data);
    });
});

// Get All Send Back quarterly nominations for individual manager
async function YearlyNominationReview (req, res, id) {
    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `SELECT yl.NOMINATIONS_ID, yl.NOMINEE_NAME, TO_CHAR(TO_DATE(yl.DATE_CREATED, 'MM-DD-YYYY HH24:MI:SS'),'Mon DD YYYY') AS DATE_CREATED FROM YEARLY_NOMINATIONS yl WHERE yl.NOMINATOR_ID =:id AND yl.CURRENT_STATUS = 'Send Back'`,
            [id],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close()
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }

        if (result.rows.length === 0) {
            res.send('No Data Found');
        } else {
            res.send(result.rows);
        }
    }
}

app.get('/YearlyNominationReview', function (req, res) {
    //get query by id
    let id = req.query.id;

    YearlyNominationReview(req, res, id).then(() => {
        console.log(res.data);
    });
});


//Update Quarterly Nomination (Resubmission)
async function AnnualNomResubmission (req, res) {

    const comment = req.body.commentValue;
    const justifications = Buffer.from(req.body.justificationFile);
    const nomId = req.body.nomId;
    const updatedStatus = req.body.updatedStatus;
    const workflow = req.body.workflow;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');
        console.log('DATA:', comment);

        var result = await connection.execute(
            `UPDATE REWARDS_ADMIN.YEARLY_NOMINATIONS SET COMMENTS = :a, JUSTIFICATION = :b, CURRENT_STATUS = :c, WORKFLOW_STATUS = :d WHERE NOMINATIONS_ID = :e`,
            {
                a: comment,
                b: justifications,
                c: updatedStatus,
                d: workflow,
                e: nomId
            },{autoCommit: true});

        connection.commit();


        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/AnnualNomResubmission', function (req, res) {

    AnnualNomResubmission(req, res).then(() => {
        console.log(req.body);
    });
});


// *************************************** INSERT & UPDATE DATA QUERIES  ***************************************
// Insert PEER TO PEER Recognitions
async function insertPeerToPeerRecognition (req, res) {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const peerCardId = req.body.peerCardId;
    const dateCreated = req.body.dateCreated
    const peerMessage = req.body.peerMessage;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `INSERT INTO REWARDS_ADMIN.PEER_TO_PEER VALUES (PEERTOPEER.nextval, :b, :c, :d, :e, :f)`,
            {
                b: senderId,
                c: receiverId,
                d: peerMessage,
                e: peerCardId,
                f: dateCreated
            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        connection.commit();

        console.log(result);

        return res.send(result);


    } catch (error) {
        //send error message
        return res.send(error);
    }
}

app.post('/InsertPeerToPeer', function (req, res) {

    insertPeerToPeerRecognition(req, res).then(() => {
        console.log(req.body);
    });
});

// Insert On The Spot Recognitions
async function insertOnTheSpot (req, res) {
    const nominatorid =  req.body.nominatorid;
    const nominatorname = req.body.nominatorname;
    const nominatorpositiontitle = req.body.nominatorpositiontitle;
    const nominatordepartment = req.body.nominatordepartment;
    const nominatordivision = req.body.nominatordivision;
    const nomineeId =  req.body.nomineeId;
    const nomineename = req.body.nomineename;
    const nomineepositiontitle = req.body.nomineepositiontitle;
    const nomineedepartment = req.body.nomineedepartment;
    const nomineedivision = req.body.nomineedivision;
    const comment = req.body.comment;
    const justifications = Buffer.from(req.body.justifications);
    const currentstatus = req.body.currentstatus;
    const workflowstatus = req.body.workflowstatus;
    const dateCreated = req.body.Created;
    const groupID = req.body.groupID

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `INSERT INTO REWARDS_ADMIN.ON_THE_SPOT VALUES (ONTHESPOTSEQ.nextval, :b, :c, :d, :e, :f, :a, :g, :h, :i, :j, :k, :l, :m, :n, :o, :p)`,
            {
                b: nominatorid,
                c: nominatorname,
                d: nominatorpositiontitle,
                e: nominatordepartment,
                f: nominatordivision,
                a: nomineeId,
                g: nomineename,
                h: nomineepositiontitle,
                i: nomineedepartment,
                j: nomineedivision,
                k: comment,
                l: justifications,
                m: currentstatus,
                n: dateCreated,
                o: workflowstatus,
                p: groupID

            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true});

        console.log(result);
        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Connection Successfully Closed');
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}

app.post('/insertOnTheSpot', function (req, res) {
    insertOnTheSpot(req, res).then(() => {
        console.log(req.body.nomineeId);
    });
});


// Insert Spotlight Nominations to check User Nom Count
async function insertSpotlightNomination (req, res) {
    const spotlightRecipient =  req.body.spotlightNominee;
    const dateCreated =  req.body.dateCreated;
    const spotlightRecipientId =  req.body.spotlightNomineeID;

    try {
        connection = await oracledb.getConnection(
          hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
          `INSERT INTO REWARDS_ADMIN.SPOTLIGHT_NOMINATION VALUES (REWARDS_ADMIN.SPOTLIGHTNOMINATIONSSEQ.nextval, :b, :c, :d)`,
          {
              b: spotlightRecipient,
              c: dateCreated,
              d: spotlightRecipientId
          },
          {outFormat: oracledb.OUT_FORMAT_OBJECT});

        connection.commit();

        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/insertSpotlightNomination', function (req, res) {
    insertSpotlightNomination(req, res).then(() => {
        console.log(req.body);
    });
});


// Update On The Spot Recognitions
async function updateOnTheSpot (req, res) {

    // const currentUserID = req.body.currentUserID;
    // const justifyData = JSON.stringify(req.body.justData);
    const stringSomething = '';
    // const stringText = JSON.stringify('Something!!');
    const dataToUpdate = Buffer.from(stringSomething);
    // const dataFormatted = dataToUpdate.toString();
    const rowToUpdate = 320;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');
        console.log('DATA:', dataToUpdate);

        var result = await connection.execute(
          `UPDATE REWARDS_ADMIN.ON_THE_SPOT SET JUSTIFICATION = :a WHERE ON_THE_SPOT_ID = :b`,
          {
              a: rowToUpdate,
              b: dataToUpdate
          },{autoCommit: true});

        connection.commit();


        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/updateOnTheSpot', function (req, res) {
    updateOnTheSpot(req, res).then(() => {
        console.log(req.body);
    });
});


// Insert Quarterly Nominations
async function insertQuarterlyNominations (req, res) {
    const nominatorid =  req.body.nominatorid;
    const nominatorname = req.body.nominatorname;
    const nominatorpositiontitle = req.body.nominatorpositiontitle;
    const nominatordepartment = req.body.nominatordepartment;
    const nominatordivision = req.body.nominatordivision;
    const nomineeid =  req.body.nomineeid;
    const nomineename = req.body.nomineename;
    const nomineepositiontitle = req.body.nomineepositiontitle;
    const nomineedepartment = req.body.nomineedepartment;
    const nomineedivision = req.body.nomineedivision;
    const comment = req.body.comment;
    const justifications = Buffer.from(req.body.justifications);
    const currentstatus = req.body.currentstatus;
    const qadate = req.body.dateCreated3;
    const workflowstatus = req.body.workflowstatus;
    const qacat= req.body.qacat;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );


        console.log('Connection successful');

        var result = await connection.execute(
            `INSERT INTO REWARDS_ADMIN.QUARTERLY_NOMINATIONS VALUES (REWARDS_ADMIN.QUARTERLYNOMINATIONSSEQ.nextval, :b, :c, :d, :e, :f, :a, :g, :h, :i, :j, :l, :m, :o, :p, :q, :r)`,
            {
                b: nominatorid,
                c: nominatorname,
                d: nominatorpositiontitle,
                e: nominatordepartment,
                f: nominatordivision,
                a: nomineeid,
                g: nomineename,
                h: nomineepositiontitle,
                i: nomineedepartment,
                j: nomineedivision,
                l: comment,
                m: justifications,
                o: currentstatus,
                p: qadate,
                q: workflowstatus,
                r: qacat
            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true});

        console.log(result);
        return res.send(result);


    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/InsertQuarterlyNominations', function (req, res) {
    insertQuarterlyNominations(req, res).then(() => {
        console.log(req.body);
    });
});


// Insert Yearly Nominations
async function InsertYearlyNominations (req, res) {
    const nominatorid =  req.body.nominatorid;
    const nominatorname = req.body.nominatorname;
    const nominatorpositiontitle = req.body.nominatorpositiontitle;
    const nominatordepartment = req.body.nominatordepartment;
    const nominatordivision = req.body.nominatordivision;
    const nomineeid =  req.body.nomineeid;
    const nomineename = req.body.nomineename;
    const nomineepositiontitle = req.body.nomineepositiontitle;
    const nomineedepartment = req.body.nomineedepartment;
    const nomineedivision = req.body.nomineedivision;
    const comment = req.body.comment;
    const justifications = Buffer.from(req.body.justifications);
    const currentstatus = req.body.currentstatus;
    const qadate = req.body.yncreation;
    const workflowstatus = req.body.workflowstatus;
    const qacat= req.body.qacat;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );


        console.log('Connection successful');

        var result = await connection.execute(
            `INSERT INTO REWARDS_ADMIN.YEARLY_NOMINATIONS VALUES (REWARDS_ADMIN.YEARLYNOMINATIONSSEQ.nextval, :b, :c, :d, :e, :f, :a, :g, :h, :i, :j, :l, :m, :o, :p, :q, :r)`,
            {
                b: nominatorid,
                c: nominatorname,
                d: nominatorpositiontitle,
                e: nominatordepartment,
                f: nominatordivision,
                a: nomineeid,
                g: nomineename,
                h: nomineepositiontitle,
                i: nomineedepartment,
                j: nomineedivision,
                l: comment,
                m: justifications,
                o: currentstatus,
                p: qadate,
                q: workflowstatus,
                r: qacat
            },
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        connection.commit();

        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/InsertYearlyNominations', function (req, res) {
    InsertYearlyNominations(req, res).then(() => {
        console.log(req.body);
    });
});

// *************************************** PL/SQL BLOCKS ***************************************
// Send Email Block
async function EmailNotification (req, res) {

    const userEmail = req.body.recieverEmail;
    const cardMessage = req.body.peerMessage;
    const subject = req.body.subject;

    try {
        connection = await oracledb.getConnection(
            midwareSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VI_MSG_TO VARCHAR2(100) := '`+userEmail+`';
                VI_MSG_SUBJECT VARCHAR2(50) := '`+subject+`';
                VI_MSG_TEXT VARCHAR2(3000) := '`+cardMessage+`';
                VO_MESSAGE VARCHAR2(100);
                VO_RESULT INT;
            FUNCTION FN_SEND_EMAIL(VI_MSG_TO VARCHAR2, VI_MSG_SUBJECT VARCHAR2, VI_MSG_TEXT VARCHAR2, VO_MESSAGE OUT VARCHAR2, VO_RESULT OUT NUMBER) RETURN NUMBER AS
                VV_MAIL_CONN UTL_SMTP.CONNECTION;
                VV_MSG_FROM VARCHAR2 (50) := 'iamdigi@livedigi.com';
                VV_MAILHOST VARCHAR2(30) := 'uc.belizetelemedia.net'; --'172.21.52.11';
                VV_CRLF VARCHAR(2) := CHR(13) || CHR(10); 
                --LOCAL USER
                
                VI_USERNAME VARCHAR2(3) := 'CMU';
                VI_PASSWORD VARCHAR2(3) := 'CMU';
                VI_IP_INFO VARCHAR2(10) := 'APEXSERVER';
                --interface variables
                BEGIN
                    VV_MAIL_CONN := utl_smtp.open_connection(VV_MAILHOST, 25); -- SMTP on port 25
                    utl_smtp.helo(VV_MAIL_CONN, VV_MAILHOST);
                    utl_smtp.mail(VV_MAIL_CONN, VV_MSG_FROM);
                    UTL_SMTP.RCPT(VV_MAIL_CONN, VI_MSG_TO);
                    UTL_SMTP.DATA(VV_MAIL_CONN, 'Date: '
                    || TO_CHAR (SYSDATE, 'Dy, DD Mon YYYY hh24:mi:ss')
                    || VV_CRLF
                    || 'From: '
                    || VV_MSG_FROM
                    || VV_CRLF
                    || 'Subject: '
                    || VI_MSG_SUBJECT
                    || VV_CRLF
                    || 'To: '
                    || VI_MSG_TO
                    || VV_CRLF
                    || VV_CRLF
                    || VI_MSG_TEXT
                    || VV_CRLF);
                    utl_smtp.quit(VV_MAIL_CONN);
                    DBMS_OUTPUT.PUT_LINE(' Success');
                    VO_MESSAGE := 'SUCCESS';
                    VO_RESULT := 0;
                    RETURN VO_RESULT;
                    EXCEPTION
                    WHEN UTL_SMTP.INVALID_OPERATION THEN
                    DBMS_OUTPUT.PUT_LINE(' Invalid Operation in Mail attempt using UTL_SMTP.');
                    VO_MESSAGE := SQLERRM;
                    VO_RESULT:= -8001;
                    RETURN VO_RESULT;
                    WHEN UTL_SMTP.TRANSIENT_ERROR THEN
                    DBMS_OUTPUT.PUT_LINE(' Temporary e-mail issue - try again');
                    VO_MESSAGE := SQLERRM;
                    VO_RESULT:= -8001;
                    RETURN VO_RESULT;
                    WHEN UTL_SMTP.PERMANENT_ERROR THEN
                    DBMS_OUTPUT.PUT_LINE(' Permanent Error Encountered.');
                    VO_MESSAGE := SQLERRM;
                    VO_RESULT:= -8001;
                    RETURN VO_RESULT;
                    WHEN OTHERS THEN
                    VO_MESSAGE := 'Contact BTL MIDWARE ADMIN';
                    DBMS_OUTPUT.PUT_LINE(DBMS_UTILITY.FORMAT_ERROR_STACK||DBMS_UTILITY.FORMAT_CALL_STACK||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE);
                    VO_RESULT := -8000;
                    RETURN VO_RESULT;
                END FN_SEND_EMAIL;
                
                BEGIN
                    VO_RESULT := FN_SEND_EMAIL(VI_MSG_TO, VI_MSG_SUBJECT, VI_MSG_TEXT, VO_MESSAGE, VO_RESULT);
                END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/EmailNotification', function (req, res) {
    EmailNotification(req, res).then(() => {
        console.log(req.data);
    });
});

//POST Yammer Block
async function POSTYAMMER (req, res) {
    const yammerToken = req.body.yammerToken;
    const yammerMessage = req.body.peerMessage;
    const recieverEmail = req.body.recieverEmail;

    try {
        connection = await oracledb.getConnection(
            midwareTestSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
            VV_TXT_TMP VARCHAR2(32767);
            VV_TXT CLOB;
            VV_HTTP_REQ UTL_HTTP.REQ;
            VV_HTTP_RESP UTL_HTTP.RESP;
            VV_HTTP_RESP_CODE NUMBER;
            VV_HTTP_REQUEST VARCHAR2(5000);
            VI_BODY VARCHAR2(1000) := '`+yammerMessage+`';
            VI_EMAIL VARCHAR2(50) := '`+recieverEmail+`';
            VI_YAMMERTOKEN VARCHAR2(5000) := '`+yammerToken+`';
            VI_GROUPID NUMBER  := 117043388416;
            VO_ID NUMBER;
            VV_ID_STRING VARCHAR2(50);
            VV_FINAL_BODY VARCHAR2(1000);
            BEGIN

            DBMS_LOB.CREATETEMPORARY(VV_TXT, FALSE);
           
            UTL_HTTP.SET_WALLET ('file:/u01/oracle/','Telemediamid2018!'); 
            VV_HTTP_REQ := UTL_HTTP.BEGIN_REQUEST('https://www.yammer.com/api/v1/users/by_email.json?email='||VI_EMAIL, 'GET', 'HTTP/1.1');
            UTL_HTTP.set_header(VV_HTTP_REQ, 'Authorization', 'Bearer '||VI_YAMMERTOKEN);
        
            UTL_HTTP.WRITE_TEXT(VV_HTTP_REQ , VV_HTTP_REQUEST);
            
            VV_HTTP_RESP := UTL_HTTP.GET_RESPONSE(R => VV_HTTP_REQ);
            VV_HTTP_RESP_CODE := VV_HTTP_RESP.STATUS_CODE;
           
            IF VV_HTTP_RESP_CODE = 200 THEN
           
            BEGIN
                LOOP
                   UTL_HTTP.READ_TEXT(VV_HTTP_RESP, VV_TXT_TMP, 32767);
                   DBMS_LOB.WRITEAPPEND (VV_TXT, LENGTH(VV_TXT_TMP), VV_TXT_TMP);
                END LOOP;
            EXCEPTION
                WHEN UTL_HTTP.END_OF_BODY THEN
                   UTL_HTTP.END_RESPONSE(VV_HTTP_RESP);
                END;
            END IF; 
        
            SELECT json_value(VV_TXT, '$.id') into VO_ID FROM dual;
             
            VV_ID_STRING := ' [[user:'||VO_ID||']]';
            
            SELECT CONCAT( VI_BODY, VV_ID_STRING ) INTO VV_FINAL_BODY FROM dual;
            
            VV_HTTP_REQ := UTL_HTTP.BEGIN_REQUEST('https://api.yammer.com/api/v1/messages.json', 'POST', 'HTTP/1.1');
            VV_HTTP_REQUEST := '{'||'"body" : "'||VV_FINAL_BODY||'","group_id" : "'||VI_GROUPID||'"}';
            DBMS_OUTPUT.PUT_LINE('BODY:'||VV_HTTP_REQUEST);
                                 
            UTL_HTTP.SET_HEADER(VV_HTTP_REQ, 'Content-Type', 'application/json');
            UTL_HTTP.SET_HEADER(VV_HTTP_REQ, 'Content-length', length(VV_HTTP_REQUEST));
            UTL_HTTP.set_header(VV_HTTP_REQ, 'Authorization', 'Bearer '||VI_YAMMERTOKEN);
            
            UTL_HTTP.WRITE_TEXT(VV_HTTP_REQ , VV_HTTP_REQUEST);
            
            VV_HTTP_RESP := UTL_HTTP.GET_RESPONSE(R => VV_HTTP_REQ);
            VV_HTTP_RESP_CODE := VV_HTTP_RESP.STATUS_CODE;
           
        BEGIN
            LOOP
                UTL_HTTP.READ_TEXT(VV_HTTP_RESP, VV_TXT_TMP, 32767);
                DBMS_LOB.WRITEAPPEND (VV_TXT, LENGTH(VV_TXT_TMP), VV_TXT_TMP);
            END LOOP;
        EXCEPTION
            WHEN UTL_HTTP.END_OF_BODY THEN
                UTL_HTTP.END_RESPONSE(VV_HTTP_RESP);
            END;
                DBMS_OUTPUT.PUT_LINE(VV_TXT);
        END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send('Yammer Failed');
    }
}

app.post('/YammerPost', function (req, res) {
    POSTYAMMER(req, res).then(() => {
        console.log(req.data);
    });
});

//Update SpotlightLog Block
async function SpotlightLog (req, res) {

    const sid = req.body.sid;
    const index = req.body.index;
    const currentUserID = req.body.currentUserID;
    const logdate = req.body.logdate;
    const currentUser = req.body.currentUser;
    const updatedStatus = req.body.updatedStatus;
    const adminComment = req.body.adminComments;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VV_ID NUMBER := '`+sid+`';
                VV_STEP NUMBER := '`+index+`';
                VV_ASSIGNEE VARCHAR(100) := '`+currentUserID+`';
                VV_ASSIGNEE_NAME VARCHAR(100) := '`+currentUser+`';
                VV_DATE VARCHAR2(50) := '`+logdate+`';
                VV_STATUS VARCHAR(15) := '`+updatedStatus+`';
                VV_COMMENTS VARCHAR(1000) := '`+adminComment+`';
                VV_TEMP_COUNT NUMBER;
                VV_TEMP_ID NUMBER;
                VV_TEMP_ASSGN VARCHAR(100);
                VV_TEMP_STS VARCHAR(15);
            BEGIN
                
                SELECT count(*) INTO VV_TEMP_COUNT FROM SPOTLIGHT_LOG sl WHERE sl.SPOTLIGHT_ID = VV_ID; 
            
                IF (VV_TEMP_COUNT = 0) THEN
                    INSERT INTO REWARDS_ADMIN.SPOTLIGHT_LOG
                    (SPOTLIGHT_LOG_ID, SPOTLIGHT_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                    VALUES(SPOTLIGHTLOGSSEQ.NEXTVAL, VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, '', VV_STATUS, VV_COMMENTS);
                COMMIT;
                RETURN;
                END IF;
                
                SELECT SPOTLIGHT_LOG_ID, ASSIGNEE_ID, WORKFLOW_STATUS INTO VV_TEMP_ID, VV_TEMP_ASSGN, VV_TEMP_STS FROM SPOTLIGHT_LOG sl WHERE sl.SPOTLIGHT_ID = VV_ID ORDER BY sl.SPOTLIGHT_LOG_ID DESC FETCH NEXT 1 ROWS ONLY ;
                
                IF (VV_TEMP_STS LIKE '%pproved') THEN
                    RETURN;
                END IF;
            
                IF (VV_STEP >= 4) THEN
                    UPDATE REWARDS_ADMIN.SPOTLIGHT_LOG
                    SET DATE_TO = VV_DATE
                    WHERE SPOTLIGHT_LOG_ID = VV_TEMP_ID;
                    COMMIT;
                
                    INSERT INTO REWARDS_ADMIN.SPOTLIGHT_LOG
                    (SPOTLIGHT_LOG_ID, SPOTLIGHT_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                    VALUES(SPOTLIGHTLOGSSEQ.NEXTVAL, VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, VV_DATE, VV_STATUS, VV_COMMENTS);
                    COMMIT;
                    RETURN;
                END IF;
            
                UPDATE REWARDS_ADMIN.SPOTLIGHT_LOG
                SET DATE_TO = VV_DATE
                WHERE SPOTLIGHT_LOG_ID = VV_TEMP_ID;
                COMMIT;
            
                INSERT INTO REWARDS_ADMIN.SPOTLIGHT_LOG
                (SPOTLIGHT_LOG_ID, SPOTLIGHT_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                VALUES(SPOTLIGHTLOGSSEQ.NEXTVAL, VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, '', VV_STATUS, VV_COMMENTS);
                COMMIT;
            END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        return res.send('Success');

    } catch (error) {
        //send error message
        return res.send('FAIL');
    }
}

app.post('/SpotlightLog', function (req, res) {
    SpotlightLog(req, res).then(() => {
        console.log(req.data);
    });
});

//Update Spotlight Status
async function updateOnTheSpotStatus (req, res, id) {

    const currentOnTheSpotId = req.body.onTheSpotId;
    const updatedStatus = req.body.updatedStatus;
    const indexValue = req.body.indexValue;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VV_ON_THE_SPOT_ID NUMBER := '`+currentOnTheSpotId+`';
                VV_ON_THE_SPOT_STATUS VARCHAR2(150)  := '`+updatedStatus+`';
                VV_INDEX_VALUE NUMBER  := '`+indexValue+`';
            BEGIN
                UPDATE ON_THE_SPOT SET CURRENTSTATUS = VV_ON_THE_SPOT_STATUS WHERE ON_THE_SPOT_ID = VV_ON_THE_SPOT_ID;
                UPDATE REWARDS_ADMIN.ON_THE_SPOT SET WORKFLOW_STATUS = VV_INDEX_VALUE WHERE ON_THE_SPOT_ID = VV_ON_THE_SPOT_ID;
                COMMIT;
            END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/updateOnTheSpotStatus', function (req, res) {
    let id = req.query.id;

    updateOnTheSpotStatus(req, res, id).then(() => {
        console.log(req.body);
    });
});

//Update Quarterly Nomination Status
async function UpdateQuarterlyStatus (req, res, id) {

    const nomID = req.body.nomID;
    const updatedStatus = req.body.nomStatus;
    const indexValue = req.body.nomIndex;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VV_NOMINATIONS_ID NUMBER := '`+nomID+`';
                VV_NOMINATIONS_STATUS VARCHAR2(150)  := '`+updatedStatus+`';
                VV_INDEX_VALUE NUMBER  := '`+indexValue+`';
            BEGIN
                UPDATE QUARTERLY_NOMINATIONS SET CURRENT_STATUS = VV_NOMINATIONS_STATUS WHERE NOMINATIONS_ID = VV_NOMINATIONS_ID;
                COMMIT;
                UPDATE QUARTERLY_NOMINATIONS SET WORKFLOW_STATUS = VV_INDEX_VALUE WHERE NOMINATIONS_ID = VV_NOMINATIONS_ID;
                COMMIT;
            END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/UpdateQuarterlyStatus', function (req, res) {
    let id = req.query.id;

    UpdateQuarterlyStatus(req, res, id).then(() => {
        console.log(req.body);
    });
});

//Update Quarterly Nomination Log
async function QuarterlyLog (req, res) {

    const sid = req.body.qnid;
    const index = req.body.qnindex;
    const currentUserID = req.body.currentUserID;
    const log_date = req.body.logdate;
    const currentUser = req.body.currentUser;
    const updatedStatus = req.body.logStatus;
    const comments = req.body.adminComments;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VV_ID NUMBER := '`+sid+`';
                VV_STEP NUMBER := '`+index+`';
                VV_ASSIGNEE VARCHAR(100) := '`+currentUserID+`';
                VV_ASSIGNEE_NAME VARCHAR(100) := '`+currentUser+`';
                VV_DATE VARCHAR2(50) := '`+log_date+`';
                VV_STATUS VARCHAR(15) := '`+updatedStatus+`';
                VV_COMMENTS VARCHAR(1000) := '`+comments+`';
                VV_TEMP_COUNT NUMBER;
                VV_TEMP_ID NUMBER;
                VV_TEMP_ASSGN VARCHAR(100);
                VV_TEMP_STS VARCHAR(15);
            BEGIN
                
                SELECT count(*) INTO VV_TEMP_COUNT FROM QUARTERLYNOMINTION_LOG ql WHERE ql.QUARTERLYNOMINTION_ID = VV_ID; 
            
                IF (VV_TEMP_COUNT = 0) THEN
                    INSERT INTO REWARDS_ADMIN.QUARTERLYNOMINTION_LOG
                    (QUARTERLYNOMINTION_LOG_ID, QUARTERLYNOMINTION_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                    VALUES("REWARDS_ADMIN"."QUARTERLYNOMINATIONLOGSEQ"."NEXTVAL", VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, '', VV_STATUS, VV_COMMENTS);
                COMMIT;
                RETURN;
                END IF;
                
                SELECT QUARTERLYNOMINTION_LOG_ID, ASSIGNEE_ID, WORKFLOW_STATUS INTO VV_TEMP_ID, VV_TEMP_ASSGN, VV_TEMP_STS FROM QUARTERLYNOMINTION_LOG ql WHERE ql.QUARTERLYNOMINTION_ID = VV_ID ORDER BY ql.QUARTERLYNOMINTION_LOG_ID DESC FETCH NEXT 1 ROWS ONLY ;
            
                IF (VV_TEMP_STS LIKE '%pproved') THEN
                RETURN;
                END IF;
            
                IF (VV_STEP >= 4) THEN
                    UPDATE REWARDS_ADMIN.QUARTERLYNOMINTION_LOG
                    SET DATE_TO = VV_DATE
                    WHERE QUARTERLYNOMINTION_LOG_ID = VV_TEMP_ID;
                    COMMIT;
                
                    INSERT INTO REWARDS_ADMIN.QUARTERLYNOMINTION_LOG
                    (QUARTERLYNOMINTION_LOG_ID, QUARTERLYNOMINTION_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                    VALUES("REWARDS_ADMIN"."QUARTERLYNOMINATIONLOGSEQ"."NEXTVAL", VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, VV_DATE, VV_STATUS, VV_COMMENTS);
                    COMMIT;
                    RETURN;
                END IF;
            
                UPDATE REWARDS_ADMIN.QUARTERLYNOMINTION_LOG 
                SET DATE_TO = VV_DATE
                WHERE QUARTERLYNOMINTION_LOG_ID = VV_TEMP_ID;
                COMMIT;
            
                INSERT INTO REWARDS_ADMIN.QUARTERLYNOMINTION_LOG
                (QUARTERLYNOMINTION_LOG_ID, QUARTERLYNOMINTION_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                VALUES("REWARDS_ADMIN"."QUARTERLYNOMINATIONLOGSEQ"."NEXTVAL", VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, '', VV_STATUS, VV_COMMENTS);
                COMMIT;
            END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        return res.send('Success');

    } catch (error) {
        //send error message
        return res.send('FAIL');
    }
}

app.post('/QuarterlyLog', function (req, res) {
    QuarterlyLog(req, res).then(() => {
        console.log(req.data);
    });
});

// Update Yearly Nominations Status
async function UpdateYearlyStatus (req, res, id) {

    const nomID = req.body.nomID;
    const updatedStatus = req.body.nomStatus;
    const indexValue = req.body.nomIndex;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VV_NOMINATIONS_ID NUMBER := '`+nomID+`';
                VV_NOMINATIONS_STATUS VARCHAR2(150)  := '`+updatedStatus+`';
                VV_INDEX_VALUE NUMBER  := '`+indexValue+`';
            BEGIN
                UPDATE YEARLY_NOMINATIONS SET CURRENT_STATUS = VV_NOMINATIONS_STATUS WHERE NOMINATIONS_ID = VV_NOMINATIONS_ID;
                COMMIT;
                UPDATE YEARLY_NOMINATIONS SET WORKFLOW_STATUS = VV_INDEX_VALUE WHERE NOMINATIONS_ID = VV_NOMINATIONS_ID;
                COMMIT;
            END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        console.log(result);

        return res.send(result);

    } catch (error) {
        //send error message
        return res.send(error.message);
    }
}

app.post('/UpdateYearlyStatus', function (req, res) {
    let id = req.query.id;

    UpdateYearlyStatus(req, res, id).then(() => {
        console.log(req.body);
    });
});

// Update Yearly Nominations Log
async function YearlyLog (req, res) {

    const sid = req.body.qnid;
    const index = req.body.qnindex;
    const currentUserID = req.body.currentUserID;
    const log_date = req.body.logdate;
    const currentUser = req.body.currentUser;
    const updatedStatus = req.body.logStatus;
    const adminComment = req.body.adminComments;

    try {
        connection = await oracledb.getConnection(
            hrSchema
        );

        console.log('Connection successful');

        var result = await connection.execute(
            `DECLARE
                VV_ID NUMBER := '`+sid+`';
                VV_STEP NUMBER := '`+index+`';
                VV_ASSIGNEE VARCHAR(100) := '`+currentUserID+`';
                VV_ASSIGNEE_NAME VARCHAR(100) := '`+currentUser+`';
                VV_DATE VARCHAR2(50) := '`+log_date+`';
                VV_STATUS VARCHAR(15) := '`+updatedStatus+`';
                VV_COMMENT VARCHAR(15) := '`+adminComment+`';
                VV_TEMP_COUNT NUMBER;
                VV_TEMP_ID NUMBER;
                VV_TEMP_ASSGN VARCHAR(100);
                VV_TEMP_STS VARCHAR(15);
            BEGIN
                
                SELECT count(*) INTO VV_TEMP_COUNT FROM YEARLYNOMINTION_LOG ql WHERE ql.YEARLYNOMINTION_ID = VV_ID; 
            
                IF (VV_TEMP_COUNT = 0) THEN
                    INSERT INTO REWARDS_ADMIN.YEARLYNOMINTION_LOG
                    (YEARLYNOMINTION_LOG_ID, YEARLYNOMINTION_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                    VALUES("REWARDS_ADMIN"."YEARLYNOMINATIONLOGSEQ"."NEXTVAL", VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, '', VV_STATUS, VV_COMMENT);
                COMMIT;
                RETURN;
                END IF;
                
                SELECT YEARLYNOMINTION_LOG_ID, ASSIGNEE_ID, WORKFLOW_STATUS INTO VV_TEMP_ID, VV_TEMP_ASSGN, VV_TEMP_STS FROM YEARLYNOMINTION_LOG ql WHERE ql.YEARLYNOMINTION_ID = VV_ID ORDER BY ql.YEARLYNOMINTION_LOG_ID DESC FETCH NEXT 1 ROWS ONLY ;
                
            IF (VV_TEMP_STS LIKE '%pproved') THEN
                RETURN;
                END IF;
            
                IF (VV_STEP >= 4) THEN
                    UPDATE REWARDS_ADMIN.YEARLYNOMINTION_LOG
                    SET DATE_TO = VV_DATE
                    WHERE YEARLYNOMINTION_LOG_ID = VV_TEMP_ID;
                    COMMIT;
                
                    INSERT INTO REWARDS_ADMIN.YEARLYNOMINTION_LOG
                    (YEARLYNOMINTION_LOG_ID, YEARLYNOMINTION_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                    VALUES("REWARDS_ADMIN"."YEARLYNOMINATIONLOGSEQ"."NEXTVAL", VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, VV_DATE, VV_STATUS, VV_COMMENT);
                    COMMIT;
                    RETURN;
                END IF;
            
                UPDATE REWARDS_ADMIN.YEARLYNOMINTION_LOG 
                SET DATE_TO = VV_DATE
                WHERE YEARLYNOMINTION_LOG_ID = VV_TEMP_ID;
                COMMIT;
            
                    INSERT INTO REWARDS_ADMIN.YEARLYNOMINTION_LOG
                    (YEARLYNOMINTION_LOG_ID, YEARLYNOMINTION_ID, ASSIGNEE_ID, ASSIGNEE_NAME, DATE_FROM, DATE_TO, WORKFLOW_STATUS, COMMENTS)
                VALUES("REWARDS_ADMIN"."YEARLYNOMINATIONLOGSEQ"."NEXTVAL", VV_ID, VV_ASSIGNEE, VV_ASSIGNEE_NAME, VV_DATE, '', VV_STATUS, VV_COMMENT);
                COMMIT;
            END;`,
            [],
            {outFormat: oracledb.OUT_FORMAT_OBJECT});

        return res.send('Success');

    } catch (error) {
        //send error message
        return res.send('FAIL');
    }
}

app.post('/YearlyLog', function (req, res) {
    YearlyLog(req, res).then(() => {
        console.log(req.data);
    });
});