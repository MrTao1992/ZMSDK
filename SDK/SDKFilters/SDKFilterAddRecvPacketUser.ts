import SDKPacket from '../SDKNetwork/SDKPacket';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKMousePacket from '../SDKNetwork/SDKMousePacket';
import * as UtilsType from '../Utils/UtilsType';
import SDKUserInfos from '../SDKLogics/SDKUserInfos';

export default class SDKFilterAddRecvPacketUser {

    public static appendMobilesToPacket(packet: SDKPacket) {
        packet.clearMobiles();
        packet.clearNotSaveMobiles();
        if (SDKRegistCommand.EVENT_CHECK.indexOf(packet.name) !== -1) {
            if (packet.name === SDKRegistCommand.VDIEO_PROCESS_REQUEST) {
                packet.addToUserId(packet.data);
                packet.addNotSaveMobiles(packet.data);
                packet.addNotSaveMobiles(SDKLogicsCore.parameterVo.userId);
                return;
            } else if (packet.name === SDKRegistCommand.VIDEO_PROCESS) {
                packet.addToUserId(SDKLogicsCore.userInfos.getTeacherId());
                packet.addToUserId(SDKLogicsCore.parameterVo.userId);
                return;
            } else if (packet.name == SDKRegistCommand.VOICE_ANSWER_SPEECH_REQUEST) {
                return;
            }
            if (SDKLogicsCore.controllState.controllerId !== '') {
                packet.addToUserId(SDKLogicsCore.userInfos.getTeacherId());
                packet.addNotSaveMobiles(SDKLogicsCore.userInfos.getTeacherId());
            }
            return;
        }

        if (SDKRegistCommand.EVENTS_LIST.indexOf(packet.name) !== -1) {
            if (
                packet.name === SDKRegistCommand.GAEM_READY ||
                packet.name === SDKRegistCommand.REPLAY_READY ||
                packet.name === SDKRegistCommand.TEACH_MODLE_CHANGE ||
                packet.name === SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE ||
                packet.name === SDKRegistCommand.ON_STAGE_ACCEPT ||
                packet.name === SDKRegistCommand.SAVE_USERS_INFO ||
                packet.name === SDKRegistCommand.GAME_NAVIGATION_STATE ||
                packet.name === SDKRegistCommand.VOICE_ANSWER_PAGE_TYPE_LIST
            ) {
                packet.addToUserId(SDKLogicsCore.parameterVo.userId);
            } else if (packet.name === SDKRegistCommand.GET_GAME_HISTORY) {
                packet.addToUserId(packet.data);
            } else if (
                packet.name === SDKRegistCommand.GAME_LOAD_START ||
                packet.name === SDKRegistCommand.GAME_LOAD_COMPLETE ||
                packet.name === SDKRegistCommand.REPAIR_SECEND_VERSION
            ) {
                packet.addToUserId(SDKLogicsCore.userInfos.getTeacherId());
                packet.addNotSaveMobiles(SDKLogicsCore.userInfos.getTeacherId());
            }
            return;
        }

        if (
            SDKLogicsCore.parameterVo.isStudent() &&
            SDKLogicsCore.controllState.isOwn() &&
            !SDKLogicsCore.controllState.isFullOwn()
        ) {
            packet.addToUserId(SDKLogicsCore.parameterVo.userId);
            packet.addToUserId(SDKLogicsCore.userInfos.getTeacherId());
            packet.addNotSaveMobiles(SDKLogicsCore.userInfos.getTeacherId());
        }

        if (
            SDKLogicsCore.parameterVo.isTeacher() &&
            SDKLogicsCore.controllState.isOwn() &&
            !SDKLogicsCore.controllState.isFullOwn()
        ) {
            packet.addToUserId(SDKLogicsCore.parameterVo.userId);
        }
    }

    public static messageToAll(packet: SDKPacket | SDKMousePacket): void {
        if (UtilsType.isEmpty(packet.toMobiles) || packet.toMobiles.length === 0) {
            SDKFilterAddRecvPacketUser.addSendUser(packet, SDKLogicsCore.userInfos);
            SDKFilterAddRecvPacketUser.addSendUser(packet, SDKLogicsCore.serverUsers);
            SDKFilterAddRecvPacketUser.addSendUser(packet, SDKLogicsCore.allUsers);
        }
    }

    public static addSendUser(packet: SDKPacket | SDKMousePacket, users: SDKUserInfos): void {
        let index = 0;
        let count = 0;
        let userInfo: SDKUserInfo;

        count = users.getCount();
        for (index = 0; index < count; index++) {
            userInfo = users.getUserInfoByIndex(index);
            if (!UtilsType.isEmpty(userInfo)) {
                packet.addToUserId(userInfo.userId);
            }
        }
    }
}