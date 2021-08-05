import * as SDKEnum from "../SDKConst/SDKEnum";
import SDKPackets from "../SDKNetwork/SDKPackets";
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKRepairUrlInfo from "./SDKRepairUrlInfo";
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";
import { SDKIRepairSceneState } from '../SDKInterfaces/SDKIRepairSceneState';

export default class SDKRepairInfo {
    //////////////////////////录制
    private _sceneIndex: number;
    private _recordType: SDKEnum.TYPE_RECORD;
    private _recordState: SDKEnum.TYPE_RECORD_STATE;
    private _recordAnswerTime: number;
    private _isGuideAnswer: boolean;
    private _isControllerChange: boolean;
    //记录录制答案开始的关键帧,产品要求每一个答案的初始状态一致.
    private _recordPacket: SDKPacket;
    //记录录制跳转场景数据包,避免加载多余的场景数据。
    private _reRecordingPasket: SDKPacket;

    //保存未录制完现场信息, 以便恢复继续原场景录制
    private _isNeedResume: boolean;
    private _resumeSceneState: SDKIRepairSceneState;

    //已录制的最大进度
    private _lastSceneIndex: number;

    //记录跳转到目标场景进行编辑的信息，以便目标场景数据加载完，还原此刻状态
    private _isJumping: boolean;
    private _targetScene: number;
    private _targetType: SDKEnum.TYPE_RECORD;

    //缓存开始录制之前的数据包
    private _storagePackets: { [key: string]: SDKPackets };


    //////////////////////////播放
    private _answerId: string;
    private _duration: number;
    private _isPlay: boolean;
    private _startTime: number;
    private _totalTime: number;
    private _packets: { [key: string]: SDKPackets };
    private _playType: SDKEnum.TYPE_REPAIR_PLAY;
    private _URLConfig: object;
    private _repairUrlInfos: Array<SDKRepairUrlInfo>;
    private _dataState: SDKEnum.TYPE_REPAIR_DATA;

    constructor() {
        this.reset();
    }

    public set sceneIndex(value: number) {
        this._sceneIndex = value;
    }

    public get sceneIndex(): number {
        return this._sceneIndex;
    }

    public set recordType(value: SDKEnum.TYPE_RECORD) {
        this._recordType = value;
    }

    public get recordType(): SDKEnum.TYPE_RECORD {
        return this._recordType;
    }

    public set recordState(value: SDKEnum.TYPE_RECORD_STATE) {
        this._recordState = value;
    }

    public get recordState(): SDKEnum.TYPE_RECORD_STATE {
        return this._recordState;
    }

    public isRecordPalying(): boolean {
        return this._recordState == SDKEnum.TYPE_RECORD_STATE.PLAY;
    }

    public set recordAnswerTime(value: number) {
        this._recordAnswerTime = value;
    }

    public get recordAnswerTime(): number {
        return this._recordAnswerTime;
    }

    public set isGuideAnswer(value: boolean) {
        this._isGuideAnswer = value;
    }

    public get isGuideAnswer(): boolean {
        return this._isGuideAnswer;
    }

    public get duration(): number {
        return this._duration;
    }

    public set duration(value: number) {
        this._duration = value;
    }

    public get isPlay(): boolean {
        return this._isPlay;
    }

    public set isPlay(value: boolean) {
        this._isPlay = value;
    }

    public get startTime(): number {
        return this._startTime;
    }

    public set startTime(value: number) {
        this._startTime = value;
    }

    public curTime(): number {
        return this._startTime + this._duration;
    }

    public set totalTime(value: number) {
        this._totalTime = value;
    }

    public get totalTime(): number {
        return this._totalTime;
    }

    public addPacket(key: string, value: SDKPacket): void {
        if (!this._packets[key]) {
            this._packets[key] = new SDKPackets();
        }
        this._packets[key].addPacket(value);
    }

