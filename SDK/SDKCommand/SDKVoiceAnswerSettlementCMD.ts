import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerSettlementCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (SDKLogicsCore.parameterVo.isStudent()) {
            DebugInfo.info('SDKVoiceAnswerSettlementCMD:');
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.VOICE_ANSWER_SETTLEMEN_SYNC,
                {},
                false);
        }
        this.recylePacket();
    }
}