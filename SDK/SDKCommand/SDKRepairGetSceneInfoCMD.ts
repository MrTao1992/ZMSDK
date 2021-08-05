import SDKCommandBase from "./SDKCommandBase";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";

/**
 *智能补课学生上课 获取场景信息请求
 */
export default class SDKRepairGetSceneInfoCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairGetSceneInfoCMD......");

        this.recylePacket();
    }
}