import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKGameConfig from '../SDKLogics/SDKGameConfig';
import SDKPacket from './SDKPacket';

/**
 * 消息流量检测
 */
export default class SDKWatcherPackets {
    private static SEND_COUNT: number = 0;
    private static RECEIVE_COUNT: number = 0;

    private static DOUBLE_SIZE: string[] = [
        'voiceAnswerSyncSync',
        'voiceAnswerEndSync'
    ];

    public static addSend(): void {
        SDKWatcherPackets.SEND_COUNT += 1;
    }

    public static addReceive(): void {
        SDKWatcherPackets.RECEIVE_COUNT += 1;
    }

    public static checkPacket(packet: SDKPacket): void {
        if (SDKLogicsCore.parameterVo.isProduction()) {
            return;
        }
        if (packet.isMainFrame && packet.data) {
            let data: string = JSON.stringify(packet.data);
            let maxCount = SDKLogicsCore.gameConfig.maxPacketSize;
            if(SDKWatcherPackets.DOUBLE_SIZE.indexOf(packet.action) != -1) {
                maxCount = SDKLogicsCore.gameConfig.maxPacketSize * 2;
            }
            if (maxCount < data.length) {
                let content = '信令名称:' + packet.name;
                content += ' ,包大小:' + data.length + 'B';
                content += ' ,包最大容量:' + maxCount + 'B';
                DebugInfo.alert('信令熔断', content);
            }
        }
    }

    private _lastStamp: number = 0;
    private _duration: number = 0;
    private _lastSendCount: number = 0;
    private _step: number;
    private _stepCount: number;

    private _gameConfig: SDKGameConfig;

    constructor() {
        this._gameConfig = SDKLogicsCore.gameConfig;
    }

    public start() {
        this._duration = 0;
        this._step = 0;
        this._stepCount = SDKWatcherPackets.SEND_COUNT;
        this._lastStamp = new Date().getTime();
        this._lastSendCount = SDKWatcherPackets.SEND_COUNT;
    }

    public update(dt) {
        if (SDKLogicsCore.parameterVo.isProduction()) {
            return;
        }

        this._duration += dt;
        if (this._duration * 1000 >= this._step * 1000) {
            this.checkStepkitckOut();
            this._step++;
            this._stepCount = SDKWatcherPackets.SEND_COUNT;
        }

        if (this._duration * 1000 >= this._gameConfig.delayTime * 1000) {
            this.checkKickOut();
            this._step = 0;
            this._lastStamp = new Date().getTime() - this._duration;
            this._duration = this._duration - this._gameConfig.delayTime;
            this._lastSendCount = SDKWatcherPackets.SEND_COUNT;
        }
    }

    private checkKickOut(): boolean {
        let result = false;
        let count = SDKWatcherPackets.SEND_COUNT - this._lastSendCount;
        if (count >= this._gameConfig.maxPacket) {
            let content = '5s内最大信令发送量:' + this._gameConfig.maxPacket;
            content += ' ,5s内信令发送量:' + count;
            content += ' ,熔断计时时间戳:' + this._lastStamp;
            DebugInfo.alert('信令熔断', content);
            result = true;
        }
        return result;
    }

    private checkStepkitckOut(): boolean {
        let result = false;
        let count = SDKWatcherPackets.SEND_COUNT - this._stepCount;
        if (count >= this._gameConfig.maxSecPacket) {
            let content = '1s内最大信令发送量:' + this._gameConfig.maxSecPacket;
            content += ' ,1s内信令发送量:' + count;
            content += ' ,熔断计时时间戳:' + this._lastStamp + this._step * 1000;
            DebugInfo.alert('信令熔断', content);
            result = true;
        }
        return result;
    }
}