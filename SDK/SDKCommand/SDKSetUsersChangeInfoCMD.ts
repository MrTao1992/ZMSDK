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
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 从培训课堂获取课堂伙伴的信息列表
 */
export default class SDKSetUsersChangeInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (!SDKLogicsCore.parameterVo.isGameTrain()) {
            return;
        }
        DebugInfo.info('SDKSetUsersChangeInfoCMD.....', data);

        let index = 0,
            count = 0;
        let student: any;
        let userInfo: SDKUserInfo;
        let userId: string;
        const students = data.students;
        const remoteIds: string[] = [];
        const userIds: string[] = [];

        SDKLogicsCore.userInfos.ClearUsersFlag();

        count = students.length;
        for (index = 0; index < count; index++) {
            student = students[index];
            if (student.role === 'teacher' || student.role === 'student') {
                if (student.mobile) {
                    userId = student.mobile;
                    userIds.push(userId);
                    if (!SDKLogicsCore.userInfos.isHasUserById(userId)) {
                        userInfo = new SDKUserInfo();
                        userInfo.userId = userId;
                        SDKLogicsCore.userInfos.addUserInfo(userInfo);
                    } else {
                        userInfo = SDKLogicsCore.userInfos.getUserInfoById(
                            userId
                        );
                    }
                    userInfo.userId = userId;
                    userInfo.name = student.name;
                    userInfo.avatar = student.avatar;
                    userInfo.role = SDKLogicsCore.parameterVo.getRoleByValue(
                        student.role
                    );
                    userInfo.isActive = true;
                }
            }
        }

        // 剔除下台的玩家
        count = SDKLogicsCore.userInfos.getCount();
        for (index = count - 1; index >= 0; index--) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            if (userIds.indexOf(userInfo.userId) === -1) {
                remoteIds.push(userInfo.userId);
                SDKLogicsCore.userInfos.removeUserById(userInfo.userId);
            }
            if (
                userInfo.role === SDKEnum.USER_ROLE.TEACHER &&
                remoteIds.indexOf(userInfo.userId) === -1
            ) {
                remoteIds.push(userInfo.userId);
            }
        }

        if (SDKLogicsCore.parameterVo.isObserver()) {
            // 默认是老师
            const id = SDKLogicsCore.userInfos.getTeacherId();
            if (id !== '') {
                SDKLogicsCore.parameterVo.observerId = id;
            }
            SDKLogicsCore.parameterVo.observerRole = SDKEnum.USER_ROLE.TEACHER;
        }

        // 老师端  培训进来的都是监课,所以不用处理
        // if (SDKLogicsCore.parameterVo.isZMG()) {
        //     if (SDKLogicsCore.parameterVo.isTeacher() || SDKLogicsCore.parameterVo.isOberverTeacher()) {
        //         console.log("同步老师的数据...");
        //         this.syncTeacher();
        //     }
        // }

        this.recylePacket();

        // 更新用户分屏
        if (
            SDKLogicsCore.parameterVo.isTeacher() ||
            SDKLogicsCore.parameterVo.isOberverTeacher()
        ) {
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.deleteUsers(remoteIds);
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
                    if (userInfo.isActive) {
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
    // private syncTeacher(): void {
    //     let index = 0, count = 0;
    //     let indexA = 0, countA = 0;
    //     let userInfo: SDKUserInfo;
    //     let teacher: SDKUserInfo;
    //     let packet: SDKPacket;
    //     let tempPacket: SDKPacket;

    //     teacher = SDKLogicsCore.userInfos.getUserInfoById(SDKLogicsCore.userInfos.getTeacherId());
    //     if (!teacher) {
    //         return;
    //     }

    //     count = SDKLogicsCore.userInfos.getCount();
    //     for (index = 0; index < count; index++) {
    //         userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
    //         if (userInfo.isActive && userInfo.role === SDKEnum.USER_ROLE.STUDENT && userInfo.historyCount === 0) {
    //             //没有历史记录
    //             countA = teacher.count();
    //             for (indexA = 0; indexA < countA; indexA++) {
    //                 packet = teacher.getPacketByIndex(indexA);
    //                 tempPacket = SDKPacketPool.Acquire(packet.name);
    //                 packet.clone(tempPacket);
    //                 userInfo.addPacket(tempPacket);
    //                 userInfo.historyCount = userInfo.historyCount + 1;
    //                 console.log("SDKSetUsersInfoCMD中途进入同步...", userInfo);
    //             }
    //         }
    //     }
    // }
}
