const utils = require("../utils/utils");
const telegram = require("./telegram");
const { SocksProxyAgent } = require('socks-proxy-agent');
const axios = require('axios');
const log = require("../utils/logger");
const axiosRetry = require('axios-retry').default;

class Account {
    constructor(username, session, api_id, api_hash, proxy) {
        this.username = username;
        this.api_id = api_id;
        this.api_hash = api_hash;
        this.session = session;
        this.proxy = proxy;
    };

    async connect(){
        this.client = await telegram.get_Client(this.session, this.api_id, this.api_hash, this.proxy);
        const proxyAgent  = new SocksProxyAgent(`socks5://${this.proxy.username}:${this.proxy.password}@${this.proxy.ip}:${this.proxy.port}`);
        this.axios = await axios.create({
            httpsAgent: proxyAgent, 
            httpAgent: proxyAgent,
            headers: {'User-Agent': utils.get_UA()}
        });
        axiosRetry(this.axios, { 
            retries: 10,
            retryDelay: (retryCount) => {
                log.info(`Retry attempt: ${retryCount}`);
                return retryCount * 2000; // time interval between retries
            }, });
    };
};

let add_NewAccount = function (accountData){
    let accountsData = utils.get_AccountsData();
    let listAccounts = Object.keys(accountsData);
    if (accountData.username in listAccounts == false)
        accountsData[accountData.username] = {
            api_id: accountData.api_id,
            api_hash: accountData.api_hash,
            session: accountData.session,
            proxy: accountData.proxy
        }
        utils.write_AccountsData(accountsData);
        log.info(`${accountData.username} added`);
};

let start_Accounts = async function (){
    let accountsData = utils.get_AccountsData();
    let listAccounts = Object.keys(accountsData);
    let result = {};
    for (let account of listAccounts){
        let accountData = accountsData[account];
        result[account] = new Account(account, accountData.session, accountData.api_id, accountData.api_hash, accountData.proxy);
        await result[account].connect();
        log.info(`${account} connected`);
    };
    return result;
};

module.exports.add_NewAccount = add_NewAccount;
module.exports.start_Accounts = start_Accounts;