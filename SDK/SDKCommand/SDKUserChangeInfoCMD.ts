import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import SDKCommandBase from './SDKCommandBase';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 处理培训课改变用户角色信息
 */
export default class SDKUserChangeInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (!SDKLogicsCore.parameterVo.isGameTrain()) {
            return;
        }

        const userId = data.mobile;
        if (userId === '' || SDKLogicsCore.parameterVo.userId !== userId) {
            console.error('it is not mine......');
            return;
        }

        let userInfo: SDKUserInfo;
        userInfo = SDKLogicsCore.mainInfo;
        userInfo.watchMobile = data.watchMobile;
        userInfo.role = SDKLogicsCore.parameterVo.getRoleByValue(data.role);
        SDKLogicsCore.parameterVo.observerId = userInfo.watchMobile;
        SDKLogicsCore.parameterVo.role = userInfo.role;

        if (SDKLogicsCore.parameterVo.isObserver()) {
            // 默认是老师
            SDKLogicsCore.parameterVo.observerRole = SDKEnum.USER_ROLE.TEACHER;
        }

        DebugInfo.info(
            'SDKUserChangeInfoCMD:......',
            userInfo.name,
            userInfo.userId,
            userInfo.role
        );
        this.recylePacket();

        if (SDKLogicsCore.parameterVo.isZML()) {
            // 通知历史记录恢复
            const packet = SDKPacketPool.Acquire(
                SDKRegistCommand.GAME_PARSE_HISTORY
            );
            SDKApp.instance().packetHandler.dispatcherCMD(packet);
        } else {
            if (SDKLogicsCore.parameterVo.isStudent()) {
                // 请求历史记录信息
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.GET_GAME_HISTORY,
                    SDKLogicsCore.parameterVo.userId,
                    false
                );
            }
            // 在培训模式下,不需要再这里请求,下放到setUsersChangeInfo里.
            // else if (SDKLogicsCore.parameterVo.isGameObserver()) {
            //     //监课模式通知历史记录恢复
            //     let packet = SDKPacketPool.Acquire(SDKRegistCommand.WATCH_HISTORY_REQUEST);
            //     SDKApp.instance().packetHandler.dispatcherCMD(packet);
            // }
        }
    }
}
