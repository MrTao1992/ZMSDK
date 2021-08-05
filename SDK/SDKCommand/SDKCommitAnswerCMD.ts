import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";

/**
 * 学生答题
 */
export default class SDKCommitAnswerCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        if (SDKLogicsCore.parameterVo.isRepairPlay) {
            DebugInfo.info("SDKCommitAnswerCMD......", data);
            if (SDKLogicsCore.controllState.isOwn()) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.REPAIR_COMMIT_ANSWER,
                    SDKLogicsCore.sceneState.getAnswerById(data),
                    false);

                SDKLogicsCore.controllState.controllerId = '';
                SDKApp.instance().packetHandler.notifyCMD('gameControllerChange', SDKLogicsCore.controllState.controllerId);
            }
        }

        if (!SDKLogicsCore.parameterVo.isGameClass() ||
            SDKLogicsCore.parameterVo.isRepair ||
            SDKLogicsCore.parameterVo.isGameTrain()) {
            return;
        }
        if (SDKLogicsCore.parameterVo.isStudent()) {
            let answer: any = SDKLogicsCore.sceneState.getAnswerById(data);
            if (answer && answer.isRight) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.REPORT_CLASS_COMMIT_ANSWER,
                    {
                        sceneIndex: SDKLogicsCore.sceneState.curIndex,
                        duration: Math.floor((new Date().getTime() - SDKLogicsCore.sceneState.interaction) / 1000),
                        isRight: answer.isRight
                    },
                    false);
            }
        }
        this.recylePacket();
    }
}