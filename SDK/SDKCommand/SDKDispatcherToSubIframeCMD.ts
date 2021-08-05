import SDKCommandBase from './SDKCommandBase';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 老师端向分屏的iframe 派发消息
 */

export default class SDKDispatcherToSubIframeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info(
            'SDKDispatcherToSubIframeCMD:发送者id',
            this._packet.sendId
        );

        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;

        if (controller) {
            controller.dispatcherSubIframe(this._packet);
        }

        this.recylePacket();
    }
}
