import SDKCommandBase from './SDKCommandBase';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';

/**
 * 显示后者隐藏切换控制权限按钮
 */
export default class SDKDisplayControllCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKDisplayControllCMD.....');

        let isForceChange = this.checkController(data);
        if (isForceChange) {
            DebugInfo.error('纠正权限......', SDKLogicsCore.controllState.controllerId, SDKLogicsCore.parameterVo.userId);
            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.CONTROLLER_CHANGE, SDKLogicsCore.parameterVo.userId, false);
        }

        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;
        if (controller) {
            controller.displayControll(data);
            controller.setVideoReplay(!data);
            if (data) {
                controller.setVideoState(false);
            }
            if (isForceChange) {
                controller.setController(SDKLogicsCore.controllState.controllerId);
            }
        }

        this.recylePacket();
    }

    protected checkController(data): boolean {
        if (data) {
            return false;
        }
        let name = SDKApp.instance().thirdInterface.getSceneName();
        if (0 == SDKLogicsCore.sceneState.getSceneIndexByName(name)) {
            return false;
        }
        if (SDKLogicsCore.parameterVo.isGameClass() && SDKLogicsCore.parameterVo.isTeacher()) {
            if (SDKLogicsCore.controllState.controllerId == '-1') {
                return true;
            }
            return false;
        }
    }
}