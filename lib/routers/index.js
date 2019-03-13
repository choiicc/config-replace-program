'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildDongxing = exports.buildMobile = exports.build = undefined;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 构建pc端
 * @param req 
 * @param res 
 */
var build = exports.build = function build(req, res) {
    var params = '';
    req.on('data', function (chunk) {
        params += chunk;
    });

    req.on('end', function () {
        try {
            console.log('params ==> ', params);
            params = JSON.parse(params);

            console.log('params is: ', params);

            var _params = params,
                template = _params.template;

            var userConfigPath = params.path;

            if (!template) {
                return res.end(JSON.stringify({
                    result: 0x000001,
                    msg: 'template is required',
                    path: null
                }));
            }

            if (!userConfigPath) {
                return res.end(JSON.stringify({
                    result: 0x000002,
                    msg: 'path is required',
                    path: null
                }));
            }

            // 检查用户配置目录
            console.log('userConfigPath ==> ', userConfigPath);
            if (!_fs2.default.existsSync(userConfigPath)) {
                return res.end(JSON.stringify({
                    result: 0x000003,
                    msg: 'The user config dir \'' + userConfigPath + '\' is not exist',
                    path: null
                }));
            }

            /*****************    编译模板    *****************/
            var templateConfig = _config2.default['TEMPLATE_' + template.toUpperCase() + '_CONFIG'];
            console.log('templateConfig is ==> ' + JSON.stringify(templateConfig, null, 2));
            console.log('template path is ==> ' + templateConfig.path);
            if (!_fs2.default.existsSync(templateConfig.path)) {
                return res.end(JSON.stringify({
                    result: 0x000005,
                    msg: '请检查模板路径==>' + templatePath,
                    path: null
                }));
            }

            // 备份原来的配置文件
            var configFile = _path2.default.join(templateConfig.path, templateConfig.configFile);
            var configBak = _path2.default.join(templateConfig.path, templateConfig.configFile + '.default');
            console.log('template config file is ==> ' + configFile);
            if (!_fs2.default.existsSync(configBak)) {
                console.log('The config file is need backup');
                _shelljs2.default.cp(configFile, configBak);
            } else {
                console.log('The config file is already backup');
            }
            var logoFile = _path2.default.join(templateConfig.path, templateConfig.logoFile);
            var tabLogoFile = _path2.default.join(templateConfig.path, templateConfig.tabLogoFile);
            var docPath = _path2.default.join(templateConfig.path, templateConfig.docPath);
            var entryImgPath = _path2.default.join(templateConfig.path, templateConfig.entryImgPath);

            // 使用用户配置
            var userConfigLogo = _path2.default.join(userConfigPath, 'logo.png'),
                // 左上角logo
            userTabLogoFile = _path2.default.join(userConfigPath, 'favicon.png'),
                // 网站图标
            userConfigFile = _path2.default.join(userConfigPath, 'keys.config.json'),
                // 配置文件
            userDocPath = _path2.default.join(userConfigPath, 'docs/'),
                // 静态文案（关于我们，代理协议等）
            userEntryImgPath = _path2.default.join(userConfigPath, 'platformimg/'); // 游戏入口图片(体育，真人，彩票)

            /**** 开始覆盖模板文件  **********/
            if (_fs2.default.existsSync(userConfigLogo)) {
                _shelljs2.default.cp('-rf', userConfigLogo, logoFile);
            } else {
                console.warn('The user logo is not exist');
            }

            if (_fs2.default.existsSync(userTabLogoFile)) {
                _shelljs2.default.cp('-rf', userTabLogoFile, tabLogoFile);
            } else {
                console.warn('The user tabLogoFile is not exist');
            }

            if (_fs2.default.existsSync(userConfigFile)) {
                _shelljs2.default.cp('-rf', userConfigFile, configFile);
            } else {
                console.warn('The user config file is not exist');
            }

            if (_fs2.default.existsSync(userDocPath)) {
                _shelljs2.default.cp('-rf', userDocPath + '*', docPath);
            } else {
                console.warn('The user docs file is not exist');
            }

            if (_fs2.default.existsSync(userEntryImgPath)) {
                _shelljs2.default.cp('-rf', userEntryImgPath + '*', entryImgPath);
            } else {
                console.warn('The user docs file is not exist');
            }

            /**** 执行编译 ****/
            _shelljs2.default.cd(templateConfig.path);

            var _shell$exec = _shelljs2.default.exec('npm run build'),
                code = _shell$exec.code,
                stdout = _shell$exec.stdout;

            if (code != 0) {
                return res.end(JSON.stringify({
                    result: 0x000004,
                    msg: '\u7F16\u8BD1\u6267\u884C\u5931\u8D25==> ' + stdout,
                    path: null
                }));
            }

            // 复制到指定目录
            var deployPath = _path2.default.join(_config2.default.DEPLOYPATH, _uuid2.default.v4());
            _shelljs2.default.mkdir('-p', deployPath);
            _shelljs2.default.mv(_path2.default.join(templateConfig.path, 'dist/*'), deployPath);
            console.log("template copy finished");

            // // 写入用户日志文件
            // if (!fs.exists(Config.HISTORYPATH)) {
            //     shell.mkdir('-p', Config.HISTORYPATH)
            // }
            // let date = new Date()
            // fs.writeFileSync(path.join(Config.HISTORYPATH, 'xxxx.txt'), `${date} ==> ${deployPath} \r\n`, {
            //     encoding: 'utf-8',
            //     flag: 'a'
            // })

            console.log('The template is compiled');
            return res.end(JSON.stringify({
                result: 0,
                msg: '成功',
                path: deployPath
            }));
        } catch (error) {
            return res.end(JSON.stringify({
                result: 0x000006,
                msg: '\u51FA\u9519 ==> ' + error,
                path: null
            }));
        }
    });
};

