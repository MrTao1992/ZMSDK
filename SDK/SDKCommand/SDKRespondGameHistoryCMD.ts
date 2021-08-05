import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKApp from '../SDKBase/SDKApp';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKRepairPlayController from "../SDKController/SDKRepairPlayController";
import * as UtilsType from '../Utils/UtilsType';

/**
 * 处理历史消息
 * 只恢复到最后一个场景的最后一个关键帧的状态
 */
export default class SDKRespondGameHistoryCMD extends SDKCommandBase {
    private changeScene: string = 'gameChangeScene';

    public execute(data: any): void {
        super.execute(data);

        let index = 0,
            count = 0;
        let msg: any;
        let msgs: any[];
        let controllerId = SDKLogicsCore.controllState.controllerId;
        let userInfo: SDKUserInfo;
        let packet: SDKPacket;
        let serverUsers: any;

        DebugInfo.info('SDKRespondGameHistoryCMD......', data);
        SDKLogicsCore.historyInfo.isParse = true;

        if (UtilsType.isEmpty(data)) {
            DebugInfo.error('没有历史数据......');
            return;
        }

        userInfo = SDKLogicsCore.userInfos.getUserInfoById(data.mobile);
        if (!userInfo) {
            DebugInfo.error('历史记录玩家不存在......', data["mobile"], SDKLogicsCore.userInfos);
            return;
        }
        userInfo.isHistoryRes = true;

        // 消息处理
        msgs = data.packets;
        count = msgs.length;
        userInfo.historyCount = count;
        for (index = 0; index < count; index++) {
            msg = msgs[index];
            if (msg.action === SDKRegistCommand.CONTROLLER_CHANGE) {
                controllerId = msg.data;
                continue;
            }

            if (msg.action === SDKRegistCommand.SERVER_USERS) {
                serverUsers = msg;
                userInfo.historyCount -= 1;
                continue;
            }

            if (!msg._isMainFrame) {
                // 非关键帧不处理。。。
                continue;
            }

            packet = this.parseMsg(msg);
            userInfo.addPacket(packet);
        }

        //智能补课学生端回放历史记录处理
        if (SDKLogicsCore.parameterVo.isRepairPlay) {
            let controller: SDKRepairPlayController;
            controller = SDKContrllerManager.instance().getController(SDKControllerConst.REPAIR_PLAY) as SDKRepairPlayController;
            if (controller) {
                controller.history();
            }
            return;
        }

        SDKLogicsCore.controllState.controllerId = controllerId;
        //处理学生上台历史状态
        if (SDKLogicsCore.parameterVo.isTeacher() &&
            SDKLogicsCore.userInfos.isAllHistoryRes() &&
            SDKLogicsCore.controllState.onStageState) {
                SDKApp.instance().packetHandler.notifyCMD(
                    SDKRegistCommand.ON_STAGE_CHANGE,
                    SDKLogicsCore.controllState.onStageState
                );
                SDKLogicsCore.controllState.onStageState = null;
        }

        if (SDKLogicsCore.parameterVo.isGameTrain()) {
            SDKApp.instance().transceiver.packetHandler.notifyCMD(
                SDKRegistCommand.TRAIN_CONTROLLER_CHANGE,
                data.mobile
            );
        }
        if (
            SDKLogicsCore.parameterVo.isTeacher() ||
            SDKLogicsCore.parameterVo.isStudent()
        ) {
            if (
                !(
                    userInfo.userId === SDKLogicsCore.parameterVo.userId ||
                    (SDKLogicsCore.parameterVo.isStudent() &&
                        userInfo.role === SDKEnum.USER_ROLE.TEACHER)
                )
            ) {
                return;
            }
            if (
                SDKLogicsCore.parameterVo.isStudent() &&
                userInfo.role === SDKEnum.USER_ROLE.TEACHER
            ) {
                userInfo = SDKLogicsCore.userInfos.getUserInfoById(
                    SDKLogicsCore.parameterVo.userId
                );
                if (userInfo && userInfo.historyCount > 0) {
                    return;
                }
                this.syncTeacher();
            }
        } else if (SDKLogicsCore.parameterVo.isGameObserver()) {
            if (userInfo.userId !== SDKLogicsCore.parameterVo.observerId) {
                return;
            }
        }

        if (!SDKLogicsCore.parameterVo.isGameTrain()) {
            // 恢复自己的控制权限。。。刷新是不表现魔法棒交接的动画效果的。
            if (
                SDKLogicsCore.parameterVo.isTeacher() ||
                SDKLogicsCore.parameterVo.isOberverTeacher()
            ) {
                let controller: SDKWebDashBoradController;
                controller = SDKContrllerManager.instance().getController(
                    SDKControllerConst.WEB_DASHBORAD
                ) as SDKWebDashBoradController;
                if (controller) {
                    controller.setController(controllerId);
                }
            }
        }

        // 恢复自己的界面数据包
        const packets: SDKPacket[] = [];
        packet = userInfo.getLastMainPacket();
        if (packet) {
            if (packet.name !== this.changeScene) {
                packets.push(this.checkChangeScene(packet));
            }
            const tempPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            packets.push(tempPacket);
        }

        if (serverUsers) {
            packet = this.parseMsg(msg);
            packets.push(packet);
        }

        // 派发数据包 更新游戏界面
        count = packets.length;
        for (index = 0; index < count; index++) {
            SDKApp.instance().packetHandler.dispatcherCMD(packets[index]);
        }

        this.recylePacket();
    }

    private checkChangeScene(packet: SDKPacket): SDKPacket {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire(packet.name);
        tempPacket.name = this.changeScene;
        tempPacket.isMainFrame = true;
        tempPacket.data = packet.secene;

        return tempPacket;
    }

    private parseMsg(data: any): SDKPacket {
        let packet: SDKPacket;

        packet = SDKApp.instance().transceiver.messageToPacket(data);
        return packet;
    }

    // 学生中途进入同步老师数据, 将老师数据保存到学生数据里
    private syncTeacher(): void {
        let index = 0,
            count = 0;
        let userInfo: SDKUserInfo;
        let teacher: SDKUserInfo;
        let packet: SDKPacket;
        let tempPacket: SDKPacket;

        teacher = SDKLogicsCore.userInfos.getUserInfoById(
            SDKLogicsCore.userInfos.getTeacherId()
        );
        if (!teacher) {
            return;
        }
        userInfo = SDKLogicsCore.userInfos.getUserInfoById(
            SDKLogicsCore.parameterVo.userId
        );
        if (userInfo.historyCount > 0) {
            return;
        }

        count = teacher.count();
        for (index = 0; index < count; index++) {
            packet = teacher.getPacketByIndex(index);
            tempPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            userInfo.addPacket(tempPacket);
            userInfo.historyCount = userInfo.historyCount + 1;
        }
    }
}