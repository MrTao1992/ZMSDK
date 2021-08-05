import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerSpeechRequestCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerSpeechRequestCMD:');
        if(SDKLogicsCore.parameterVo.isStudent()) {
            let tempData : any = {};
            tempData.countDownEnd = SDKLogicsCore.voiceAnswerInfo.countDownEnd;
            tempData.voiceAnswerContent = SDKLogicsCore.voiceAnswerInfo.voiceAnswerContent;
            tempData.voiceAnswerState = SDKLogicsCore.voiceAnswerInfo.getVoiceAnswerStateById(SDKLogicsCore.parameterVo.userId);

            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.VOICE_ANSWER_SPEECH_RESPOND,tempData, false);
        }

        this.recylePacket();
    }
}
