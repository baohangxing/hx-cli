const fse = require('fs-extra');

function getDirFileName(dir) {
    try {
        const files = fse.readdirSync(dir);
        return files;
    } catch (e) {
        return [];
    }
}
exports.getDirFileName = getDirFileName;
