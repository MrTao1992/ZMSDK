import SDKTransceiver from '../SDKNetwork/SDKTransceiver';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKPacketHandler from '../SDKNetwork/SDKPacketHandler';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import SDKControllerBase from '../SDKController/SDKControllerBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKReplayController from '../SDKController/SDKReplayController';
import SDKRecordTransceiver from '../SDKNetwork/SDKRecordTransceiver';
import * as SDKRecordEventConst from '../../SDK/SDKConst/SDKRecordEventConst';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKRepairPlayController from "../SDKController/SDKRepairPlayController";
import SDKWatcherPackets from '../SDKNetwork/SDKWatcherPackets';
import SDKLogTransceiver from '../SDKNetwork/SDKLogTransceiver';
import SDKNewRecordTransceiver from '../SDKNetwork/SDKNewRecordTransceiver';
import CheckCrash from '../Utils/CheckCrash';
import { SDKIThirdInterfaces } from '../SDKInterfaces/SDKIThirdInterfaces';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';

export default class SDKApp {
    public get transceiver(): SDKTransceiver {
        return this._transceiver;
    }

    public get packetHandler(): SDKPacketHandler {
        return this._packetHandler;
    }

    public get recordTransceiver(): SDKRecordTransceiver {
        return this._recordTransceiver;
    }

    public get logTransceiver(): SDKLogTransceiver {
        return this._logTransceiver;
    }

    public get newRecordTransceiver(): SDKNewRecordTransceiver {
        return this._newRecordTransceiver;
    }

    public get thirdInterface(): SDKIThirdInterfaces {
        return this._thirdInterface;
    }

    public static instance(): SDKApp {
        if (!SDKApp._instance) {
            SDKApp._instance = new SDKApp();
        }
        return SDKApp._instance;
    }
    private static _instance: SDKApp;

    private _transceiver: SDKTransceiver;
    private _packetHandler: SDKPacketHandler;
    private _recordTransceiver: SDKRecordTransceiver;
    private _watcherPackets: SDKWatcherPackets;
    private _logTransceiver: SDKLogTransceiver;
    private _newRecordTransceiver: SDKNewRecordTransceiver;
    private _checkCrash: CheckCrash;
    private _thirdInterface: SDKIThirdInterfaces;

    /** 进入游戏场景 */
    private _isEnter: boolean = false;
    private _jsbReady: boolean = false;

    constructor() {
        if (SDKApp._instance) {
            throw console.error('SDKApp object is had already!');
        }
        SDKApp._instance = this;
    }

    public init(): void {
        this._packetHandler = new SDKPacketHandler();

        this._transceiver = new SDKTransceiver();
        this._transceiver.packetHandler = this._packetHandler;

        this._recordTransceiver = new SDKRecordTransceiver();
        this._watcherPackets = new SDKWatcherPackets();
        this._logTransceiver = new SDKLogTransceiver();
        this._newRecordTransceiver = new SDKNewRecordTransceiver();
        this._checkCrash = new CheckCrash();
        
        this._thirdInterface = <SDKIThirdInterfaces>{};
        (window as any).ZMSDK_INTERFACE = this._thirdInterface;
    }

    public gameReady(): void {
        this._transceiver.gameReady();
        this._checkCrash.start();

        this._newRecordTransceiver.send(SDKLogEventConst.JS_INIT_COMPLETE);
        this._newRecordTransceiver.send(SDKLogEventConst.FIRST_SCENE_LOAD_START);
    }

    private initEvents(): void {
        SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.GAME_LOAD_COMPLETE, null, false);

        if (SDKLogicsCore.parameterVo.isTeacher() && !SDKLogicsCore.parameterVo.isRepair) {
            this.transceiver.sendMsg(SDKRegistCommand.TEACH_MODLE_CHANGE, SDKLogicsCore.controllState.teachingMode, false);
            this.transceiver.sendMsg(SDKRegistCommand.NOTIFY_WATCH_CONTROLLER, SDKLogicsCore.controllState.controllerId, false);
            this.transceiver.sendMsg(SDKRegistCommand.VOICE_ANSWER_SPEECH_REQUEST, null, false);
        }

        if (SDKLogicsCore.parameterVo.isZMG() && !SDKLogicsCore.parameterVo.isRepair) {
            this.packetHandler.notifyCMD(SDKRegistCommand.SYNC_TEACHER_REQUEST);
        }

        if (SDKLogicsCore.parameterVo.isOberverTeacher()) {
            this.transceiver.sendMsg(SDKRegistCommand.TEACH_MODLE_REQUEST, null, false);
            this.transceiver.sendMsg(SDKRegistCommand.WATCH_CONTROLLER_REQUEST, null, false);
            this.transceiver.sendMsg(SDKRegistCommand.TEACH_SPLIT_PAGE_REQUEST, null, false);
        }

        if (SDKLogicsCore.parameterVo.isGameReplay()) {
            this.packetHandler.notifyCMD(SDKRegistCommand.GET_REPLAY_DATA_REQUEST);
        }

        if (SDKLogicsCore.parameterVo.isRepairPlay) {
            this.transceiver.sendMsg(SDKRegistCommand.REPAIR_GET_SCENE_INFO, null, false);
        }
    }

    private initController(): void {
        let controller: SDKControllerBase;

        controller = new SDKWebDashBoradController();
        SDKContrllerManager.instance().addController(SDKControllerConst.WEB_DASHBORAD, controller);

        if (SDKLogicsCore.parameterVo.isGameReplay()) {
            controller = new SDKReplayController();
            SDKContrllerManager.instance().addController(SDKControllerConst.REPLAY, controller);
        }
        if (SDKLogicsCore.parameterVo.isRepairPlay) {
            controller = new SDKRepairPlayController();
            SDKContrllerManager.instance().addController(SDKControllerConst.REPAIR_PLAY, controller);
        };
    }

    public set jsbReady(value: boolean) {
        this._jsbReady = true;
    }

    public get jsbReady(): boolean {
        return this._jsbReady;
    }

    public get isEnter(): boolean {
        return this._isEnter;
    }

    /**
     * 初始化视图
     */
    public initView(): void {
        if (this._isEnter) {
            return;
        }
        this._isEnter = true;

        this.initController();
        this.initEvents();

        DebugInfo.info('SDK initView');
        this._watcherPackets.start();
        this._recordTransceiver.send(SDKRecordEventConst.OPEN);
        this._newRecordTransceiver.send(SDKLogEventConst.FIRST_SCENE_LOAD_COMPLETE);
    }

    public update(dt: number): void {
        SDKContrllerManager.instance().update(dt);
        this._watcherPackets.update(dt);
    }
}