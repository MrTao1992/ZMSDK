import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';

/**
 * 监课者刷新重新进入游戏的时候向老师请求老师的教学模式
 */
export default class SDKTrackDataCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKTrackDataCMD......');

        let trackInfo = SDKLogicsCore.trackInfo;
        if(data) {
            trackInfo.appVersion = data.appVersion;
            trackInfo.deviceId = data.deviceId;
            trackInfo.coursewareId = data.coursewareId;

            SDKApp.instance().newRecordTransceiver.setDefaults();
            let logInfo = JSON.parse(JSON.stringify(data));
            SDKApp.instance().newRecordTransceiver.send(SDKLogEventConst.INIT_SET_TRACK_DATA,logInfo);
        }

        this.recylePacket();
    }
}