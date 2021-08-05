import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 培训控制权限的转换
 */
export default class SDKTrainControllerChangeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info(
            'SDKTrainControllerChangeCMD......',
            data,
            SDKLogicsCore.parameterVo.userId
        );

        this.changeController();
        if (
            !(
                SDKLogicsCore.parameterVo.userId === data ||
                SDKLogicsCore.parameterVo.observerId === data
            )
        ) {
            return;
        }

        if (SDKLogicsCore.parameterVo.isTeacher()) {
            SDKLogicsCore.controllState.isSyncTeacher = false;
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.TEACH_MODLE_CHANGE,
                SDKLogicsCore.controllState.teachingMode,
                false
            );
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.CONTROLLER_CHANGE,
                SDKLogicsCore.controllState.controllerId,
                false
            );
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.TRAIN_USERS_CHANGE,
                SDKLogicsCore.userInfos.getStudentIds(),
                false
            );
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE,
                {
                    pageIndex: SDKLogicsCore.controllState.splitPage,
                    isFull: SDKLogicsCore.controllState.isSplitFull
                },
                false
            );
        }

        let controller: SDKWebDashBoradController;
        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;
        if (controller) {
            controller.displayWebDashBoardView();
            if (SDKLogicsCore.parameterVo.isTeacher() || 
                SDKLogicsCore.parameterVo.isOberverTeacher()) {
                controller.setController(
                    SDKLogicsCore.controllState.controllerId
                );
            }
            controller.updateViewStyle();
        }

        if (
            SDKLogicsCore.controllState.teachingMode ===
            SDKEnum.TEACHING_MODE.TYPE_INSPECTION
        ) {
            SDKApp.instance().thirdInterface.showSystemMouse();
        }
        this.recylePacket();
    }

    private changeController(): void {
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            if (
                SDKLogicsCore.controllState.controllerId === '' ||
                SDKLogicsCore.controllState.controllerId !== '-1'
            ) {
                SDKLogicsCore.controllState.controllerId =
                    SDKLogicsCore.parameterVo.userId;
            }
        }
        if (SDKLogicsCore.parameterVo.isObserver()) {
            if (
                SDKLogicsCore.controllState.controllerId === '' ||
                SDKLogicsCore.controllState.controllerId !== '-1'
            ) {
                SDKLogicsCore.controllState.controllerId =
                    SDKLogicsCore.parameterVo.observerId;
            }
        }
        if (SDKLogicsCore.parameterVo.isStudent()) {
            if (
                SDKLogicsCore.controllState.controllerId === '' ||
                SDKLogicsCore.controllState.controllerId !== '-1'
            ) {
                SDKLogicsCore.controllState.controllerId = SDKLogicsCore.userInfos.getTeacherId();
            }
        }
    }
}
