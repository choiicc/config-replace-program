'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**********************   Server Config   **********************/
var PORT = 9999;

/**********************    Path Config    **********************/
var DEPLOYPATH = __dirname + '/../deploy';
var CONFIGPATH = __dirname + '/../config';
var HISTORYPATH = __dirname + '/../history';

console.log('The deploy path is ==> ' + DEPLOYPATH);
console.log('The config path is ==> ' + CONFIGPATH);
/**********************  Template Config  **********************/
var TEMPLATE_DEFAULT1_CONFIG = {
    path: __dirname + '/../templates/master/casino-pc-www',
    configFile: 'src/specific/keys.config.json',
    tabLogoFile: 'static/platformimg/favicon.png',
    logoFile: 'src/specific/assets/images/logo.png',
    docPath: 'src/specific/views/quote',
    entryImgPath: 'static/platformimg'

    /***************** mobile templates config *************/
};var TEMPLATE_DEFAULT2_CONFIG = {
    path: __dirname + '/../templates/mobile-master/casino-mobile-www',
    configFile: 'src/keys.config.json',
    tabLogoFile: 'static/favicon.png',
    logoFile: 'src/assets/images/logo.png',
    entryImgPath: 'static/img'

    /**********************  Dongxing Template Config  **********************/
};var TEMPLATE_DEFAULT3_CONFIG = {
    path: __dirname + '/../templates/dongxing-master/casino-pc-dongxing',
    configFile: 'keys.config.json',
    tabLogoFile: 'public/favicon.png',
    logoFile: 'src/assets/img/page/logo.png',
    docPath: 'src/views/html',
    entryImgPath: 'src/assets/img/game'
};

exports.default = {
    PORT: PORT,
    DEPLOYPATH: DEPLOYPATH,
    CONFIGPATH: CONFIGPATH,
    HISTORYPATH: HISTORYPATH,
    TEMPLATE_DEFAULT1_CONFIG: TEMPLATE_DEFAULT1_CONFIG,
    TEMPLATE_DEFAULT2_CONFIG: TEMPLATE_DEFAULT2_CONFIG,
    TEMPLATE_DEFAULT3_CONFIG: TEMPLATE_DEFAULT3_CONFIG
};