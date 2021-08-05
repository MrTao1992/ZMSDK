import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacket from '../SDKNetwork/SDKPacket';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';
import * as UtilsString from '../Utils/UtilsString';

/**
 * 从zml课件获取多个伙伴的信息
 */
export default class SDKSetUsersInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (SDKLogicsCore.parameterVo.isGameReplay() ||
            SDKLogicsCore.parameterVo.isGameTrain() ||
            SDKLogicsCore.parameterVo.isRepair) {
            return;
        }

        DebugInfo.info('SDKSetUsersInfoCMD.....', data);
        this.sendLog(data);

        let index = 0;
        let count = 0;
        const students = data.students || [];
        let student: any;
        let userInfo: SDKUserInfo;
        let userId: string;

        SDKLogicsCore.userInfos.ClearUsersFlag();

        count = students.length;
        for (index = 0; index < count; index++) {
            student = students[index];
            if (student.role === 'teacher' || student.role === 'student') {
                if (student['mobile']) {
                    userId = String(student['mobile']);
                    if (!SDKLogicsCore.userInfos.isHasUserById(userId)) {
                        userInfo = new SDKUserInfo();
                        userInfo.userId = userId;
                        userInfo.name = student.name;
                        userInfo.avatar = student.avatar;
                        userInfo.role = SDKLogicsCore.parameterVo.getRoleByValue(
                            student.role
                        );
                        SDKLogicsCore.userInfos.addUserInfo(userInfo);
                    } else {
                        userInfo = SDKLogicsCore.userInfos.getUserInfoById(
                            userId
                        );
                    }
                    userInfo.isActive = true;
                }
            }
        }

        if (
            SDKLogicsCore.parameterVo.isStudent() &&
            SDKLogicsCore.controllState.controllerId === ''
        ) {
            SDKLogicsCore.controllState.controllerId = SDKLogicsCore.userInfos.getTeacherId();
        }

        // 老师端
        if (SDKLogicsCore.parameterVo.isZMG()) {
            if (
                SDKLogicsCore.parameterVo.isTeacher() ||
                SDKLogicsCore.parameterVo.isOberverTeacher()
            ) {
                this.syncTeacher();
            }
        }

        let watcherUser: SDKUserInfo;
        if (SDKLogicsCore.parameterVo.observerId !== '') {
            watcherUser = SDKLogicsCore.userInfos.getUserInfoById(
                SDKLogicsCore.parameterVo.observerId
            );
            if (watcherUser) {
                SDKLogicsCore.parameterVo.observerRole = watcherUser.role;
            }
        }

        this.recylePacket();

        // 更新用户分屏
        if (
            SDKLogicsCore.parameterVo.isGameClass() &&
            (SDKLogicsCore.parameterVo.isTeacher() ||
                SDKLogicsCore.parameterVo.isOberverTeacher())
        ) {
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.updateUsers();
            }
        }

        if (SDKLogicsCore.parameterVo.isZML()) {
            // 通知历史记录恢复
            const packet = SDKPacketPool.Acquire(
                SDKRegistCommand.GAME_PARSE_HISTORY
            );
            SDKApp.instance().packetHandler.dispatcherCMD(packet);
        } else {
            if (SDKLogicsCore.parameterVo.isTeacher()) {
                // if (SDKLogicsCore.historyInfo.isParse) {
                //     return;
                // }
                // 请求历史记录信息
                count = SDKLogicsCore.userInfos.getCount();
                for (index = 0; index < count; index++) {
                    userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(
                        index
                    );
                    if (userInfo.isActive && !userInfo.isHistoryReq) {
                        userInfo.isHistoryReq = true;
                        SDKApp.instance().transceiver.sendMsg(
                            SDKRegistCommand.GET_GAME_HISTORY,
                            userInfo.userId,
                            false
                        );
                    }
                }
            } else if (SDKLogicsCore.parameterVo.isGameObserver()) {
                // 监课模式通知历史记录恢复
                const packet = SDKPacketPool.Acquire(
                    SDKRegistCommand.WATCH_HISTORY_REQUEST
                );
                SDKApp.instance().packetHandler.dispatcherCMD(packet);
            }
        }
    }

    // 学生中途进入同步老师数据, 将老师数据保存到学生数据里
    private syncTeacher(): void {
        let index = 0,
            count = 0;
        let indexA = 0,
            countA = 0;
        let userInfo: SDKUserInfo;
        let teacher: SDKUserInfo;
        let packet: SDKPacket;
        let tempPacket: SDKPacket;

        teacher = SDKLogicsCore.userInfos.getUserInfoById(
            SDKLogicsCore.userInfos.getTeacherId()
        );
        if (!teacher) {
            return;
        }

        count = SDKLogicsCore.userInfos.getCount();
        for (index = 0; index < count; index++) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            if (
                userInfo.isActive &&
                userInfo.role === SDKEnum.USER_ROLE.STUDENT &&
                userInfo.historyCount === 0
            ) {
                // 没有历史记录
                countA = teacher.count();
                for (indexA = 0; indexA < countA; indexA++) {
                    packet = teacher.getPacketByIndex(indexA);
                    tempPacket = SDKPacketPool.Acquire(packet.name);
                    packet.clone(tempPacket);
                    userInfo.addPacket(tempPacket);
                    userInfo.historyCount = userInfo.historyCount + 1;
                }
            }
        }
    }

    private sendLog(data) {
        let index = 0;
        let count = 0;
        let student;
        let logInfo = {};

        let users = [];
        logInfo['users'] = users;
        const students = data.students || [];
        count = students.length;
        for (index = 0; index < count; index++) {
            student = students[index];
            if (student.role === 'teacher' || student.role === 'student') {
                let user = {};
                user['mobile'] = UtilsString.formateMobile(student['mobile']);
                user['userId'] = student['userId'] || '0';
                user['name'] = student.name;
                user['role'] = student.role;
                users.push(user);
            }
        }
        SDKApp.instance().newRecordTransceiver.send(SDKLogEventConst.INIT_SET_USERS_INFO, logInfo);
    }
}