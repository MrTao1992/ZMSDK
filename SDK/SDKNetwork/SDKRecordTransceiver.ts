import SDKHttpClient from './SDKHttpClient';
import * as SDKConfigConst from '../SDKConst/SDKConfigConst';
import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';
import SDKRecord from './SDKRecord';
import SDKPacketPool from './SDKPacketPool';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKPageRecord from './SDKPageRecord';
import SDKApp from '../SDKBase/SDKApp';

/**
 * SDKRecordTransceiver
 * 处理课件埋点消息的发送
 */
export default class SDKRecordTransceiver {
    private static SEND_COUNT: number = 0;

    protected _httpClient: SDKHttpClient;

    constructor() {
        this.reset();

        let url: string = '';
        if (
            SDKLogicsCore.parameterVo.enviroment ===
            SDKEnum.TYPE_ENVIRONMENT.PRODUCTION
        ) {
            url = SDKConfigConst.RECORD_OUT_URL;
        } else {
            url = SDKConfigConst.RECORD_OUT_URL_TEST;
        }
        this._httpClient = new SDKHttpClient(url);
        DebugInfo.info('日志URL', url);
    }

    /**
     * 提交事件埋点数据
     * @param name 事件名称
     * @param eventType 事件类型
     * @param eventValue 事件值
     * @param data 扩展参数
     */
    public send(
        name: string,
        data: any = {},
        eventType: number = 0,
        eventValue: number = 1
    ): void {
        // if (name && name === '') {
        //     DebugInfo.error('埋点事件名称为空');
        //     return;
        // }

        // if (SDKLogicsCore.parameterVo.isSplitScreen()) {
        //     return;
        // }

        // if (SDKLogicsCore.parameterVo.enviroment == SDKEnum.TYPE_ENVIRONMENT.PRODUCTION) {
        //     const record: SDKRecord = SDKPacketPool.AcquireRecord(name);
        //     record.event_para = data;
        //     record.event_type = eventType;
        //     record.event_value = eventValue;

        //     record.event_id = this.getEventPreName() + record.event_id;
        //     this.appendParamsToPacket(record);

        //     SDKRecordTransceiver.SEND_COUNT++;
        //     this._httpClient.send(record);
        // }

        SDKApp.instance().newRecordTransceiver.send(name, data, eventType, eventValue);
    }

    /**
     * 提交页面埋点数据
     * @param name 事件名称
     * @param eventType 事件类型
     * @param eventValue 事件值
     * @param data 扩展参数
     */
    public sendPage(
        name: string,
        duration: number = 0,
        data: any = {},
        tracker_tpye: number = 3
    ): void {
        // if (name && name === '') {
        //     DebugInfo.error('埋点事件名称为空');
        //     return;
        // }

        // if (SDKLogicsCore.parameterVo.isSplitScreen()) {
        //     return;
        // }

        // if (SDKLogicsCore.parameterVo.enviroment == SDKEnum.TYPE_ENVIRONMENT.PRODUCTION) {
        //     const record: SDKPageRecord = SDKPacketPool.AcquirePageRecord(name);
        //     record.expand = data;
        //     record.tracker_tpye = tracker_tpye;
        //     record.duration = duration;
        //     record.page_name = this.getEventPreName() + record.name();
    
        //     this.appendPageParamsToPacket(record);
    
        //     SDKRecordTransceiver.SEND_COUNT++;
        //     this._httpClient.send(record);
        // }

        // 新埋点跟就埋点不同，计算页面的停留时间不一样
        SDKApp.instance().newRecordTransceiver.send(name, data, 1, duration);
        // SDKApp.instance().newRecordTransceiver.sendPage(name,duration,data,tracker_tpye);
    }

    public reset(): void {
        SDKRecordTransceiver.SEND_COUNT = 0;
    }

    public destroy(): void {
        this._httpClient.destory();
        this._httpClient = null;
    }

    /**
     * 向数据包追加参数数据
     * @param packet 数据包
     */
    private appendParamsToPacket(record: SDKRecord): void {
        let exPare: any;

        record.user_id = SDKLogicsCore.parameterVo.userId;
        record.app_id = SDKLogicsCore.parameterVo.appId;
        record.session_id = SDKLogicsCore.parameterVo.sessionId;
        record.event_time_start = new Date().getTime();

        if (record.event_type === SDKRecordEventConst.EVENT_TYPE.TYPE_COUNT) {
            record.event_value = 1;
        }
        exPare = record.event_para;
        exPare.gameId = SDKLogicsCore.parameterVo.gameId;
        exPare.scene = SDKLogicsCore.sceneState.curSceneName();
        exPare.sceneIndex = SDKLogicsCore.sceneState.curIndex;
        if (SDKLogicsCore.parameterVo.isGameClass()) {
            exPare.lessonId = SDKLogicsCore.lessonInfo.lessonId;
            exPare.lessonUid = SDKLogicsCore.lessonInfo.lessonUID;
            exPare.lessonName = SDKLogicsCore.lessonInfo.courseName;
        } else if (SDKLogicsCore.parameterVo.isGameReplay()) {
            exPare.lessonUid = SDKLogicsCore.parameterVo.lessonUid;
        }
        exPare.buType = SDKLogicsCore.parameterVo.buType;
    }

    private appendPageParamsToPacket(record: SDKPageRecord): void {
        let exPare: any;

        record.user_id = SDKLogicsCore.parameterVo.userId;
        record.app_id = SDKLogicsCore.parameterVo.appId;
        record.session_id = SDKLogicsCore.parameterVo.sessionId;
        record.time_start = new Date().getTime();
        record.page_id = SDKLogicsCore.parameterVo.gameOrigin;

        exPare = record.expand;
        exPare.gameId = SDKLogicsCore.parameterVo.gameId;
        exPare.scene = SDKLogicsCore.sceneState.curSceneName();
        exPare.sceneIndex = SDKLogicsCore.sceneState.curIndex;
        if (SDKLogicsCore.parameterVo.isGameClass()) {
            exPare.lessonId = SDKLogicsCore.lessonInfo.lessonId;
            exPare.lessonUid = SDKLogicsCore.lessonInfo.lessonUID;
            exPare.lessonName = SDKLogicsCore.lessonInfo.courseName;
        } else if (SDKLogicsCore.parameterVo.isGameReplay()) {
            exPare.lessonUid = SDKLogicsCore.parameterVo.lessonUid;
        }
        exPare.buType = SDKLogicsCore.parameterVo.buType;
    }

    /**
     * 获取事件类型前缀
     */
    private getEventPreName(): string {
        let eventPreName: string;

        eventPreName = '';

        if (SDKLogicsCore.parameterVo.isGamePreview()) {
            eventPreName += SDKRecordEventConst.PREVIEW;
        } else if (SDKLogicsCore.parameterVo.isGameClass()) {
            eventPreName += SDKRecordEventConst.STUDY;
        } else if (SDKLogicsCore.parameterVo.isGameObserver()) {
            eventPreName += SDKRecordEventConst.WATCH;
        } else if (SDKLogicsCore.parameterVo.isReplay()) {
            eventPreName += SDKRecordEventConst.REPLAY;
        }

        if (SDKLogicsCore.parameterVo.isZMG()) {
            if (SDKApp.instance().thirdInterface.isZMG2()) {
                eventPreName += SDKRecordEventConst.ZMG2;
            } else {
                eventPreName += SDKRecordEventConst.ZMG;
            }
        } else if (SDKLogicsCore.parameterVo.isZML()) {
            eventPreName += SDKRecordEventConst.ZML;
        }

        return eventPreName;
    }
}