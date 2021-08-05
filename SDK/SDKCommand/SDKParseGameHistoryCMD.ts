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
import * as DebugInfo from '../Utils/DebugInfo';
import * as UtilsType from '../Utils/UtilsType';

/**
 * 处理历史消息
 * 只恢复到最后一个场景的最后一个关键帧的状态
 */
export default class SDKParseGameHistoryCMD extends SDKCommandBase {
    private changeScene: string = 'gameChangeScene';

    public execute(data: any): void {
        super.execute(data);

        let index = 0,
            count = 0;
        let indexA = 0,
            countA = 0;
        let msg: any;
        // let controllerIndex = -1;
        let controllerId = SDKLogicsCore.controllState.controllerId;
        let userInfo: SDKUserInfo;
        let packet: SDKPacket;

        DebugInfo.info('SDKParseGameHistoryCMD.....');

        if (SDKLogicsCore.historyInfo.isParse) {
            DebugInfo.info('历史记录信息已解析过。。。。');
            return;
        }

        data = SDKLogicsCore.historyInfo.historyMsgs;
        if (UtilsType.isEmpty(data)) {
            DebugInfo.error('没有历史数据......');
            return;
        }

        if (SDKLogicsCore.userInfos.getCount() <= 1) {
            DebugInfo.error('setUsersInfo没有初始化......');
            return;
        }

        if (SDKLogicsCore.parameterVo.userId === '') {
            DebugInfo.error('setUserInfo没有初始化......');
            return;
        }
        SDKLogicsCore.historyInfo.isParse = true;

        // 消息分拣
        count = data.length;
        for (index = 0; index < count; index++) {
            msg = data[index];
            if (msg.action === SDKRegistCommand.CONTROLLER_CHANGE) {
                // controllerIndex = index;
                controllerId = msg.data;
                continue;
            }

            if (!msg._isMainFrame) {
                // 非关键帧不处理。。。
                continue;
            }

            countA = SDKLogicsCore.userInfos.getCount();
            for (indexA = 0; indexA < countA; indexA++) {
                userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(indexA);
                if (
                    SDKRegistCommand.EVENTS_LIST.indexOf(msg.action) === -1 &&
                    controllerId === '-1'
                ) {
                    // 不是系统消息。。。控制权限是各玩个的。。。
                    if (msg._sendId !== userInfo.userId) {
                        // 消息发送者 不是 对应user. 不保存
                        continue;
                    }
                }
                if (
                    SDKLogicsCore.historyInfo.userMsgs[userInfo.userId] ===
                    undefined
                ) {
                    SDKLogicsCore.historyInfo.userMsgs[userInfo.userId] = [];
                }
                const arr = SDKLogicsCore.historyInfo.userMsgs[userInfo.userId];
                arr.push(msg);
            }
        }

        // 构建每一个伙伴的最后一个关键帧数据包
        count = SDKLogicsCore.userInfos.getCount();
        for (index = 0; index < count; index++) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            const arr = SDKLogicsCore.historyInfo.userMsgs[userInfo.userId];
            if (arr === undefined || arr.length === 0) {
                continue;
            }
            // 处理最后的一个关键帧
            if (arr[arr.length - 1]) {
                packet = this.parseMsg(arr[arr.length - 1]);
                // SDKLogicsCore.historyInfo.addPacket(userInfo.userId, packet);
                userInfo.addPacket(packet);
            }
        }

        // 恢复自己的界面
        // if (controllerIndex !== -1) {
        //     packet = this.parseMsg(data[controllerIndex]);
        //     packets.push(packet);
        // }

        // 恢复自己的控制权限。。。刷新是不表现魔法棒交接的动画效果的。
        SDKLogicsCore.controllState.controllerId = controllerId;
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.setController(controllerId);
            }
        }

        // 恢复自己的界面数据包
        const packets: SDKPacket[] = [];
        const _userInfo = SDKLogicsCore.userInfos.getUserInfoById(
            SDKLogicsCore.parameterVo.userId
        );
        packet = _userInfo && _userInfo.getLastMainPacket();
        if (packet) {
            if (packet.name !== this.changeScene) {
                packets.push(this.checkChangeScene(packet));
            }
            packets.push(packet);
        }

        // 派发数据包 更新游戏界面
        count = packets.length;
        for (index = 0; index < count; index++) {
            SDKApp.instance().packetHandler.dispatcherCMD(packets[index]);
        }

        // 清除消息。。。
        SDKLogicsCore.historyInfo.clear();

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
}
