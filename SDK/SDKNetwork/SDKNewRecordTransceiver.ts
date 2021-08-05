import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * SDKNewRecordTransceiver
 * 处理课件埋点消息的发送
 */
export default class SDKNewRecordTransceiver {
    private static APP_ID: string = '11264';
    private static APP_VERSION: string = '1.0.0';

    private _ZM_JSSDK = window['ZM_JSSDK'];
    private _subUuid = '';

    constructor() {
        this.reset();
        this.setConfig();
    }

    private setConfig() {
        let env = 'fat';

        if (!this._ZM_JSSDK) {
            return;
        }

        if (SDKLogicsCore.parameterVo.enviroment === SDKEnum.TYPE_ENVIRONMENT.PRODUCTION) {
            env = 'prod';
        }

        this._ZM_JSSDK.setConfig({
            environment: env,
            logLevel: 'error',
            useBeacon: false
        });

        this.setDefaults();
        this.getSubCoursewareUuid();
    }

    public setDefaults() {
        let lessonUid = '0';
        let userId = '0';
        let appId = SDKNewRecordTransceiver.APP_ID;
        let appVersion = SDKNewRecordTransceiver.APP_VERSION;

        if (!this._ZM_JSSDK) {
            return;
        }

        lessonUid = this.getLessonUid();
        userId = SDKLogicsCore.parameterVo.user_id;
        if (userId === '' || userId === '0') {
            userId = SDKLogicsCore.parameterVo.userId;
        }

        if (window['SDKConfig']) {
            appId = window['SDKConfig'].appId || appId;
            appVersion = window['SDKConfig'].appVersion || appVersion;
        }

        this._ZM_JSSDK.setDefaults({
            appId: appId,
            appVersion: appVersion,
            userId: userId,
            lessonUid: lessonUid,
            role: this.getRole(),
            roomSessionId:SDKLogicsCore.parameterVo.roomSessionId
        });
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
        if (name && name === '') {
            DebugInfo.error('埋点事件名称为空!');
            return;
        }
        if (!this._ZM_JSSDK || !this._ZM_JSSDK.sendEvent) {
            return;
        }
        if (SDKLogicsCore.parameterVo.isSplitScreen()) {
            return;
        }

        let log = {};
        this.appendParamsToPacket(log, name, data, eventType, eventValue);
        this._ZM_JSSDK.sendEvent(log);
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
        if (name && name === '') {
            DebugInfo.error('埋点事件名称为空');
            return;
        }

        if (!this._ZM_JSSDK || !this._ZM_JSSDK.sendCustomPage) {
            return;
        }

        if (SDKLogicsCore.parameterVo.isSplitScreen()) {
            return;
        }

        let log = {};
        this.appendPageParamsToPacket(log, name, duration, data, tracker_tpye);

        this._ZM_JSSDK.sendCustomPage(log);
    }

    public reset(): void {
        this._subUuid = '';
    }

    public destroy(): void {
        this.reset();
        this._ZM_JSSDK = null;
    }

    /**
     * 向数据包追加参数数据
     * @param packet 数据包
     */
    private appendParamsToPacket(
        log: any,
        name: string,
        data: any = {},
        eventType: number = 0,
        eventValue: number = 1): void {

        let exPare: any;
        let date: Date = new Date();

        log.eventId = this.getEventPreName() + name;
        log.eventType = eventType;
        log.eventValue = eventValue;
        if (log.event_type === SDKRecordEventConst.EVENT_TYPE.TYPE_COUNT) {
            log.event_value = 1;
        }
        log.eventParam = data;

        exPare = log.eventParam;
        exPare.gameId = SDKLogicsCore.parameterVo.gameId;
        exPare.scene = SDKLogicsCore.sceneState.curSceneName();
        exPare.sceneIndex = SDKLogicsCore.sceneState.curIndex;
        exPare.parentAppId = SDKLogicsCore.parameterVo.appId;
        exPare.appVersion = SDKLogicsCore.trackInfo.appVersion;
        exPare.timeStamp = date.getTime();
        exPare.localTime = date.toLocaleString() + '.' + exPare.timeStamp % 1000;
        exPare.nameSpace = this.getNameSpace();
        exPare.coursewareUuid = SDKLogicsCore.parameterVo.coursewareUuid;
        exPare.subCoursewareUuid = this._subUuid;
        exPare.coursewareId  = SDKLogicsCore.parameterVo.coursewareId;
        exPare.versionCode = SDKLogicsCore.parameterVo.versionCode;
        exPare.buType = SDKLogicsCore.parameterVo.buType;
    }

