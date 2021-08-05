import SDKPacket from './SDKPacket';
import SDKPacketPool from './SDKPacketPool';
import SDKCommandBase from '../SDKCommand/SDKCommandBase';
import * as ZMSDK from '../ZMSDK';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKENUM from '../SDKConst/SDKEnum';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * SDKPacketHandler:
 * 消息包处理类,对上接SDKTransceiver,对下接游戏处理逻辑
 * 改类目前是处理postMessage
 * 如果要处理TCP等 可以继承该类, 重写相应的方法即可
 */

export default class SDKPacketHandler {
    protected _packets: SDKPacket[];
    protected _messageHanlers: { [key: string]: any };

    constructor() {
        this._packets = [];
        this._messageHanlers = {};
    }

    /**
     * 保存消息包.....每一个端都拥有所有玩家的所有数据
     * @param packet 消息包
     */
    public saveUserMessage(packet: SDKPacket): void {
        let userInfo: SDKUserInfo;
        let clonePacket: SDKPacket;
        let index = 0,
            count = 0;

        count = SDKLogicsCore.userInfos.getCount();
        for (index = 0; index < count; index++) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            if (!userInfo) {
                continue;
            }
            if (
                SDKRegistCommand.EVENTS_LIST.indexOf(packet.name) === -1 &&
                SDKLogicsCore.controllState.controllerId === '-1'
            ) {
                if (packet.sendId !== userInfo.userId) {
                    continue;
                }
            }
            if (!this.isNeedSave(packet)) {
                continue;
            }
            clonePacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(clonePacket);
            userInfo.addPacket(clonePacket);
        }
    }

    /**
     * 接收到消息
     * @param packet 消息包
     */
    public recevieMsg(packet: SDKPacket): void {
        this._packets.push(packet);

        while (this._packets.length > 0) {
            this.messageHandle();
        }
    }

    /**
     * 控制者发送消息,立马执行派发,提高游戏体验
     * @param packet 消息包
     */
    public sendToReceive(packet: SDKPacket): void {
        this.saveUserMessage(packet);

        if (
            SDKLogicsCore.parameterVo.isTeacher() &&
            SDKLogicsCore.controllState.isFullOwn() &&
            SDKLogicsCore.controllState.teachingMode ===
            SDKENUM.TEACHING_MODE.TYPE_INSPECTION
        ) {
            const tempPacket = SDKPacketPool.Acquire(packet.name);
            packet.clone(tempPacket);
            this.dispatcherSubIframe(tempPacket);
        }
        this.dispatcherMessage(packet);
    }

    /**
     * 外界调用。。。。发送CMD
     * 内部消息通信
     * @param packet
     */
    public dispatcherCMD(packet: SDKPacket): void {
        this.dispatcherMessage(packet);
    }

    /**
     * 外界调用。。。。处理CMD
     * @param name
     * @param data
     */
    public notifyCMD(name: string, data: any = null) {
        let packet: SDKPacket;
        packet = SDKPacketPool.Acquire(name);
        packet.data = data;
        this.dispatcherMessage(packet);
    }

    public registerHandler(name: string, value: any): void {
        this._messageHanlers[name] = value;
    }

    public unRegisterHandler(name: string): void {
        this._messageHanlers[name] = null;
        delete this._messageHanlers[name];
    }

    /**
     * 获得CMD对象
     * @param name CMD的名称
     */
    public getHandler(name: string): SDKCommandBase {
        if (!this._messageHanlers[name]) {
            if (SDKRegistCommand.EVENT_NO_EXCUTE.indexOf(name) === -1) {
                DebugInfo.error('消息对应的命令不存在.....[', name + ']');
            }
            return null;
        }
        return new this._messageHanlers[name]() as SDKCommandBase;
    }

    public reset(): void {
        let index = 0,
            count = 0;

        count = this._packets.length;
        for (index = 0; index < count; index++) {
            SDKPacketPool.Release(this._packets[index]);
        }
        this._packets = [];
    }

    public destroy(): void {
        this.reset();
        this._packets = null;
        this._messageHanlers = null;
    }

    /**
     * 处理消息
     */
    private messageHandle(): void {
        let packet: SDKPacket;

        if (this._packets.length === 0) {
            return;
        }
        packet = this._packets.shift();

        if (SDKLogicsCore.parameterVo.isSplitScreen()) {
            this.dispatcherMessage(packet);
            return;
        }

        if (
            packet.sendId === SDKLogicsCore.parameterVo.userId &&
            SDKLogicsCore.parameterVo.userId !== ''
        ) {
            return;
        }

        if (SDKRegistCommand.EVENT_CHECK.indexOf(packet.name) !== -1) {
            if (packet.name === SDKRegistCommand.VIDEO_PROCESS) {
                if (
                    SDKLogicsCore.parameterVo.isTeacher() &&
                    SDKLogicsCore.controllState.teachingMode ===
                    SDKENUM.TEACHING_MODE.TYPE_INSPECTION
                ) {
                    this.dispatcherSubIframe(packet);
                }
                this.observeMsgHandle(packet);
                return;
            }
        }

        // 系统系统消息必须处理
        if (
            SDKRegistCommand.EVENTS_LIST.indexOf(packet.name) !== -1 ||
            SDKRegistCommand.EVENT_CHECK.indexOf(packet.name) !== -1
        ) {
            if (this.isNeedSave(packet)) {
                this.saveUserMessage(packet);
            }
            this.dispatcherMessage(packet);
            return;
        }

        // 保存消息
        this.saveUserMessage(packet);

        this.classMsgHandle(packet);
        this.observeMsgHandle(packet);
    }

    private classMsgHandle(packet: SDKPacket): void {
        if (SDKLogicsCore.parameterVo.isStudent()) {
            if (!SDKLogicsCore.controllState.isOwn()) {
                this.dispatcherMessage(packet);
            }
        }
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            if (!SDKLogicsCore.controllState.isOwn()) {
                if (
                    SDKLogicsCore.controllState.teachingMode ===
                    SDKENUM.TEACHING_MODE.TYPE_TEACHING
                ) {
                    if (SDKLogicsCore.controllState.controllerId !== '') {
                        // 某个学生上台。。。同步这个上台学生
                        if (
                            packet.sendId ===
                            SDKLogicsCore.controllState.controllerId
                        ) {
                            this.dispatcherMessage(packet);
                        }
                    }
                } else {
                    this.dispatcherSubIframe(packet);
                }
            } else {
                if (SDKRegistCommand.EVENTS_SYNC_TEACHER.indexOf(packet.name) != -1) {
                    this.dispatcherMessage(packet);
                } else {
                    if (
                        SDKLogicsCore.controllState.teachingMode ===
                        SDKENUM.TEACHING_MODE.TYPE_INSPECTION
                    ) {
                        this.dispatcherSubIframe(packet);
                    }
                }
            }
        }
    }

    private observeMsgHandle(packet: SDKPacket): void {
        if (SDKLogicsCore.parameterVo.isGameObserver()) {
            if (this.packetIsObserved(packet)) {
                if (SDKLogicsCore.parameterVo.isOberverTeacher()) {
                    if (
                        SDKLogicsCore.controllState.teachingMode ===
                        SDKENUM.TEACHING_MODE.TYPE_TEACHING
                    ) {
                        if (
                            packet.sendId === SDKLogicsCore.controllState.controllerId ||
                            packet.sendId === SDKLogicsCore.parameterVo.observerId
                        ) {
                            this.dispatcherMessage(packet);
                        }
                    } else {
                        this.dispatcherSubIframe(packet);
                    }
                } else {
                    this.dispatcherMessage(packet);
                }
            } else {
                DebugInfo.error('监课数据包异常', packet.name);
            }
        }
    }

    /**
     * 是否是被监视的包
     */
    private packetIsObserved(packet: SDKPacket): boolean {
        let result: boolean = true;
        let userInfo: SDKUserInfo;

        if (packet.sendId === '') {
            DebugInfo.error('消息发送者为空', packet.name);
            result = false;
            return;
        }

        if (SDKLogicsCore.parameterVo.observerId === '') {
            result = false;
            DebugInfo.error('被监视的对象为空', packet.name);
            return;
        }

        userInfo = SDKLogicsCore.userInfos.getUserInfoById(
            SDKLogicsCore.parameterVo.observerId
        );
        if (!userInfo) {
            result = false;
            DebugInfo.error(
                '被监视的对象为不存在......',
                packet.name,
                SDKLogicsCore.parameterVo.observerId
            );
            DebugInfo.error('伙伴列表......', SDKLogicsCore.userInfos);
            return;
        }

        if (userInfo.role === SDKENUM.USER_ROLE.STUDENT) {
            if (SDKLogicsCore.controllState.controllerId === '-1') {
                if (packet.sendId !== userInfo.userId) {
                    result = false;
                    DebugInfo.error(
                        '被监视的对象与包的发送者不同1',
                        packet.name,
                        packet.sendId,
                        userInfo.userId
                    );
                    return;
                }
            } else if (SDKLogicsCore.controllState.controllerId !== '') {
                if (
                    packet.sendId !== SDKLogicsCore.controllState.controllerId
                ) {
                    result = false;
                    DebugInfo.error(
                        '被监视的对象与包的发送者不同2',
                        packet.name,
                        packet.sendId,
                        userInfo.userId
                    );
                    return;
                }
            }
        } else if (userInfo.role === SDKENUM.USER_ROLE.TEACHER) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoById(packet.sendId);
            if (!userInfo) {
                result = false;
                DebugInfo.error('被监视的对象与包的发送者不同（老师）......', packet.name);
                return;
            }
        }
        return result;
    }

    private isNeedSave(packet: SDKPacket): boolean {
        if (
            SDKRegistCommand.EVENTS_NO_SAVE.indexOf(packet.name) !== -1 ||
            SDKRegistCommand.EVENT_CHECK.indexOf(packet.name) !== -1
        ) {
            return false;
        }
        return true;
    }

    /**
     * 执行接收到的消息
     * @param packet
     */
    private dispatcherMessage(packet: SDKPacket): void {
        let command: SDKCommandBase;

        command = this.getHandler(packet.name);
        if (!command) {
            if (SDKRegistCommand.EVENT_NO_EXCUTE.indexOf(packet.name) === -1) {
                DebugInfo.error('没有注册命令:........[', packet.name + ']');
                DebugInfo.error('已注册的命令:........', this._messageHanlers);
            }
            return;
        }
        command.packet = packet;
        command.run(packet.data);
    }

    /**
     * 向老师端的子iframe派发消息
     * @param packet
     */
    private dispatcherSubIframe(packet: SDKPacket): void {
        let command: SDKCommandBase;

        command = this.getHandler(SDKRegistCommand.DISPATCHER_TO_SUBIFRAME);
        if (!command) {
            return;
        }
        command.packet = packet;
        command.run(packet.data);
    }
}
