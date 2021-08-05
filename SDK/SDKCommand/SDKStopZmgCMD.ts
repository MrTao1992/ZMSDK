import SDKCommandBase from './SDKCommandBase';
import SDKApp from '../SDKBase/SDKApp';
import * as DebugInfo from '../Utils/DebugInfo';
import * as UtilsType from '../Utils/UtilsType';

/**
 * 处理ZML课件发送到课件的用户信息
 */
export default class SDKStopZmgCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (UtilsType.isEmpty(SDKApp.instance().thirdInterface.getScene())) {
            return;
        }
        DebugInfo.info('SDKStopZmgCMD......', data);

        if (data) {
            SDKApp.instance().packetHandler.notifyCMD('gameReplayPlay', 2);
            SDKApp.instance().thirdInterface.pause();
        } else {
            SDKApp.instance().thirdInterface.resume();
            SDKApp.instance().packetHandler.notifyCMD('gameReplayPlay', 1);
        }

        this.recylePacket();
    }
}
