import SDKCommandBase from './SDKCommandBase';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 显示或者隐藏视频播放按钮
 */
export default class SDKDisplayVedioBtnCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKDisplayVedioBtnCMD.....');

        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;
        // if (controller) {
        //     controller.setVideoState(data);
        // }

        this.recylePacket();
    }
}