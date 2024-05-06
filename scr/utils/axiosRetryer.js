const log = require('./logger');

function getDelayTime(retryCount) {
    return Math.pow(2, retryCount) * 1000; 
};

async function delay(delayTime) {
    return new Promise(resolve => setTimeout(resolve, delayTime)); 
};

async function get(instance, url, retriesLeft = 5) {
    let response = await instance.get(url).catch(async error => {
        if (retriesLeft > 0) {
            log.debug(`AxiosRetryer: retrying left ${retriesLeft}`)
            const delayTime = getDelayTime(5 - retriesLeft);
            await delay(delayTime);
            return get(instance, url, retriesLeft - 1);
        } else {
            log.debug(`AxiosRetryer: request error ${error.toJSON()}`)
            throw error;
        }
    });
    return response;
};

async function post(instance, url, body, retriesLeft = 5) {
    let response = await instance.post(url, body).catch(async error => {
        if (retriesLeft > 0) {
            log.debug(`AxiosRetryer: retrying left ${retriesLeft}`)
            const delayTime = getDelayTime(5 - retriesLeft);
            await delay(delayTime);
            return post(instance, url, body, retriesLeft - 1);
        } else {
            log.debug(`AxiosRetryer: request error ${error.toJSON()}`)
            throw error;
        }
    });
    return response;
};

module.exports.get = get;
module.exports.post = post;