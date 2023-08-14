const pkg = require('../package.json');

function getCLIConfig() {
    const { fetchTemplateTimeOut = 3000, templateURL = null } = pkg?.cliConfig || { };

    return {
        fetchTemplateTimeOut,
        templateURL
    }
}
module.exports = getCLIConfig;