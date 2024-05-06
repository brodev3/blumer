const log = require("./utils/logger");
const telegram = require("./telegram/telegram");
const axiosRetry = require("./utils/axiosRetryer");


async function login(Account){
    try {
        let json_data = {"query": await telegram.get_TgWebData(Account.client)};
        
        let resp = await axiosRetry.post(Account.axios, "https://gateway.blum.codes/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP", json_data);
        // .catch(async function (error) {
        //     log.error(error.toJSON());
        //     resp = await Account.axios.post("https://gateway.blum.codes/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP", json_data)
        // });
        const accessToken = resp.data.token.access;
        Account.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function balance(Account){
    try {
        let resp = await axiosRetry.get(Account.axios, "https://game-domain.blum.codes/api/v1/user/balance")
        // .catch(async function (error) {
        //     log.error(error.toJSON());
        //     if (error.response.status == 401){
        //         await login(Account);
        //         resp = await Account.axios.get("https://game-domain.blum.codes/api/v1/user/balance");
        //     };
        // });
        let timestamp = resp.data.timestamp;
        let start_time = null;
        let end_time = null;
        if (resp.data["farming"]){
            start_time = resp.data["farming"]["startTime"];
            end_time = resp.data["farming"]["endTime"];
            return [ timestamp, start_time, end_time ];
        }
        return [timestamp, start_time, end_time];
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function claim(Account){
    try {
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/farming/claim")
        // .catch(function (error) {
        //     log.error(error.toJSON());
        // });
        let timestamp = resp.data.timestamp;
        let balance = resp.data.availableBalance;
        return timestamp, balance;
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function start(Account){
    try {
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/farming/start")
        // .catch(function (error) {
        //     log.error(error.toJSON());
        // });
        let start_time = resp.data.startTime;
        let end_time = resp.data.endTime;
        return [ start_time, end_time ];
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function farming(Account){
    try {
        await Account.connect();
        await login(Account);
        let [ timestamp, start_time, end_time ]  = await balance(Account);
        if (start_time == null && end_time == null){
            [ start_time, end_time ]  = await start(Account);
            setTimeout(farming, (end_time - timestamp + 5), Account);
            log.info(`Account ${Account.username} | Start farming!`);
        } 
        else if(start_time != null && end_time != null){
            if ( timestamp >= end_time) {
                let [ timestamp, balance ] = await claim(Account);
                log.info(`Account ${Account.username} | Claimed reward! Balance: ${balance}`);
                setTimeout(farming, 10 * 1000, Account);
            }
            else {
                setTimeout(farming, (end_time - timestamp + 5), Account);
                log.info(`Account ${Account.username} | Waiting claim...`);
            };
        };
        await Account.client.disconnect();
        await Account.client.destroy();
        return;
    }
    catch (err){
        log.error(`Account ${Account.username} | Error: ${err}`);
    };
}

module.exports.farming = farming;
module.exports.login = login;





