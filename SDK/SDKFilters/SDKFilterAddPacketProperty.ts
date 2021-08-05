import SDKPacket from "../SDKNetwork/SDKPacket";
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKApp from "../SDKBase/SDKApp";

export default class SDKFilterAddPacketProperty {
    /**
     * 向数据包追加参数数据
     * @param packet 数据包
     */
    public static appendParamsToPacket(packet: SDKPacket): void {

        packet.id = SDKLogicsCore.parameterVo.gameId;
        packet.source = 'game';
        packet.sendId = SDKLogicsCore.parameterVo.userId;
        packet.secene = SDKApp.instance().thirdInterface.getSceneName();
        packet.userId = SDKLogicsCore.parameterVo.user_id;

        if (SDKLogicsCore.parameterVo.isZML()) {
            packet.kjType = 'zml';
        } else if (SDKLogicsCore.parameterVo.isZMG()) {
            packet.kjType = 'zmg';
        }
    }

    /**
     * 将事件消息数据转换成 数据包
     * @param packet 数据包
     * @param data 事件消息数据
     */
    public static messageToPacket(packet: SDKPacket, data: any) {
        packet.id = data["id"];
        packet.source = data["source"];
        packet.data = data["data"];
        packet.toMobiles = data["toMobiles"];
        packet.notSaveMobile = data["notSaveMobile"];
        packet.kjType = data["kjType"];
        if (data["isOnline"] != undefined) {
            packet.isOnline = data["isOnline"] == "true" ? true : false;
        }
        packet.sendId = data["_sendId"];
        packet.secene = data["_secene"];
        packet.userId = data['userId'];
        packet.isMainFrame = data["_isMainFrame"];
    }
}