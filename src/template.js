const inquirer = require('inquirer');
const fse = require('fs-extra');
const ora = require('ora');
const { ONLINE_PROJECT_LIST } = require('./constants');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const utils = require('./utils');
const path = require('path');
const OnlineProject = require('./onlineProject');
const LocalProject = require('./localProject');

const ONLINE_PROJECT_TIP = ' (download from online)';

class Tmpelate {
    constructor(options) {
        this.config = Object.assign(
            {
                projectType: '',
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
        const { projectType, projectName, description } = this.config;
        let templatePath = path.resolve(__dirname, './../template/');

        let onlineList = ONLINE_PROJECT_LIST.map(
            x => x.NAME + ONLINE_PROJECT_TIP
        );

        let templateList = [
            ...utils.getDirFileName(templatePath),
            ...onlineList,
        ];

        if (
            typeof projectType !== 'string' ||
            templateList.indexOf(projectType) === -1
        ) {
            prompts.push({
                type: 'list',
                name: 'projectType',
                message: '请选择项目类型：',
                choices: templateList,
            });
        }

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
    generate() {
        if (this.config.projectType.indexOf(ONLINE_PROJECT_TIP) !== -1) {
            let downloadUrl = '';
            for (let item of ONLINE_PROJECT_LIST) {
                if (
                    this.config.projectType ===
                    item.NAME + ONLINE_PROJECT_TIP
                ) {
                    downloadUrl = item.LINK;
                    break;
                }
            }
            new OnlineProject({
                downloadUrl: downloadUrl,
                projectName: this.config.projectName,
                description: this.config.description,
            });
        } else {
            new LocalProject({
                projectType: this.config.projectType,
                projectName: this.config.projectName,
                description: this.config.description,
            });
        }
    }
}

module.exports = Tmpelate;
