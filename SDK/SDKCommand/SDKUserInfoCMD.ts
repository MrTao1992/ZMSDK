import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';
import * as UtilsString from '../Utils/UtilsString';

/**
 * 处理ZML课件发送到课件的用户信息
 */
export default class SDKUserInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (SDKLogicsCore.parameterVo.isGameReplay()) {
            return;
        }
        this.sendLog(data);

        /** 将自己的id设置到公共信息里去 方便外界调用 */
        SDKLogicsCore.parameterVo.userId = data.mobile;
        if (
            SDKLogicsCore.parameterVo.isTeacher() &&
            SDKLogicsCore.controllState.controllerId === ''
        ) {
            SDKLogicsCore.controllState.controllerId =
                SDKLogicsCore.parameterVo.userId;

            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.setController(
                    SDKLogicsCore.controllState.controllerId
                );
            }
        }

        let userInfo: SDKUserInfo;
        userInfo = new SDKUserInfo();
        userInfo.userId = String(data["mobile"]);
        userInfo.name = data["name"];
        userInfo.avatar = data["avatar"];
        userInfo.watchMobile = data["watchMobile"];

        userInfo.role = SDKLogicsCore.parameterVo.role;
        SDKLogicsCore.setMainInfo(userInfo);
        if (SDKLogicsCore.parameterVo.isTeacher() ||
            SDKLogicsCore.parameterVo.isStudent()) {
            SDKLogicsCore.userInfos.addUserInfo(userInfo);
        }
        SDKLogicsCore.parameterVo.observerId = userInfo.watchMobile;

        let watcherUser: SDKUserInfo;
        watcherUser = SDKLogicsCore.userInfos.getUserInfoById(
            userInfo.watchMobile
        );
        if (watcherUser) {
            SDKLogicsCore.parameterVo.observerRole = watcherUser.role;
        }

        DebugInfo.info('SDKUserInfoCMD:______', userInfo.name, userInfo.userId);
        this.recylePacket();

        if (SDKLogicsCore.parameterVo.isZML()) {
            // 通知历史记录恢复
            const packet = SDKPacketPool.Acquire(
                SDKRegistCommand.GAME_PARSE_HISTORY
            );
            SDKApp.instance().packetHandler.dispatcherCMD(packet);
        } else {
            if (SDKLogicsCore.parameterVo.isStudent()) {
                if (SDKLogicsCore.parameterVo.isRepairPlay) {
                    //智能补课学生上课
                    //ZMSDK.sendMsg(SDKRegistCommand.REPAIR_GET_SCENE_INFO, null, false);
                } else {
                    //请求历史记录信息
                    SDKApp.instance().transceiver.sendMsg(
                        SDKRegistCommand.GET_GAME_HISTORY,
                        SDKLogicsCore.parameterVo.userId,
                        false);
                }
            } else if (SDKLogicsCore.parameterVo.isGameObserver()) {
                // 监课模式通知历史记录恢复
                const packet = SDKPacketPool.Acquire(
                    SDKRegistCommand.WATCH_HISTORY_REQUEST
                );
                SDKApp.instance().packetHandler.dispatcherCMD(packet);
            }
        }
    }

    private sendLog(data): void {
        let logInfo = {};

        logInfo['name'] = data["name"];
        logInfo['mobile'] = UtilsString.formateMobile(data["mobile"]);
        logInfo['userId'] = data["userId"] || '0';
        logInfo['watchMobile'] = UtilsString.formateMobile(data['watchMobile']);
        SDKApp.instance().newRecordTransceiver.send(SDKLogEventConst.INIT_SET_USER_INFO, logInfo);
    }
}