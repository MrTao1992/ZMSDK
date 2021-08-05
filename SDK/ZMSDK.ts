/**
 * ZMSDK：该类是外界调用SDK的唯一调用接口
 */
import * as SDKLogicsCore from './SDKLogics/SDKLogicsCore';
import SDKPacket from './SDKNetwork/SDKPacket';
import SDKApp from './SDKBase/SDKApp';
import SDKPacketPool from './SDKNetwork/SDKPacketPool';
import * as SDKJavascriptBridge from './SDKNetwork/SDKJavascriptBridge';
import * as SDKEnum from './SDKConst/SDKEnum';
import * as DebugInfo from './Utils/DebugInfo';
import SDKCommandBase from "./SDKCommand/SDKCommandBase";
import * as SDKRegistCommand from './SDKConst/SDKRegistCommand';

const RUL: string = window.location.search;

class ZMSDKCLASS {
    /**
     * 初始化SDK
     */
    SDKInit() {
        this.parseUrl(RUL);
        DebugInfo.init();
        SDKApp.instance().init();
        SDKRegistCommand.registCommands();
        DebugInfo.info('SDK init');
    }

    gameReady(): void {
        DebugInfo.info('SDK ready');
        SDKApp.instance().gameReady();
        SDKJavascriptBridge.init();
        if (this.isSplitScreen()) {
            this.sendMsg(SDKRegistCommand.SPLIT_GAME_READY, this.userId(), false);
        } else if (this.isPost()) {
            this.sendMsg(SDKRegistCommand.GAEM_READY, null, false);
        }
        SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.GET_GAME_CONFIG);
    }

    /**
     * 解析用户URL参数
     * @param url 用户游戏加载地址
     */
    parseUrl(url: string): boolean {
        if (SDKLogicsCore.parameterVo.isInit) {
            return false;
        }
        return SDKLogicsCore.parameterVo.parseUrl(url);
    }

    /**
     * 课件id
     */
    lessonId(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.lessonId;
    }

    /**
     * 游戏id
     */
    gameId(): number {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.gameId;
    }

    /**
     * 控制者id
     */
    controllerId(): string {
        return SDKLogicsCore.controllState.controllerId;
    }

    /**
     * 用户id
     */
    userId(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.userId;
    }

    /**
     * 被监视的id
     */
    oberverId(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.observerId;
    }

    /**
     * 是否是分屏模式
     */
    isSplitScreen(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isSplitScreen();
    }

    /**
     * 是否是预览模式
     */
    isGamePreview(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isGamePreview();
    }

    /**
     * 是否是教学模式
     */
    isGameClass(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isGameClass();
    }

    /**
     * 是否是监课模式
     */
    isObserverClass(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isGameObserver();
    }

    /**
     * 是否是回放模式
     */
    isGameReplay(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isGameReplay();
    }

    /**
     * 是否是老师
     */
    isTeacher(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isTeacher();
    }

    /**
     * 是否是学生
     */
    isStudent(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isStudent();
    }

    /**
     * 自己是否是控制者
     */
    isOwn(): boolean {
        return SDKLogicsCore.controllState.isOwn();
    }

    /**
     * 自己是否是完全控制着。。。只能有且只有自己一个人操作
     */
    isFullOwn(): boolean {
        return SDKLogicsCore.controllState.isFullOwn();
    }

    /**
     * 是否是观察者
     */
    isObserver(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isObserver();
    }

    /**
     * 是否是销售
     */
    isSeller(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isSeller();
    }

    /**
     * 被监课对象是否老师
     */
    isOberverTeacher(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isOberverTeacher();
    }

    /**
     * 被监课对象是否学生
     */
    isOberverStudent(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isOberverStudent();
    }

    /**
     * 被监课的对象是否有权限
     */
    isObserverOwn(): boolean {
        return SDKLogicsCore.controllState.isObserverOwn();
    }

    /**
     * 被监课的对象是否有完全权限
     */
    isOberverFullOwn(): boolean {
        return SDKLogicsCore.controllState.isOberverFullOwn();
    }

    /**
     * 回放学生
     */
    isReplayStudent(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isReplayStudent();
    }

    /**
     * 回放老师
     */
    isReplayTeacher(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isReplayTeacher();
    }

    /**
     * 回放对象是否有权限
     */
    isReplayOwn(): boolean {
        return SDKLogicsCore.controllState.isReplayOwn();
    }

    /**
     * 回放对象是否有完全权限
     */
    isReplayFullOwn(): boolean {
        return SDKLogicsCore.controllState.isReplayFullOwn();
    }

    isPc(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isPc();
    }

    isIpad(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isIpad();
    }

    isApad(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isApad();
    }

    isJsb(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isJsb();
    }

    isPost(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isPost();
    }

    isLocal(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isLocal;
    }

    isMix(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isMix;
    }

    isGameTrain(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isGameTrain();
    }

    isRepair(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isRepair;
    }

    isRepairPlay(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isRepairPlay;
    }

    isRepairRecord(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.isRepairRecord;
    }

    isLocalVideo(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.localVideo;
    }

    /**
     * 游戏根目录
     */
    gameRoot(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.gameRoot;
    }

    /**
     * 游戏根入口文件
     */
    gameOrigin(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.gameOrigin;
    }

    /**
     * 发送消息
     * @param name 消息名称
     * @param data 消息数据
     * @param target 发送的目标
     */
    sendMsg(
        name: string,
        data: any = null,
        isMainIframe: boolean = true,
        target?: Window
    ) {
        SDKApp.instance().transceiver.sendMsg(name, data, isMainIframe, target);
    }

    /**
     * 发送消息包
     */
    // export function sendPacket(packet: SDKPacket, target: Window = window.parent) {
    //     SDKApp.instance().transceiver.sendPacket(packet, target);
    // }

    /**
     * 提交埋点数据
     * @param name 事件名称
     * @param eventType 事件类型
     * @param eventValue 事件值
     * @param data 扩展参数
     */
    sendLog(
        name: string,
        data: any = {},
        eventType: number = 0,
        eventValue: number = 1
    ) {
        SDKApp.instance().recordTransceiver.send(name, data, eventType, eventValue);
    }

    /**
     * 提交页面埋点数据
     * @param name
     * @param data
     * @param eventType
     * @param eventValue
     */
    sendPageLog(
        name: string,
        duration: number = 0,
        data: any = {},
        tracker_tpye: number = 3
    ) {
        SDKApp.instance().recordTransceiver.sendPage(
            name,
            duration,
            data,
            tracker_tpye
        );
    }

    /**
     * 发送日志
     * @param name 日志名称
     * @param data 日志数据
     */
    log(name: string, data: any = {}) {
        SDKApp.instance().logTransceiver.send(name, data);
    }

    /**
     * 处理消息包,不向学生或者老师发送,直接处理相应的CMD
     * @param packet 消息包
     */
    handlePacket(packet: SDKPacket): void {
        SDKApp.instance().packetHandler.dispatcherCMD(packet);
    }

    /**
     * 处理消息,不向学生或者老师发送,直接处理相应的CMD
     * @param name 消息名称
     * @param data 消息数据
     */
    handleMessage(name: string, data: any = null) {
        let packet: SDKPacket;
        packet = SDKPacketPool.Acquire(name);
        packet.data = data;
        SDKApp.instance().packetHandler.dispatcherCMD(packet);
    }

    /**
     * 注册消息处理对象
     * @param name 消息名称
     * @param value 消息处理对象。。。SKDCommandBase的子对象
     */
    registerHandler(name: string, value: any): void {
        SDKApp.instance().transceiver.packetHandler.registerHandler(name, value);
    }

    /**
     * 注销消息处理对象
     * @param name 消息名称
     */
    unRegisterHandler(name: string): void {
        SDKApp.instance().transceiver.packetHandler.unRegisterHandler(name);
    }

    /**
     * 初始化视图
     */
    initView(): void {
        SDKApp.instance().initView();
    }

    /**
     * 更新
     * @param dt
     */
    update(dt: number): void {
        SDKApp.instance().update(dt);
    }

    /**
     * 智能补课按钮控制状态
     * 改方法与 isBtnShow,isBtnTeacherShow,isBtnFullShow,isBtnTeacherFullShow 进行&& 运算
     */
    isStepBtnShow(): boolean {
        if (this.isRepairRecord() && SDKLogicsCore.repairInfo.recordType != SDKEnum.TYPE_RECORD.GAME) {
            return false;
        }
        if (this.isRepairPlay() && this.isOwn()) {
            return false;
        }
        return true;
    }

    /**
     * 按钮状态显示，仅拥有权限就显示
     */
    isBtnShow(): boolean {
        if (this.isGamePreview() || this.isOwn() ||
            this.isObserverOwn() || this.isReplayOwn()) {
            return true;
        }
        return false;
    }

    /**
     * 按钮状态显示，只有老师并且仅有权限的时候才显示
     */
    isBtnTeacherShow(): boolean {
        if (
            this.isGamePreview() ||
            (this.isOwn() && this.isTeacher()) ||
            (this.isObserverOwn() && this.isOberverTeacher()) ||
            (this.isReplayOwn() && this.isReplayTeacher())
        ) {
            return true;
        }
        return false;
    }

    /**
     * 按钮状态显示，只有完全控制者的时候才显示
     */
    isBtnFullShow(): boolean {
        if (
            this.isGamePreview() ||
            this.isFullOwn() ||
            this.isOberverFullOwn() ||
            this.isReplayFullOwn()
        ) {
            return true;
        }
        return false;
    }

    /**
     * 按钮状态显示，只有老师并且是完全控制者的时候才显示
     */
    isBtnTeacherFullShow(): boolean {
        if (
            this.isGamePreview() ||
            (this.isFullOwn() && this.isTeacher()) ||
            (this.isOberverFullOwn() && this.isOberverTeacher()) ||
            (this.isReplayFullOwn() && this.isReplayTeacher())
        ) {
            return true;
        }
        return false;
    }

    /**
     * 视频本地化播放
     */
    isLocalPlay(): boolean {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        // if (SDKLogicsCore.parameterVo.isOld) {
        //     if (
        //         SDKLogicsCore.parameterVo.isIpad() &&
        //         SDKLogicsCore.parameterVo.isJsb()
        //     ) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }

        return SDKLogicsCore.parameterVo.isMix;
    }

    /**
     * 音频本地化播放
     */
    isLocalMusic(): boolean {
        if (this.isLocalPlay()) {
            return true;
        }
        return false;
    }

    /**
     * PC端混音
     */
    isPcMix(): boolean {
        let result: boolean = false;
        if (!this.isPc() ||
            !this.isLocal() ||
            this.isRepair()
        ) {
            return false;
        }
        if (!window['ZMClientBridge']) {
            return false;
        }
        if (this.isTeacher() || this.isStudent()) {
            result = true;
        }
        return result;
    }

    sdkVersion(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.sdkVersion;
    }

    gameVersion(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.gameVersion;
    }

    coursewareId(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.coursewareId;
    }

    versionCode(): string {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.versionCode;
    }

    courseWareLevel(): number {
        if (!SDKLogicsCore.parameterVo.isInit) {
            this.parseUrl(RUL);
        }
        return SDKLogicsCore.parameterVo.courseWareLevel;
    }

    controllerLastMainPacket(): SDKPacket {
        return SDKLogicsCore.userInfos.controllerLastMainPacket();
    }
}

