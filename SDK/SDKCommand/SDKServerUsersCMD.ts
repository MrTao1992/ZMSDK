import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 设置场景状态
 */
export default class SDKServerUsersCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (SDKLogicsCore.parameterVo.isGameReplay()) {
            return;
        }

        DebugInfo.info('SDKServerUsersCMD.....', data);

        let index = 0,
            count = 0;
        const students = data;
        let student: any;
        let userInfo: SDKUserInfo;
        let userId: string;

        SDKLogicsCore.serverUsers.ClearUsersFlag();

        count = students.length;
        for (index = 0; index < count; index++) {
            student = students[index];
            if (student.mobile) {
                userId = student.mobile;
                if (!SDKLogicsCore.serverUsers.isHasUserById(userId)) {
                    userInfo = new SDKUserInfo();
                    userInfo.userId = userId;
                    // userInfo.name = student["name"];
                    // userInfo.avatar = student["avatar"];
                    // userInfo.role = this.getRole(student["role"]);
                    SDKLogicsCore.serverUsers.addUserInfo(userInfo);
                } else {
                    userInfo = SDKLogicsCore.serverUsers.getUserInfoById(
                        userId
                    );
                }
                userInfo.isActive = student.online;
            }
        }

        this.recylePacket();
    }
}
