import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';

/**
 * SDKLogTransceiver
 * 处理课件埋点消息的发送
 */
export default class SDKLogTransceiver {
    private _target: Window;

    constructor() {
        this._target = window.parent && window.parent.window;
    }

    /**
     * 提交事件埋点数据
     * @param name 事件名称
     * @param data 扩展参数
     */
    public send(name: string, data: any = {}): void {
        if (name && name === '') {
            DebugInfo.error('日志名称为空');
            return;
        }
        if (SDKLogicsCore.parameterVo.isSplitScreen()) {
            return;
        }
        let log = {};
        this.appendParamsToLog(log, name, data);

        if (SDKLogicsCore.parameterVo.isJsb()) {
            if (window['WebViewJavascriptBridge']) {
                window['WebViewJavascriptBridge'].callHandler(
                    'log',
                    JSON.stringify(log)
                );
            }
        } else if (SDKLogicsCore.parameterVo.isPost()) {
            log = this.appendParamsToPC(log);
            //this._target.postMessage(log, '*');
            if(window['ZMClientBridge']) {
                window['ZMClientBridge'].ZMGClientOnly && window['ZMClientBridge'].ZMGClientOnly(log);
            }
        }

        //往新的埋点发送消息
        SDKApp.instance().newRecordTransceiver.send(name,data);
        //DebugInfo.info('发送日志:', name);
    }

    /**
     * 向数据包追加参数数据
     * @param packet 数据包
     */
    private appendParamsToLog(log: any, name: string, data: any = {}): void {
        log.action = name;
        log.data = data;
        log.url = window.location.href;
        log.time = new Date().getTime();
        log.id = SDKLogicsCore.parameterVo.gameId;
        log.source = 'game';
        if (SDKLogicsCore.parameterVo.isZML()) {
            log.kjType = 'zml';
        } else if (SDKLogicsCore.parameterVo.isZMG()) {
            log.kjType = 'zmg';
        }
        log.scene = SDKLogicsCore.sceneState.curSceneName();
        log.sceneIndex = SDKLogicsCore.sceneState.curIndex;
        if (SDKLogicsCore.parameterVo.isGameClass()) {
            log.lessonUid = SDKLogicsCore.lessonInfo.lessonUID;
        } else if (SDKLogicsCore.parameterVo.isGameReplay()) {
            log.lessonUid = SDKLogicsCore.parameterVo.lessonUid;
        }
    }

    private appendParamsToPC(log: any): object {
        let data = <any>{};
        let userId = SDKLogicsCore.parameterVo.userId;

        data.action = SDKRegistCommand.GAME_LOG;
        data.source = log.source;
        data.id = log.id;
        data.data = log;
        data.kjType = log.kjType;
        data._sendId = userId;
        data._isMainFrame = false;
        data.toMobiles = [userId];
        data.notSaveMobile = [userId];

        return data;
    }
}