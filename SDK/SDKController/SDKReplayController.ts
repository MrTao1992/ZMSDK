import SDKApp from '../SDKBase/SDKApp';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKControllerBase from './SDKControllerBase';
import SDKReplayInfo from '../SDKLogics/SDKReplayInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKWebDashBoradController from './SDKWebDashBoradController';
import SDKContrllerManager from './SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKPackets from '../SDKNetwork/SDKPackets';
import SDKReplayView from '../SDKView/SDKReplayView';
import * as DebugInfo from '../Utils/DebugInfo';
import * as UtilsType from '../Utils/UtilsType';

export default class SDKReplayController extends SDKControllerBase {
    private changeScene: string = 'gameChangeScene';

    private _replayView: SDKReplayView;

    private _isPlay: boolean;
    private _duration: number;
    private _startIndex: number;
    private _replayInfo: SDKReplayInfo;
    private _splitStartIndex: any;

    private _controlllerId: string;
    private _isSplit: boolean;
    private _offlinePackets: any;

    constructor() {
        super();
    }

    public update(dt: number) {
        let gameId, userId;

        if (!this._isPlay) {
            return;
        }
        this._duration += this._replayInfo.speed * dt * 1000;
        this._replayInfo.duration = this._duration;

        if (SDKLogicsCore.parameterVo.replayMobiles.length === 0) {
            DebugInfo.error('回放replayMobiels参数有误......');
            return;
        }

        gameId = SDKLogicsCore.parameterVo.gameId;
        if (
            SDKLogicsCore.parameterVo.isReplayTeacher() &&
            SDKLogicsCore.controllState.teachingMode ===
            SDKEnum.TEACHING_MODE.TYPE_INSPECTION
        ) {
            this.splitRender();
        } else {
            userId = SDKLogicsCore.parameterVo.replayId;
            this.notifyCMD(gameId, userId, this._startIndex);
        }
    }

