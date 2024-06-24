const manager = require("./scr/telegram/accountManager");
const blum = require("./scr/blum");
const input = require("input");
const log = require("./scr/utils/logger");

(async () => {
    // let play = await input.text("Does the bot have to run games ? (Y/N)");
    let play = "Y"
    if (play == "Y")
        play = true;
    else if (play == "N")
        play = false;
    else
        log.error('Wrong answer! Y or N');
    let accounts = await manager.start_Accounts();
    for (let account in accounts){
        accounts[account].play = play;
        await blum.farming(accounts[account]);
    }
})();

