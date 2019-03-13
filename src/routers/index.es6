import uuid from 'uuid'
import shell from 'shelljs'
import path from 'path'
import fs from 'fs'
import Config from '../config'

/**
 * 构建pc端
 * @param req 
 * @param res 
 */
export const build = (req, res) => {
    let params = ''
    req.on('data', (chunk) => {
        params += chunk
    })

    req.on('end', () => {
        try {
            console.log('params ==> ', params)
            params = JSON.parse(params)

            console.log('params is: ', params)

            let { template } = params
            let userConfigPath = params.path

            if (!template) {
                return res.end(JSON.stringify({
                    result: 0x000001,
                    msg: 'template is required',
                    path: null
                }))
            }
            
            if (!userConfigPath) {
                return res.end(JSON.stringify({
                    result: 0x000002,
                    msg: 'path is required',
                    path: null
                }))
            } 

            // 检查用户配置目录
            console.log(`userConfigPath ==> `, userConfigPath)
            if (!fs.existsSync(userConfigPath)) {
                return res.end(JSON.stringify({
                    result: 0x000003,
                    msg: `The user config dir '${userConfigPath}' is not exist`,
                    path: null
                }))
            }

            /*****************    编译模板    *****************/
            let templateConfig = Config[`TEMPLATE_${template.toUpperCase()}_CONFIG`]
            console.log(`templateConfig is ==> ${JSON.stringify(templateConfig, null, 2)}`)
            console.log(`template path is ==> ${templateConfig.path}`)
            if (!fs.existsSync(templateConfig.path)) {
                return res.end(JSON.stringify({
                    result: 0x000005,
                    msg: '请检查模板路径==>' + templatePath,
                    path: null
                }))
            }

            // 备份原来的配置文件
            let configFile = path.join(templateConfig.path, templateConfig.configFile)
            let configBak = path.join(templateConfig.path, templateConfig.configFile + '.default')
            console.log(`template config file is ==> ${configFile}`)
            if (!fs.existsSync(configBak)) {
                console.log('The config file is need backup')
                shell.cp(configFile, configBak)
            } else {
                console.log('The config file is already backup')
            }
            let logoFile = path.join(templateConfig.path, templateConfig.logoFile)
            let tabLogoFile = path.join(templateConfig.path, templateConfig.tabLogoFile)
            let docPath = path.join(templateConfig.path, templateConfig.docPath)
            let entryImgPath = path.join(templateConfig.path, templateConfig.entryImgPath)

            // 使用用户配置
            let userConfigLogo = path.join(userConfigPath, 'logo.png'), // 左上角logo
                userTabLogoFile = path.join(userConfigPath, 'favicon.png'), // 网站图标
                userConfigFile = path.join(userConfigPath, 'keys.config.json'), // 配置文件
                userDocPath = path.join(userConfigPath, 'docs/'), // 静态文案（关于我们，代理协议等）
                userEntryImgPath = path.join(userConfigPath, 'platformimg/') // 游戏入口图片(体育，真人，彩票)

            /**** 开始覆盖模板文件  **********/ 
            if (fs.existsSync(userConfigLogo)) {
                shell.cp('-rf', userConfigLogo, logoFile)
            } else {
                console.warn(`The user logo is not exist`)
            }

            if (fs.existsSync(userTabLogoFile)) {
                shell.cp('-rf', userTabLogoFile, tabLogoFile)
            } else {
                console.warn(`The user tabLogoFile is not exist`)
            }

            if (fs.existsSync(userConfigFile)) {
                shell.cp('-rf', userConfigFile, configFile)
            } else {
                console.warn(`The user config file is not exist`)
            }

            if (fs.existsSync(userDocPath)) {
                shell.cp('-rf', userDocPath + '*', docPath)
            } else {
                console.warn(`The user docs file is not exist`)
            }

            if (fs.existsSync(userEntryImgPath)) {
                shell.cp('-rf', userEntryImgPath + '*', entryImgPath)
            } else {
                console.warn(`The user docs file is not exist`)
            }

            /**** 执行编译 ****/
            shell.cd(templateConfig.path)
            let { code, stdout } = shell.exec('npm run build')
            if (code != 0) {
                return res.end(JSON.stringify({
                    result: 0x000004,
                    msg: `编译执行失败==> ${stdout}`,
                    path: null
                }))
            }

            // 复制到指定目录
            let deployPath = path.join(Config.DEPLOYPATH, uuid.v4())
            shell.mkdir('-p', deployPath)
            shell.mv(path.join(templateConfig.path, 'dist/*'), deployPath)
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

            console.log('The template is compiled')
            return res.end(JSON.stringify({
                result: 0,
                msg: '成功',
                path: deployPath
            }))
        } catch (error) {
            return res.end(JSON.stringify({
                result: 0x000006,
                msg: `出错 ==> ${error}`,
                path: null
            }))
        }
    })
}

