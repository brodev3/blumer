const log = require("./utils/logger");
const telegram = require("./telegram/telegram");
const axiosRetry = require("./utils/axiosRetryer");
const notion = require("./utils/notion");

async function delay(delayTime) {
    return new Promise(resolve => setTimeout(resolve, delayTime)); 
};

async function login(Account){
    try {
        let json_data = {"query": await telegram.get_TgWebData(Account.client)};
        let resp = await axiosRetry.post(Account.axios, "https://gateway.blum.codes/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP", json_data);
        const accessToken = resp.data.token.access;
        Account.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        Account.refreshToken = resp.data.token.refresh;
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function refresh(Account){
    try {
        let json_data = {"refresh": Account.refreshToken};
        let resp = await axiosRetry.post(Account.axios, "https://gateway.blum.codes/v1/auth/refresh", json_data);
        const accessToken = resp.data.access;
        Account.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        Account.refreshToken = resp.data.refresh;
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function balance(Account){
    try {
        let resp = await axiosRetry.get(Account.axios, "https://game-domain.blum.codes/api/v1/user/balance")
        let timestamp = resp.data.timestamp;
        let start_time = null;
        let end_time = null;
        let play_passes = null;
        let Balance = null;
        if (resp.data["farming"]){
            start_time = resp.data["farming"]["startTime"];
            end_time = resp.data["farming"]["endTime"];
            play_passes = resp.data["playPasses"];
            Balance = +resp.data.availableBalance;
            await notion.findAndUpdatePage('Brothers', Account.username, "BLUM | Points", Balance);
            return [ timestamp, start_time, end_time, play_passes, Balance ];
        }
        return [timestamp, start_time, end_time, play_passes];
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function claim(Account){
    try {
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/farming/claim");
        if (resp === false){
            await start(Account);
            return claim(Account);
        }
        if (resp === true){
            log.info(`Account ${Account.username} | Reward already claimed!`);
            let [ timestamp, start_time, end_time, play_passes, Balance ]  = await balance(Account);
            return [timestamp, Balance];
        }
        let timestamp = resp.data.timestamp;
        let b = resp.data.availableBalance;
        return [timestamp, b]; 
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function claimFriend(Account){
    try {
        let resp = await axiosRetry.post(Account.axios, "https://gateway.blum.codes/v1/friends/claim");
        if (resp === true)
            log.info(`Account ${Account.username} | Friend reward already claimed!`);
        else
            log.info(`Account ${Account.username} | Friend reward claimed! Reward: ${resp.data.claimBalance}`);
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function claimGame(Account, game_id){
    try {
        let points = Math.round(Math.random() * (275 - 220) + 220);
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/game/claim", {
            gameId: game_id,
            points: points,
        });
        if (resp.data == "OK") {
            log.info(`Account ${Account.username} | Game reward claimed! Reward: ${points}`);
        }
        else 
            return false;
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function start(Account){
    try {
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/farming/start")
        let start_time = resp.data.startTime;
        let end_time = resp.data.endTime;
        return [ start_time, end_time ];
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function daily(Account){
    try {
        await refresh(Account);
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/daily-reward?offset=-180")
        if (resp === true){
            log.info(`Account ${Account.username} | Daily already claimed!`);
        } else if (resp.data == "OK") {
            log.info(`Account ${Account.username} | Daily claimed!`);
        }
        await delay(Math.round(Math.random() * (30_000 - 10_000) + 10_000));
        tasks(Account);
        await delay(Math.round(Math.random() * (30_000 - 10_000) + 10_000));
        claimFriend(Account);
        let [ timestamp, start_time, end_time, play_passes, Balance ]  = await balance(Account);
        for (let i = 0; i < play_passes; i++){
            setTimeout(play, Math.round(Math.random() * (3_600_000 - 5_000) + 5_000), Account)
        }
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function tasks(Account){
    try {
        let resp = await axiosRetry.get(Account.axios, "https://game-domain.blum.codes/api/v1/tasks");
        for (let i = 0; i < resp.data.length; i++){
            let task = resp.data[i];
            if (task.status == "CLAIMED" || task.title.includes("Invite"))
                continue;
            if (task.status == "NOT_STARTED"){
                let res = await axiosRetry.post(Account.axios, `https://game-domain.blum.codes/api/v1/tasks/${task["id"]}/start`);
                await delay(Math.round(Math.random() * (20_000 - 10_000) + 10_000));
            }
            if (task.status == "STARTED")
                await delay(Math.round(Math.random() * (20_000 - 10_000) + 10_000));
            let clres = await axiosRetry.post(Account.axios, `https://game-domain.blum.codes/api/v1/tasks/${task["id"]}/claim`);
            log.info(`Account ${Account.username} | Task completed ${task.title}!`);
        };
        log.info(`Account ${Account.username} | All tasks completed!`);
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
}

async function play(Account){
    try {
        await refresh(Account);
        let resp = await axiosRetry.post(Account.axios, "https://game-domain.blum.codes/api/v1/game/play");
        if (!resp){
            log.error('cannot start game');
            return;
        }
        let game_id = resp.data.gameId;
        await delay(Math.round(Math.random() * (45_000 - 30_000) + 30_000));
        let res = await claimGame(Account, game_id);
        log.info(`Account ${Account.username} | Game plaid!`);
    }
    catch (err){
        log.error(`Account: ${Account.username} ` + err);
    };
};

async function farming(Account){
    try {
        await Account.connect();
        await login(Account);
        daily(Account);
        let [ timestamp, start_time, end_time, play_passes, Balance ]  = await balance(Account);
        if (start_time == null && end_time == null){
            [ start_time, end_time ]  = await start(Account);
            setTimeout(farming, (end_time - timestamp + 5), Account);
            log.info(`Account ${Account.username} | Start farming!`);
        } 
        else if(start_time != null && end_time != null){
            if ( Date.now() >= end_time) {
                await refresh(Account);
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





