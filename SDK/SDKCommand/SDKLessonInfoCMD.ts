import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';

/**
 * 处理ZML课件发送到课件的用户信息
 */

export default class SDKLessonInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKLessonInfoCMD......');

        SDKLogicsCore.lessonInfo.lessonId = data.lessonId;
        SDKLogicsCore.lessonInfo.courseName = data.courseName;
        SDKLogicsCore.lessonInfo.startTime = data.startTime;
        SDKLogicsCore.lessonInfo.endTime = data.endTime;
        SDKLogicsCore.lessonInfo.lessonUID = data.lessonUid;

        SDKApp.instance().newRecordTransceiver.setDefaults();
        let logInfo = JSON.parse(JSON.stringify(data));
        SDKApp.instance().newRecordTransceiver.send(SDKLogEventConst.INIT_LESSON_INFO,logInfo);

        this.recylePacket();
    }
}