import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKFilterTimeConditon from '../SDKFilters/SDKFilterTimeConditon';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerSyncCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);
        
        if (SDKLogicsCore.parameterVo.isStudent()) {
            DebugInfo.info('SDKVoiceAnswerSyncCMD:');
            if (SDKFilterTimeConditon.instance().isCanSend(SDKRegistCommand.VOICE_ANSWER_SYNC_SYNC)) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.VOICE_ANSWER_SYNC_SYNC,
                    JSON.parse(JSON.stringify(data)),
                    false);
            }
        }
        this.recylePacket();
    }
}