    /**
    * 获取回放起始包下标
    * @param time 
    */
    public getReplayStartIndex(time: number): number {
        let packet: SDKPacket;
        let startIndex: number;
        let temp: SDKPackets = this._packets[this.getkey()];

        startIndex = 0;
        let index = 0, count = 0;
        count = temp ? temp.getPacketsCount() : 0;
        for (index = 0; index < count; index++) {
            packet = temp.getPacketByIndex(index);
            if (packet.isMainFrame && packet.relativeTime <= time) {
                startIndex = index;
            } else if (packet.relativeTime > time) {
                break;
            }
        }
        return startIndex;
    }

    /**
     * 获取最后一个关键包
     */
    public getLastMainPacket(): SDKPacket {
        let packet: SDKPacket;
        let temp: SDKPackets = this._packets[this.getkey()];

        let index = 0, count = 0;
        count = temp ? temp.getPacketsCount() : 0;
        for (index = count - 1; index >= 0; index--) {
            packet = temp.getPacketByIndex(index);
            if (packet.isMainFrame) {
                return packet;
            }
        }
        return null;
    }

    public getPacketMaxTime(): number {
        if (this.getPacketsCount() == 0) {
            return 0;
        }
        let packet = this.getPacketByIndex(this.getPacketsCount() - 1);
        return packet ? packet.relativeTime : 0;
    }

    /**
     * 获取回放包根据index
     * @param index 
     */
    public getPacketByIndex(index: number): SDKPacket {
        let temp: SDKPackets = this._packets[this.getkey()];
        return temp ? temp.getPacketByIndex(index) : null;
    }

    public getPacketsCount(): number {
        let temp: SDKPackets = this._packets[this.getkey()];
        return temp ? temp.getPacketsCount() : 0;
    }

    public getRepairUrlInfo(sceneIndex: string): SDKRepairUrlInfo {
        let index = 0, count = 0;
        count = this._repairUrlInfos.length;
        for (index = 0; index < count; index++) {
            const element = this._repairUrlInfos[index];
            if (element.sceneIndex == sceneIndex) {
                return this._repairUrlInfos[index];
            }
        }
        return null;
    }

    public addRepairUrlInfo(value: SDKRepairUrlInfo) {
        this._repairUrlInfos.push(value);
    }

    public getRepairUrlInfoCount(): number {
        return this._repairUrlInfos.length;
    }

    public clearRepairUrlInfos(): void {
        this._repairUrlInfos = [];
    }

    public get answerId(): string {
        return this._answerId;
    }

    public set answerId(value: string) {
        this._answerId = value;
    }

    public get playType(): SDKEnum.TYPE_REPAIR_PLAY {
        return this._playType;
    }

    public set playType(value: SDKEnum.TYPE_REPAIR_PLAY) {
        this._playType = value;
    }

    public set URLConfig(value: object) {
        this._URLConfig = value;
    }

    public get URLConfig(): object {
        return this._URLConfig;
    }

    public isUnload(): boolean {
        return this._dataState == SDKEnum.TYPE_REPAIR_DATA.UNLOAD;
    }

    public isLoading(): boolean {
        return this._dataState == SDKEnum.TYPE_REPAIR_DATA.LOADING;
    }

    public isLoaded(): boolean {
        return this._dataState == SDKEnum.TYPE_REPAIR_DATA.LOADED;
    }

    public get dataState(): SDKEnum.TYPE_REPAIR_DATA {
        return this._dataState;
    }

    public set dataState(value: SDKEnum.TYPE_REPAIR_DATA) {
        this._dataState = value;
    }

    public getkey(): string {
        if (this._playType == SDKEnum.TYPE_REPAIR_PLAY.GAME) {
            return this._sceneIndex.toString();
        } else {
            return this._sceneIndex + "_" + this._answerId;
        }
    }

    public clearPacket(): void {
        for (const key in this._packets) {
            if (this._packets.hasOwnProperty(key)) {
                this._packets[key].clear();
            }
        }
        this._packets = {};
    }

    public set isControllerChange(value: boolean) {
        this._isControllerChange = value;
    }

