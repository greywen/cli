/**
 * template
 * [{ value: '1', name: 'React template', url: 'direct:<repository_url>#<branch_name>(default:master)' }]
 * @returns 
 */

const pkg = require('../package.json');

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
    return new Promise((resolve) => {
        const request = createFetchWithTimeout(5000);
        request(pkg.cliConfig.templateURL).then((response) => {
            resolve(response.json());
        }).catch(error => {
            console.log(`get template error: ${error}`);
            process.exit();
        })
    });
}

module.exports = getTemplates;