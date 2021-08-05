import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from "../SDKConst/SDKControllerConst";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKEnum from "../SDKConst/SDKEnum";
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";
import SDKUserInfo from "../SDKLogics/SDKUserInfo";

/**
 * 智能补课老师录播, 设置答题时间
 */
export default class SDKRepairAnswerTimeCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairAnswerTimeCMD......", data);
        this.setRecordPacket();

        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        repairInfo.recordAnswerTime = 0;
        if (data.timestamp) {
            repairInfo.recordAnswerTime = data.timestamp;
        }
        repairInfo.isGuideAnswer = false;
        if (data.isGuideAnswer) {
            repairInfo.isGuideAnswer = data.isGuideAnswer;
        }
        SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_ANSWER_RESPOND, data, false);

        repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
        //SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.STOP_ZMG, !repairInfo.isRecordPalying());
        SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);

        //权限设置回来
        let controller = this.getController();
        SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;
        controller && controller.setController(SDKLogicsCore.controllState.controllerId);
        controller && controller.updateViewStyle();

        // if (repairInfo.isGuideAnswer) {
        //     setTimeout(() => {
        //         SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;
        //         //SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.STOP_ZMG, false);
        //         SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.CONTROLLER_CHANGE, SDKLogicsCore.controllState.controllerId, false);
        //         SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_CONTROLLER_CHANGE, SDKLogicsCore.controllState.controllerId, false);
        //         let controller = this.getController();
        //         if (controller) {
        //             controller.setController(SDKLogicsCore.controllState.controllerId);
        //             controller.updateViewStyle();
        //         }
        //     }, SDKLogicsCore.repairInfo.recordAnswerTime * 1000);

        //     // setTimeout(() => {
        //     //     SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.STOP_ZMG, !repairInfo.isRecordPalying());
        //     // }, SDKLogicsCore.repairInfo.recordAnswerTime * 1000 + 100);
        // }

        this.recylePacket();
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }

    private setRecordPacket(): void {
        let packet: SDKPacket;
        let userInfo: SDKUserInfo;

        SDKLogicsCore.repairInfo.clearRecordPacket();
        userInfo = SDKLogicsCore.userInfos.getUserInfoById(SDKLogicsCore.parameterVo.userId);
        packet = userInfo && userInfo.getLastMainPacket();
        if (packet) {
            let tempPacket: SDKPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            SDKLogicsCore.repairInfo.recordPacket = tempPacket;
        }
    }
}