    private appendPageParamsToPacket(
        log: any,
        name: string,
        duration: number = 0,
        data: any = {},
        tracker_tpye: number = 3): void {

        let exPare: any;
        let date: Date = new Date();

        // 这个页面停留时间，埋点自己计算了，这里就不赋值了
        // log.duration = duration;
        log.pageName = this.getEventPreName() + name;
        log.pageId = SDKLogicsCore.parameterVo.gameOrigin;
        log.pageParam = data;

        exPare = log.pageParam;
        exPare.gameId = SDKLogicsCore.parameterVo.gameId;
        exPare.scene = SDKLogicsCore.sceneState.curSceneName();
        exPare.sceneIndex = SDKLogicsCore.sceneState.curIndex;
        exPare.parentAppId = SDKLogicsCore.parameterVo.appId;
        exPare.appVersion = SDKLogicsCore.trackInfo.appVersion;
        exPare.timeStamp = date.getTime();
        exPare.localTime = date.toLocaleString() + '.' + exPare.timeStamp % 1000;
        exPare.nameSpace = this.getNameSpace();
        exPare.coursewareUuid = SDKLogicsCore.parameterVo.coursewareUuid;
        exPare.subCoursewareUuid = this._subUuid;
        exPare.coursewareId  = SDKLogicsCore.parameterVo.coursewareId;
        exPare.versionCode = SDKLogicsCore.parameterVo.versionCode;
        exPare.buType = SDKLogicsCore.parameterVo.buType;
    }

    private getSubCoursewareUuid(): string {
        if (window['hdLog']) {
            this._subUuid = window['hdLog'].subCoursewareUuid;
        } else {
            this._subUuid = new Date().getTime().toString();
        }
        return this._subUuid;
    }

    /**
     * 获取事件类型前缀
     */
    private getEventPreName(): string {
        let eventPreName: string;

        eventPreName = '';
        if (SDKLogicsCore.parameterVo.isGamePreview()) {
            eventPreName = SDKRecordEventConst.PREVIEW;
        } else if (SDKLogicsCore.parameterVo.isGameClass()) {
            eventPreName = SDKRecordEventConst.STUDY;
        } else if (SDKLogicsCore.parameterVo.isGameObserver()) {
            eventPreName = SDKRecordEventConst.WATCH;
        } else if (SDKLogicsCore.parameterVo.isReplay()) {
            eventPreName = SDKRecordEventConst.REPLAY;
        }
        eventPreName += SDKRecordEventConst.ZMG;
        return eventPreName;
    }

    private getLessonUid(): string {
        if (SDKLogicsCore.parameterVo.isGameClass()) {
            return SDKLogicsCore.lessonInfo.lessonUID;
        } else if (SDKLogicsCore.parameterVo.isGameReplay()) {
            return SDKLogicsCore.parameterVo.lessonUid;
        }
        return SDKLogicsCore.parameterVo.lessonUid;
    }

    private getNameSpace(): string {
        let nameSpace = 'preview';
        if (SDKLogicsCore.parameterVo.isGamePreview()) {
            nameSpace = 'preview';
        } else if (SDKLogicsCore.parameterVo.isGameReplay()) {
            nameSpace = 'replay';
        } else if (SDKLogicsCore.parameterVo.isGameClass()) {
            nameSpace = 'class';
            if (SDKLogicsCore.parameterVo.isGameObserver()) {
                nameSpace = 'watch';
            } else if (SDKLogicsCore.parameterVo.isRepairRecord) {
                nameSpace = 'repairRecord';
            } else if (SDKLogicsCore.parameterVo.isRepairPlay) {
                nameSpace = 'repairPlay';
            } else if (SDKLogicsCore.parameterVo.isGameTrain()) {
                nameSpace = 'train';
            }
        }
        return nameSpace;
    }

    private getRole(): string {
        let role = 'none';
        switch (SDKLogicsCore.parameterVo.role) {
            case SDKEnum.USER_ROLE.STUDENT:
                role = 'student';
                break;
            case SDKEnum.USER_ROLE.TEACHER:
                role = 'teacher';
                break;
            case SDKEnum.USER_ROLE.OBSERVER:
                role = 'watcher';
                break;
            case SDKEnum.USER_ROLE.TRAINER:
                role = 'trainer';
                break;
        }
        return role;
    }
}