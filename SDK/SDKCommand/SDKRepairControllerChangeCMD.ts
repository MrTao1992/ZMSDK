import SDKCommandBase from "./SDKCommandBase";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";

/**
 *智能补课老师录制, 切换权限 
 */
export default class SDKRepairControllerChangeCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairControllerChangeCMD......", data);
        if(SDKLogicsCore.parameterVo.isRepairRecord) {
            let repairInfo : SDKRepairInfo = SDKLogicsCore.repairInfo;
            repairInfo.isControllerChange = true;
        }

        this.recylePacket();
    }
}