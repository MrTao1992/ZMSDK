import SDKCommandBase from "./SDKCommandBase";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKRepairUrlInfo from "../SDKLogics/SDKRepairUrlInfo";
import SDKApp from "../SDKBase/SDKApp";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";

/**
 * 智能补课学生上课, 设置基础URL信息
 */
export default class SDKRepairSetBaseInfoCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairSetBaseInfoCMD......", data);
        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        repairInfo.URLConfig = data;
        repairInfo.clearRepairUrlInfos();

        let urlInfo: SDKRepairUrlInfo;
        let chapterList = data.chapterList;
        let index = 0, count = 0;
        count = chapterList.length;
        for (index = 0; index < count; index++) {
            urlInfo = new SDKRepairUrlInfo();
            const element = chapterList[index];
            urlInfo.sceneIndex = element.chapterId;
            urlInfo.gameEvents = element.gameEvents;
            urlInfo.duration = element.duration;
            urlInfo.parseAnswers(element.answerList);
            repairInfo.addRepairUrlInfo(urlInfo);

            if (repairInfo.lastSceneIndex < parseInt(urlInfo.sceneIndex) + 1) {
                repairInfo.lastSceneIndex = parseInt(urlInfo.sceneIndex) + 1;
            }
        }

        if (SDKLogicsCore.parameterVo.isRepairRecord) {
            this.recylePacket();
            return;
        }

        if (SDKApp.instance().isEnter) {
            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_GET_SCENE_INFO, null, false);
        }

        this.recylePacket();
    }
}