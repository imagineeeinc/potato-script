#!/usr/bin/env node
const chalk = require('chalk');
const yargs = require("yargs");
const argv = require('yargs/yargs')(process.argv.slice(2)).argv
var path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const prompt = require('prompt-sync')({eot: true});//sigint: true
const potato_run = require('./potato.js').run
var ver = "1.0.0"
console.log(chalk.cyan.bold(`
    _         _         _         _         _         _         _         _         _         _         _         _         _    
  _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__    _( )__ 
_|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| _|     _| 
(_ P _ (_ (_ O _ (_ (_ T _ (_ (_ A _ (_ (_ T _ (_ (_ O _ (_ (_   _ (_ (_ S _ (_ (_ C _ (_ (_ R _ (_ (_ I _ (_ (_ P _ (_ (_ T _ (_ 
|_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__|  |_( )__| 
`))
/*
if (argv._.indexOf("init") > -1) {
    if (argv._[1]) {
        console.log(chalk.green.bold("creating a project..."));
        proj_name = argv._[1]
        init()
    } else {
        console.log(chalk.red.bold("you must provide a name for the project like this:\n") + chalk.blue.bold("snowie init <project-name>") + chalk.red.bold("\ngo to: <docs link> to learn more"));
    }
} else*/ if (argv._.indexOf("help") > -1) {
    help()
} else if (argv._.indexOf("ver") > -1) {
    console.log(chalk.bold.green("version: v" + ver))
} else {
    shell()
}
//console.log(argv)

function help() {
    console.log(chalk.cyan.bold(`
Version: ${ver}
\nfor documentation on how to use it go to `) + 
chalk.bold.blueBright(`https://github.com/imagineeeinc/potato-script/#documentation`) + 
`
\n` + 
chalk.bgBlue.yellow.bold("Syntax: potato [options] <flags> [file...]") + 
chalk.cyan.bold(`\n
Examples: potato
          potato -c filename.potato
help:                  output usage information
ver:                   output Version
-c:                    compiles file given
@<file>                the file that will be compiled or executed`));
}
//console.log(argv);

function shell() {
    console.log(chalk.blue(`Welcome to Potato Script v` + ver + `.`))
    for (i = 0; i < 1;) {
        var result, error
        var input = prompt(chalk.cyan.bold('>>>'));
        if (input == null){
            input = chalk.green("   [To exit, Ctrl+D or type ?.exit]")
        } else if (input == "?.exit"){
            process.exit()
        } else {
            result, error = potato_run(input)
            input = result
        }
        if (error) {
            console.log(chalk.red(error.asString()))
        } else {
            console.log(`${input}`);
        }
    }
    
}