
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //題目模板1
        TopicBoard1: {
            default: null,
            type: cc.Prefab
        },
        //題目模板2
        TopicBoard2: {
            default: null,
            type: cc.Prefab
        },
        //題目模板3
        TopicBoard3: {
            default: null,
            type: cc.Prefab
        },
        //題目模板4
        TopicBoard4: {
            default: null,
            type: cc.Prefab
        },
        //題目模板5
        TopicBoard5: {
            default: null,
            type: cc.Prefab
        },
        //題目模板6
        TopicBoard6: {
            default: null,
            type: cc.Prefab
        },
        //題目模板7
        TopicBoard7: {
            default: null,
            type: cc.Prefab
        },
        //題目模板8
        TopicBoard8: {
            default: null,
            type: cc.Prefab
        },
        //題目模板9
        TopicBoard9: {
            default: null,
            type: cc.Prefab
        },
        //題目模板10
        TopicBoard10: {
            default: null,
            type: cc.Prefab
        },
        //題目模板11
        TopicBoard11: {
            default: null,
            type: cc.Prefab
        },
        //題目模板12
        TopicBoard12: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },
    /**
     * 初始化題目
     * @param {*} Subjects 
     * @param {*} startIndex 題目index
     * @param {*} isBot 是否為機器人
     * @param {*} isShow 是否為展示
     */
    init(Subjects, startIndex, isBot, isShow) {
        self = this;
        this.isBot = isBot;
        this.isShow = isShow;
        this.TopicIndex = startIndex;//開始的題目index
        this.TopicSubjects = Subjects;//題組
        if (this.TopicSubjects) {
            //執行第一題
            console.log('do topic');
            this.ChoiceTopic(this.TopicIndex);
        } else {
            console.log('no topic');
        }
    },

    /**
     * 設定回傳
     * @param {*} cal 
     */
    setArenaCallback(cal) {
        ArenaCallback = cal;
    },

    //執行哪一題
    ChoiceTopic(index) {
        console.log(index);
        console.log(this.TopicSubjects);
        this.TopicIndex = index;
        if (this.TopicIndex >= this.TopicSubjects.length) {
            return
        }
        this.closeTopic();
        this.choiceBoard(this.TopicSubjects[this.TopicIndex]);
    },


    //強制結束
    closeTopic() {
        if(this.TopicNode)this.TopicNode.destroy();
        // if(this.TopicNodeControl)this.TopicNodeControl.CloseTopicAnim();
    },

    //分類題目版面
    choiceBoard(exam) {

        switch (exam.Subject.Template_Name) {
            case 'CH1':
                self.TopicBoardOne(exam);
                break;
            case 'CH2':
                self.TopicBoardTwo(exam);
                break;
            case 'CH3':
                self.TopicBoardThree(exam);
                break;
            case 'CH4':
                self.TopicBoardFour(exam);
                break;
            case 'CH5':
                self.TopicBoardFive(exam);
                break;
            case 'CH6':
                self.TopicBoardSix(exam);
                break;
            case 'CH7':
                self.TopicBoardSeven(exam);
                break;
            case 'CH8':
                self.TopicBoardEight(exam);
                break;
            case 'CH9':
                self.TopicBoardNine(exam);
                break;
            case 'CH10':
                self.TopicBoardTen(exam);
                break;
            case 'CH11':
                self.TopicBoardEleven(exam);
                break;
            case 'CH12':
                self.TopicBoardTwelve(exam);
                break;
            default:
                break;
        }
        self.index++;
    },


    /**
     * --答題回傳--
     * 答題方式         "choice" or "input"
     * 答題選項index    event.target._tag
     * 答題內容         "" 
     * 答題是否正確     isCorrect
     */
    TopicCallBack(anwserType, answerIndex, anwserIsCorrect, anwserContent) {
        console.log("TopicCallBack 選擇回傳");
        var model = { 'anwserType': anwserType, 'Option_ID': self.TopicSubjects[self.TopicIndex].OptionData[answerIndex].Option_ID, 'anwserContent': anwserContent, 'anwserIsCorrect': anwserIsCorrect, }
        console.log(model);
        self.scheduleOnce(function () {
            ArenaCallback("TopicControl", "AnwserCall", model);
        }, 0.5);
    },

    //版型1
    TopicBoardOne(exam) {
        if (this.TopicNode) this.TopicNode.destroy();//刪除上一個
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard1);
        //將題版節點建立在選擇的組件上方
        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard1");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化 .Subject
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型2
    TopicBoardTwo(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard2);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard2");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型3
    TopicBoardThree(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard3);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard3");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型4
    TopicBoardFour(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard4);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard4");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型5
    TopicBoardFive(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard5);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard5");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型6
    TopicBoardSix(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard6);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard6");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型7
    TopicBoardSeven(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard7);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard7");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型8
    TopicBoardEight(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard8);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard8");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型9
    TopicBoardNine(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard9);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard9");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型10
    TopicBoardTen(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard10);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard10");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) {
            this.setChoiceAndTrue(exam);
        }, 0.5);
    },

    //版型11
    TopicBoardEleven(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard11);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard11");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) { this.setChoiceAndTrue(exam); }, 0.5);
    },

    //版型12
    TopicBoardTwelve(exam) {
        //建立
        this.TopicNode = cc.instantiate(this.TopicBoard12);
        //將題版節點建立在選擇的組件上方

        self.node.addChild(this.TopicNode);
        this.TopicNode.setPosition(cc.p(0, 0));
        this.TopicNode.setLocalZOrder(2);//設定排序
        //獲得題版component
        this.TopicNodeControl = this.TopicNode.getComponent("TopicBoard12");
        //
        if (!this.TopicNodeControl) {
            console.log('this.TopicNodeControl not find');
            return;
        }
        //初始化
        this.TopicNodeControl.setTopicExamData(exam.Subject, this.TopicCallBack, this.isBot, this.isShow);
        this.scheduleOnce(function delay(params) {
            this.setChoiceAndTrue(exam);
        }, 0.5);

    },

    //建立正確與錯誤的動畫小圖
    setChoiceAndTrue(exam) {
        console.log('setChoiceAndTrue');
        console.log('exam.Select_Option_ID:'+exam.Select_Option_ID);
        console.log(exam.Subject.OptionData);
        if (exam.Permission == false) {
            //取選擇的
            var showIndex = exam.Subject.OptionData.findIndex(function (Option) {
                return Option.Option_ID == exam.Select_Option_ID;
            });
            console.log(showIndex);
            if (showIndex >= 0 && showIndex < exam.Subject.OptionData.length) {
                this.TopicNodeControl.ShowChoiceState(showIndex);
            }
            //取正確的
            var trueIndex = exam.Subject.OptionData.findIndex(function (Option) {
                return Option.isCorrect == true;
            });
            console.log('trueIndex:' + trueIndex);
            if (trueIndex >= 0 && trueIndex < exam.Subject.OptionData.length) {
                this.TopicNodeControl.ShowChoiceState(trueIndex);   
            }
        } else {
            var showIndex = exam.Subject.OptionData.findIndex(function (Option) {
                return Option.Option_ID == exam.Select_Option_ID;
            });
            console.log('showIndex:' + showIndex);
            if (showIndex >= 0 && showIndex < exam.Subject.OptionData.length) {
                this.TopicNodeControl.ShowChoiceState(showIndex);
            }
        }

    },

    // start () {    },

    // update (dt) {},
});
