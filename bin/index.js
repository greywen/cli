#!/usr/bin/env node
const program = require('commander');
const init = require('../lib/create');
program.version(require('../package.json').version, '-v,--version');
const checkVersion = require('../lib/upgrade');

program
    .command('upgrade')
    .description('check the gy2x-cli version')
    .action(() => {
        checkVersion();
    });

program
    .name('gy2x-cli')
    .usage('<commands> [options]')
    .command('create <project_name>')
    .description('create a new project')
    .action(project => {
        init(project);
    });
    
program.parse(process.argv);