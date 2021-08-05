import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as ZMSDK from '../ZMSDK';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKUiDisplayConst from '../SDKConst/SDKUiDisplayConst';

/**
 * 设置场景状态
 */
export default class SDKSetSceneStateCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        let isToFirstPage: boolean = false;
        isToFirstPage = (data[0] == 0 && SDKLogicsCore.sceneState.curIndex > 0);

        SDKLogicsCore.voiceAnswerInfo.reset();
        SDKLogicsCore.sceneState.curIndex = data[0];
        if (data[1] === 0) {
            SDKLogicsCore.sceneState.state = SDKEnum.TYPE_SCENE.TYPE_LOADING;
        } else if (data[1] === 1) {
            SDKLogicsCore.sceneState.state = SDKEnum.TYPE_SCENE.TYPE_LOADED;
        } else if (data[1] === 2) {
            SDKLogicsCore.sceneState.state = SDKEnum.TYPE_SCENE.TYPE_PAUSE;
        }

        if (SDKLogicsCore.sceneState.state != SDKEnum.TYPE_SCENE.TYPE_LOADED) {
            if (SDKLogicsCore.parameterVo.isRepairRecord) {
                SDKLogicsCore.repairInfo.releaseAllStoragePackets();
                SDKLogicsCore.repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
            }
            this.recylePacket();
            return;
        }
        let controller = this.getController();
        controller && controller.updatePageState();
        controller && controller.dispatcherSubIframe(this.getSubSenceStatePacket());

        if (SDKLogicsCore.parameterVo.isRepair) {
            let sceneInfo = {
                sceneIndex: SDKLogicsCore.sceneState.curIndex,
                totalScene: SDKLogicsCore.sceneState.getCount(),
                answerList: SDKLogicsCore.sceneState.getAnswerByIndex(SDKLogicsCore.sceneState.curIndex)
            };
            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_SCENE_INFO, sceneInfo, false);

            if (SDKLogicsCore.parameterVo.isRepairRecord) {
                let repairInfo = SDKLogicsCore.repairInfo;
                let secneState = SDKLogicsCore.sceneState;
                repairInfo.lastSceneIndex = Math.max(repairInfo.lastSceneIndex, secneState.curIndex);
                this.getController().showUI();
                if (!repairInfo.isJumping) {
                    SDKLogicsCore.repairInfo.isControllerChange = false;
                    this.setController(SDKLogicsCore.parameterVo.userId);
                    repairInfo.clearRecordPacket();
                    SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);
                }

                if (repairInfo.reRecordingPasket) {
                    SDKApp.instance().packetHandler.dispatcherCMD(repairInfo.reRecordingPasket);
                    repairInfo.clearReRecordingPasket();
                    this.recylePacket();
                    return;
                }

                //重录已录制场景跳转到未录制完场景
                if (repairInfo.isJumping &&
                    repairInfo.isNeedResume &&
                    repairInfo.resumeSceneState &&
                    repairInfo.resumeSceneState.sceneIndex == secneState.curIndex) {
                    this.getController().setOpacity(1);
                    this.resumeScene();
                    repairInfo.isNeedResume = false;
                    repairInfo.isJumping = false;
                } else if (repairInfo.isJumping && secneState.curIndex != repairInfo.lastSceneIndex) {
                    this.getController().setOpacity(1);
                    SDKLogicsCore.repairInfo.isControllerChange = false;
                    SDKLogicsCore.repairInfo.sceneIndex = SDKLogicsCore.repairInfo.targetScene;
                    this.setController(SDKLogicsCore.parameterVo.userId);
                    SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);
                    //this.getController().showUI(SDKUiDisplayConst.REPAIR_RECORD);
                    SDKApp.instance().packetHandler.notifyCMD(
                        SDKRegistCommand.REPAIR_GET_DATA_REQUEST, SDKLogicsCore.repairInfo.targetScene);
                } else if (repairInfo.isJumping && secneState.curIndex == repairInfo.lastSceneIndex) {
                    this.getController().setOpacity(1);
                    SDKLogicsCore.repairInfo.isControllerChange = false;
                    repairInfo.clearRecordPacket();
                    this.setController(SDKLogicsCore.parameterVo.userId);
                    SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);
                }
            }
            
            if (SDKLogicsCore.parameterVo.isRepairPlay && (SDKLogicsCore.sceneState.curIndex != 0 || isToFirstPage)) {
                this.setController('');
                SDKApp.instance().packetHandler.notifyCMD(
                    SDKRegistCommand.REPAIR_GET_DATA_REQUEST, SDKLogicsCore.repairInfo.sceneIndex);
            }
        }

        this.recylePacket();
    }

    private getSubSenceStatePacket(): SDKPacket {
        let packet: SDKPacket;
        packet = SDKPacketPool.Acquire(SDKRegistCommand.SET_SUB_IFRAME_SCENE_STATE);
        packet.data = SDKLogicsCore.sceneState.curSceneName();
        return packet;
    }

    private setController(controllerId: string): void {
        let controller = this.getController();

        SDKLogicsCore.controllState.controllerId = controllerId;
        controller && controller.setController(SDKLogicsCore.controllState.controllerId);
        SDKApp.instance().packetHandler.notifyCMD("gameControllerChange", SDKLogicsCore.controllState.controllerId);
        controller && controller.updateViewStyle();
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }

    private resumeScene(): void {
        let index = 0, count = 0;
        let tempPacket: SDKPacket;
        let packet: SDKPacket;
        let repairInfo = SDKLogicsCore.repairInfo;
        let packets: Array<SDKPacket> = [];

        let state = repairInfo.resumeSceneState;
        if (!state) {
            return;
        }

        repairInfo.recordType = state.recordType;
        repairInfo.recordState = state.recordState;
        repairInfo.isGuideAnswer = state.isGuideAnswer;
        repairInfo.recordAnswerTime = state.recordAnswerTime;
        repairInfo.isControllerChange = state.isControllerChange;

        if (repairInfo.recordType != SDKEnum.TYPE_RECORD.ANSWER) {
            packet = state.recordPacket;
            if (packet && packet.action != 'gameChangeScene') {
                tempPacket = SDKPacketPool.Acquire(packet.name);
                packet.clone(tempPacket);
                packets.push(tempPacket);
            } else {
                tempPacket = SDKPacketPool.Acquire('gameSceneReset');
                tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
                tempPacket.data = SDKLogicsCore.sceneState.curSceneName();
                packets.push(tempPacket);
            }

            //派发数据包 更新游戏界面
            count = packets.length;
            for (index = 0; index < count; index++) {
                SDKApp.instance().transceiver.sendPacket(packets[index]);
            }

            repairInfo.clearResumeRecordPacket();
        }

        this.setController(SDKLogicsCore.parameterVo.userId);
        SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);
    }
}