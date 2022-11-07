const oracledb = require('oracledb');

let connection;

async function Connect () {
    try {
        connection = await oracledb.getConnection(
            {
                user: 'REWARDS_ADMIN',
                password: 'R3Ward5',
                connectionString: '172.21.56.30/HRRWRDS_DEV'
            }
        );

        console.log('connecting to database');

    } catch (error) {
        console.log(error)
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close()
                console.log('close connection success');
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}

Connect();
