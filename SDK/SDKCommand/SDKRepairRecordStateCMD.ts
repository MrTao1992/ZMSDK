import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import * as SDKEnum from "../SDKConst/SDKEnum";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import * as SDKControllerConst from "../SDKConst/SDKControllerConst";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";
import SDKFilterSaveRecordPackets from "../SDKFilters/SDKFilterSaveRecordPackets";

/**
 * 智能补课老师录播, 通知录制端页面信息
 */
export default class SDKRepairRecordStateCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairRecordStateCMD......", data);

        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;

        if (data) {
            switch (data.cmd) {
                case 'play':
                    repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PLAY;
                    break;
                case 'pause':
                    repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
                    break;
                case 'replay':
                    repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PLAY;
                    break;
                default:
                    repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
                    break;
            }

            switch (data.type) {
                case 'game':
                    repairInfo.recordType = SDKEnum.TYPE_RECORD.GAME;
                    break;
                case 'correct':
                    repairInfo.recordType = SDKEnum.TYPE_RECORD.CORRECT;
                    this.recoveryView();
                    break;
                case 'error':
                    repairInfo.recordType = SDKEnum.TYPE_RECORD.ERROR;
                    this.recoveryView();
                    break;
                case 'answer':
                    repairInfo.recordType = SDKEnum.TYPE_RECORD.ANSWER;
                    this.recoveryView();
                    break;
                default:
                    repairInfo.recordType = SDKEnum.TYPE_RECORD.GAME;
                    break;
            }
            repairInfo.sceneIndex = data.sceneIndex;

            if (data.cmd == 'replay') {
                //SDKApp.instance().packetHandler.notifyCMD('gameSceneReset');
                if (SDKLogicsCore.controllState.controllerId == "-1") {
                    SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;
                    SDKLogicsCore.controllState.isSyncTeacher = false;
                    SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.CONTROLLER_CHANGE, SDKLogicsCore.controllState.controllerId, false);
                    SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_CONTROLLER_CHANGE, SDKLogicsCore.controllState.controllerId, false);
                }
                if (repairInfo.recordType == SDKEnum.TYPE_RECORD.GAME) {
                    repairInfo.releaseAllStoragePackets();
                    SDKApp.instance().thirdInterface.loadScene(SDKLogicsCore.sceneState.curSceneName());
                }
            }

            //录制答案重置会老师权限显示。。。仅仅只是显示，不保存权限状态
            if (repairInfo.recordType != SDKEnum.TYPE_RECORD.GAME) {
                //SDKApp.instance().transceiver.sendMsg('gameSceneReset'); //录制答案是否重置
                SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;
            }

            let controller = this.getController();
            if (controller) {
                controller.setController(SDKLogicsCore.controllState.controllerId);
                SDKApp.instance().packetHandler.notifyCMD("gameControllerChange", SDKLogicsCore.controllState.controllerId);
                controller.updateViewStyle();
            }
            if (SDKApp.instance().thirdInterface.isZMG2()) {
                SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.STOP_ZMG, !repairInfo.isRecordPalying());
            }
            SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);

            if (repairInfo.recordState == SDKEnum.TYPE_RECORD_STATE.PLAY) {
                let sceneName = SDKLogicsCore.sceneState.curSceneName();
                SDKFilterSaveRecordPackets.dispatcher(sceneName);
            }
        }

        this.recylePacket();
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }

    /**
     * 录制答案，恢复视图
     */
    private recoveryView(): void {
        //恢复自己的界面数据包
        let index = 0, count = 0;
        let packets: Array<SDKPacket> = [];
        let packet: SDKPacket;
        let tempPacket: SDKPacket;

        if (SDKLogicsCore.repairInfo.recordState == SDKEnum.TYPE_RECORD_STATE.PAUSE) {
            SDKApp.instance().packetHandler.notifyCMD("gameTouchCancel");
            return;
        }

        if (SDKLogicsCore.repairInfo.resumeSceneState &&
            SDKLogicsCore.repairInfo.resumeSceneState.recordPacket) {
            packet = SDKLogicsCore.repairInfo.resumeSceneState.recordPacket;
        } else {
            packet = SDKLogicsCore.repairInfo.recordPacket;
        }
        if (packet && packet.action != 'gameChangeScene') {
            tempPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            packets.push(tempPacket);
        } else {
            tempPacket = SDKPacketPool.Acquire('gameSceneReset');
            tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
            tempPacket.isMainFrame = false;
            tempPacket.data = SDKLogicsCore.sceneState.curSceneName();
            packets.push(tempPacket);
        }

        //派发数据包 更新游戏界面
        count = packets.length;
        for (index = 0; index < count; index++) {
            SDKApp.instance().transceiver.sendPacket(packets[index]);
        }

        SDKLogicsCore.repairInfo.clearResumeRecordPacket();
    }
}