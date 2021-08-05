import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKReplayController from '../SDKController/SDKReplayController';

/**
 * 培训控制权限的转换
 */
export default class SDKTrainUsersChangeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKTrainUsersChangeCMD..........', data);

        if (SDKLogicsCore.parameterVo.isSplitScreen()) {
            return;
        }

        if (
            !(
                SDKLogicsCore.parameterVo.isReplay() &&
                SDKLogicsCore.parameterVo.replayType ===
                    SDKEnum.TYPE_REPLAY.TRAIN
            )
        ) {
            return;
        }

        let index = 0,
            count = 0;
        let userInfo: SDKUserInfo;
        const remoteIds: string[] = [];
        const userIds: string[] = data;

        count = SDKLogicsCore.userInfos.getCount();
        for (index = count - 1; index >= 0; index--) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            if (userInfo.userId === SDKLogicsCore.parameterVo.replayId) {
                continue;
            }

            if (userIds.indexOf(userInfo.userId) === -1) {
                userInfo.isSplitReady = false;
                userInfo.role = SDKEnum.USER_ROLE.OBSERVER;
                remoteIds.push(userInfo.userId);
            } else {
                userInfo.role = SDKEnum.USER_ROLE.STUDENT;
            }
        }

        // 更新用户分屏
        if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
            let controller: SDKReplayController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.REPLAY
            ) as SDKReplayController;
            if (controller) {
                controller.changeUserRole(remoteIds);
            }
        }

        this.recylePacket();
    }
}
