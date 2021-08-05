/**
 * SDKTransceiver：
 * 处理Window的消息发送和接受
 */

import SDKPacket from './SDKPacket';
import SDKPacketHandler from './SDKPacketHandler';
import SDKPacketPool from './SDKPacketPool';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKMousePacket from "./SDKMousePacket";
import * as DebugInfo from '../Utils/DebugInfo';
import SDKWatcherPackets from './SDKWatcherPackets';
import SDKFilterAddRecvPacketUser from '../SDKFilters/SDKFilterAddRecvPacketUser';
import SDKFilterAddPacketProperty from '../SDKFilters/SDKFilterAddPacketProperty';
import SDKFilterSendPacketCondition from '../SDKFilters/SDKFilterSendPacketCondition';
import SDKFilterSaveRecordPackets from '../SDKFilters/SDKFilterSaveRecordPackets';

export default class SDKTransceiver {
    public set packetHandler(value: SDKPacketHandler) {
        this._packetHandler = value;
    }

    public get packetHandler(): SDKPacketHandler {
        return this._packetHandler;
    }
    private static ORDER_ID: number = 1;
    private static SEND_COUNT: number = 0;
    private static RECEIVE_COUNT: number = 0;

    protected _packetHandler: SDKPacketHandler;

    constructor() {
        this.reset();
    }

    /**监听事件*/
    public gameReady() {
        this.addMessageEvent();
    }

    /**
     * 将事件消息数据转换成 数据包
     * @param data 事件消息数据
     */
    public messageToPacket(data: any): SDKPacket {
        let packet: SDKPacket;
        packet = SDKPacketPool.Acquire(data["action"]);
        SDKFilterAddPacketProperty.messageToPacket(packet, data);
        return packet;
    }

    public jsbReceiveMsg(data): void {
        let packet: SDKPacket;

        packet = this.messageToPacket(data);
        if (
            packet.sendId !== SDKLogicsCore.parameterVo.userId &&
            SDKLogicsCore.parameterVo.userId !== ''
        ) {
            DebugInfo.info('<<<接收消息JSB:' + data.action, data);
        }

        // 兼容特需处理
        if (packet.name === SDKRegistCommand.STOP_ZMG) {
            if (data.flag !== undefined) {
                packet.data = data.flag;
            }
        }

        SDKTransceiver.RECEIVE_COUNT++;
        if (this._packetHandler) {
            this._packetHandler.recevieMsg(packet);
        }
    }

    /**
     * 发送数据包
     * @param packet 数据包
     * @param target 数据包接受者
     */
    public sendPacket(
        packet: SDKPacket,
        target: Window = window.parent && window.parent.window
    ) {
        if (!this.checkSendPacket(packet)) {
            DebugInfo.error('send packet is error:', packet);
            return;
        }
        this.appendParamsToPacket(packet);

        // 只需要转到客户端的信令
        if (SDKRegistCommand.EVENTS_TO_LOCAL_CLIENT.indexOf(packet.action) != -1) {
            this._sendPacket(packet, target);
            return;
        }
        if (SDKLogicsCore.parameterVo.isGamePreview()) {
            if (this._packetHandler) {
                this._packetHandler.dispatcherCMD(packet);
            }
            return;
        }

        if (!SDKFilterSendPacketCondition.isCanSend(packet)) {
            return;
        }

        if (SDKLogicsCore.parameterVo.isZMG()) {
            SDKFilterAddRecvPacketUser.appendMobilesToPacket(packet);
            SDKFilterAddRecvPacketUser.messageToAll(packet);
        }

        this._sendPacket(packet, target);

        SDKTransceiver.SEND_COUNT++;
        SDKWatcherPackets.addSend();
        SDKWatcherPackets.checkPacket(packet);
        DebugInfo.info('>>>发送消息:' + packet.name, packet);

        SDKFilterSaveRecordPackets.save(packet);
        if (this._packetHandler) {
            this._packetHandler.sendToReceive(packet);
        }
    }

    private _sendPacket(packet: SDKPacket, target: Window = window.parent && window.parent.window) {
        if (SDKLogicsCore.parameterVo.isJsb()) {
            if (window['WebViewJavascriptBridge']) {
                if (SDKRegistCommand.EVENT_TO_CLIENT.indexOf(packet.action) != -1) {
                    window['WebViewJavascriptBridge'].callHandler('ZMGClientOnly', JSON.stringify(packet));
                } else {
                    window['WebViewJavascriptBridge'].callHandler('jsbMessage', JSON.stringify(packet));
                }
            }
        } else if (SDKLogicsCore.parameterVo.isPost()) {
            if (SDKRegistCommand.EVENT_TO_CLIENT.indexOf(packet.action) != -1) {
                if (window['ZMClientBridge']) {
                    window['ZMClientBridge'].ZMGClientOnly && window['ZMClientBridge'].ZMGClientOnly(packet);
                }
            } else {
                target.postMessage(packet, '*');
            }
        }
    }


