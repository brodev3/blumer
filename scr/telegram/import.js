const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const log = require("../utils/logger");
const manager = require("./accountManager");

(async () => {
    let apiId = await input.text("apiId ?");
    let apiHash = await input.text("apiHash?");
    let proxy = await input.text("proxy?");
    proxy = proxy.split(":");
    let ip = proxy[0];
    let port = Number(proxy[1]);
    let username = proxy[2];
    let password = proxy[3];
    let stringSession = new StringSession("");
    const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
        connectionRetries: 5,
        useWSS: false,
        proxy: {
            ip: ip, 
            port: port, 
            username: username, 
            password: password, 
            socksType: 5, 
            timeout: 2, 
          },
    });
    await client.start({
        phoneNumber: async () => await input.text("number ?"),
        password: async () => await input.text("password?"),
        phoneCode: async () => await input.text("Code ?"),
        onError: (err) => log.error(err),
    });
    await client.sendMessage("me", { message: "Hello!" });
    const me = await client.getMe();
    let accData = {
        api_id: Number(apiId),
        api_hash: apiHash,
        session: client.session.save(),
        proxy: {
            ip: ip, 
            port: port, 
            username: username, 
            password: password, 
            socksType: 5, 
            timeout: 2, 
          },
        username: me.username
    };
    manager.add_NewAccount(accData);
})();