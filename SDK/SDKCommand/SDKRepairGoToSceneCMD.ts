import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";

/**
 * 智能补课老师录播, 跳转到某一页。
 */
export default class SDKRepairGoToSceneCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairGoToSceneCMD......", data);

        let sceneName: string = SDKLogicsCore.sceneState.getSceneNameByIndex(data.targetScene);
        if (sceneName != '') {
            let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
            repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
            repairInfo.recordType = SDKEnum.TYPE_RECORD.GAME;
            SDKLogicsCore.controllState.controllerId = SDKLogicsCore.parameterVo.userId;
    
            let controller = this.getController();
            controller && controller.setController(SDKLogicsCore.controllState.controllerId);
            SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);

            SDKApp.instance().packetHandler.notifyCMD('gameChangeScene', sceneName);
        }

        this.recylePacket();
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }
}