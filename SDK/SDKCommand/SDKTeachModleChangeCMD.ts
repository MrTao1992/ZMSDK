import SDKCommandBase from './SDKCommandBase';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 教学模式的改变
 */
export default class SDKTeachModleChangeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKTeachModleChangeCMD......', data);

        let teachModle: SDKEnum.TEACHING_MODE;
        if (data === 0) {
            teachModle = SDKEnum.TEACHING_MODE.TYPE_TEACHING;
        } else if (data === 1) {
            teachModle = SDKEnum.TEACHING_MODE.TYPE_INSPECTION;
        }

        if (
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isReplayTeacher()
        ) {
            // 监课或者回放老师的教学模式
            SDKLogicsCore.controllState.teachingMode = teachModle;
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.teachModleChange(teachModle);
            }
        }

        this.recylePacket();
    }
}
