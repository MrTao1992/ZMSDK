import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
/**
 * 智能补课播放, 获取答题时间
 */
export default class SDKRepairAnswerRespondCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairAnswerRespondCMD......", data);
        if(!SDKLogicsCore.parameterVo.isRepairPlay) {
            return;
        }
        DebugInfo.info("SDKRepairAnswerRespondCMD......", data);

        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;

        repairInfo.recordAnswerTime = 0;
        if (data.timestamp) {
            repairInfo.recordAnswerTime = data.timestamp;
        }
        repairInfo.isGuideAnswer = false;
        if (data.isGuideAnswer) {
            repairInfo.isGuideAnswer = data.isGuideAnswer;
        }

        this.recylePacket();
    }
}