    public get isControllerChange(): boolean {
        return this._isControllerChange;
    }

    public set recordPacket(value: SDKPacket) {
        this._recordPacket = value;
    }

    public get recordPacket(): SDKPacket {
        return this._recordPacket;
    }

    public set isNeedResume(value: boolean) {
        this._isNeedResume = value;
    }

    public get isNeedResume(): boolean {
        return this._isNeedResume;
    }

    public set resumeSceneState(value: SDKIRepairSceneState) {
        this._resumeSceneState = value;
    }

    public get resumeSceneState(): SDKIRepairSceneState {
        return this._resumeSceneState;
    }

    public set isJumping(value: boolean) {
        this._isJumping = value;
    }

    public get isJumping(): boolean {
        return this._isJumping;
    }

    public set targetScene(value: number) {
        this._targetScene = value;
    }

    public get targetScene(): number {
        return this._targetScene;
    }

    public set targetType(value: SDKEnum.TYPE_RECORD) {
        this._targetType = value;
    }

    public get targetType(): SDKEnum.TYPE_RECORD {
        return this._targetType;
    }

    public set reRecordingPasket(value: SDKPacket) {
        this._reRecordingPasket = value;
    }

    public get reRecordingPasket(): SDKPacket {
        return this._reRecordingPasket;
    }

    public set lastSceneIndex(value: number) {
        this._lastSceneIndex = value;
    }

    public get lastSceneIndex(): number {
        return this._lastSceneIndex;
    }

    public addStoragePackets(index: number, value: SDKPacket) {
        let key = index.toString();
        if (!this._storagePackets[key]) {
            this._storagePackets[key] = new SDKPackets();
        }
        this._storagePackets[key].addPacket(value);
    }

    public getStoragePacketsByIndex(index: number): SDKPackets {
        let key = index.toString();
        return this._storagePackets[key];
    }

    public releaseStoragePackets(index: number) {
        let key = index.toString();
        let packets = this._storagePackets[key];
        if (packets) {
            packets.clear();
            this._storagePackets[key] = null;
            delete this._storagePackets[key];
        }
    }

    public releaseAllStoragePackets() {
        for (const key in this._storagePackets) {
            if (this._storagePackets.hasOwnProperty(key)) {
                this.releaseStoragePackets(parseInt(key));
            }
        }
    }

    public clearRecordPacket(): void {
        this._recordPacket && SDKPacketPool.Release(this._recordPacket);
        this._recordPacket = null;
    }

    public clearResumeRecordPacket(): void {
        if (this._resumeSceneState) {
            this._resumeSceneState.recordPacket && SDKPacketPool.Release(this._resumeSceneState.recordPacket);
            this._resumeSceneState.recordPacket = null;
        }
    }

    public clearReRecordingPasket() {
        this._reRecordingPasket && SDKPacketPool.Release(this._reRecordingPasket);
        this._reRecordingPasket = null;
    }

    public reset(): void {
        this._sceneIndex = 0;
        this._recordAnswerTime = 0;
        this._isGuideAnswer = false;
        this._duration = 0;
        this._isPlay = false;
        this._startTime = 0;
        this._packets = {};
        this._repairUrlInfos = [];
        this._answerId = '-1';
        this._URLConfig = null;
        this._isControllerChange = false;
        this._storagePackets = {};
        this._lastSceneIndex = 0;
        this._isNeedResume = false;
        this._resumeSceneState = <SDKIRepairSceneState>{};
        this._isJumping = false;
        this._targetScene = 0;
        this._targetType = SDKEnum.TYPE_RECORD.GAME;
        this._playType = SDKEnum.TYPE_REPAIR_PLAY.GAME;
        this._dataState = SDKEnum.TYPE_REPAIR_DATA.UNLOAD;
        this._recordType = SDKEnum.TYPE_RECORD.GAME;
        this._recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
        this.clearRecordPacket();
        this.clearResumeRecordPacket();
        this.clearReRecordingPasket();
    }
}