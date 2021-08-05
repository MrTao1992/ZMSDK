import SDKCommandBase from './SDKCommandBase';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 课程报告 学生答题交互时长
 */
export default class SDKReportClassInteractionCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);
        DebugInfo.info('SDKReportClassInteractionCMD......');
        this.recylePacket();
    }
}
