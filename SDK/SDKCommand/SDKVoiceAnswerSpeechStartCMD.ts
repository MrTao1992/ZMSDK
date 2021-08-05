import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerSpeechStartCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerSpeechStartCMD:');
        SDKLogicsCore.voiceAnswerInfo.voiceAnswerContent = data;

        this.recylePacket();
    }
}