import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerBeginCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (SDKLogicsCore.parameterVo.isStudent()) {
            DebugInfo.info('SDKVoiceAnswerBeginCMD:');
            SDKApp.instance().transceiver.sendMsg(
                SDKRegistCommand.VOICE_ANSWER_BEGIN_SYNC,
                {
                    toTalDuration: data.toTalDuration,
                    voiceAnswerContent: SDKLogicsCore.voiceAnswerInfo.voiceAnswerContent
                },
                false);
        }
        this.recylePacket();
    }
}