import SDKCommandBase from './SDKCommandBase';
import * as ZMSDK from '../ZMSDK';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 教学模式的改变
 */
export default class SDKNotifyWatchControllerCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKNotifyWatchControllerCMD......', data);

        if (
            SDKLogicsCore.parameterVo.isGameObserver() &&
            SDKLogicsCore.parameterVo.isOberverTeacher()
        ) {
            // 监课，同步老师的控制权限
            SDKLogicsCore.controllState.controllerId = data;
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.setController(data);
            }
        }

        this.recylePacket();
    }
}
