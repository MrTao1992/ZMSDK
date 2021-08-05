import * as UtilsType from '../Utils/UtilsType';
export default class SDKMousePacket {
    /**gameId....通信标记 */
    public id: number;
    /**区分消息包类型*/
    public source: string;
    /**zml课件使用*/
    public action: string;
    public data: any;
    public kjType: string;
    public toMobiles: string[];

    protected _name: string;
    protected _sendId: string;
    protected _isMainFrame: boolean;

    constructor(name: string = "") {
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

    public get sendId(): string {
        return this._sendId;
    }

    public set sendId(value: string) {
        this._sendId = value;
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

    public clearMobiles(): void {
        this.toMobiles = null;
    }

    public clone(packet: SDKMousePacket) {
        packet.id = this.id;
        packet.source = this.source;
        packet.action = this._name;
        packet.name = this._name;
        packet.sendId = this._sendId;
        packet.isMainFrame = this._isMainFrame;
        packet.kjType = this.kjType;
        if (!UtilsType.isEmpty(this.toMobiles)) {
            packet.toMobiles = JSON.parse(JSON.stringify(this.toMobiles));
        }
        if (!UtilsType.isEmpty(this.data)) {
            packet.data = JSON.parse(JSON.stringify(this.data));
        }
    }

    public reset(): void {
        this.id = 0;
        this.source = "";
        this.action = "";

        this._name = "";
        this._sendId = "";
        this._isMainFrame = false;
        this.data = null;
        this.kjType = "zmg";
        this.toMobiles = null;
    }
}