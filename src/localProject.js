const fse = require('fs-extra');
const download = require('download-git-repo');

const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { getDirFileName } = require('./utils');
const { exec } = require('child_process');
const { INJECT_FILES } = require('./constants');

module.exports = class LocalProject {
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
        this.init();
    }
    /**
     * 模板替换
     * @param {string} source 源文件路径
     * @param {string} dest 目标文件路径
     * @param {object} data 替换文本字段
     */
    injectTemplate(source, dest, data) {
        this.memFsEditor.copyTpl(source, dest, data);
    }
    init() {
        const { projectType, projectName, description } = this.config;
        const projectPath = path.join(process.cwd(), projectName);
        const templatePath = path.join(
            path.resolve(__dirname),
            './../template/' + projectType
        );

        const templateSpinner = ora('正在复制模板，请稍等...');
        templateSpinner.start(); // 复制文件
        console.log();
        const copyFiles = getDirFileName(templatePath);

        copyFiles.forEach(file => {
            fse.copySync(
                path.join(templatePath, file),
                path.join(projectPath, file)
            );
            console.log(
                `${chalk.green('✔ ')}${chalk.grey(
                    `创建: ${projectName}/${file}`
                )}`
            );
        });
        templateSpinner.succeed('复制成功');

        // INJECT_FILES.forEach(file => {
        //     this.injectTemplate(
        //         path.join(templatePath, file),
        //         path.join(projectName, file),
        //         {
        //             projectName,
        //             description,
        //         }
        //     );
        // });

        this.memFsEditor.commit(() => {
            INJECT_FILES.forEach(file => {
                console.log(
                    `${chalk.green('✔ ')}${chalk.grey(
                        `创建: ${projectName}/${file}`
                    )}`
                );
            });

            process.chdir(projectPath);

            // git 初始化
            console.log();
            console.log(projectPath + '/package.json');
            fse.pathExists(projectPath + '/package.json').then(exist => {
                if (exist) {
                    const gitInitSpinner = ora(
                        `cd ${chalk.green.bold(
                            projectName
                        )}目录, 执行 ${chalk.green.bold('git init')}`
                    );
                    gitInitSpinner.start();

                    const gitInit = exec('git init');
                    gitInit.on('close', code => {
                        if (code === 0) {
                            gitInitSpinner.color = 'green';
                            gitInitSpinner.succeed(gitInit.stdout.read());
                        } else {
                            gitInitSpinner.color = 'red';
                            gitInitSpinner.fail(gitInit.stderr.read());
                        }

                        // 安装依赖
                        console.log();
                        const installSpinner = ora(
                            `安装项目依赖 ${chalk.green.bold(
                                'npm install'
                            )}, 请稍后...`
                        );
                        installSpinner.start();
                        exec('npm install', (error, stdout, stderr) => {
                            if (error) {
                                installSpinner.color = 'red';
                                installSpinner.fail(
                                    chalk.red(
                                        '安装项目依赖失败，请自行重新安装！'
                                    )
                                );
                                console.log(error);
                            } else {
                                installSpinner.color = 'green';
                                installSpinner.succeed('安装依赖成功');
                                console.log(`${stderr}${stdout}`);

                                console.log();
                                console.log(chalk.green('创建项目成功！'));
                                console.log(
                                    chalk.green("Let's Coding吧！嘿嘿😝")
                                );
                            }
                        });
                    });
                } else {
                    console.log(chalk.green('创建项目成功！'));
                    console.log(chalk.green("Let's Coding吧！嘿嘿😝"));
                }
            });
        });
    }
};
