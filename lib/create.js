const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const inquirer = require('inquirer');
const path = require('path');

const getTemplates = require('./template');
const downloadTemplate = require('./download');

async function init(projectName) {
    const targetDir = path.join(process.cwd(), projectName);
    if (fse.existsSync(targetDir)) {
        inquirer.prompt([{
            type: 'confirm',
            message: 'the directory already exists, do you want to overwrite it?',
            name: 'projectCover',
            default: 'true'
        }]).then(answers => {
            if (answers.projectCover) {
                createProject(targetDir, true);
            } else {
                console.log(symbols.error, chalk.red('the project name already exists, please set it again'));
                process.exit();
            }
        }).catch((error) => {
            console.log(symbols.error, chalk.red(`error: ${error}`));
            process.exit();
        });
    } else {
        createProject(targetDir);
    }
}

async function createProject(targetDir, removeDir) {
    const templates = await getTemplates();
    inquirer.prompt([{
        type: 'list',
        message: 'please select a template to create',
        name: 'projectSelect',
        choices: templates
    }]).then(async (answers) => {
        const initSpinner = ora(chalk.cyan('creating directory'));
        initSpinner.start();
        if (removeDir) {
            try {
                await fse.remove(targetDir);
            } catch (error) {
                initSpinner.text = chalk.red(`project removal failed: ${error}`);
                initSpinner.fail();
                process.exit();
            }
        }
        fse.ensureDir(targetDir);

        try {
            initSpinner.text = 'downloading template...';
            await downloadTemplate(targetDir, templates.find(t => t.value === answers.projectSelect).url);
        } catch (error) {
            initSpinner.text = chalk.red(error);
            initSpinner.fail();
            process.exit();
        }

        initSpinner.text = 'project initialization is complete'
        initSpinner.succeed();
    }).catch(error => {
        console.log(symbols.error, chalk.red(error));
    });
}

module.exports = init;