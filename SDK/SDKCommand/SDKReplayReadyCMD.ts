import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 回放准备完毕
 */
export default class SDKReplayReadyCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKReplayReadyCMD......');

        // test
        // ZMSDK.sendMsg("replayInfo",{playOrPause:true,relativeTime:0});

        this.recylePacket();
    }
}