/**
 * 构建手机端
 * @param req 
 * @param res 
 */
export const buildMobile = (req, res) => {
    let params = ''
    req.on('data', (chunk) => {
        params += chunk
    })

    req.on('end', () => {
        try {
            console.log('params ==> ', params)
            params = JSON.parse(params)

            console.log('params is: ', params)

            let { template } = params
            let userConfigPath = params.path

            if (!template) {
                return res.end(JSON.stringify({
                    result: 0x000001,
                    msg: 'template is required',
                    path: null
                }))
            }
            
            if (!userConfigPath) {
                return res.end(JSON.stringify({
                    result: 0x000002,
                    msg: 'path is required',
                    path: null
                }))
            } 

            // 检查用户配置目录
            console.log(`userConfigPath ==> `, userConfigPath)
            if (!fs.existsSync(userConfigPath)) {
                return res.end(JSON.stringify({
                    result: 0x000003,
                    msg: `The user config dir '${userConfigPath}' is not exist`,
                    path: null
                }))
            }

            /*****************    编译模板    *****************/
            let templateConfig = Config[`TEMPLATE_${template.toUpperCase()}_CONFIG`]
            console.log(`templateConfig is ==> ${JSON.stringify(templateConfig, null, 2)}`)
            console.log(`template path is ==> ${templateConfig.path}`)
            if (!fs.existsSync(templateConfig.path)) {
                return res.end(JSON.stringify({
                    result: 0x000005,
                    msg: '请检查模板路径==>' + templatePath,
                    path: null
                }))
            }

            // 备份原来的配置文件
            let configFile = path.join(templateConfig.path, templateConfig.configFile)
            let configBak = path.join(templateConfig.path, templateConfig.configFile + '.default')
            console.log(`template config file is ==> ${configFile}`)
            if (!fs.existsSync(configBak)) {
                console.log('The config file is need backup')
                shell.cp(configFile, configBak)
            } else {
                console.log('The config file is already backup')
            }
            let logoFile = path.join(templateConfig.path, templateConfig.logoFile)
            let tabLogoFile = path.join(templateConfig.path, templateConfig.tabLogoFile)
            let entryImgPath = path.join(templateConfig.path, templateConfig.entryImgPath)

            // 使用用户配置
            let userConfigLogo = path.join(userConfigPath, 'logo.png'), // 左上角logo
                userTabLogoFile = path.join(userConfigPath, 'favicon.png'), // 网站图标
                userConfigFile = path.join(userConfigPath, 'keys.config.json'), // 配置文件
                userEntryImgPath = path.join(userConfigPath, 'img/') // 游戏入口图片，游戏详情图(体育，真人，彩票,电子)

            /**** 开始覆盖模板文件  **********/ 
            if (fs.existsSync(userConfigLogo)) {
                shell.cp('-rf', userConfigLogo, logoFile)
            } else {
                console.warn(`The user logo is not exist`)
            }

            if (fs.existsSync(userTabLogoFile)) {
                shell.cp('-rf', userTabLogoFile, tabLogoFile)
            } else {
                console.warn(`The user tabLogoFile is not exist`)
            }

            if (fs.existsSync(userConfigFile)) {
                shell.cp('-rf', userConfigFile, configFile)
            } else {
                console.warn(`The user config file is not exist`)
            }

            if (fs.existsSync(userEntryImgPath)) {
                shell.cp('-rf', userEntryImgPath + '*', entryImgPath)
            } else {
                console.warn(`The user docs file is not exist`)
            }

            /**** 执行编译 ****/
            shell.cd(templateConfig.path)
            let { code, stdout } = shell.exec('npm run build')
            if (code != 0) {
                return res.end(JSON.stringify({
                    result: 0x000004,
                    msg: `编译执行失败==> ${stdout}`,
                    path: null
                }))
            }

            // 复制到指定目录
            let deployPath = path.join(Config.DEPLOYPATH, uuid.v4())
            shell.mkdir('-p', deployPath)
            shell.mv(path.join(templateConfig.path, 'dist/*'), deployPath)
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

            console.log('The template is compiled')
            return res.end(JSON.stringify({
                result: 0,
                msg: '成功',
                path: deployPath
            }))
        } catch (error) {
            return res.end(JSON.stringify({
                result: 0x000006,
                msg: `出错 ==> ${error}`,
                path: null
            }))
        }
    })
}


/**
 * 构建东兴模板pc端
 * @param req 
 * @param res 
 */
