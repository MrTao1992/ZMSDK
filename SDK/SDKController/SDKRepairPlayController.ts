import SDKApp from "../SDKBase/SDKApp";
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";
import SDKControllerBase from "./SDKControllerBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKEnum from "../SDKConst/SDKEnum";
import * as UtilsType from '../Utils/UtilsType';
import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';

export default class SDKRepairPlayController extends SDKControllerBase {

    private changeScene: string = "gameChangeScene";

    private _isPlay: boolean;
    private _duration: number;
    private _startIndex: number;
    private _repairInfo: SDKRepairInfo;
    private _controlllerId: string;
    private _isChange: boolean;

    constructor() {
        super();
    }

    public update(dt: number) {
        if (!this._isPlay) {
            return;
        }
        this._duration += dt * 1000;
        this._repairInfo.duration = this._duration;
        this.notifyCMD(this._startIndex);
    }

    public stop(): void {
        DebugInfo.info("暂停回放......", this._repairInfo.getkey(), this._startIndex + '/' + this._repairInfo.getPacketsCount());
        this._isPlay = false;
        this._repairInfo.isPlay = this._isPlay;
        SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.GAME_STOP);
    }

    public play(): void {
        SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.GAME_RESUME);

        if (SDKLogicsCore.controllState.isOwn()) {
            return;
        }

        this._duration = 0;
        this._isPlay = true;
        this._repairInfo.isPlay = this._isPlay;
        this._startIndex = this._repairInfo.getReplayStartIndex(this._repairInfo.curTime());

        DebugInfo.info("开始回放......", this._repairInfo.getkey(), this._startIndex + '/' + this._repairInfo.getPacketsCount());
        this.parseGlobleInfo();
        this.syncScene();
        this.update(0);
        this.history();
    }

    private notifyCMD(startIndex: number): void {
        let packet: SDKPacket;
        let index: number;
        //let packetMaxTime: number;

        index = startIndex;
        //packetMaxTime = this._repairInfo.getPacketMaxTime();
        do {
            packet = this._repairInfo.getPacketByIndex(index);
            if (UtilsType.isEmpty(packet)) {
                return;
            }
            if (packet.relativeTime <= this._repairInfo.curTime()) {
                let tempPacket: SDKPacket;
                tempPacket = SDKPacketPool.Acquire(packet.name);
                packet.clone(tempPacket);
                if (this._isChange && packet.name == SDKRegistCommand.CONTROLLER_CHANGE) {
                    DebugInfo.info('不执行数据包...', packet.name, this._repairInfo.curTime());
                } else {
                    DebugInfo.info("回放数据包...", tempPacket.name, index + "/" + this._repairInfo.getPacketsCount(), this._repairInfo.getkey());
                    SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
                    if (packet.name == SDKRegistCommand.CONTROLLER_CHANGE) {
                        this.dispatcherController(packet.data);
                    }
                }
                this._startIndex++;
                index = this._startIndex;
            } else if (packet.relativeTime > this._repairInfo.curTime()) {
                break;
            }
        } while (packet);
    }

    private dispatcherController(controllerId: string): void {
        SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_CONTROLLER_CHANGE, controllerId, false);
    }

    /**解析全局信息 */
    private parseGlobleInfo(): void {
        let index = 0, count = 0;
        let packet: SDKPacket;

        this._controlllerId = '';
        this._isChange = false;
        count = this._repairInfo.getPacketsCount();
        for (index = 0; index < count; index++) {
            packet = this._repairInfo.getPacketByIndex(index);
            if (packet.relativeTime > this._repairInfo.curTime()) {
                break;
            }
            if (packet.name == SDKRegistCommand.CONTROLLER_CHANGE) {
                this._controlllerId = packet.data;
            }
        }
        if (this._controlllerId == '-1') {
            this._isChange = true;
        }
        if (SDKLogicsCore.repairInfo.playType == SDKEnum.TYPE_REPAIR_PLAY.ANSWER || !this.anserIsEmpty()) {
            this._controlllerId = '';
        }
        SDKLogicsCore.controllState.controllerId = this._controlllerId;
        SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.CONTROLLER_CHANGE, this._controlllerId);
    }

    private syncScene(): void {
        let packet: SDKPacket;

        packet = this._repairInfo.getPacketByIndex(this._startIndex);
        if (this._startIndex == 0) {
            this.syncPacket(this.checkChangeScene(packet));
        } else {
            this.syncPacket(packet);
        }
        this.checkVideoPlay();
    }

    private syncPacket(packet: SDKPacket): void {
        let index = 0, count = 0;
        let tempPacket: SDKPacket;
        let packets: Array<SDKPacket>;

        if (UtilsType.isEmpty(packet) || packet.relativeTime > this._repairInfo.curTime()) {
            //同步前面的包,后面的包Update来处理
            return;
        }

        packets = [];
        if (packet.name != this.changeScene && packet.isMainFrame) {
            tempPacket = this.checkChangeScene(packet);
            if (tempPacket) {
                packets.push(tempPacket);
            }
        }
        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        packets.push(tempPacket);
        if (packet.name == this.changeScene) {
            tempPacket = this.initScene(packet.data);
            packets.push(tempPacket);
        }

        count = packets.length;
        for (index = 0; index < count; index++) {
            tempPacket = packets[index];
            SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
        }
    }

    /**
     * 检测录播视频是否异常，或者无任务录制的播放信令
     */
    private checkVideoPlay(): void {
        let index: number = 0;
        let count: number = 0;
        let packet: SDKPacket;
        let action: string = 'gameVideoPlay';

        const videoDom = document.getElementsByClassName('cocosVideo')[0] as HTMLVideoElement;
        if (!videoDom) {
            return;
        }

        count = this._repairInfo.getPacketsCount();
        for (index = 0; index < count; index++) {
            packet = this._repairInfo.getPacketByIndex(index);
            if (packet && packet.name === action) {
                return;
            }
        }

        DebugInfo.error('录播视频记录数据异常,没有视频播放关键帧');
        SDKApp.instance().recordTransceiver.send(SDKRecordEventConst.VIDEO_REPAIR_ERROR);

        packet = SDKPacketPool.Acquire(action);
        packet.secene = SDKLogicsCore.sceneState.curSceneName();
        packet.data = 1;
        SDKApp.instance().packetHandler.dispatcherCMD(packet);
    }

    private checkChangeScene(packet: SDKPacket): SDKPacket {
        let tempPacket: SDKPacket;

        if (UtilsType.isEmpty(packet) || packet.secene == "") {
            return null;
        }

        let index = SDKLogicsCore.sceneState.getSceneIndexByName(packet.name);
        if (index == -1 ||
            index != SDKLogicsCore.repairInfo.sceneIndex ||
            index == SDKLogicsCore.sceneState.curIndex) {
            return null;
        }

        tempPacket = SDKPacketPool.Acquire(packet.name);
        tempPacket.name = this.changeScene;
        tempPacket.isMainFrame = true;
        tempPacket.data = packet.secene;

        return tempPacket;
    }

    private initScene(sceneName: string): SDKPacket {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire('gameSceneReset');
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.isMainFrame = false;
        tempPacket.data = sceneName;

        return tempPacket;
    }

    private anserIsEmpty(): boolean {
        if (SDKLogicsCore.repairInfo.answerId == '-1' ||
            SDKLogicsCore.repairInfo.answerId == '0') {
            return true;
        }
        return false;
    }

    public history(): void {
        //P,A 阶段不处理,  U阶段处理 
        if (!this._isPlay || SDKLogicsCore.repairInfo.playType != SDKEnum.TYPE_REPAIR_PLAY.GAME) {
            return;
        }

        let userId = SDKLogicsCore.parameterVo.userId;
        let userInfo = SDKLogicsCore.userInfos.getUserInfoById(String(userId));
        if (userInfo && userInfo.historyCount > 0) {
            DebugInfo.info("处理历史数据中......");
            userInfo.historyCount = 0;
            //恢复自己的界面数据包
            let packets: Array<SDKPacket> = [];
            let packet = userInfo.getLastMainPacket();
            if (packet) {
                let tempPacket;
                if (packet.name != this.changeScene) {
                    // tempPacket = this.checkChangeScene(packet);
                    // if (tempPacket) {
                    //     packets.push(tempPacket);
                    // }

                    tempPacket = SDKPacketPool.Acquire(packet.name);
                    packet.clone(tempPacket);
                    packets.push(tempPacket);
                }
            }
            //派发数据包 更新游戏界面
            let index = 0, count = 0;
            count = packets.length;
            for (index = 0; index < count; index++) {
                SDKApp.instance().packetHandler.dispatcherCMD(packets[index]);
            }
        }
    }

    public reset(): void {
        super.reset();

        this._isPlay = false;
        this._duration = 0;
        this._controlllerId = "";
        this._repairInfo = SDKLogicsCore.repairInfo;
    }
}