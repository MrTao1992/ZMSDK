import SDKCommandBase from './SDKCommandBase';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 监课者刷新重新进入游戏的时候向老师请求老师的教学模式
 */
export default class SDKTeachModleRequestCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKTeachModleRequestCMD......');

        if (SDKLogicsCore.parameterVo.isTeacher()) {
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.TEACH_MODLE_CHANGE,
                SDKLogicsCore.controllState.teachingMode,
                false
            );
        }

        this.recylePacket();
    }
}