let zmsdk = new ZMSDKCLASS();
let ZMSDK = {
    /**初始化SDK*/
    SDKInit() { zmsdk.SDKInit(); },

    /**游戏准备*/
    gameReady() { zmsdk.gameReady(); },

    /**课件id*/
    lessonId(): string { return zmsdk.lessonId(); },

    /**游戏id*/
    gameId(): number { return zmsdk.gameId(); },

    /**控制者id*/
    controllerId(): string { return zmsdk.controllerId(); },

    /**用户id*/
    userId(): string { return zmsdk.userId(); },

    /**被监视的id*/
    oberverId(): string { return zmsdk.oberverId(); },

    /**是否是分屏模式*/
    isSplitScreen(): boolean { return zmsdk.isSplitScreen(); },

    /**是否是预览模式*/
    isGamePreview(): boolean { return zmsdk.isGamePreview(); },

    /**是否是教学模式*/
    isGameClass(): boolean { return zmsdk.isGameClass(); },

    /**是否是监课模式*/
    isObserverClass(): boolean { return zmsdk.isObserverClass(); },

    /**是否是回放模式*/
    isGameReplay(): boolean { return zmsdk.isGameReplay(); },

    /**是否是老师*/
    isTeacher(): boolean { return zmsdk.isTeacher(); },

    /**是否是学生*/
    isStudent(): boolean { return zmsdk.isStudent(); },

    /**自己是否是控制者*/
    isOwn(): boolean { return zmsdk.isOwn(); },

    /**自己是否是完全控制着。。。只能有且只有自己一个人操作*/
    isFullOwn(): boolean { return zmsdk.isFullOwn(); },

    /**是否是观察者*/
    isObserver(): boolean { return zmsdk.isObserver(); },

    /**是否是销售*/
    isSeller(): boolean { return zmsdk.isSeller(); },

    /**被监课对象是否老师*/
    isOberverTeacher(): boolean { return zmsdk.isOberverTeacher(); },

    /**被监课对象是否学生*/
    isOberverStudent(): boolean { return zmsdk.isOberverStudent(); },

    /**被监课的对象是否有权限*/
    isObserverOwn(): boolean { return zmsdk.isObserverOwn(); },

    /**被监课的对象是否有完全权限*/
    isOberverFullOwn(): boolean { return zmsdk.isOberverFullOwn(); },

    /**回放学生*/
    isReplayStudent(): boolean { return zmsdk.isReplayStudent(); },

    /** 回放老师*/
    isReplayTeacher(): boolean { return zmsdk.isReplayTeacher(); },

    /**回放对象是否有权限*/
    isReplayOwn(): boolean { return zmsdk.isReplayOwn(); },

    /**回放对象是否有完全权限*/
    isReplayFullOwn(): boolean { return zmsdk.isReplayFullOwn(); },

    isPc(): boolean { return zmsdk.isPc(); },

    isIpad(): boolean { return zmsdk.isIpad(); },

    isApad(): boolean { return zmsdk.isApad(); },

    isJsb(): boolean { return zmsdk.isJsb(); },

    isLocal(): boolean { return zmsdk.isLocal(); },

    isMix(): boolean { return zmsdk.isMix(); },

    isGameTrain(): boolean { return zmsdk.isGameTrain(); },

    isRepair(): boolean { return zmsdk.isRepair(); },

    isRepairPlay(): boolean { return zmsdk.isRepairPlay(); },

    isRepairRecord(): boolean { return zmsdk.isRepairRecord(); },

    isLocalVideo(): boolean { return zmsdk.isLocalVideo(); },

    /**游戏根目录*/
    gameRoot(): string { return zmsdk.gameRoot(); },

    /**游戏根入口文件*/
    gameOrigin(): string { return zmsdk.gameOrigin(); },

    /**
     * 发送消息
     * @param name 消息名称
     * @param data 消息数据
     * @param target 发送的目标
     */
    sendMsg(
        name: string,
        data: any = null,
        isMainIframe: boolean = true,
        target?: Window
    ) {
        zmsdk.sendMsg(name, data, isMainIframe, target);
    },

    /**
     * 提交埋点数据
     * @param name 事件名称
     * @param eventType 事件类型
     * @param eventValue 事件值
     * @param data 扩展参数
     */
    sendLog(
        name: string,
        data: any = {},
        eventType: number = 0,
        eventValue: number = 1
    ) {
        zmsdk.sendLog(name, data, eventType, eventValue);
    },

    /**
     * 提交页面埋点数据
     * @param name
     * @param data
     * @param eventType
     * @param eventValue
     */
    sendPageLog(
        name: string,
        duration: number = 0,
        data: any = {},
        tracker_tpye: number = 3
    ) {
        zmsdk.sendPageLog(name, duration, data, tracker_tpye);
    },

    /**
     * 发送日志
     * @param name 日志名称
     * @param data 日志数据
     */
    log(name: string, data: any = {}) { zmsdk.log(name, data); },

    /**
     * 处理消息包,不向学生或者老师发送,直接处理相应的CMD
     * @param packet 消息包
     */
    handlePacket(packet: SDKPacket): void { zmsdk.handlePacket(packet); },

    /**
     * 处理消息,不向学生或者老师发送,直接处理相应的CMD
     * @param name 消息名称
     * @param data 消息数据
     */
    handleMessage(name: string, data: any = null) { zmsdk.handleMessage(name, data); },

    /**
     * 注册消息处理对象
     * @param name 消息名称
     * @param value 消息处理对象。。。SKDCommandBase的子对象
     */
    registerHandler(name: string, value: any): void { zmsdk.registerHandler(name, value); },

    /**
     * 注销消息处理对象
     * @param name 消息名称
     */
    unRegisterHandler(name: string): void { zmsdk.unRegisterHandler(name); },

    /**初始化视图*/
    initView(): void { zmsdk.initView(); },

    /**
     * 更新
     * @param dt
     */
    update(dt: number): void { zmsdk.update(dt); },

    /**
     * 智能补课按钮控制状态
     * 改方法与 isBtnShow,isBtnTeacherShow,isBtnFullShow,isBtnTeacherFullShow 进行&& 运算
     */
    isStepBtnShow(): boolean { return zmsdk.isStepBtnShow(); },

    /**按钮状态显示，仅拥有权限就显示*/
    isBtnShow(): boolean { return zmsdk.isBtnShow(); },

    /**按钮状态显示，只有老师并且仅有权限的时候才显示*/
    isBtnTeacherShow(): boolean { return zmsdk.isBtnTeacherShow(); },

    /**按钮状态显示，只有完全控制者的时候才显示*/
    isBtnFullShow(): boolean { return zmsdk.isBtnFullShow(); },

    /**按钮状态显示，只有老师并且是完全控制者的时候才显示*/
    isBtnTeacherFullShow(): boolean { return zmsdk.isBtnTeacherFullShow(); },

    /**显示导航栏 */
    isShowNavigation(): boolean {return zmsdk.isBtnTeacherFullShow() && !zmsdk.isRepair()},

    /**视频本地化播放*/
    isLocalPlay(): boolean { return zmsdk.isLocalPlay(); },

    /**音频本地化播放*/
    isLocalMusic(): boolean { return zmsdk.isLocalMusic(); },

    /**PC端混音*/
    isPcMix(): boolean { return zmsdk.isPcMix(); },

    /**sdk 版本 */
    sdkVersion(): string { return zmsdk.sdkVersion(); },

    /**游戏版本 */
    gameVersion(): string { return zmsdk.gameVersion(); },

    /**zmg2.0 课件id*/
    coursewareId(): string { return zmsdk.coursewareId() },

    /**zmg2.0  课件版本*/
    versionCode(): string { return zmsdk.versionCode(); },

    /**zmg2.0 分屏率*/
    courseWareLevel(): number { return zmsdk.courseWareLevel(); },

    /**获取控制者最后的关键帧*/
    controllerLastMainPacket(): SDKPacket {
        return zmsdk.controllerLastMainPacket();
    }
};

zmsdk.SDKInit();
(window as any).ZMSDK = ZMSDK;
(window as any).ZMSDK.SDKPacket = SDKPacket;
(window as any).ZMSDK.SDKPacketPool = SDKPacketPool;
(window as any).ZMSDK.SDKCommandBase = SDKCommandBase;
(window as any).ZMSDK.DebugInfo = DebugInfo;

export = ZMSDK;

// // ----------------------------- version* -----------------------------
const SDKVersion = '1.6.3';
const SDKDashVersion = '1.1.8';
const SDKTrackVersion = '1.1.1';
const PublicVersion = '1.5.0';

// // ----------------------------- raven -----------------------------
try {
    if (window['Raven']) {
        const Raven = window['Raven'];
        Raven.setTagsContext({
            SDKVersion,
            SDKDashVersion,
            SDKTrackVersion,
            PublicVersion,
        });
    }
} catch {
    console.log('Raven setTags fail.');
}