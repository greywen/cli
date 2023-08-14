/**
 * template format
 * [{ value: '1', name: 'React template', url: 'direct:<repository_url>#<branch_name>(default:master)' }]
 * @returns 
 */

const fse = require('fs-extra');
const path = require('path');
const getCLIConfig = require('./config');

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

function createFetchWithTimeout(timeout) {
    return function (url, init) {
        return new Promise((resolve, reject) => {
            const abort = new AbortController();
            fetch(url, init).then(resolve, reject);
            setTimeout(() => {
                abort.abort();
                reject('fetch timeout');
            }, timeout);
        });
    }
}

async function getTemplates() {
    const url = getCLIConfig().templateURL;
    if (!url) {
        console.log(`please configure the template url`);
        process.exit();
    }
    return isValidUrl(url) ? getRemoteTemplates(url) : getFileTemplates(url);
}

async function getRemoteTemplates(url) {
    return new Promise((resolve) => {
        const request = createFetchWithTimeout(getCLIConfig().fetchTemplateTimeOut);
        request(url).then((response) => {
            resolve(response.json());
        }).catch(error => {
            console.log(`get remote template error: ${error}`);
            process.exit();
        })
    });
}

async function getFileTemplates(url) {
    const filePath = path.join(process.cwd(), url);
    console.log(filePath);
    if (fse.existsSync(filePath)) {
        const json = await fse.readFileSync(filePath, { encoding: 'utf8' });
        return JSON.parse(json);
    } else {
        console.log('template file not found');
        process.exit();
    }
}

module.exports = getTemplates;