export const buildDongxing = (req, res) => {
    let params = ''
    req.on('data', (chunk) => {
        params += chunk
    })

    req.on('end', () => {
        try {
            console.log('params ==> ', params)
            params = JSON.parse(params)

            console.log('params is: ', params)

            let { template } = params
            let userConfigPath = params.path

            if (!template) {
                return res.end(JSON.stringify({
                    result: 0x000001,
                    msg: 'template is required',
                    path: null
                }))
            }
            
            if (!userConfigPath) {
                return res.end(JSON.stringify({
                    result: 0x000002,
                    msg: 'path is required',
                    path: null
                }))
            } 

            // 检查用户配置目录
            console.log(`userConfigPath ==> `, userConfigPath)
            if (!fs.existsSync(userConfigPath)) {
                return res.end(JSON.stringify({
                    result: 0x000003,
                    msg: `The user config dir '${userConfigPath}' is not exist`,
                    path: null
                }))
            }

            /*****************    编译模板    *****************/
            let templateConfig = Config[`TEMPLATE_${template.toUpperCase()}_CONFIG`]
            console.log(`templateConfig is ==> ${JSON.stringify(templateConfig, null, 2)}`)
            console.log(`template path is ==> ${templateConfig.path}`)
            if (!fs.existsSync(templateConfig.path)) {
                return res.end(JSON.stringify({
                    result: 0x000005,
                    msg: '请检查模板路径==>' + templatePath,
                    path: null
                }))
            }

            // 备份原来的配置文件
            let configFile = path.join(templateConfig.path, templateConfig.configFile)
            let configBak = path.join(templateConfig.path, templateConfig.configFile + '.default')
            console.log(`template config file is ==> ${configFile}`)
            if (!fs.existsSync(configBak)) {
                console.log('The config file is need backup')
                shell.cp(configFile, configBak)
            } else {
                console.log('The config file is already backup')
            }
            let logoFile = path.join(templateConfig.path, templateConfig.logoFile)
            let tabLogoFile = path.join(templateConfig.path, templateConfig.tabLogoFile)
            let docPath = path.join(templateConfig.path, templateConfig.docPath)
            let entryImgPath = path.join(templateConfig.path, templateConfig.entryImgPath)

            // 使用用户配置
            let userConfigLogo = path.join(userConfigPath, 'logo.png'), // 左上角logo
                userTabLogoFile = path.join(userConfigPath, 'favicon.png'), // 网站图标
                userConfigFile = path.join(userConfigPath, 'keys.config.json'), // 配置文件
                userDocPath = path.join(userConfigPath, 'html/'), // 静态文案（关于我们，代理协议等）
                userEntryImgPath = path.join(userConfigPath, 'game/') // 游戏入口图片(体育，真人，彩票)

            /**** 开始覆盖模板文件  **********/ 
            if (fs.existsSync(userConfigLogo)) {
                shell.cp('-rf', userConfigLogo, logoFile)
            } else {
                console.warn(`The user logo is not exist`)
            }

            if (fs.existsSync(userTabLogoFile)) {
                shell.cp('-rf', userTabLogoFile, tabLogoFile)
            } else {
                console.warn(`The user tabLogoFile is not exist`)
            }

            if (fs.existsSync(userConfigFile)) {
                shell.cp('-rf', userConfigFile, configFile)
            } else {
                console.warn(`The user config file is not exist`)
            }

            if (fs.existsSync(userDocPath)) {
                shell.cp('-rf', userDocPath + '*', docPath)
            } else {
                console.warn(`The user docs file is not exist`)
            }

            if (fs.existsSync(userEntryImgPath)) {
                shell.cp('-rf', userEntryImgPath + '*', entryImgPath)
            } else {
                console.warn(`The user docs file is not exist`)
            }

            /**** 执行编译 ****/
            shell.cd(templateConfig.path)
            let { code, stdout } = shell.exec('npm run build')
            if (code != 0) {
                return res.end(JSON.stringify({
                    result: 0x000004,
                    msg: `编译执行失败==> ${stdout}`,
                    path: null
                }))
            }

            // 复制到指定目录
            let deployPath = path.join(Config.DEPLOYPATH, uuid.v4())
            shell.mkdir('-p', deployPath)
            shell.mv(path.join(templateConfig.path, 'dist/*'), deployPath)
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

            console.log('The template is compiled')
            return res.end(JSON.stringify({
                result: 0,
                msg: '成功',
                path: deployPath
            }))
        } catch (error) {
            return res.end(JSON.stringify({
                result: 0x000006,
                msg: `出错 ==> ${error}`,
                path: null
            }))
        }
    })
}

// const upload = (req, res) => {
//     let form = new formidable.IncomingForm()
//     form.parse(req, (err, fields, files) => {
//         console.log(fields, files)
//         res.end('end')
//     })
// }

export default {
    build,
    buildMobile,
    buildDongxing
    // upload
}