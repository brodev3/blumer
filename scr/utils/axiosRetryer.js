const log = require('./logger');

function getDelayTime(retryCount) {
    return Math.pow(2, retryCount) * 1000; 
};

async function delay(delayTime) {
    return new Promise(resolve => setTimeout(resolve, delayTime)); 
};

async function get(instance, url, retriesLeft = 10) {
    let response = await instance.get(url).catch(async error => {
        if (retriesLeft > 0) {
            log.debug(`AxiosRetryer: retrying left ${retriesLeft}`)
            const delayTime = getDelayTime(10 - retriesLeft);
            await delay(delayTime);
            return get(instance, url, retriesLeft - 1);
        } else {
            log.error(`AxiosRetryer: request error ${error}`)
            throw error;
        }
    });
    return response;
};

async function post(instance, url, body, retriesLeft = 10) {
    let response = await instance.post(url, body).catch(async error => {
        if (error.response){
            if (error.response.data.message == 'same day' || 
                error.response.data.message == "It's too early to claim" || 
                error.response.data.message == 'Task is already claimed' ||
                error.response.data.message == "Task is already started" 
            )
                return true
            if (error.response.data.message == 'Need to start farm' || 
                error.response.data.message == 'cannot start game' ||
                error.response.data.message == "Task is not done" )
                return false;
        }

        if (retriesLeft > 0) {
             log.debug(`AxiosRetryer: retrying left ${retriesLeft}`)
            const delayTime = getDelayTime(10 - retriesLeft);
            await delay(delayTime);
            return post(instance, url, body, retriesLeft - 1);
        }
        else {
            log.error(`AxiosRetryer: request error ${error}`)
            throw error;
        }
            
    });
    return response;
};

module.exports.get = get;
module.exports.post = post;