    public stop(): void {
        this._isPlay = false;
        SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.GAME_STOP);
        // if (this._isSplit) {
        //     this.notitySubIframeState(false);
        // }
    }

    public play(): void {
        let gameId, userId;
        SDKApp.instance().packetHandler.notifyCMD(SDKRegistCommand.GAME_RESUME);
        // if (this._isSplit) {
        //     this.notitySubIframeState(true);
        // }

        if (SDKLogicsCore.parameterVo.replayMobiles.length === 0) {
            DebugInfo.error('回放replayMobiels参数有误......');
            return;
        }
        gameId = SDKLogicsCore.parameterVo.gameId;
        userId = SDKLogicsCore.parameterVo.replayId;

        this._isPlay = true;
        this._duration = 0;
        this._startIndex = this.getStartIndex(
            gameId,
            userId,
            this._replayInfo.curTime()
        );

        //this.clearOfflinePackets();
        this.updateOnlineState(userId,true);
        this.parseGlobleInfo();
        this.syncScene();
        this.update(0);
    }

    public changeUserRole(students: string[]): void {
        let index = 0,
            count = 0;
        let controller: SDKWebDashBoradController;

        count = students.length;
        for (index = 0; index < count; index++) {
            if (this._splitStartIndex[students[index]] === undefined) {
                continue;
            }
            delete this._splitStartIndex[students[index]];
        }
        controller = this.getDashBoradController();
        if (students.length > 0) {
            controller && controller.deleteUsers(students);
        }
        controller && controller.updateUsers();
    }

    public replayResumeUserView(userId: string): void {
        if (SDKLogicsCore.controllState.teachingMode ===
            SDKEnum.TEACHING_MODE.TYPE_INSPECTION) {
            this.updateSubIframe(userId);
        }
    }

    public reset(): void {
        super.reset();

        this._isPlay = false;
        this._duration = 0;
        this._isSplit = false;
        this._controlllerId = '';
        this._splitStartIndex = {};
        this._replayInfo = SDKLogicsCore.ReplayInfo;
        this._offlinePackets = {};
    }

    protected constructorViews(): void {
        super.constructorViews();
        if (SDKLogicsCore.parameterVo.isGameReplay()) {
            this._replayView = new SDKReplayView(this);
            this._views.push(this._replayView);
        }
    }

    private splitRender(): void {
        let index = 0,
            count = 0;
        let gameId, userId;
        let userInfo: SDKUserInfo;

        gameId = SDKLogicsCore.parameterVo.gameId;

        count = SDKLogicsCore.parameterVo.replayMobiles.length;
        for (index = 0; index < count; index++) {
            userId = SDKLogicsCore.parameterVo.replayMobiles[index];
            if (userId !== SDKLogicsCore.parameterVo.replayId) {
                userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
                if (userInfo.role !== SDKEnum.USER_ROLE.STUDENT) {
                    continue;
                }
                if (
                    userInfo.isSplitReady &&
                    this._splitStartIndex[userId] !== undefined
                ) {
                    this.notifyCMD(
                        gameId,
                        userId,
                        this._splitStartIndex[userId]
                    );
                } else if (this._splitStartIndex[userId] === undefined) {
                    // 检查userId子分屏是否加载完成
                    this.checkSubIframeReady(userId);
                }
            } else if (userId === SDKLogicsCore.parameterVo.replayId) {
                this.checkChangeModle();
            }
        }
    }

    private updateSubIframe(userId: string): void {
        let gameId: number;
        let userInfo: SDKUserInfo;

        gameId = SDKLogicsCore.parameterVo.gameId;
        userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);

        if (userInfo.isSplitReady) {
            let packetIndex = this._replayInfo.getReplayStartIndex(
                gameId,
                userId,
                this._replayInfo.curTime()
            );
            if (!this._splitStartIndex[userId] ||
                this._splitStartIndex[userId] < packetIndex) {
                this._splitStartIndex[userId] = packetIndex;
            }
            if (
                SDKLogicsCore.parameterVo.replayType ===
                SDKEnum.TYPE_REPLAY.TRAIN
            ) {
                this.syncTrainPacket(userId);
            } else {
                this.syncDispatch(gameId, userId, packetIndex, userId);
            }
        }
    }

    private checkSubIframeReady(userId: string): void {
        let gameId: number;
        let userInfo: SDKUserInfo;

        gameId = SDKLogicsCore.parameterVo.gameId;
        userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);

        if (userInfo.isSplitReady) {
            // 子iframe 加载完成了
            this._splitStartIndex[
                userId
            ] = this._replayInfo.getReplayStartIndex(
                gameId,
                userId,
                this._replayInfo.curTime()
            );
            if (
                SDKLogicsCore.parameterVo.replayType ===
                SDKEnum.TYPE_REPLAY.TRAIN
            ) {
                this.syncTrainPacket(userId);
            } else {
                this.syncDispatch(gameId, userId, this._splitStartIndex[userId], userId);
            }
            DebugInfo.info('分屏结束......', userId, this._splitStartIndex[userId]);
        }
    }

    private syncTrainPacket(userId: string): void {
        let gameId, replayId, index;

        gameId = SDKLogicsCore.parameterVo.gameId;
        replayId = SDKLogicsCore.parameterVo.replayId;
        index = this.getStartIndex(
            gameId,
            replayId,
            this._replayInfo.curTime()
        );

        //同步培训师的数据给学生
        this.syncDispatch(gameId, replayId, index, userId);
    }

    private getStartIndex(
        gameId: number,
        userId: string,
        time: number
    ): number {
        return this._replayInfo.getReplayStartIndex(gameId, userId, time);
    }

    private checkChangeModle(): void {
        let packet: SDKPacket;
        let userId, gameId;

        gameId = SDKLogicsCore.parameterVo.gameId;
        userId = SDKLogicsCore.parameterVo.userId;

        packet = this._replayInfo.getReplayPacketByIndex(
            gameId,
            userId,
            this._startIndex
        );
        if (!packet || packet.relativeTime > this._replayInfo.curTime()) {
            return;
        }
        let tempPacket: SDKPacket;
        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
        this._startIndex++;
    }

    private notifyCMD(
        gameId: number,
        userId: string,
        startIndex: number
    ): void {
        let packet: SDKPacket;
        let index: number;

        this._isSplit =
            SDKLogicsCore.controllState.teachingMode ===
            SDKEnum.TEACHING_MODE.TYPE_INSPECTION;

        index = startIndex;
        do {
            packet = this._replayInfo.getReplayPacketByIndex(
                gameId,
                userId,
                index
            );
            if (UtilsType.isEmpty(packet)) {
                return;
            }
            if (packet.relativeTime <= this._replayInfo.curTime()) {
                let tempPacket: SDKPacket;
                tempPacket = SDKPacketPool.Acquire(packet.name);
                packet.clone(tempPacket);
                DebugInfo.info(
                    '回放数据包...',
                    tempPacket.name,
                    index,
                    userId,
                    gameId,
                    tempPacket.isOnline
                );
                if (!this._isSplit) {
                    SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
                    this._startIndex++;
                    index = this._startIndex;
                } else {
                    let controller = this.getDashBoradController();
                    controller && controller.notifySubIframe(tempPacket, userId);
                    this._splitStartIndex[userId]++;
                    index = this._splitStartIndex[userId];
                }
                this.updateOnlineState(userId, packet.isOnline);
            } else if (packet.relativeTime > this._replayInfo.curTime()) {
                break;
            }
        } while (packet);
    }

    /**
     * 更新在线状态
     * @param userId
     * @param isOnline
     */
    private updateOnlineState(userId: string, isOnline: boolean): void {
        if (SDKLogicsCore.parameterVo.replayId === userId) {
            this._replayView.updateOnlineState(isOnline);
        }
        this.updateSplitOnlineState(userId, isOnline);
    }

    /**
     * 更新分屏在线状态
     */
    private updateSplitOnlineState(userId: string, isOnline: boolean): void {
        let isChange: boolean = false;
        let userInfo: SDKUserInfo;

        if (!SDKLogicsCore.parameterVo.isReplayTeacher()) {
            return;
        }
        if (userId !== SDKLogicsCore.parameterVo.replayId) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
            if (UtilsType.isEmpty(userInfo)) {
                return;
            }
            if (userInfo.isActive !== isOnline) {
                isChange = true;
            }
            userInfo.isActive = isOnline;
        }
        if (
            isChange &&
            SDKLogicsCore.controllState.teachingMode ===
            SDKEnum.TEACHING_MODE.TYPE_INSPECTION
        ) {
            let controller = this.getDashBoradController();
            controller && controller.updateUsers();
        }
    }

    /** 解析全局信息 */
    private parseGlobleInfo(): void {
        let index = 0,
            count = 0;
        let gameId, userId;
        let packet: SDKPacket;
        let students: string[] = [];
        let splitPage: number;
        let isSplitFull: boolean;
        let pageMaxSize: number;

        gameId = SDKLogicsCore.parameterVo.gameId;
        userId = SDKLogicsCore.parameterVo.replayId;
        splitPage = SDKLogicsCore.controllState.splitPage;
        isSplitFull = SDKLogicsCore.controllState.isSplitFull;
        pageMaxSize = SDKLogicsCore.gameConfig.splitPageNumber;

        if (SDKLogicsCore.parameterVo.isReplayStudent()) {
            this._controlllerId = '';
        } else if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
            this._controlllerId = SDKLogicsCore.parameterVo.replayId;
        }
        this._isSplit = false;

        count = this._replayInfo.getPacketsCount(userId, gameId);
        for (index = 0; index < count; index++) {
            packet = this._replayInfo.getReplayPacketByIndex(
                gameId,
                userId,
                index
            );
            if (packet.relativeTime > this._replayInfo.curTime()) {
                break;
            }
            if (packet.name === SDKRegistCommand.CONTROLLER_CHANGE) {
                this._controlllerId = packet.data;
            }
            if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
                if (packet.name === SDKRegistCommand.TEACH_MODLE_CHANGE) {
                    this._isSplit = packet.data === 1;
                }
                if (packet.name === SDKRegistCommand.TRAIN_USERS_CHANGE) {
                    students = packet.data;
                }
                if (packet.name === SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE) {
                    splitPage = packet.data.pageIndex;
                    isSplitFull = packet.data.isFull;
                    if(packet.data.pageMaxSize) {
                        pageMaxSize = packet.data.pageMaxSize;
                    }
                }
            }
        }
        SDKLogicsCore.controllState.controllerId = this._controlllerId;
        SDKLogicsCore.controllState.splitPage = splitPage;
        SDKLogicsCore.controllState.isSplitFull = isSplitFull;
        SDKLogicsCore.gameConfig.splitPageNumber = pageMaxSize;
        this.changeState();
        if (
            SDKLogicsCore.parameterVo.replayType === SDKEnum.TYPE_REPLAY.TRAIN
        ) {
            this.changeIframes(students);
        }
    }

    private changeState(): void {
        SDKApp.instance().packetHandler.notifyCMD(
            SDKRegistCommand.CONTROLLER_CHANGE,
            this._controlllerId
        );

        if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
            let controller: SDKWebDashBoradController;
            controller = this.getDashBoradController();
            if (controller) {
                controller.setController(this._controlllerId);
                controller.teachModleChange(this._isSplit ? 1 : 0);
                controller.teachSplitPageChange(
                    SDKLogicsCore.controllState.splitPage,
                    SDKLogicsCore.controllState.isSplitFull,
                    SDKLogicsCore.gameConfig.splitPageNumber);
            }
        }
    }

    private changeIframes(students: string[]): void {
        if (UtilsType.isEmpty(students)) {
            students = [];
        }
        SDKApp.instance().packetHandler.notifyCMD(
            SDKRegistCommand.TRAIN_USERS_CHANGE,
            students
        );
    }

    private syncScene(): void {
        let userId, gameId;
        let userInfo: SDKUserInfo;

        gameId = SDKLogicsCore.parameterVo.gameId;
        if (SDKLogicsCore.parameterVo.isReplayTeacher() && this._isSplit) {
            let index = 0,
                count = 0;
            count = SDKLogicsCore.parameterVo.replayMobiles.length;
            for (index = 0; index < count; index++) {
                userId = SDKLogicsCore.parameterVo.replayMobiles[index];
                if (userId !== SDKLogicsCore.parameterVo.userId) {
                    userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
                    if (userInfo.role !== SDKEnum.USER_ROLE.STUDENT) {
                        continue;
                    }
                    if (!userInfo.isSplitReady) {
                        continue;
                    }
                    this._splitStartIndex[
                        userId
                    ] = this._replayInfo.getReplayStartIndex(
                        gameId,
                        userId,
                        this._replayInfo.curTime()
                    );
                    this.syncDispatch(gameId, userId, this._splitStartIndex[userId], userId);
                } else {
                    this.syncDispatch(gameId, userId, this._startIndex);
                }
            }
        } else {
            userId = SDKLogicsCore.parameterVo.replayId;
            this.syncDispatch(gameId, userId, this._startIndex);
        }
    }

    private syncDispatch(gameId, userId, startIndex, target = '') {
        let packet: SDKPacket;

        packet = this._replayInfo.getReplayPacketByIndex(
            gameId,
            userId,
            startIndex
        );
        if (startIndex === 0) {
            if (UtilsType.isEmpty(packet) || packet.secene == '' ||
                packet.relativeTime > this._replayInfo.curTime()) {
                packet = new SDKPacket();
                packet.secene = SDKLogicsCore.sceneState.getSceneNameByIndex(0);
            }
            if (!packet.isMainFrame) {
                packet = this.checkChangeScene(packet);
            }
        }
        this.syncPacket(packet, target);
    }

    private syncPacket(packet: SDKPacket, userId: string = ''): void {
        let index = 0,
            count = 0;
        let tempPacket: SDKPacket;
        let packets: SDKPacket[];

        if (
            UtilsType.isEmpty(packet) ||
            packet.relativeTime > this._replayInfo.curTime()
        ) {
            // 同步前面的包,后面的包Update来处理
            return;
        }

        packets = [];
        if (packet.name !== this.changeScene && packet.isMainFrame) {
            tempPacket = this.checkChangeScene(packet);
            if (tempPacket) {
                packets.push(tempPacket);
            }
        }
        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        packets.push(tempPacket);
        if (packet.name === this.changeScene) {
            tempPacket = this.initScene(packet.data);
            packets.push(tempPacket);
        }

        count = packets.length;
        for (index = 0; index < count; index++) {
            tempPacket = packets[index];
            if (userId === '') {
                SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
            } else {
                let controller = this.getDashBoradController();
                controller && controller.notifySubIframe(tempPacket, userId);
            }
        }
    }

    private checkChangeScene(packet: SDKPacket): SDKPacket {
        let tempPacket: SDKPacket;

        if (UtilsType.isEmpty(packet) || packet.secene === '') {
            return null;
        }

        tempPacket = SDKPacketPool.Acquire(packet.name);
        tempPacket.name = this.changeScene;
        tempPacket.isMainFrame = true;
        tempPacket.data = packet.secene;

        return tempPacket;
    }

    private initScene(sceneName: string): SDKPacket {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire('gameSceneReset');
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.isMainFrame = false;
        tempPacket.data = sceneName;

        return tempPacket;
    }

    private getDashBoradController(): SDKWebDashBoradController {
        let controller: SDKWebDashBoradController;

        controller = SDKContrllerManager.instance().getController(
            SDKControllerConst.WEB_DASHBORAD
        ) as SDKWebDashBoradController;

        return controller;
    }

    /**
     * 执行离线数据包,以便恢复在线的时候的状态
     */
    private excuteOnlinePackets(userId: string): void {
        let gameId;
        let packet: SDKPacket;
        let packets: SDKPackets;
        let index = 0,
            count = 0;
        let lastMainIndex: number;

        gameId = SDKLogicsCore.parameterVo.gameId;
        packets = this._offlinePackets[userId];
        if (!packets || packets.getPacketsCount() === 0) {
            return;
        }

        lastMainIndex = -1;
        count = packets.getPacketsCount();
        for (index = 0; index < count; index++) {
            packet = packets.getPacketByIndex(index);
            if (packet.isMainFrame) {
                lastMainIndex = index;
            }
            if (packet.name === SDKRegistCommand.CONTROLLER_CHANGE) {
                this._controlllerId = packet.data;
            }
            if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
                if (packet.name === SDKRegistCommand.TEACH_MODLE_CHANGE) {
                    this._isSplit = packet.data === 1;
                } else if (packet.name === SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE) {
                    SDKLogicsCore.controllState.splitPage = packet.data.pageIndex;
                    SDKLogicsCore.controllState.isSplitFull = packet.data.isFull;
                    if(packet.data.pageMaxSize) {
                        SDKLogicsCore.gameConfig.splitPageNumber = packet.data.pageMaxSize;
                    }
                }
            }
        }

        if (userId === SDKLogicsCore.parameterVo.replayId) {
            SDKLogicsCore.controllState.controllerId = this._controlllerId;
            this.changeState();
        }

        if (lastMainIndex === -1) {
            this.clearOfflinePackets(userId);
            return;
        }

        packet = packets.getPacketByIndex(lastMainIndex);
        if (userId === SDKLogicsCore.parameterVo.replayId) {
            this.syncPacket(packet);
        } else {
            this.syncPacket(packet, userId);
        }
        this.clearOfflinePackets(userId);
    }

    private addOfflinePacket(userId: string, packet: SDKPacket): void {
        let packets: SDKPackets;

        if (!this._offlinePackets[userId]) {
            packets = new SDKPackets();
            this._offlinePackets[userId] = packets;
        }
        packets = this._offlinePackets[userId];
        packets.addPacket(packet);
    }

    private clearOfflinePackets(id: string = ''): void {
        let index, count, userId;

        count = SDKLogicsCore.parameterVo.replayMobiles.length;
        for (index = 0; index < count; index++) {
            userId = SDKLogicsCore.parameterVo.replayMobiles[index];
            if ((id !== '' && userId === id) || id === '') {
                if (this._offlinePackets[userId]) {
                    (this._offlinePackets[userId] as SDKPackets).reset();
                    this._offlinePackets[userId] = null;
                }
            }
        }
    }

    private notitySubIframeState(isPlay: boolean) {
        let index = 0,
            count = 0,
            userId = '';
        let tempPacket: SDKPacket;
        let userInfo: SDKUserInfo;

        count = SDKLogicsCore.parameterVo.replayMobiles.length;
        for (index = 0; index < count; index++) {
            userId = SDKLogicsCore.parameterVo.replayMobiles[index];
            userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
            if (!userInfo || userInfo.role !== SDKEnum.USER_ROLE.STUDENT) {
                continue;
            }

            const cmd = isPlay
                ? SDKRegistCommand.GAME_RESUME
                : SDKRegistCommand.GAME_STOP;
            tempPacket = SDKPacketPool.Acquire(cmd);

            let controller = this.getDashBoradController();
            controller && controller.notifySubIframe(tempPacket, userId);
        }
    }
}