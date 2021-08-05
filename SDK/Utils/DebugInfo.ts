import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as UtilsType from './UtilsType';

export enum DEBUG_LEVEL {
    NONE = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

var gameConfig = { isDebug: true, level: DEBUG_LEVEL.INFO };
(window as any).gameConfig = gameConfig;

export function init() {
    if (
        SDKLogicsCore.parameterVo.enviroment ===
        SDKEnum.TYPE_ENVIRONMENT.PRODUCTION
    ) {
        setDebugLevel(DEBUG_LEVEL.WARN);
    } else {
        if (SDKLogicsCore.parameterVo.isDebugInfo) {
            setDebugLevel(DEBUG_LEVEL.INFO);
        } else {
            setDebugLevel(DEBUG_LEVEL.WARN);
        }
    }
}

export function setDebugLevel(value: DEBUG_LEVEL): void {
    gameConfig.level = value;
}

export function getDebugLevel(): DEBUG_LEVEL {
    return gameConfig.level;
}

export function setIsDebug(value: boolean): void {
    gameConfig.isDebug = value;
}

export function getIsDebug(): boolean {
    return gameConfig.isDebug;
}

export function info(msg: string, ...args): void {
    if (!gameConfig.isDebug || gameConfig.level > DEBUG_LEVEL.INFO) {
        return;
    }
    msg = parse(msg, args);
    console.log(msg, args, new Date().getTime());
    addToDebugView(msg, args);
}

export function warn(msg: string, ...args): void {
    if (!gameConfig.isDebug || gameConfig.level > DEBUG_LEVEL.WARN) {
        return;
    }
    msg = parse(msg, args);
    console.warn(msg, args, new Date().getTime());
    addToDebugView(msg, args);
}

export function error(msg: string, ...args): void {
    if (!gameConfig.isDebug || gameConfig.level > DEBUG_LEVEL.ERROR) {
        return;
    }
    msg = parse(msg, args);
    console.error(msg, args, new Date().getTime());
    addToDebugView(msg, args);
}

export function alert(title: string, msg: string): void {
    if (!gameConfig.isDebug || SDKLogicsCore.parameterVo.isProduction()) {
        return;
    }
    showAlert(title, msg);
}

function parse(msg: string, args): string {
    let result: string = '';

    result = 'hdGameInfo_';
    if (SDKLogicsCore.parameterVo.isSplitScreen()) {
        result += 'splite_';
    }
    if (SDKLogicsCore.parameterVo.userId) {
        result += SDKLogicsCore.parameterVo.userId;
    }
    result += ':' + msg;
    return result;
}

var megs = [];
var MAX = 50;
function addToDebugView(msg: string, args) {
    let index = 0, count = 0;
    let argsContent: string;

    if (SDKLogicsCore.parameterVo.isProduction()) {
        return;
    }
    if (!(SDKLogicsCore.parameterVo.isIpad() ||
        SDKLogicsCore.parameterVo.isApad() ||
        SDKLogicsCore.parameterVo.isAphone() ||
        SDKLogicsCore.parameterVo.isIphone())) {
        return;
    }

    argsContent = '[';
    count = args.length;
    for (index = 0; index < count; index++) {
        if (UtilsType.isEmpty(args[index])) {
            continue;
        }
        if (args[index] as Object) {
            msg += (index == 0 ? "" : ",") + JSON.stringify(args[index]);
        } else {
            msg += (index == 0 ? "" : ",") + args[index].toString();
        }
    }
    argsContent += "]";
    msg += argsContent + "  " + new Date().getTime();

    megs.push(msg);
    if (megs.length >= MAX) {
        megs.shift();
    }

    showMessage();
}

function showMessage(): void {
    let index = 0, count = 0;
    let content: string = '';

    count = megs.length;
    for (index = 0; index < count; index++) {
        content += megs[index] + '\n';
    }

    if (!debugView) {
        createdebugView();
    }
    if (isShow) {
        debugView.innerText = content;
    } else {
        debugView.innerText = '';
    }
}

var debugView: any;
var debugBtn: any;
var isShow: boolean = false;
function createdebugView(): void {
    debugView = document.createElement('div');
    debugView.style.backgroundColor = '#2F2F37';
    debugView.style.width = '80%';
    debugView.style.height = '100%';
    debugView.style.position = 'absolute';
    debugView.style['overflow-x'] = "auto";
    debugView.style['text-align'] = "left";
    document.body.appendChild(debugView);
    debugView.style.display = 'none';
    debugView.innerText = '';

    debugBtn = document.createElement('button');
    debugBtn.innerText = 'debugInfo';
    debugBtn.style.position = 'absolute';
    debugBtn.onclick = function (e: any) {
        isShow = !isShow;
        if (isShow) {
            debugView.style.display = 'block';
            showMessage();
        } else {
            debugView.style.display = 'none';
            debugView.innerText = '';
        }
    }
    document.body.appendChild(debugBtn);
}

var alverView: any;
var titleEle: any;
var contentEle: any;
function showAlert(title: string, msg: string) {
    if (!alverView) {
        alverView = document.createElement('div');
        alverView.style.backgroundColor = '#ffffff';
        alverView.style.width = '8rem';
        alverView.style.height = '4.5rem';
        alverView.style.position = 'absolute';
        alverView.style.left = '50%';
        alverView.style.top = '50%';
        alverView.style['margin-left'] = '-4rem';
        alverView.style['margin-top'] = '-2.25rem';
        alverView.style['z-index'] = '2001';
        document.body.appendChild(alverView);
        alverView.style.display = 'none';

        titleEle = document.createElement('p');
        titleEle.style['text-align'] = "center";
        titleEle.style['font-size'] = '0.6rem';
        titleEle.style['margin'] = '0.1rem';
        titleEle.style.color = '#000000';
        alverView.appendChild(titleEle);

        contentEle = document.createElement('p');
        contentEle.style['text-align'] = "left";
        contentEle.style['font-size'] = '0.4rem';
        contentEle.style['margin'] = '0.1rem';
        contentEle.style.color = '#000000';
        alverView.appendChild(contentEle);

        let close = document.createElement('button');
        close.innerText = '关 闭';
        close.style.position = 'absolute';
        close.style.bottom = '0.2rem';
        close.style.left = '50%';
        close.style['font-size'] = '0.4rem';
        close.style['margin-left'] = '-0.8rem';
        close.onclick = function (e: any) {
            alverView.style.display = 'none';
        }
        alverView.appendChild(close);
    }
    titleEle.innerText = title;
    contentEle.innerText = msg;
    alverView.style.display = 'block';
}