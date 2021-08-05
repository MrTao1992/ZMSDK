import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';

/**
 * 学生上下台
 */
export default class SDKOnStageChangeCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKOnStageChangeCMD...', data);
        if (!data) {
            return;
        }

        if (SDKLogicsCore.parameterVo.isTeacher() &&
            (!SDKLogicsCore.historyInfo.isParse ||
                !SDKLogicsCore.userInfos.isAllHistoryRes())) {
            SDKLogicsCore.controllState.onStageState = data;
            return;
        }

        let controller = this.getController();
        let isUp: boolean = data.type == 'up' ? true : false;
        let mobile: string = data.mobile;
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            if (isUp) {
                if (SDKLogicsCore.controllState.controllerId != mobile) {
                    SDKLogicsCore.controllState.isSyncTeacher = false;
                    SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.CONTROLLER_CHANGE, mobile, false);
                    controller && controller.setController(SDKLogicsCore.controllState.controllerId);

                    if (SDKLogicsCore.controllState.isInspection()) {
                        SDKLogicsCore.controllState.oldTeachingMode = SDKLogicsCore.controllState.teachingMode;
                        SDKLogicsCore.controllState.teachingMode = SDKEnum.TEACHING_MODE.TYPE_TEACHING;
                        controller && controller.teachModleChange(SDKLogicsCore.controllState.teachingMode);
                        SDKApp.instance().transceiver.sendMsg(
                            SDKRegistCommand.TEACH_MODLE_CHANGE,
                            SDKLogicsCore.controllState.teachingMode,
                            false);
                    }
                }
            } else {
                if (SDKLogicsCore.controllState.controllerId == mobile) {
                    mobile = SDKLogicsCore.parameterVo.userId;
                    SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;
                    SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.CONTROLLER_CHANGE, mobile, false);
                    controller && controller.setController(SDKLogicsCore.controllState.controllerId);

                    SDKLogicsCore.controllState.teachingMode = SDKLogicsCore.controllState.oldTeachingMode;
                    SDKLogicsCore.controllState.oldTeachingMode = SDKEnum.TEACHING_MODE.TYPE_TEACHING;
                    controller && controller.teachModleChange(SDKLogicsCore.controllState.teachingMode);
                    SDKApp.instance().transceiver.sendMsg(
                        SDKRegistCommand.TEACH_MODLE_CHANGE,
                        SDKLogicsCore.controllState.teachingMode,
                        false);
                }
            }
        } else if (SDKLogicsCore.parameterVo.isStudent()) {
            if (isUp) {
                SDKLogicsCore.controllState.controllerId = mobile;
                SDKApp.instance().packetHandler.notifyCMD('gameControllerChange', mobile);
                if (mobile == SDKLogicsCore.parameterVo.userId) {
                    this.syncToOther(mobile);
                }
            }
        }

        this.recylePacket();
    }

    private syncToOther(controllerId: string): void {
        let userInfo: SDKUserInfo;
        let packet: SDKPacket;

        userInfo = SDKLogicsCore.userInfos.getUserInfoById(controllerId);
        if (!userInfo) {
            return;
        }

        packet = userInfo.getLastMainPacket();
        if (!packet) {
            return;
        }

        if (packet.name !== 'gameChangeScene') {
            this.checkChangeScene(packet);
            SDKApp.instance().transceiver.sendPacket(packet);
        } else {
            const sceneName: string = packet.data;

            SDKApp.instance().transceiver.sendPacket(packet);
            this.initScene(sceneName);
        }
    }

    private checkChangeScene(packet: SDKPacket): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        tempPacket.name = 'gameChangeScene';
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.data = packet.secene;

        SDKApp.instance().transceiver.sendPacket(tempPacket);
    }

    private initScene(sceneName: string): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire('gameSceneReset');
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.isMainFrame = false;
        tempPacket.data = sceneName;

        SDKApp.instance().transceiver.sendPacket(tempPacket);
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;
        return controller;
    }
}