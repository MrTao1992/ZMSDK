import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as UtilsString from '../Utils/UtilsString';

/**
 * 从课件获取整个用户的信息
 */
export default class SDKSetAllUsersInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKSetAllUsersInfoCMD.....');
        if (SDKLogicsCore.parameterVo.isGameReplay() ||
            SDKLogicsCore.parameterVo.isGameTrain() ||
            SDKLogicsCore.parameterVo.isRepair) {
            return;
        }

        let index = 0;
        let count = 0;
        let student: any;
        let userId: string;
        let userInfo: SDKUserInfo;
        const students = data;
        let saveStudents = [];

        count = students.length;
        for (index = 0; index < count; index++) {
            student = students[index];
            if (student.role === 'teacher' || student.role === 'student') {
                if (student['mobile']) {
                    userId = String(student['mobile']);
                    if (!SDKLogicsCore.allUsers.isHasUserById(userId)) {
                        userInfo = new SDKUserInfo();
                        userInfo.userId = userId;
                        userInfo.name = student.name;
                        userInfo.avatar = student.avatar;
                        userInfo.role = SDKLogicsCore.parameterVo.getRoleByValue(student.role);
                        SDKLogicsCore.allUsers.addUserInfo(userInfo);
                        saveStudents.push({
                            'mobile': userId,
                            'name': student.name,
                            'role': student.role,
                            'avatar': student.avatar,
                            'userId': student.userId
                        });
                    }
                }
            }
        }

        //保存课堂所有信息到老师端数据里去
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.SAVE_USERS_INFO, saveStudents, false);
        }
        this.sendLog(saveStudents);

        this.recylePacket();
    }

    private sendLog(data): void {
        let index = 0;
        let count = 0;
        let logInfo = {};
        let users = [];
        let student;

        logInfo['users'] = users;
        count = data.length;
        for (index = 0; index < count; index++) {
            student = data[index];
            users.push({
                'mobile': UtilsString.formateMobile(student.mobile),
                'name': student.name,
                'role': student.role,
                'userId': student.userId || '0'
            });
        }
        SDKApp.instance().newRecordTransceiver.send(SDKLogEventConst.INIT_SET_ALL_USERS_INFO, logInfo);
    }
}