import * as UtilsType from '../Utils/UtilsType';

/**
 * SDKPacket:
 * 消息包数据结构
 */

export default class SDKPacket {
    /** gameId....通信标记 */
    public id: number;
    /** 区分消息包类型 */
    public source: string;
    /** zml课件使用 */
    public action: string;
    public data: any;
    public toMobiles: string[];
    public notSaveMobile: string[];
    public kjType: string;
    public isOnline: boolean;
    public userId:string;

    protected _secene: string;
    protected _name: string;
    protected _sendId: string;
    protected _relativeTime: number;
    protected _isMainFrame: boolean;

    constructor(name: string = '') {
        this.reset();
        this._name = name;
        this.action = name;
    }

    public set name(value: string) {
        this._name = value;
        this.action = value;
    }

    public get name(): string {
        return this._name;
    }

    public set secene(value: string) {
        this._secene = value;
    }

    public get secene(): string {
        return this._secene;
    }

    public get sendId(): string {
        return this._sendId;
    }

    public set sendId(value: string) {
        this._sendId = value;
    }

    public get relativeTime(): number {
        return this._relativeTime;
    }

    public set relativeTime(value: number) {
        this._relativeTime = value;
    }

    public get isMainFrame(): boolean {
        return this._isMainFrame;
    }

    public set isMainFrame(value: boolean) {
        this._isMainFrame = value;
    }

    public addToUserId(userId: string): void {
        if (!this.toMobiles) {
            this.toMobiles = [];
        }
        if (this.toMobiles.indexOf(userId) === -1) {
            this.toMobiles.push(userId);
        }
    }

    public addNotSaveMobiles(userId: string): void {
        if (!this.notSaveMobile) {
            this.notSaveMobile = [];
        }
        if (this.notSaveMobile.indexOf(userId) === -1) {
            this.notSaveMobile.push(userId);
        }
    }

    public clearMobiles(): void {
        this.toMobiles = null;
    }

    public clearNotSaveMobiles(): void {
        this.notSaveMobile = null;
    }

    public clone(packet: SDKPacket) {
        packet.id = this.id;
        packet.source = this.source;
        packet.action = this._name;
        packet.name = this._name;
        packet.secene = this._secene;
        packet.sendId = this._sendId;
        packet.isMainFrame = this._isMainFrame;
        packet.kjType = this.kjType;
        packet._relativeTime = this._relativeTime;
        packet.isOnline = this.isOnline;
        packet.userId = this.userId;
        if (!UtilsType.isEmpty(this.toMobiles)) {
            packet.toMobiles = JSON.parse(JSON.stringify(this.toMobiles));
        }
        if (!UtilsType.isEmpty(this.data)) {
            packet.data = JSON.parse(JSON.stringify(this.data));
        }
    }

    public reset(): void {
        this.id = 0;
        this.source = '';
        this.action = '';
        this._name = '';
        this._secene = '';
        this._sendId = '';
        this._relativeTime = 0;
        this._isMainFrame = false;
        this.data = null;
        this.toMobiles = null;
        this.notSaveMobile = null;
        this.kjType = 'zmg';
        this.isOnline = true;
        this.userId = '';
    }
}