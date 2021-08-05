import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKUserInfo from "../SDKLogics/SDKUserInfo";
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";

/**
 * 智能补课老师录制 保存当前录制页状态
 */
export default class SDKRepairSaveRecordSceneCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairSaveRecordSceneCMD......", data);
        if (!SDKLogicsCore.parameterVo.isRepairRecord) {
            this.recylePacket();
            return;
        }

        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        repairInfo.isNeedResume = true;
        let resumeSceneState = repairInfo.resumeSceneState;
        resumeSceneState.sceneIndex = SDKLogicsCore.sceneState.curIndex;
        resumeSceneState.recordType = repairInfo.recordType;
        resumeSceneState.recordState = repairInfo.recordState;
        resumeSceneState.isGuideAnswer = repairInfo.isGuideAnswer;
        resumeSceneState.recordAnswerTime = repairInfo.recordAnswerTime;
        resumeSceneState.isControllerChange = repairInfo.isControllerChange;
        resumeSceneState.recordPacket = this.getLastMainPacket();

        this.recylePacket();
    }

    private getLastMainPacket(): SDKPacket {
        let packet: SDKPacket;
        let userInfo: SDKUserInfo;

        SDKLogicsCore.repairInfo.clearResumeRecordPacket();
        userInfo = SDKLogicsCore.userInfos.getUserInfoById(SDKLogicsCore.parameterVo.userId);
        packet = userInfo && userInfo.getLastMainPacket();
        if (packet) {
            let tempPacket: SDKPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            return tempPacket;
        }
        return null;
    }
}