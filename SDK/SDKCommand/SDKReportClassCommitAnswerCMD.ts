import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 课程报告 学生答题提交答案
 */
export default class SDKReportClassCommitAnswerCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);
        DebugInfo.info('SDKReportClassCommitAnswerCMD......');
        this.recylePacket();
    }
}
