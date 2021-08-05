import SDKCommandBase from './SDKCommandBase';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 老师端向分屏的iframe 派发消息
 */

export default class SDKDisplayBtnUICMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKDisplayBtnUICMD');
        if (!data) {
            data = [];
        }

        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;

        if (controller) {
            controller.displayUI(data);
        }

        this.recylePacket();
    }
}
