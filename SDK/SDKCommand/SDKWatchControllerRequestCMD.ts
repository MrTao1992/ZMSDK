import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 监课模式向老师请求权限
 */
export default class SDKWatchControllerRequestCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKWatchControllerRequestCMD......');

        if (SDKLogicsCore.parameterVo.isTeacher()) {
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.NOTIFY_WATCH_CONTROLLER,
                SDKLogicsCore.controllState.controllerId,
                false
            );
        }
    }
}
