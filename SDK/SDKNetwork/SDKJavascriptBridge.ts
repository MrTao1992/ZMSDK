/**
 * 该文件主要是处理ipad和apad 与游戏的信息交互
 * WebViewJavascriptBridge由设备的控件注入到window对象的
 * 提示报错请忽略他们，运行时就有该对象了。
 */

import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';

let isReady: boolean = false;
let isLoad: boolean = false;

// ios 前置注入
function setupWebViewJavascriptBridge(callback) {
    if ((window as any).WebViewJavascriptBridge) {
        return callback((window as any).WebViewJavascriptBridge);
    }
    if ((window as any).WVJBCallbacks) {
        return (window as any).WVJBCallbacks.push(callback);
    }
    (window as any).WVJBCallbacks = [callback];
    const WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
    DebugInfo.info('jsb init start');
}

// android 后置注入
function connectWebViewJavascriptBridge(callback) {
    if ((window as any).WebViewJavascriptBridge) {
        callback((window as any).WebViewJavascriptBridge);
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady',
            function() {
                callback((window as any).WebViewJavascriptBridge);
            },
            false
        );
    }
    DebugInfo.info('android jsb init start');
}

function registerHandlers(bridge) {
    DebugInfo.info('jsb init end');

    bridge.registerHandler('jsbReceiveMsg', function(data, responseCallback) {
        data = JSON.parse(data);
        SDKApp.instance().transceiver.jsbReceiveMsg(data);
    });

    if ((window as any).WebViewJavascriptBridge) {
        DebugInfo.info('jsb gameReady...');
        // window.WebViewJavascriptBridge.callHandler('jsbMessage', {
        //     action: 'gameReady'
        // });
        SDKApp.instance().transceiver.sendMsg('gameReady',null,false);
        SDKApp.instance().jsbReady = true;
    }
}

function initJsb() {
    if (!isLoad || !isReady) {
        return;
    }

    if (
        SDKLogicsCore.parameterVo.isIpad() ||
        SDKLogicsCore.parameterVo.isIphone()
    ) {
        setupWebViewJavascriptBridge((bridge) => registerHandlers(bridge));
    } else if (
        SDKLogicsCore.parameterVo.isApad() ||
        SDKLogicsCore.parameterVo.isAphone()
    ) {
        connectWebViewJavascriptBridge((bridge) => registerHandlers(bridge));
    }
}

(window as any).onload = () => {
    isLoad = true;
    initJsb();
};

export function init() {
    if (!SDKLogicsCore.parameterVo.isJsb()) {
        return;
    }
    isReady = true;
    initJsb();
}