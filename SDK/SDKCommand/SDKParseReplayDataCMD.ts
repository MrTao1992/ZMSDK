import SDKCommandBase from './SDKCommandBase';
import SDKReplayInfo from '../SDKLogics/SDKReplayInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKApp from '../SDKBase/SDKApp';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as UtilsType from '../Utils/UtilsType';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';

/**
 * 解析回放数据
 */
export default class SDKParseReplayDataCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKParseReplayDataCMD......');

        let index = 0;
        let count = 0;
        const userId: string = data[0];
        const content: any = data[1];
        let packet: SDKPacket;
        let isOnLine: boolean = true;
        let isInsert: boolean = false;
        const replayInfo: SDKReplayInfo = SDKLogicsCore.ReplayInfo;

        if (!content) {
            DebugInfo.error('回放数据异常......');
            return;
        }
        replayInfo.total = content.duration;
        const messages = content.whiteboard;
        if (!messages) {
            return;
        }

        let curTime: number = 0;
        count = messages.length;
        for (index = 0; index < count; index++) {
            packet = this.parseMsg(messages[index][1]);
            packet.relativeTime = curTime + messages[index][0];
            curTime = packet.relativeTime;
            if (packet.action === SDKRegistCommand.SAVE_USERS_INFO) {
                this.updateUserInfo(packet.data);
            }
            //后端插入的数据
            if (packet.action === SDKRegistCommand.REPLAY_ONLINE_STATUS) {
                isOnLine = packet.data;
                isInsert = true;
                continue;
            }
            if (isInsert) {
                packet.isOnline = isOnLine;
            }
            replayInfo.addPacket(userId, packet);
        }

        this.recylePacket();
    }

    private parseMsg(data: any): SDKPacket {
        let packet: SDKPacket;

        packet = SDKApp.instance().transceiver.messageToPacket(data);
        return packet;
    }

    private updateUserInfo(students): void {
        let index: number = 0;
        let count: number = 0;
        let student;
        let userId;
        let userInfo: SDKUserInfo;

        if (UtilsType.isEmpty(students)) {
            return;
        }
        count = students.length;
        for (index = 0; index < count; index++) {
            student = students[index];
            if (student['mobile']) {
                userId = String(student['mobile']);
                userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
                if (userInfo) {
                    userInfo.name = student.name;
                }
            }
        }
    }
}