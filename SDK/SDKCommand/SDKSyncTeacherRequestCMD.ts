import SDKCommandBase from './SDKCommandBase';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 学生向老师请求最新的状态
 */
export default class SDKSyncTeacherRequestCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (
            !(
                SDKLogicsCore.parameterVo.isGameClass() ||
                SDKLogicsCore.parameterVo.isGameObserver()
            )
        ) {
            return;
        }

        DebugInfo.info('SDKSyncTeacherRequestCMD......');

        // 改成同步老师的历史数据
        if (SDKLogicsCore.parameterVo.isStudent()) {
            let userInfo: SDKUserInfo;
            userInfo = SDKLogicsCore.userInfos.getUserInfoById(
                SDKLogicsCore.parameterVo.userId
            );
            if (userInfo && userInfo.historyCount === 0) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.GET_GAME_HISTORY,
                    SDKLogicsCore.userInfos.getTeacherId(),
                    false
                );
            }
        } else if (
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isTeacher()
        ) {
            let index = 0,
                count = 0;
            let indexA = 0,
                countA = 0;
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

            count = SDKLogicsCore.userInfos.getCount();
            for (index = 0; index < count; index++) {
                userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
                if (
                    userInfo.isActive &&
                    userInfo.role === SDKEnum.USER_ROLE.STUDENT &&
                    userInfo.historyCount === 0
                ) {
                    // 没有历史记录
                    countA = teacher.count();
                    for (indexA = 0; indexA < countA; indexA++) {
                        packet = teacher.getPacketByIndex(indexA);
                        tempPacket = SDKPacketPool.Acquire(packet.name);
                        packet.clone(tempPacket);
                        userInfo.addPacket(tempPacket);
                        userInfo.historyCount = userInfo.historyCount + 1;
                    }
                }
            }
        }
    }
}
