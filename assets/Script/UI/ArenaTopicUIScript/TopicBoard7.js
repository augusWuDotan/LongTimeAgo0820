var self;
var jsbUtils = require('jsbUtils');
var DomainTopicExamContent;//題目內容
var callbackType;//回傳的type
var AnwserCallback;//callback
var CorrectResult;//是否正確
var AnwserIndex;//選擇的index

cc.Class({
    extends: cc.Component,

    properties: {
        //題目 動畫
        TopicBoardAnimation: {
            default: null,
            type: cc.Animation
        },
        //題目預設圖片
        TopicBoardPhotoLayer: {
            default: null,
            type: cc.Node,
        },

        //題目預設圖片
        TopicBoardPhoto: {
            default: null,
            type: cc.Sprite,
        },
        //題目預設文字區塊
        TopicBoardLabel: {
            default: null,
            type: cc.Label,
        },
        //選項
        AnwserOne: {
            default: null,
            type: cc.Node
        },
        AnwserTwo: {
            default: null,
            type: cc.Node
        },
        AnwserThree: {
            default: null,
            type: cc.Node
        },

        correct_audio: {
            default: null,
            url: cc.AudioClip
        },
        //
        wrong_audio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        //題目主題
        this.TopicTheme = '聽音檔選圖';
        this.debugConsole = true;//是否console
        this.debug = false;//
        //鎖定判別
        self.canChoice = true;//可以選擇答案
    },

    // start() {},


    //region 題目
    /**
     * 設定題目
     * @param {*} ExamData 
     * @param {*} TopicCallback 
     */
    setTopicExamData(ExamData, TopicCallback, isBot, isShow) {
        //
        //競技場的資料保存
        this.ArenaData = cc.find('ArenaData');
        if (this.ArenaData) {
            this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
            this.BotCorrectPer = this.ArenaDataComponent.BotCorrectPer;
        }
        //
        this.isBot = isBot;//設定是否為機器人
        this.isShow = isShow;//設定是否為展示
        console.log('是否為機器人:' + this.isBot);
        console.log(ExamData);
        //
        if (ExamData == null) return
        DomainTopicExamContent = ExamData;
        AnwserCallback = TopicCallback;//callback
        console.log('DomainTopicExamContent: ' + DomainTopicExamContent);

        //資料不是空的時候，才可以置換
        if (DomainTopicExamContent) {
            console.log('changeTopicExam');
            this.changeTopicExam();//置換題目內容（顯示）圖、音
        }

        //show topic
        this.ShowTopicAnim();
    },

    /**
     * reset data 清除節點資訊
     */
    resetNodeData() {
        this.node.destroy();
    },

    /**
     * change Topic view data 置換題目內容（顯示）圖、音
     * ch1
     */
    changeTopicExam() {
        console.log('--------題目版型檢查開始--------');
        console.log('題目ID：'+DomainTopicExamContent.Subject_ID);
        console.log('題目使用版型：'+DomainTopicExamContent.Template_Name);
        console.log('題目音源路徑：'+DomainTopicExamContent.QuestionData.QuestionTopicVoicePath);
        console.log('題目圖檔路徑：'+DomainTopicExamContent.QuestionData.QuestionTopicPhoto);
        console.log('題目文字資源：'+DomainTopicExamContent.QuestionData.QuestionTopicContent);
        console.log('--------題目版型檢查結束--------');
        //題目音檔處理 [(ch1),ch4,ch5,ch8,ch10,ch11,ch12]
        // if (DomainTopicExamContent) this.ExecuteTopicVoice();
        //題目圖檔處理 [ch3,ch6,ch8,ch9,ch10]
        // if (DomainTopicExamContent) this.ExecuteTopicPhoto();
        //題目文字處理 [ch2,ch5,ch6,ch7,ch9,ch10,ch12]
        if (DomainTopicExamContent) this.ExecuteTopicContent();
        //選項文字處理 [ch3,ch4,ch5,ch6,ch7,ch8]
        if (DomainTopicExamContent) this.ExecuteOptionContent();
        //選項圖檔處理 [(ch1),ch2,ch9,ch10,ch11,ch12]
        // if (DomainTopicExamContent) this.ExecuteOptionPhoto();
    },

    /**
     * 題目音檔處理
     */
    ExecuteTopicVoice() {
        if (this.isShow) return;//如果是展示用 鎖定不能自動播放
        console.log('題目音檔處理');
        var voicePath = DomainTopicExamContent.QuestionData.QuestionTopicVoicePath;
        //
        if (voicePath == '') {
            console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' 沒有音檔路徑');
        }
        //jsb
        if (CC_JSB) {
            jsbUtils.PlayMusicUseNactiveModel(voicePath);
        }
    },
    /**
     * 題目圖檔處理
     */
    ExecuteTopicPhoto() {
        console.log('題目圖檔處理');

        var url = DomainTopicExamContent.QuestionData.QuestionTopicPhoto;
        if (url === '') {
            console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' 沒有題目圖像路徑');
            url = 'https://dragon-backend.azurewebsites.net/img/SubjectItems/not_upload.png';
        }

        //下載選擇圖片
        cc.loader.load(url, function (err, tex) {
            console.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
            if (!err) {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                console.log(self.TopicBoardPhotoLayer.width);
                console.log(self.TopicBoardPhotoLayer.height);
                var side = self.TopicBoardPhotoLayer.width > self.TopicBoardPhotoLayer.height ? self.TopicBoardPhotoLayer.height : self.TopicBoardPhotoLayer.width;//確定矩行邊長
                self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').width = side * 17 / 24;
                self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').height = side * 17 / 24;
                self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').getComponent(cc.Sprite).spriteFrame = spf;
            } else {
                console.log('下載題目圖錯誤：' + err);
                console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' 題目圖像路徑錯誤,路徑為：'+url);
                self.LoadTopicNodeAgain();//重新載入錯誤
            }
        });

    },
    /**
     * 題目文字處理
     */
    ExecuteTopicContent() {
        console.log('題目文字處理');
        if (DomainTopicExamContent.QuestionData.QuestionTopicContent == '') {
            console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' 沒有題目文字');
        }else{
            console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' 題目文字:'+DomainTopicExamContent.QuestionData.QuestionTopicContent);
        }
        this.TopicBoardLabel.string = DomainTopicExamContent.QuestionData.QuestionTopicContent;
    },
    /**
     * 選項文字處理
     */
    ExecuteOptionContent() {

        console.log('選項文字處理');
        var contentData = DomainTopicExamContent.OptionData;
        //
        var index = 0;
        contentData.forEach(content => {
            //
            let AnwserNode = null;
            if (index == 0) {
                AnwserNode = this.AnwserOne;
            } else if (index == 1) {
                AnwserNode = this.AnwserTwo;
            } else {
                AnwserNode = this.AnwserThree;
            }
            if (content.OptionContent == '') {
                console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' ,第' + (index + 1) + '個選項沒有文字');
            }
            AnwserNode.getChildByName('AnwserContent').getComponent(cc.Label).string = content.OptionContent;
            //
            index++;
        });
    },
    /**
     * 選項圖檔處理
     */
    ExecuteOptionPhoto() {

        console.log('選項圖檔處理');
        var contentData = DomainTopicExamContent.OptionData;
        //選項圖檔非同步下載
        var index = 0;
        contentData.forEach(e => {
            let url = '';
            let AnwserNode = null;
            if (index == 0) {
                url = e.PhotoPath;
                AnwserNode = this.AnwserOne;
            } else if (index == 1) {
                url = e.PhotoPath;
                AnwserNode = this.AnwserTwo;
            } else {
                url = e.PhotoPath;
                AnwserNode = this.AnwserThree;
            }

            console.log('第' + (index + 1) + '張圖的路徑：' + url);
            if (url === '') {
                console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' ,第' + (index + 1) + '個選項沒有圖像路徑');
                url = 'https://dragon-backend.azurewebsites.net/img/SubjectItems/not_upload.png';
            }

            var nodeIndex = index + 1;
            //下載選擇圖片
            cc.loader.load(url, function (err, tex) {
                if (this.debugConsole) console.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
                if (!err) {
                    var spf = new cc.SpriteFrame();
                    spf.initWithTexture(tex);
                    if (this.debugConsole) console.log(AnwserNode.width);
                    if (this.debugConsole) console.log(AnwserNode.height);
                    var side = AnwserNode.width > AnwserNode.height ? AnwserNode.height : AnwserNode.width;//確定矩行邊長
                    AnwserNode.getChildByName('AnwserIcon').width = side * 5 / 6;
                    AnwserNode.getChildByName('AnwserIcon').height = side * 5 / 6;
                    AnwserNode.getChildByName('AnwserIcon').getComponent(cc.Sprite).spriteFrame = spf;
                } else {
                    console.log('題目ID:' + DomainTopicExamContent.Subject_ID + ' ,第' + nodeIndex + '個選項圖像路徑路徑錯誤 ,路徑為：' + url);
                    self.LoadAnwserNodeAgain(AnwserNode);//重新載入錯誤
                }
            });
            index++;
        });
    },

    //下載圖是錯誤
    LoadTopicNodeAgain() {
        var url = 'https://dragon-backend.azurewebsites.net/img/SubjectItems/not_upload.png';
        //下載選擇圖片
        cc.loader.load(url, function (err, tex) {
            console.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
            if (!err) {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                console.log(self.TopicBoardPhotoLayer.width);
                console.log(self.TopicBoardPhotoLayer.height);
                var side = self.TopicBoardPhotoLayer.width > self.TopicBoardPhotoLayer.height ? self.TopicBoardPhotoLayer.height : self.TopicBoardPhotoLayer.width;//確定矩行邊長
                self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').width = side * 17 / 24;
                self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').height = side * 17 / 24;
                self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').getComponent(cc.Sprite).spriteFrame = spf;
            } else {
                console.log('下載題目圖錯誤：' + err);
            }
        });
    },

    //下載圖是錯誤
    LoadAnwserNodeAgain(AnwserNode) {
        var url = 'https://dragon-backend.azurewebsites.net/img/SubjectItems/not_upload.png';
        cc.loader.load(url, function (err, tex) {
            if (this.debugConsole) console.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
            if (!err) {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                if (this.debugConsole) console.log(AnwserNode.width);
                if (this.debugConsole) console.log(AnwserNode.height);
                var side = AnwserNode.width > AnwserNode.height ? AnwserNode.height : AnwserNode.width;//確定矩行邊長
                AnwserNode.getChildByName('AnwserIcon').width = side * 5 / 6;
                AnwserNode.getChildByName('AnwserIcon').height = side * 5 / 6;
                AnwserNode.getChildByName('AnwserIcon').getComponent(cc.Sprite).spriteFrame = spf;
            } else {
                console.log('下載題目圖錯誤：' + err);
            }
        });
    },



    //endregion

    //region 題版動作
    /**
     * 顯示題版
     */
    ShowTopicAnim() {
        this.TopicBoardAnimation.play(this.TopicBoardAnimation._clips[0].name);
    },
    /**
     * 隱藏題版
     */
    CloseTopicAnim() {
        this.TopicBoardAnimation.play(this.TopicBoardAnimation._clips[1].name);
    },
    /**
     * 顯示題版 結束狀態
     */
    ShowTopicFinish() {
        console.log('ShowTopicFinish');

        if (this.isBot) {
            console.log('use bot');
            //todo勝率
            var MoreThanNum = Math.floor(this.BotCorrectPer * 100);
            var max = 100;
            console.log('MoreThanNum:' + MoreThanNum);
            //決定要用哪一個選擇
            var number = 0;
            var RandomNum = (Math.floor(cc.random0To1() * max) + 1);
            console.log('RandomNum:' + RandomNum);
            var isntRandom = RandomNum < MoreThanNum;//是否進入隨機答案或是直接正確
            if (isntRandom) {
                function findCorrect(Option) {
                    return Option.isCorrect == true;
                }
                number = DomainTopicExamContent.OptionData.findIndex(findCorrect);
            } else {
                function findWrong(Option) {
                    return Option.isCorrect == false;
                }
                number = DomainTopicExamContent.OptionData.findIndex(findWrong);
            }
            //找出該節點
            var ButtonNode = (number === 0 ? this.AnwserOne : number === 1 ? this.AnwserTwo : number === 2 ? this.AnwserThree : null);
            console.log(ButtonNode);
            if (ButtonNode === null) return;//錯誤出現沒有找到要觸發的節點 防呆
            //
            this.scheduleOnce(function delay(params) {
                ButtonNode.getComponent(cc.Button).clickEvents[0].emit([number.toString()]);
                var scale1Action = cc.scaleTo(0.1, 0.8, 0.8);
                var scale2Action = cc.scaleTo(0.1, 1, 1);
                var action = cc.sequence(
                    scale1Action,
                    scale2Action
                )
                ButtonNode.runAction(action);
            }, 3.5);
        }
    },
    /**
     * 隱藏題版 結束狀態
     */
    CloseTopicFinish() {
        this.resetNodeData();//回收資源
        console.log('CloseTopicFinish');
    },

    //endregion

    /**
     * choice item
     */
    choiceItem(event, index) {
        if (!self.canChoice) return;//鎖定點擊連點
        if (this.isShow) return;//如果是展示用 鎖定不能點
        self.canChoice = false;//點擊一次後自動鎖定
        //console 選擇項目index
        console.log('點選項目：' + index);
        //改變選擇改變選項狀態
        this.ShowChoiceState(parseInt(index));
        //改變選擇的 index and 正確與否
        AnwserIndex = parseInt(index);
        CorrectResult = DomainTopicExamContent.OptionData[parseInt(index)].isCorrect;
        console.log('AnwserIndex:' + AnwserIndex);
        console.log('CorrectResult:' + CorrectResult);

        if (CorrectResult) {
            console.log("正確")
            //音效
            cc.audioEngine.playEffect(self.correct_audio, false, 1);
        } else {
            console.log("錯誤")
            //音效
            cc.audioEngine.playEffect(self.wrong_audio, false, 1);
        }

        //關閉
        callbackType = 'choice';
        this.scheduleOnce(function close() {
            this.CloseTopicAnim();//關閉動畫
            if (AnwserCallback) {
                AnwserCallback(callbackType, AnwserIndex, CorrectResult, '');
            }
        }, 1);
    },

    /**
     * Show true or false 選擇選項狀態
     */
    ShowChoiceState(index) {
        // console.log(this.AnwserButtonOne.getChildByName('TrueFalseIcon'));
        // console.log(this.AnwserButtonOne.getChildByName('TrueFalseIcon').getComponent(cc.Sprite));
        console.log('第 ' + index + ' 個按鍵');//顯示選擇項目index 
        var SpriteNode = null;
        switch (index) {
            case 0:
                SpriteNode = this.AnwserOne.getChildByName('TrueFalseIcon')
                break;
            case 1:
                SpriteNode = this.AnwserTwo.getChildByName('TrueFalseIcon')
                break;
            case 2:
                SpriteNode = this.AnwserThree.getChildByName('TrueFalseIcon')
                break;
            default:
                break;
        }

        //顯示
        var nodeAnimation = SpriteNode.getComponent(cc.Animation);
        var nodeAnimationClips = SpriteNode.getComponent(cc.Animation)._clips;
        if (DomainTopicExamContent.OptionData[index].isCorrect == true) {
            nodeAnimation.playAdditive(nodeAnimationClips[0].name);
        } else {
            nodeAnimation.playAdditive(nodeAnimationClips[1].name);
        }
    },

    /**
    * Show true or false 選擇選項狀態
    */
    CloseChoiceState(index) {
        // console.log(this.AnwserButtonOne.getChildByName('TrueFalseIcon'));
        // console.log(this.AnwserButtonOne.getChildByName('TrueFalseIcon').getComponent(cc.Sprite));
        console.log('第 ' + index + ' 個按鍵');//顯示選擇項目index 
        var SpriteNode = null;
        switch (index) {
            case 0:
                SpriteNode = this.AnwserOne.getChildByName('TrueFalseIcon')
                break;
            case 1:
                SpriteNode = this.AnwserTwo.getChildByName('TrueFalseIcon')
                break;
            case 2:
                SpriteNode = this.AnwserThree.getChildByName('TrueFalseIcon')
                break;
            default:
                break;
        }
        SpriteNode.opacity = 0;
    },

    /**
     * 音檔播放
     */
    PlayVoice() {
        console.log('播放音檔');
        var voicePath = DomainTopicExamContent.QuestionData.QuestionTopicVoicePath;
        //呼叫前端播放聲音
        if (CC_JSB) {
            jsbUtils.PlayMusicUseNactiveModel(voicePath);
        }
    },

    // update (dt) {},
});
