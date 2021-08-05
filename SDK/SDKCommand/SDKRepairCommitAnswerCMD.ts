import SDKCommandBase from "./SDKCommandBase";
import * as DebugInfo from "../Utils/DebugInfo";


/**
 *智能补课学生上课, 提交答案
 */
export default class SDKRepairCommitAnswerCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairCommitAnswerCMD......", data);

        this.recylePacket();
    }
}