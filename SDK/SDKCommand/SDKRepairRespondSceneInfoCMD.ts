import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import * as SDKEnum from "../SDKConst/SDKEnum";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";
import SDKApp from "../SDKBase/SDKApp";

/**
 * 智能补课学生上课 获取场景信息返回
 */
export default class SDKRepairRespondSceneInfoCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairRespondSceneInfoCMD......", data);
        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        repairInfo.sceneIndex = parseInt(data.chapterId);
        repairInfo.startTime = data.duration;
        repairInfo.answerId = data.answerId;
        if (data.playType == "a") {
            repairInfo.playType = SDKEnum.TYPE_REPAIR_PLAY.ANSWER;
            SDKLogicsCore.controllState.controllerId = '';
        } else {
            repairInfo.playType = SDKEnum.TYPE_REPAIR_PLAY.GAME;
        }

        if (repairInfo.sceneIndex != 0) {
            let sceneName: string = SDKLogicsCore.sceneState.getSceneNameByIndex(repairInfo.sceneIndex);
            SDKApp.instance().packetHandler.notifyCMD('gameChangeScene', sceneName);
        } else {
            SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.REPAIR_GET_DATA_REQUEST, repairInfo.sceneIndex);
        }

        if (repairInfo.playType == SDKEnum.TYPE_REPAIR_PLAY.GAME) {
            //请求历史记录信息
            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.GET_GAME_HISTORY, SDKLogicsCore.parameterVo.userId, false);
        }

        this.recylePacket();
    }
}