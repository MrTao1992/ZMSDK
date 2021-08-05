import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKEnum from "../SDKConst/SDKEnum";
import * as SDKControllerConst from "../SDKConst/SDKControllerConst";
import SDKRepairPlayController from "../SDKController/SDKRepairPlayController";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";

/**
 *智能补课学生上课, 课件翻页
 */
export default class SDKRepairChangeSceneCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairChangeSceneCMD......", data);
        let repairInfo = SDKLogicsCore.repairInfo;

        //验证跳转的场景
        let targetIndex = this.getRecordSceneIndex(data.chapterId);
        if (targetIndex >= SDKLogicsCore.sceneState.getCount()) {
            DebugInfo.error("跳转的目标场景不存在......");
            return;
        }

        if (repairInfo.sceneIndex != targetIndex) {
            repairInfo.sceneIndex = targetIndex;
            repairInfo.dataState = SDKEnum.TYPE_REPAIR_DATA.UNLOAD;
            repairInfo.playType = SDKEnum.TYPE_REPAIR_PLAY.GAME;
            repairInfo.answerId = '-1';
            repairInfo.startTime = 0;
            repairInfo.isPlay = false;

            this.updateState();
        }

        let sceneName: string = SDKLogicsCore.sceneState.getSceneNameByIndex(repairInfo.sceneIndex);
        SDKApp.instance().packetHandler.notifyCMD('gameChangeScene', sceneName);

        this.recylePacket();
    }

    private getRecordSceneIndex(index: number): number {
        let sceneIndex: number = index;
        let repairInfo = SDKLogicsCore.repairInfo;

        do {
            let info = repairInfo.getRepairUrlInfo(sceneIndex.toString());
            if (info) {
                sceneIndex = parseInt(info.sceneIndex);
                break;
            }
            sceneIndex++;
        } while (sceneIndex < SDKLogicsCore.sceneState.getCount());

        return sceneIndex;
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