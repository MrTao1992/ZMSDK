import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKEnum from "../SDKConst/SDKEnum";
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from "../SDKConst/SDKControllerConst";

/**
 * 智能补课老师录播, 录制下一页。
 */
export default class SDKRepairNextSceneCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairNextSceneCMD......", data);
        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
        repairInfo.recordType = SDKEnum.TYPE_RECORD.GAME;
        SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;

        let controller = this.getController();
        controller && controller.setController(SDKLogicsCore.controllState.controllerId);
        
        SDKApp.instance().transceiver.sendMsg("gameNextScene", null, true);

        this.recylePacket();
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }
}