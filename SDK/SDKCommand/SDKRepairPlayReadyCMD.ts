import SDKCommandBase from "./SDKCommandBase";
import * as DebugInfo from "../Utils/DebugInfo";
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKPacket from "../SDKNetwork/SDKPacket";
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacketPool from "../SDKNetwork/SDKPacketPool";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import SDKWebDashBoradController from "../SDKController/SDKWebDashBoradController";
import SDKContrllerManager from '../SDKController/SDKContrllerManager';

/**
 * 智能补课老师录播, 录制下一页。
 */
export default class SDKRepairPlayReadyCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairPlayReadyCMD......");

        if (SDKLogicsCore.parameterVo.isRepairRecord) {
            let repairInfo = SDKLogicsCore.repairInfo;
            if (!repairInfo.isJumping) {
                this.recylePacket();
                return;
            }
            repairInfo.isJumping = false;
            let controller = this.getController();
            controller && controller.setOpacity(0);
            controller && controller.updateViewStyle();
            this.resumeScene();
        }

        this.recylePacket();
    }

    private getController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
        return controller;
    }

    private resumeScene(): void {
        let index = 0, count = 0;
        let tempPacket: SDKPacket;
        let packet: SDKPacket;
        let packets: Array<SDKPacket> = [];
        let repairInfo = SDKLogicsCore.repairInfo;

        //u,a 阶段的时候， 恢复p阶段的最后一个关键帧数据。
        if (repairInfo.targetType != SDKEnum.TYPE_RECORD.GAME) {
            repairInfo.recordType = SDKEnum.TYPE_RECORD.GAME;
            packet = repairInfo.getLastMainPacket();
            repairInfo.recordType = repairInfo.targetType;

            if (packet) {
                tempPacket = SDKPacketPool.Acquire(packet.name);
                packet.clone(tempPacket);
                repairInfo.recordPacket = tempPacket;
            }
        }

        if (!packet) {
            let sceneName = SDKLogicsCore.sceneState.curSceneName();
            SDKApp.instance().packetHandler.notifyCMD('gameSceneReset', sceneName);
        }

        if (packet && packet.action != 'gameChangeScene') {
            tempPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            packets.push(tempPacket);
        }

        //派发数据包 更新游戏界面
        count = packets.length;
        for (index = 0; index < count; index++) {
            //SDKApp.instance().transceiver.sendPacket(packets[index]);
            SDKApp.instance().packetHandler.dispatcherCMD(packets[index]);
        }

        repairInfo.targetScene = 0;
        repairInfo.targetType = SDKEnum.TYPE_RECORD.GAME;
    }
}