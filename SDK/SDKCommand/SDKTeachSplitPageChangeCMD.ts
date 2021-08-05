import SDKCommandBase from './SDKCommandBase';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 教学模式的改变
 */
export default class SDKTeachSplitPageChangeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKTeachSplitPageChangeCMD......', data);
        if (
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isReplayTeacher()
        ) {
            // 监课或者回放老师的教学模式
            SDKLogicsCore.controllState.splitPage = data;
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.teachSplitPageChange(data.pageIndex,data.isFull,data.pageMaxSize);
            }
        }

        this.recylePacket();
    }
}
