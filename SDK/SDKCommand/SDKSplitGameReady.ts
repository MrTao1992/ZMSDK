import SDKCommandBase from './SDKCommandBase';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';

/**
 * 分屏iframe发送给老师端的游戏准备CMD
 */

export default class SDKSplitGameReady extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKSplitGameReady......', data);

        if (
            SDKLogicsCore.parameterVo.isTeacher() ||
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isReplayTeacher()
        ) {
            // 通知老师执行
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;

            if (controller) {
                controller.splitGameReady(data);
            }
        }

        this.recylePacket();
    }
}
