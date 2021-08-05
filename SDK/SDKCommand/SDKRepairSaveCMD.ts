import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';

/**
 * 智能补课老师录制 重新录制任意页
 */
export default class SDKRepairSaveCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairSaveCMD......", data);
        let sceneIndex = parseInt(data.sceneIndex);

        if (!SDKLogicsCore.parameterVo.isRepairRecord) {
            this.recylePacket();
            return;
        }
        this.appendControllCMD(data);

        this.recylePacket();
    }

    protected appendControllCMD(data) {
        let playType = data.playType;

        if (playType == "p") {
            if (data.isControllChange) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.CONTROLLER_CHANGE, '-1', false);
            }
        }

        let repairInfo = SDKLogicsCore.repairInfo;
        repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
        let controller = this.getController();
        controller && controller.updateViewStyle();

        SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }
}