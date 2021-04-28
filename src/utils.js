const fse = require('fs-extra');
const { INJECT_FILES } = require('./constants');

function getDirFileName(dir) {
    try {
        const files = fse.readdirSync(dir);
        const filesToCopy = [];
        files.forEach(file => {
            if (file.indexOf(INJECT_FILES) > -1) return;
            filesToCopy.push(file);
        });
        return filesToCopy;
    } catch (e) {
        return [];
    }
}
exports.getDirFileName = getDirFileName;
