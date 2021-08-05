import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from "../SDKConst/SDKControllerConst";
import SDKRepairPlayController from "../SDKController/SDKRepairPlayController";
import SDKApp from "../SDKBase/SDKApp";

/**
 * 智能补课老师录播, 设置答题时间
 */
export default class SDKRepairPlayStateCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairPlayStateCMD......", data);
        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        repairInfo.isPlay = data.isPlay;
        repairInfo.startTime = data.duration;
        repairInfo.duration = 0;

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