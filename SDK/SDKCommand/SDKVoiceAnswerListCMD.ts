import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerListCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerListCMD:');
        SDKLogicsCore.voiceAnswerInfo.voiceAnswerList = data;

        this.recylePacket();
    }
}