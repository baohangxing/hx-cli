const inquirer = require('inquirer');
const fse = require('fs-extra');
const download = require('download-git-repo');
const { TEMPLATE_GIT_REPO, INJECT_FILES } = require('./constants');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { getDirFileName } = require('./utils');
const { exec } = require('child_process');

class Tmpelate {
    constructor(options) {
        this.config = Object.assign(
            {
                projectName: '',
                description: '',
            },
            options
        );
        const store = memFs.create();
        this.memFsEditor = editor.create(store);
    }
    create() {
        this.inquire().then(answer => {
            this.config = Object.assign(this.config, answer);
            this.generate();
        });
    }
    inquire() {
        const prompts = [];
        const { projectName, description } = this.config;
        if (typeof projectName !== 'string') {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: '请输入项目名：',
                validate(input) {
                    if (!input) {
                        return '项目名不能为空';
                    }
                    if (fse.existsSync(input)) {
                        return '当前目录已存在同名项目，请更换项目名';
                    }
                    return true;
                },
            });
        } else if (fse.existsSync(projectName)) {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: '当前目录已存在同名项目，请更换项目名',
                validate(input) {
                    if (!input) {
                        return '项目名不能为空';
                    }
                    if (fse.existsSync(input)) {
                        return '当前目录已存在同名项目，请更换项目名';
                    }
                    return true;
                },
            });
        }

        if (typeof description !== 'string') {
            prompts.push({
                type: 'input',
                name: 'description',
                message: '请输入项目描述',
            });
        }

        return inquirer.prompt(prompts);
    }
}

module.exports = Tmpelate;