    /**
     * 发送消息
     * @param name 消息名称
     * @param data 消息数据
     * @param target 发送的目标
     */
    public sendMsg(
        name: string,
        data: any = null,
        isMainIframe: boolean = true,
        target?: Window
    ): void {
        if (name && name === '') {
            return;
        }
        if (name == SDKRegistCommand.GAME_SYNC_MOUSE) {
            this.syncMouse(name, data);
            return;
        }
        const packet: SDKPacket = SDKPacketPool.Acquire(name);
        packet.data = data;
        packet.isMainFrame = isMainIframe;

        if (target) {
            this.sendPacket(packet, target);
        } else {
            this.sendPacket(packet);
        }
    }

    public reset(): void {
        SDKTransceiver.ORDER_ID = 1;
        SDKTransceiver.SEND_COUNT = 0;
        SDKTransceiver.RECEIVE_COUNT = 0;
    }

    public destroy(): void {
        this._packetHandler = null;
        this.removeMessageEvent();
    }

    /**
     * 监听window消息事件
     */
    private addMessageEvent(): void {
        if (
            SDKLogicsCore.parameterVo.msgSendModle ===
            SDKEnum.TYPE_MSG.TYPE_POST_MESSAGE
        ) {
            window.addEventListener(
                'message',
                this.receiveMsg.bind(this),
                false
            );
        }
    }

    private removeMessageEvent(): void {
        window.removeEventListener(
            'message',
            this.receiveMsg.bind(this),
            false
        );
    }

    /**
     * 检测数据包是否合法。。。不合法的不给发送
     * @param packet 数据包
     */
    private checkSendPacket(packet: SDKPacket): boolean {
        if (packet === undefined || packet.name === '') {
            return false;
        }
        return true;
    }

    /**
     * 向数据包追加参数数据
     * @param packet 数据包
     */
    private appendParamsToPacket(packet: SDKPacket): void {
        SDKFilterAddPacketProperty.appendParamsToPacket(packet);
    }

    /**同步鼠标 */
    private syncMouse(name: string, data: any = null, target: Window = window.parent && window.parent.window) {
        let packet: SDKMousePacket = SDKPacketPool.AcquireMousePacket(name);
        packet.source = 'game';
        packet.data = data;
        packet.isMainFrame = false;
        packet.id = SDKLogicsCore.parameterVo.gameId;
        packet.sendId = SDKLogicsCore.parameterVo.userId;
        if (SDKLogicsCore.controllState.isFullOwn()) {
            SDKFilterAddRecvPacketUser.messageToAll(packet);
        } else if (SDKLogicsCore.controllState.isOwn()) {
            packet.addToUserId(SDKLogicsCore.parameterVo.userId);
        }
        if (SDKLogicsCore.parameterVo.isZML()) {
            packet.kjType = "zml";
        } else if (SDKLogicsCore.parameterVo.isZMG()) {
            packet.kjType = "zmg";
        }
        if (SDKLogicsCore.parameterVo.isJsb()) {
            if (window['WebViewJavascriptBridge']) {
                window['WebViewJavascriptBridge'].callHandler('jsbMessage', JSON.stringify(packet));
            }
        } else if (SDKLogicsCore.parameterVo.isPost()) {
            target.postMessage(packet, '*');
        }
        SDKPacketPool.ReleaseMousePacket(packet);
    }

    /**
     * window 接受到的事件
     * @param event 消息事件
     */
    private receiveMsg(event: MessageEvent): void {
        let packet: SDKPacket;

        packet = this.messageToPacket(event.data);
        if (
            packet.sendId != SDKLogicsCore.parameterVo.userId &&
            SDKLogicsCore.parameterVo.userId != '' &&
            packet.name != SDKRegistCommand.GAME_SYNC_MOUSE) {
            DebugInfo.info("<<<接收消息:" + event.data["action"], event.data);
        }

        //兼容特需处理
        if (packet.name === SDKRegistCommand.STOP_ZMG) {
            if (event.data["flag"] != undefined) {
                packet.data = event.data["flag"];
            }
        }

        SDKTransceiver.RECEIVE_COUNT++;
        if (this._packetHandler) {
            this._packetHandler.recevieMsg(packet);
        }
    }
}