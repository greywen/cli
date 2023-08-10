const download = require('download-git-repo');

async function downloadTemplate(targetDir, url) {
    return new Promise((resolve, reject) => {
        download(url, targetDir, { clone: true }, (error) => {
            if (error) {
                reject(`template download failed: ${error}`);
            } else {
                resolve('template downloaded successfully');
            }
        })
    });
}

module.exports = downloadTemplate;