/**
 * 构建手机端
 * @param req 
 * @param res 
 */
var buildMobile = exports.buildMobile = function buildMobile(req, res) {
    var params = '';
    req.on('data', function (chunk) {
        params += chunk;
    });

    req.on('end', function () {
        try {
            console.log('params ==> ', params);
            params = JSON.parse(params);

            console.log('params is: ', params);

            var _params2 = params,
                template = _params2.template;

            var userConfigPath = params.path;

            if (!template) {
                return res.end(JSON.stringify({
                    result: 0x000001,
                    msg: 'template is required',
                    path: null
                }));
            }

            if (!userConfigPath) {
                return res.end(JSON.stringify({
                    result: 0x000002,
                    msg: 'path is required',
                    path: null
                }));
            }

            // 检查用户配置目录
            console.log('userConfigPath ==> ', userConfigPath);
            if (!_fs2.default.existsSync(userConfigPath)) {
                return res.end(JSON.stringify({
                    result: 0x000003,
                    msg: 'The user config dir \'' + userConfigPath + '\' is not exist',
                    path: null
                }));
            }

            /*****************    编译模板    *****************/
            var templateConfig = _config2.default['TEMPLATE_' + template.toUpperCase() + '_CONFIG'];
            console.log('templateConfig is ==> ' + JSON.stringify(templateConfig, null, 2));
            console.log('template path is ==> ' + templateConfig.path);
            if (!_fs2.default.existsSync(templateConfig.path)) {
                return res.end(JSON.stringify({
                    result: 0x000005,
                    msg: '请检查模板路径==>' + templatePath,
                    path: null
                }));
            }

            // 备份原来的配置文件
            var configFile = _path2.default.join(templateConfig.path, templateConfig.configFile);
            var configBak = _path2.default.join(templateConfig.path, templateConfig.configFile + '.default');
            console.log('template config file is ==> ' + configFile);
            if (!_fs2.default.existsSync(configBak)) {
                console.log('The config file is need backup');
                _shelljs2.default.cp(configFile, configBak);
            } else {
                console.log('The config file is already backup');
            }
            var logoFile = _path2.default.join(templateConfig.path, templateConfig.logoFile);
            var tabLogoFile = _path2.default.join(templateConfig.path, templateConfig.tabLogoFile);
            var entryImgPath = _path2.default.join(templateConfig.path, templateConfig.entryImgPath);

            // 使用用户配置
            var userConfigLogo = _path2.default.join(userConfigPath, 'logo.png'),
                // 左上角logo
            userTabLogoFile = _path2.default.join(userConfigPath, 'favicon.png'),
                // 网站图标
            userConfigFile = _path2.default.join(userConfigPath, 'keys.config.json'),
                // 配置文件
            userEntryImgPath = _path2.default.join(userConfigPath, 'img/'); // 游戏入口图片，游戏详情图(体育，真人，彩票,电子)

            /**** 开始覆盖模板文件  **********/
            if (_fs2.default.existsSync(userConfigLogo)) {
                _shelljs2.default.cp('-rf', userConfigLogo, logoFile);
            } else {
                console.warn('The user logo is not exist');
            }

            if (_fs2.default.existsSync(userTabLogoFile)) {
                _shelljs2.default.cp('-rf', userTabLogoFile, tabLogoFile);
            } else {
                console.warn('The user tabLogoFile is not exist');
            }

            if (_fs2.default.existsSync(userConfigFile)) {
                _shelljs2.default.cp('-rf', userConfigFile, configFile);
            } else {
                console.warn('The user config file is not exist');
            }

            if (_fs2.default.existsSync(userEntryImgPath)) {
                _shelljs2.default.cp('-rf', userEntryImgPath + '*', entryImgPath);
            } else {
                console.warn('The user docs file is not exist');
            }

            /**** 执行编译 ****/
            _shelljs2.default.cd(templateConfig.path);

            var _shell$exec2 = _shelljs2.default.exec('npm run build'),
                code = _shell$exec2.code,
                stdout = _shell$exec2.stdout;

            if (code != 0) {
                return res.end(JSON.stringify({
                    result: 0x000004,
                    msg: '\u7F16\u8BD1\u6267\u884C\u5931\u8D25==> ' + stdout,
                    path: null
                }));
            }

            // 复制到指定目录
            var deployPath = _path2.default.join(_config2.default.DEPLOYPATH, _uuid2.default.v4());
            _shelljs2.default.mkdir('-p', deployPath);
            _shelljs2.default.mv(_path2.default.join(templateConfig.path, 'dist/*'), deployPath);
            console.log("template copy finished");

            // // 写入用户日志文件
            // if (!fs.exists(Config.HISTORYPATH)) {
            //     shell.mkdir('-p', Config.HISTORYPATH)
            // }
            // let date = new Date()
            // fs.writeFileSync(path.join(Config.HISTORYPATH, 'xxxx.txt'), `${date} ==> ${deployPath} \r\n`, {
            //     encoding: 'utf-8',
            //     flag: 'a'
            // })

            console.log('The template is compiled');
            return res.end(JSON.stringify({
                result: 0,
                msg: '成功',
                path: deployPath
            }));
        } catch (error) {
            return res.end(JSON.stringify({
                result: 0x000006,
                msg: '\u51FA\u9519 ==> ' + error,
                path: null
            }));
        }
    });
};

