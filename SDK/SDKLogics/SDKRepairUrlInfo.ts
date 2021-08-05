interface Answer {
    type: string,
    gameEvents: string,
    duration: number,
    right: boolean
}
export default class SDKRepairUrlInfo {
    public sceneIndex: string = '0';
    public gameEvents: string = '';
    public duration: number = 0;
    public answers: Array<Answer> = [];

    public parseAnswers(answerList): void {
        let index = 0, count = 0;
        count = answerList ? answerList.length : 0;
        for (index = 0; index < count; index++) {
            const element = answerList[index];
            let answer = {
                type: element.answerId,
                gameEvents: element.gameEvents,
                duration: element.duration,
                right: element.right
            };
            this.addAnswer(answer);
        }
    }

    public getAnswerByType(type: string): Answer {
        let index = 0, count = 0;
        count = this.answers.length;
        for (index = 0; index < count; index++) {
            const element = this.answers[index];
            if (element.type == type) {
                return this.answers[index];
            }
        }
        return null;
    }

    public addAnswer(value: Answer) {
        this.answers.push(value);
    }

    public getRightAnswerType(): string {
        let index = 0, count = 0;
        count = this.answers.length;
        for (index = 0; index < count; index++) {
            const element = this.answers[index];
            if (element.right) {
                return element.type;
            }
        }
        return "-1";
    }

    public getErrorAnswerType(): string {
        let index = 0, count = 0;
        count = this.answers.length;
        for (index = 0; index < count; index++) {
            const element = this.answers[index];
            if (!element.right) {
                return element.type;
            }
        }
        return "-1";
    }

    public getLoadUrls() {
        let urls = [];
        if (this.gameEvents && this.gameEvents != "") {
            urls.push({ 'key': this.sceneIndex, 'value': this.gameEvents });
        }

        let index = 0, count = 0;
        count = this.answers.length;
        for (index = 0; index < count; index++) {
            const element = this.answers[index];
            if (element.gameEvents && element.gameEvents != "") {
                urls.push({ 'key': this.sceneIndex + "_" + element.type, 'value': element.gameEvents });
            }
        }
        return urls;
    }
}