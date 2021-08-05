import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import * as SDKEnum from "../SDKConst/SDKEnum";
import SDKApp from "../SDKBase/SDKApp";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from "../SDKConst/SDKControllerConst";
import SDKRepairPlayController from "../SDKController/SDKRepairPlayController";

/**
 * 智能补课学生上课 跳过作答
 */
export default class SDKRepairSkipCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairSkipCMD......", data);
        SDKLogicsCore.repairInfo.answerId = data.answerId;
        SDKLogicsCore.controllState.controllerId = '';
        SDKLogicsCore.repairInfo.isPlay = false;

        SDKApp.instance().packetHandler.notifyCMD('gameControllerChange', SDKLogicsCore.controllState.controllerId);

        if (SDKLogicsCore.repairInfo.answerId != "-1") {
            SDKLogicsCore.repairInfo.playType = SDKEnum.TYPE_REPAIR_PLAY.ANSWER;
            SDKLogicsCore.repairInfo.startTime = 0;
            SDKLogicsCore.repairInfo.duration = 0;
        }

        this.updateState();

        this.recylePacket();
    }

    private updateState() : void {
        let repairInfo = SDKLogicsCore.repairInfo;
        let controller: SDKRepairPlayController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.REPAIR_PLAY) as SDKRepairPlayController;
        if (!controller) {
            return;
        }
        if (repairInfo.isPlay) {
            controller.play();
        } else {
            controller.stop();
        }
    }
}