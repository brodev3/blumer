const manager = require("./scr/telegram/accountManager");
const blum = require("./scr/blum");

(async () => {
    let accounts = await manager.start_Accounts();
    for (let account in accounts){
        await blum.farming(accounts[account]);
    }

})();

