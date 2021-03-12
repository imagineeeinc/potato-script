#!/usr/bin/env node
var ver = "1.0.0"
const chalk = require('chalk');
const yargs = require("yargs");
const argv = require('yargs/yargs')(process.argv.slice(2)).argv
var path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const prompt = require('prompt-sync')({eot: true});//sigint: true
const potato_run = require('./potato.js').run
const print = require('./potato.js').print
var setTitle = require('console-title');
setTitle(`Potato Script v` + ver);

//console.log(argv)
console.log(chalk.cyan.bold(`

██████╗░░█████╗░████████╗░█████╗░████████╗░█████╗░  ░██████╗░█████╗░██████╗░██╗██████╗░████████╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗╚══██╔══╝██╔══██╗  ██╔════╝██╔══██╗██╔══██╗██║██╔══██╗╚══██╔══╝
██████╔╝██║░░██║░░░██║░░░███████║░░░██║░░░██║░░██║  ╚█████╗░██║░░╚═╝██████╔╝██║██████╔╝░░░██║░░░
██╔═══╝░██║░░██║░░░██║░░░██╔══██║░░░██║░░░██║░░██║  ░╚═══██╗██║░░██╗██╔══██╗██║██╔═══╝░░░░██║░░░
██║░░░░░╚█████╔╝░░░██║░░░██║░░██║░░░██║░░░╚█████╔╝  ██████╔╝╚█████╔╝██║░░██║██║██║░░░░░░░░██║░░░
╚═╝░░░░░░╚════╝░░░░╚═╝░░░╚═╝░░╚═╝░░░╚═╝░░░░╚════╝░  ╚═════╝░░╚════╝░╚═╝░░╚═╝╚═╝╚═╝░░░░░░░░╚═╝░░░
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
} else*/ if (argv.h == true) {
    help()
} else if (argv._.indexOf("ver") > -1) {
    console.log(chalk.bold.green("version: v" + ver))
} else {
    shell(argv.alterFn)
}

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
-h:                     output usage information
ver:                    output Version
-c:                     compiles file given
--alter-fn=<alterfile>: replace alterfile with a custom file name or
                        input so errors will be switched for your custom name
@<file>                 the file that will be compiled or executed`));
}
//console.log(argv);

function shell(alterfile) {
    var fn = '<stdin>'
    if (alterfile != undefined) {
        fn = alterfile
    }
    console.log(chalk.blue(`Welcome to Potato Script v` + ver + `.`))
    for (i = 0; i < 1;) {
        var result, error, output
        var input = prompt(chalk.cyan.bold('>>>'));
        if (input == null){
            input = chalk.green("   [To exit, Ctrl+D or type ?.exit]")
            result = [input]
        } else if (input == "?.exit"){
            process.exit()
        } else {
            result = potato_run(input, fn)
            result = result//JSON.parse(result)
            output = result[0]
            error = result[1]
        }
        if (result[1] != null) {
            console.log(chalk.red(result[1]))
        } else {
            console.log(result);//result[0]
        }
    }
    
}

function compile() {}