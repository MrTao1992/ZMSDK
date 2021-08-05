import SDKCommandBase from "./SDKCommandBase";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";
import SDKRepairUrlInfo from "../SDKLogics/SDKRepairUrlInfo";
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import SDKContrllerManager from "../SDKController/SDKContrllerManager";
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';

/**
 * 智能补课老师录制 重新录制任意页
 */
export default class SDKRepairRerecordingSceneCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairRerecordingSceneCMD......", data);
        //let sceneIndex = parseInt(data.sceneIndex);
        let targetScene = parseInt(data.targetScene);
        let playType = data.playType;

        if (!SDKLogicsCore.parameterVo.isRepairRecord) {
            this.recylePacket();
            return;
        }

        let urlInfo: SDKRepairUrlInfo = SDKLogicsCore.repairInfo.getRepairUrlInfo(targetScene.toString());
        if (!urlInfo) {
            let repairInfo = SDKLogicsCore.repairInfo;
            if (repairInfo.isNeedResume && repairInfo.resumeSceneState.sceneIndex != targetScene) {
                DebugInfo.error("没有该场景的url配置信息", targetScene);
                this.recylePacket();
                return;
            }
        }

        //场景没加载未完成，或者场景正在加载中。
        if (SDKLogicsCore.sceneState.state != SDKEnum.TYPE_SCENE.TYPE_LOADED) {
            let tempPacket: SDKPacket = SDKPacketPool.Acquire(this._packet.action);
            this._packet.clone(tempPacket);
            SDKLogicsCore.repairInfo.reRecordingPasket = tempPacket;
            this.recylePacket();
            return;
        }

        //重置数据加载状态
        SDKLogicsCore.repairInfo.dataState = SDKEnum.TYPE_REPAIR_DATA.UNLOAD;

        let repairInfo = SDKLogicsCore.repairInfo;
        repairInfo.targetScene = targetScene;
        if (playType == "p") {
            repairInfo.targetType = SDKEnum.TYPE_RECORD.GAME;
        } else if (playType == "u") {
            repairInfo.targetType = SDKEnum.TYPE_RECORD.GUILD;
        } else if (playType == "a") {
            repairInfo.targetType = SDKEnum.TYPE_RECORD.ANSWER;
        }

        this.updateState();
        this.changeScene();
        this.recylePacket();
    }

    protected changeScene() {
        let repairInfo = SDKLogicsCore.repairInfo;
        let currentName = SDKApp.instance().thirdInterface.getSceneName();

        repairInfo.isJumping = true;
        repairInfo.releaseAllStoragePackets();

        let sceneName: string = SDKLogicsCore.sceneState.getSceneNameByIndex(repairInfo.targetScene);
        if (sceneName != '' && currentName != '' && sceneName != currentName) {
            SDKApp.instance().packetHandler.notifyCMD('gameChangeScene', sceneName);
        } else if (sceneName != '' && sceneName == currentName) {
            SDKApp.instance().packetHandler.notifyCMD('changeSceneState',
                [repairInfo.targetScene, SDKLogicsCore.sceneState.state]);
        } else {
            repairInfo.isJumping = false;
            DebugInfo.info('当前场景为空....');
        }
    }

    private updateState(): void {
        let repairInfo = SDKLogicsCore.repairInfo;

        repairInfo.recordState = SDKEnum.TYPE_RECORD_STATE.PAUSE;
        let controller = this.getController();
        controller && controller.updateViewStyle();
        SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", repairInfo.isRecordPalying() ? 1 : 2);
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }
}