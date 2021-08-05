import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 课程报告 学生答题总数加1
 */
export default class SDKReportAddNewAnswerCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);
        DebugInfo.info('SDKReportAddNewAnswerCMD......');
        this.recylePacket();
    }
}
