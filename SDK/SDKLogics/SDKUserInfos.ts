import SDKUserInfo from './SDKUserInfo';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacket from '../SDKNetwork/SDKPacket';
import * as SDKLogicsCore from './SDKLogicsCore';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';

export default class SDKUserInfos {
    private _userIds: string[];
    private _userInfos: SDKUserInfo[];

    constructor() {
        this._userIds = [];
        this._userInfos = [];
    }

    public getUserInfoById(userId: string): SDKUserInfo {
        let index = -1;

        index = this._userIds.indexOf(userId);
        if (index !== -1) {
            return this._userInfos[index];
        }
        return null;
    }

    public getUserInfoByIndex(index: number): SDKUserInfo {
        if (index < this._userInfos.length) {
            return this._userInfos[index];
        }
        return null;
    }

    public isHasUserById(userId: string): boolean {
        let index = -1;

        index = this._userIds.indexOf(userId);

        return index !== -1;
    }

    public addUserInfo(user: SDKUserInfo): boolean {
        if (!this.isHasUserById(user.userId)) {
            this._userIds.push(user.userId);
            this._userInfos.push(user);
            return true;
        }
        return false;
    }

    public removeUserById(userId: string): boolean {
        let index: number = -1;

        if (!this.isHasUserById(userId)) {
            return false;
        }
        index = this._userIds.indexOf(userId);
        this._userInfos[index].clear();
        this._userInfos.splice(index, 1);
        this._userIds.splice(index, 1);

        return true;
    }

    public ClearUsersFlag(): void {
        let index = 0,
            count = 0;

        count = this._userInfos.length;
        for (index = 0; index < count; index++) {
            this._userInfos[index].isActive = false;
        }
    }

    public getCount() {
        return this._userIds.length;
    }

    public getTeacherId(): string {
        let index = 0,
            count = 0;

        count = this._userInfos.length;
        for (index = 0; index < count; index++) {
            if (this._userInfos[index].role === SDKEnum.USER_ROLE.TEACHER) {
                return this._userInfos[index].userId;
            }
        }
        return '';
    }

    public getStudentIds(): string[] {
        let index = 0,
            count = 0;
        const studentIds = [];

        count = this._userInfos.length;
        for (index = 0; index < count; index++) {
            if (this._userInfos[index].role === SDKEnum.USER_ROLE.STUDENT) {
                studentIds.push(this._userInfos[index].userId);
            }
        }
        return studentIds;
    }

    public isAllHistoryRes(): boolean {
        let index = 0;
        let count = 0;

        count = this._userInfos.length;
        for (index = 0; index < count; index++) {
            if (!this._userInfos[index].isHistoryRes) {
                return false;
            }
        }
        return true;
    }

    public controllerLastMainPacket(): SDKPacket {
        let contorller = this.getUserInfoById(SDKLogicsCore.controllState.controllerId);
        let tempPacket = contorller && contorller.getLastMainPacket();
        let packet = tempPacket && SDKPacketPool.Acquire(tempPacket.action);
        packet && tempPacket.clone(packet);
        return packet;
    }
}