/**
 * 构建东兴模板pc端
 * @param req 
 * @param res 
 */
var buildDongxing = exports.buildDongxing = function buildDongxing(req, res) {
    var params = '';
    req.on('data', function (chunk) {
        params += chunk;
    });

    req.on('end', function () {
        try {
            console.log('params ==> ', params);
            params = JSON.parse(params);

            console.log('params is: ', params);

            var _params3 = params,
                template = _params3.template;

            var userConfigPath = params.path;

            if (!template) {
                return res.end(JSON.stringify({
                    result: 0x000001,
                    msg: 'template is required',
                    path: null
                }));
            }

            if (!userConfigPath) {
                return res.end(JSON.stringify({
                    result: 0x000002,
                    msg: 'path is required',
                    path: null
                }));
            }

            // 检查用户配置目录
            console.log('userConfigPath ==> ', userConfigPath);
            if (!_fs2.default.existsSync(userConfigPath)) {
                return res.end(JSON.stringify({
                    result: 0x000003,
                    msg: 'The user config dir \'' + userConfigPath + '\' is not exist',
                    path: null
                }));
            }

            /*****************    编译模板    *****************/
            var templateConfig = _config2.default['TEMPLATE_' + template.toUpperCase() + '_CONFIG'];
            console.log('templateConfig is ==> ' + JSON.stringify(templateConfig, null, 2));
            console.log('template path is ==> ' + templateConfig.path);
            if (!_fs2.default.existsSync(templateConfig.path)) {
                return res.end(JSON.stringify({
                    result: 0x000005,
                    msg: '请检查模板路径==>' + templatePath,
                    path: null
                }));
            }

            // 备份原来的配置文件
            var configFile = _path2.default.join(templateConfig.path, templateConfig.configFile);
            var configBak = _path2.default.join(templateConfig.path, templateConfig.configFile + '.default');
            console.log('template config file is ==> ' + configFile);
            if (!_fs2.default.existsSync(configBak)) {
                console.log('The config file is need backup');
                _shelljs2.default.cp(configFile, configBak);
            } else {
                console.log('The config file is already backup');
            }
            var logoFile = _path2.default.join(templateConfig.path, templateConfig.logoFile);
            var tabLogoFile = _path2.default.join(templateConfig.path, templateConfig.tabLogoFile);
            var docPath = _path2.default.join(templateConfig.path, templateConfig.docPath);
            var entryImgPath = _path2.default.join(templateConfig.path, templateConfig.entryImgPath);

            // 使用用户配置
            var userConfigLogo = _path2.default.join(userConfigPath, 'logo.png'),
                // 左上角logo
            userTabLogoFile = _path2.default.join(userConfigPath, 'favicon.png'),
                // 网站图标
            userConfigFile = _path2.default.join(userConfigPath, 'keys.config.json'),
                // 配置文件
            userDocPath = _path2.default.join(userConfigPath, 'html/'),
                // 静态文案（关于我们，代理协议等）
            userEntryImgPath = _path2.default.join(userConfigPath, 'game/'); // 游戏入口图片(体育，真人，彩票)

            /**** 开始覆盖模板文件  **********/
            if (_fs2.default.existsSync(userConfigLogo)) {
                _shelljs2.default.cp('-rf', userConfigLogo, logoFile);
            } else {
                console.warn('The user logo is not exist');
            }

            if (_fs2.default.existsSync(userTabLogoFile)) {
                _shelljs2.default.cp('-rf', userTabLogoFile, tabLogoFile);
            } else {
                console.warn('The user tabLogoFile is not exist');
            }

            if (_fs2.default.existsSync(userConfigFile)) {
                _shelljs2.default.cp('-rf', userConfigFile, configFile);
            } else {
                console.warn('The user config file is not exist');
            }

            if (_fs2.default.existsSync(userDocPath)) {
                _shelljs2.default.cp('-rf', userDocPath + '*', docPath);
            } else {
                console.warn('The user docs file is not exist');
            }

            if (_fs2.default.existsSync(userEntryImgPath)) {
                _shelljs2.default.cp('-rf', userEntryImgPath + '*', entryImgPath);
            } else {
                console.warn('The user docs file is not exist');
            }

            /**** 执行编译 ****/
            _shelljs2.default.cd(templateConfig.path);

            var _shell$exec3 = _shelljs2.default.exec('npm run build'),
                code = _shell$exec3.code,
                stdout = _shell$exec3.stdout;

            if (code != 0) {
                return res.end(JSON.stringify({
                    result: 0x000004,
                    msg: '\u7F16\u8BD1\u6267\u884C\u5931\u8D25==> ' + stdout,
                    path: null
                }));
            }

            // 复制到指定目录
            var deployPath = _path2.default.join(_config2.default.DEPLOYPATH, _uuid2.default.v4());
            _shelljs2.default.mkdir('-p', deployPath);
            _shelljs2.default.mv(_path2.default.join(templateConfig.path, 'dist/*'), deployPath);
            console.log("template copy finished");

            // // 写入用户日志文件
            // if (!fs.exists(Config.HISTORYPATH)) {
            //     shell.mkdir('-p', Config.HISTORYPATH)
            // }
            // let date = new Date()
            // fs.writeFileSync(path.join(Config.HISTORYPATH, 'xxxx.txt'), `${date} ==> ${deployPath} \r\n`, {
            //     encoding: 'utf-8',
            //     flag: 'a'
            // })

            console.log('The template is compiled');
            return res.end(JSON.stringify({
                result: 0,
                msg: '成功',
                path: deployPath
            }));
        } catch (error) {
            return res.end(JSON.stringify({
                result: 0x000006,
                msg: '\u51FA\u9519 ==> ' + error,
                path: null
            }));
        }
    });
};

// const upload = (req, res) => {
//     let form = new formidable.IncomingForm()
//     form.parse(req, (err, fields, files) => {
//         console.log(fields, files)
//         res.end('end')
//     })
// }

exports.default = {
    build: build,
    buildMobile: buildMobile,
    buildDongxing: buildDongxing
    // upload
};