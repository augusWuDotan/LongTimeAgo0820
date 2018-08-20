
var self;
var ArenaUtils = require('ArenaUtils');
var SkillUtils = require('SkillUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        //競技畫面Loading
        fightLoadingPrefab: {
            default: null,
            type: cc.Prefab
        },
        //競技屬性畫面
        AttributePrefab: {
            default: null,
            type: cc.Prefab
        },
        //競技 技能提示 
        SkillTipPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.isBot = true;//是否開啟機器人
        this.LeavePairCall = null;//離開配對的方法
        this.addFightLoading();//進入場景//開始競技loading

        //背景音控制
        this.AudioControl = cc.find('AudioControl');
        if (this.AudioControl) {
            console.log('this.AudioControl is init');
            //todo ArenaFightLoading 背景音樂
            this.AudioControl.getComponent('AudioControl').PlayArenaFightLoading();
        }

        //競技場的資料保存
        this.ArenaData = cc.find('ArenaData');
        if (this.ArenaData) {
            console.log('this.ArenaData is init');
            this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
            this.isBot = this.ArenaDataComponent.isBot;
        }

        //取得socketIO
        this.socketControl = cc.find('SocketControl');
        if (this.socketControl) {
            console.log('this.socketControl is init');
            this.socketControl.getComponent('SocketIoCtrl').setArenaCallBack(this.ArenaCallback, 'Fight');
            //進入配對
            this.scheduleOnce(function delay(params) {
                this.socketControl.getComponent('SocketIoCtrl').doReady4Fight();
            }, 1);
        }

        //攻擊對方 所顯示的動畫 layer
        this.AttackEnemyLayer = this.node.getChildByName('AttackEnemyLayer');
        this.AttackEnemyLayer.getComponent('AttackEnemyControl').setCallback(this.ActionFinishCallback);
        //攻擊自己 所顯示的動畫 layer
        this.AttackSelfLayer = this.node.getChildByName('AttackSelfLayer');
        this.AttackSelfLayer.getComponent('AttackSelfControl').setCallback(this.ActionFinishCallback);

        //技能大圖
        this.StatusBigIcon = cc.find('Canvas/StatusBigIcon');
        if (this.StatusBigIcon) {
            //ArenaUtils.getAttributeStatusBigIconPath_Skill(source, volume) return path
            //loader.loadRes
            console.log('StatusBigIcon init');
        }

        //結束layer
        this.ArenaFinishGameLayer = this.node.getChildByName('ArenaFinishGameLayer');
        if (this.ArenaFinishGameLayer) {
            console.log('ArenaFinishLayer init');
            this.ArenaFinishGameLayerControl = this.ArenaFinishGameLayer.getComponent('ArenaFinishGameControl');
            this.ArenaFinishGameLayerControl.init(this.isBot);
        }

    },

    /**
   * 統一回傳格式
   * @param {*} NodeName 節點名字
   * @param {*} actionName 行為名字 
   * @param {*} result 回傳內容
   */
    ArenaCallback(NodeName, actionName, result) {
        console.log('NodeName:' + NodeName);
        switch (NodeName) {
            //socket
            case 'socket':
                self.SocketCallBack(actionName, result);
                break;
            //遊戲開場
            case 'FightLoading':
                self.FightLoadingAreaLayerCallback(actionName, result);
                break;
            //屬性區
            case 'AttributeArea':
                self.ArenaAttributeAreaCallback(actionName, result);
                break;
            //Rival 對手區
            case 'RivalAreaLayerControl':
                self.RivalAreaLayerCallback(actionName, result);
                break;
            //題版區
            case 'TopicControl':
                self.TopicLayerCallback(actionName, result);
                break;
            //攻擊控制 AttackControl
            case 'AttackControl':
                self.AttackControlCallback(actionName, result);
                break;

            default:
                break;
        }
    },
    //socket call back
    SocketCallBack(functionName, resultData) {
        var socketID = this.socketControl.getComponent('SocketIoCtrl').getSocketId();
        console.log('functionName:' + functionName);
        switch (functionName) {
            case 'RestartCallback':
                cc.director.loadScene("FightArena");
                break;
            //準備配對回傳
            case 'ReadyCallback':
                //ready的資訊
                console.log('-----ReadyCallback');
                console.log(JSON.stringify(resultData));
                self.setRoleData(resultData);
                console.log('-----');
                break;
            case 'CancelFightCallback':
                //todo 離開配對
                console.log('CancelFightCallback: ' + resultData);
                self.LeavePairCall(resultData);//
                break;
            //進入攻擊準備階段
            case 'GameStart':
                console.log('-----GameStart');
                console.log(resultData);
                console.log(JSON.stringify(resultData.subjects));
                self.setRivalData(self.socketControl.getComponent('SocketIoCtrl').getRivalData());
                console.log('-----');
                break;
            //已經有一人答題
            case 'RoleAnwser':
                self.RoleAnwserData = resultData;
                console.log('-----SocketCallBack - RoleAnwser-----');
                console.log(self.RoleAnwserData);
                // console.log(JSON.stringify(self.RoleAnwserData));
                //todo 顯示誰已經回答
                console.log('-----');
                break;
            //兩人答題後的回傳
            case 'AnswerCallback':
                self.AnwserData = resultData;
                console.log('-----SocketCallBack - AnswerCallback-----');
                console.log(self.AnwserData);
                console.log(JSON.stringify(self.AnwserData));
                var ProtagonistAnswer = Object.create(null);
                var RivalAnswer = Object.create(null);
                self.AnwserData.forEach(permissions => {
                    if (permissions.HubConnectID === socketID) {
                        ProtagonistAnswer = permissions;
                    } else {
                        RivalAnswer = permissions;
                    }
                });
                //雙方都錯誤 直接執行 空攻擊 //只要有一方具有攻擊權利就會執行 [提醒誰先攻]
                self.AttributeControl.AddTopicResult(ProtagonistAnswer, RivalAnswer);

                //收起道具欄
                this.AttributeControl.ProtagonistItemBarClose();
                this.AttributeControl.RivalItemBarClose();
                break;
            //使用道具
            case 'UseItemsCallBack':
                console.log('-----SocketCallBack - UseItemsCallBack-----');
                console.log(JSON.stringify(resultData));
                // console.log(JSON.stringify(resultData));
                var attr_eng = ArenaUtils.getAttrEng(resultData.Method);
                console.log('attr_eng:' + attr_eng);

                // effect data
                // {
                //     "Element": "Agi",
                //     "Value": -115,
                //     "Source": "Skill",
                //     "SourceID": 74,
                //     "SourceName": "冰凍術",
                //     "Rounds": 2
                // }

                // propsData
                // {
                //     "HubConnectID": "fQGeqHpYNFkKXZq2AAAb",
                //     "Method": "AddDef",
                //     "Value": 35,
                //     "Round": 30,
                //     "SourceID": 18,
                //     "SourceName": "初級防禦增強卷軸",
                //     "Participants": [],
                //     "SortNum": 4
                // }

                //修正好的 effect
                var Effect = {
                    "Element": attr_eng,
                    "Value": resultData.Value,
                    "Source": 'Item',
                    "SourceID": resultData.SourceID,
                    "SourceName": resultData.SourceName,
                    "Rounds": resultData.Round
                }

                var SkillTitle = ArenaUtils.getAttrTitle(Effect.Element);//技能對應中文

                var description = (socketID === resultData.HubConnectID ? '' : '對方') + '使用 ' + Effect.SourceName + ' 道具\n'
                    + SkillTitle + (Effect.Value >= 0 ? " 增加" + Effect.Value + "点" : "损失" + (Effect.Value) + "点") + '\n'
                    + "持续" + Effect.Rounds + "回合";

                if (resultData.HubConnectID === socketID) {
                    this.AttributeControl.UseItem('Protagonist', resultData.SortNum);
                    this.AttackShowStatusDescriptionLayer(description, 'Protagonist', Effect);
                } else {
                    this.AttributeControl.UseItem('Rival', resultData.SortNum);
                    this.AttackShowStatusDescriptionLayer(description, 'Rival', Effect);
                }
                console.log('-----');
                break;
            //攻擊回傳
            case 'AttackCallback':
                console.log('-----SocketCallBack - AttackCallback-----');
                // console.log(resultData);
                console.log(JSON.stringify(resultData));
                //判斷是否結束
                for (let attack of resultData.PersonalAttackList) {
                    // console.log(JSON.stringify(attack));
                    //驗證是否結束
                    if (attack.isFinish) {
                        self.isFinish = true;
                    }
                }

                //todo 攻擊實現
                var PersonalAttackList = resultData.PersonalAttackList;
                var isFirst = PersonalAttackList[0].HubConnectID === socketID;//判斷是不是主角開始攻擊的順序
                var ProtagonistAttacklist = resultData.PersonalAttackList.find(AttackObject => AttackObject.HubConnectID === socketID);
                var RivalAttacklist = resultData.PersonalAttackList.find(AttackObject => AttackObject.HubConnectID !== socketID);
                var ProtagonistRoundEndEffect = resultData.RoundEndEffect.find(RoundEndEffect => RoundEndEffect.HubConnectID === socketID);
                var RivalRoundEndEffect = resultData.RoundEndEffect.find(RoundEndEffect => RoundEndEffect.HubConnectID !== socketID);

                //todo 排列執行順序
                self.SortAttackAction(isFirst, ProtagonistAttacklist, RivalAttacklist, ProtagonistRoundEndEffect, RivalRoundEndEffect);

                //
                if (self.isFinish) {
                    console.log('遊戲結束')
                } else {
                    // this.socketControl.getComponent('SocketIoCtrl').doGameNext('next');
                }

                console.log('-----');
                break;
            //GameNext
            case 'GameNextCallback':
                console.log('-----SocketCallBack - GameNextCallback-----');
                // console.log(resultData);
                console.log(JSON.stringify(resultData));
                //debug
                self.scheduleOnce(function doAnimation() {
                    //收起道具欄
                    this.AttributeControl.ProtagonistItemBarShow();
                    this.AttributeControl.RivalItemBarShow();
                    this.AttributeControl.executeNextTopic();//屬性區 下一題
                    this.TopicBoardNext();//題版區 下一題  
                }, 1);
                console.log('-----');
                break;

            //Victory
            case 'GameFinishCallback':
                console.log('-----SocketCallBack - GameFinishCallback-----');
                console.log(resultData);
                console.log('-----');
                //開啟勝利或是失敗畫面
                this.addFinishLayer(resultData);
                break;

            default:
                break;
        }
    },

    /**
     * ------------------------------------------------------loading scene 配置
     */
    //設定對戰讀取畫面
    //加入 雙人對戰loading prefab
    addFightLoading() {
        this.LoadingLayer = this.node.getChildByName("LoadingLayer");
        if (this.LoadingLayer) console.log('this.LoadingLayer init');
        //
        this.FightLoadingLayer = cc.instantiate(this.fightLoadingPrefab);
        this.LoadingLayer.addChild(this.FightLoadingLayer);
        this.ArenaFightGameLoadingControl = this.FightLoadingLayer.getComponent('ArenaFightGameLoadingControl');
        if (this.ArenaFightGameLoadingControl) {
            console.log('this.ArenaFightGameLoadingControl init');
            this.ArenaFightGameLoadingControl.init();//初始
            this.ArenaFightGameLoadingControl.setArenaCallback(this.ArenaCallback);
            this.ArenaFightGameLoadingControl.showLoadingStart();//開始配對動畫
        }
    },
    //設定主角資訊
    setRoleData(roleData) {
        this.ArenaFightGameLoadingControl.setRoleData(
            roleData//主角資料
        );
    },

    //設定對手資訊
    setRivalData(roleData) {
        this.ArenaFightGameLoadingControl.setRivalData(
            roleData//對手資料
        );
    },

    //離開配對
    LeavePair() {
        //離開此scene
        this.AudioControl.getComponent('AudioControl').stopAllAudio();
        cc.director.loadScene("ArenaRankAreaScene");
    },

    //配對完成
    PairFinish() {
        //進入顯示戰鬥屬性
        var ParticipantData = this.socketControl.getComponent('SocketIoCtrl').getParticipantData();
        var RivalData = this.socketControl.getComponent('SocketIoCtrl').getRivalData();
        var SubjectData = this.socketControl.getComponent('SocketIoCtrl').getParticipantSubjectData().Subject;
        this.addAttributeLayer(ParticipantData, RivalData, SubjectData);
    },
    //分析回傳處理 loading
    FightLoadingAreaLayerCallback(actionName, result) {
        console.log(actionName);
        switch (actionName) {
            case 'LeavePair':
                self.LeavePairCall = result;
                this.socketControl.getComponent('SocketIoCtrl').doCancelFight();//離開配對
                break;
            case 'showLoadingEndFinish':
                if (result === 'leave') {
                    //離開配對
                    self.LeavePair();
                } else if (result === 'pair') {
                    //配對完成
                    self.PairFinish();
                } else {
                    //null
                }
                break;
            //配對延時 //呼叫機器人
            case 'doMachinePair':
                this.socketControl.getComponent('SocketIoCtrl').doMachine();//請求機器人配對
                break;
            default:
                break;
        }
    },

    /**
     * ------------------------------------------------------屬性 配置
     */
    //加入屬性prefab
    addAttributeLayer(Participant, Rival, subject) {
        //
        //todo ArenaFightLoading 背景音樂
        this.AudioControl.getComponent('AudioControl').PlayArenaFight();
        //
        this.AttributeLayer = this.node.getChildByName("AttributeLayer");
        if (this.AttributeLayer) console.log('this.AttributeLayer init');
        /**
         * AttributeLayerNode 預置節點
         * AttributeLayer 裝載父節點
         * AttributeControl 子結點 component
         * //兩邊頭像
         * this.AttributeLayerNode.getChildByName('ProtagonistLayer').getChildByName('ProtagonistAvatarLayer');
         * this.AttributeLayerNode.getChildByName('RivalLayer').getChildByName('RivalAvatarLayer');
         */
        this.AttributeLayerNode = cc.instantiate(this.AttributePrefab);
        this.AttributeLayer.addChild(this.AttributeLayerNode);
        this.AttributeControl = this.AttributeLayerNode.getComponent('AttributeArea');
        if (this.AttributeControl) {
            console.log('this.AttributeControl init');
            this.AttributeControl.initData();//屬性層 初始化
            this.AttributeControl.setAttackType('Multiplayer');//今天做多人對戰
            this.AttributeControl.setProtagonistAttributeData(Participant);//主角屬性
            this.AttributeControl.setRivalAttributeData(Rival);//怪物屬性
            this.AttributeControl.executeInitTopicCount((subject) ? subject.length : 0);//初始化題數
            this.AttributeControl.setArenaCallback(this.ArenaCallback);
            this.AttributeAreaShowOrNot(true);//出場動畫
        }
    },
    //雙方屬性層級 道具欄 的顯示和消失
    AttributeItemsLayerShowOrNot(boo) {
        if (!this.AttributeControl) console.log('this.AttributeControl not init');
        if (boo) {
            //顯示
            this.AttributeControl.ProtagonistItemBarShow();
            this.AttributeControl.RivalItemBarShow();
        } else {
            //消失
            this.AttributeControl.ProtagonistItemBarClose();
            this.AttributeControl.RivalItemBarClose();
        }
    },

    //雙方屬性層 消失 或是 顯示
    AttributeAreaShowOrNot(boo) {
        if (!this.AttributeControl) console.log('this.AttributeControl not init');
        if (boo) {
            //顯示
            this.AttributeControl.AttributeAreaShow();
        } else {
            //消失
            this.AttributeControl.AttributeAreaClose();
        }
    },
    /**
     * //雙方 [增加|減少] [血量|魔力|其他屬性]
     * @param {*} RoleType 角色型別
     * @param {*} AttrType 屬性型別
     * @param {*} Volume 值
     */
    AttributeUpdateBloodOrMagic(RoleType, AttrType, Volume) {
        if (RoleType === 'Protagonist') {
            //主角
            if (AttrType === 'HP') {
                //血量
                if (Volume >= 0) this.AttributeControl.AddProtagonistBlood(Volume);
                else this.AttributeControl.CutProtagonistBlood(Volume);
            } else if (AttrType === 'MP') {
                //魔力
                if (Volume >= 0) this.AttributeControl.AddProtagonistMagic(Volume);
                else this.AttributeControl.CutProtagonistMagic(Volume);
            }
            this.AttributeControl.createStatusNodeWithHPMPBar(RoleType, AttrType, Volume);//顯示狀態特效
        } else {
            //對手
            if (AttrType === 'HP') {
                //血量
                if (Volume >= 0) this.AttributeControl.AddRivalBlood(Volume);
                else this.AttributeControl.CutRivalBlood(Volume);
            } else if (AttrType === 'MP') {
                //魔力
                if (Volume >= 0) this.AttributeControl.AddRivalMagic(Volume);
                else this.AttributeControl.CutRivalMagic(Volume);
            }
            this.AttributeControl.createStatusNodeWithHPMPBar(RoleType, AttrType, Volume);//顯示狀態特效
        }
    },

    /**
    * 建立答題計時
    */
    startAnswerSchedule() {
        var limit = this.socketControl.getComponent('SocketIoCtrl').getAnswerTime();
        this.AttributeControl.StartAnswerSchedule(limit);
    },
    /**
    * 建立攻擊計時
    */
    startAttackSchedule() {
        console.log('startAttackSchedule');
        var limit = this.socketControl.getComponent('SocketIoCtrl').getAttackTime();
        console.log('startAttackSchedule limit' + limit);
        this.AttributeControl.StartAttackSchedule(limit);
    },
    /**
     * 取得使用時間
     */
    getScheduleTime() {
        return this.AttributeControl.getScheduleTime();
    },

    //屬性區回傳配置
    ArenaAttributeAreaCallback(actionName, result) {
        console.log(actionName);
        switch (actionName) {
            case 'AttributeAreaShowFinsh':
                console.log('開啟屬性區結束');
                if (result == 'AttributeAreaShowFinsh') {
                    //todo debud animation
                    if (self.AttackSelfLayer) this.AttackSelfLayer.getComponent('AttackSelfControl').init();
                    if (self.AttackEnemyLayer) this.AttackEnemyLayer.getComponent('AttackEnemyControl').init();

                    //todo 開啟boss
                    self.scheduleOnce(function delay(params) {
                        this.ShowRivalControl();
                    }, 0.5);

                    //建立題目「會有第一回合的叫囂」
                    self.scheduleOnce(function delay(params) {
                        this.AddTopicBoardControl();
                    }, 5);

                } else if (result == 'normal') {
                    //一般    
                }
                break;
            //使用道具
            case 'ProtagonistItemCallback':
                console.log('使用道具:' + result.Sort);
                this.socketControl.getComponent('SocketIoCtrl').doUserItems(result.Sort);
                break;
            //顯示誰先攻結束
            case 'ShowTopicResultCallBack':
                console.log(result);
                this.isAttackFirst = result.isProtagonistWin;
                if (this.isAttackFirst != null) {
                    //雙方有人答對或是都正確
                    if (!result.ProtagonistAnswer.Permission.Permission) {
                        console.log('沒有攻擊');
                        self.socketControl.getComponent('SocketIoCtrl').doAttack(-1, this.isAttackFirst ? 0 : 1);
                    } else {
                        //show Attack
                        console.log('顯示攻擊控制');
                        self.AddAttackControl();//攻擊管理
                    }
                } else {
                    //都答錯
                    self.socketControl.getComponent('SocketIoCtrl').doAttack(-1, 0);
                }
                break;
            case 'ProtagonistGameOver':
                console.log('主角陣亡');
                this.GameOver = { 'WinRole': 'Rival' };//{'WinRole':'Rival'}
                break;
            case 'RivalGameOver':
                console.log('對手陣亡');
                this.GameOver = { 'WinRole': 'Protagonist' };//{'WinRole':'Protagonist'}
                break;
            case 'StopAnswerControl':
                //答題計時結束
                this.TopicControl.closeTopic();
                this.socketControl.getComponent('SocketIoCtrl').doAnwser(-1, this.AttributeControl.getScheduleTime());
                break;
            case 'StopAttackControl':
                //攻擊計時結束
                this.AttackControl.finishAttackControl();
                break;
            default:
                break;
        }
    },



    /**
     * ------------------------------------------------------題目版型 配置
     */
    //新增題版管理
    AddTopicBoardControl() {
        this.isAttackFirst = false;
        this.TopicControl = this.node.getChildByName('ArenaTopicLayer').getComponent('TopicControl');
        var SubjectData = this.socketControl.getComponent('SocketIoCtrl').getParticipantSubjectData().Subject;
        if (this.TopicControl) {
            console.log('this.TopicControl init');
            //題目列表、index、是否自動答題、是否展示用
            this.TopicControl.init(SubjectData, 0, this.isBot, false);
            //
            this.TopicControl.setArenaCallback(this.ArenaCallback);
        }
        //
        if (SubjectData) {
            this.scheduleOnce(function delay(params) {
                self.startAnswerSchedule();
            }, 1);
        } else {
            console.log('no topic');
        }

    },
    //下一題
    TopicBoardNext() {
        this.TopicControl.ChoiceNext();
        //
        this.scheduleOnce(function delay(params) {
            self.startAnswerSchedule();
        }, 1);
    },
    //題版回傳
    TopicLayerCallback(actionName, result) {
        console.log(actionName);
        console.log(result);
        switch (actionName) {
            case 'AnwserCall':
                console.log('答題');
                this.AttributeControl.stopSchedule();//
                this.socketControl.getComponent('SocketIoCtrl').doAnwser(result.Option_ID, this.AttributeControl.getScheduleTime());
                break;
            default:
                break;
        }
    },

    /**
     * ------------------------------------------------------攻擊版型 配置
     */
    AddAttackControl() {
        //初始化攻擊控制區  this.AttackControlLayer
        if (!this.AttackControl) {
            this.AttackControl = this.node.getChildByName("AttackControlLayer").getComponent("AttackControl");
        }
        console.log("this.AttackControl init");
        var ParticipantData = this.socketControl.getComponent('SocketIoCtrl').getParticipantData();
        this.AttackControl.init(ParticipantData.Background_ID, ParticipantData.Skills, this.isBot);
        this.AttackControl.setArenaCallback(this.ArenaCallback);
        this.AttackControl.ArenaGameControl = this;
        this.AttackControl.ExecutePentagramControl();//顯示五芒星

    },

    AttackControlCallback(actionName, result) {
        console.log(actionName);
        console.log(result);
        switch (actionName) {
            case 'AttackControlShowFinished':
                console.log('AttackControlCallback startAttackSchedule');
                self.startAttackSchedule();//開始攻擊計時
                break
            case 'AttackListener':
                console.log('this.isAttackFirst:' + this.isAttackFirst);
                this.socketControl.getComponent('SocketIoCtrl').doAttack(result.type, this.isAttackFirst == true ? 0 : 1);
                break;
            default:
                break;
        }
    },

    /**
     * 攻擊技能提示
     * @param {*} AvatarNode 
     * @param {*} SkillName 
     */
    AttackShowSkillTipLayer(RoleName, SkillName) {
        console.log(SkillName);
        if (this.SkillTipLayer) this.SkillTipLayer.destroy();
        this.SkillTipLayer = cc.instantiate(this.SkillTipPrefab);
        this.node.addChild(this.SkillTipLayer);
        this.SkillTipLayer.setLocalZOrder(12);//設定Ｚ層級 [顯示需求]
        this.SkillTipLayer.getComponent('SkillTipControl').setSkillTip(RoleName, SkillName);
        this.SkillTipLayer.setPosition(cc.p(0, (this.node.height / 2) - this.SkillTipLayer.height));
    },

    /**
     * 攻擊技能提示 detroy
     * @param {*} AvatarNode 
     * @param {*} SkillName 
     */
    AttackDetroySkillTipLayer() {
        console.log(this.SkillTipLayer);
        if (this.SkillTipLayer) this.SkillTipLayer.destroy();
    },

    /**
     * 狀態提示
     * @param {*} StatusDescription 狀態中文
     * @param {*} RoleType 角色
     * @param {*} model effect
     */
    AttackShowStatusDescriptionLayer(StatusDescription, RoleType, model) {
        console.log(StatusDescription);
        if (this.SkillTipLayer) this.SkillTipLayer.destroy();
        this.SkillTipLayer = cc.instantiate(this.SkillTipPrefab);
        this.node.addChild(this.SkillTipLayer);
        this.SkillTipLayer.setLocalZOrder(12);//設定Ｚ層級 [顯示需求]
        this.SkillTipLayer.setPosition(cc.p(0, (this.node.height / 2) - this.SkillTipLayer.height));

        //建立技能大圖式 this.StatusBigIcon
        if (this.StatusBigIcon) {
            //skill
            if (model.Source === 'Skill' && model.Rounds > 1) {
                console.log('技能狀態 , Rounds > 1');
                //增加提示 4秒延遲 [讀取圖示、淡入、移動、淡出]
                this.SkillTipLayer.getComponent('SkillTipControl').setStatusDescription(StatusDescription);
                //
                if (this.SkillBigIcon) this.SkillBigIcon.destroy();
                this.SkillBigIcon = cc.instantiate(this.StatusBigIcon);
                this.SkillBigIcon.scale = 0;
                this.node.addChild(this.SkillBigIcon);
                this.SkillBigIcon.setLocalZOrder(12);
                this.SkillBigIcon.setPosition(cc.p(0, (this.node.height / 2) - (this.SkillTipLayer.height + this.SkillBigIcon.height / 2 + 100)));
                //
                var path = ArenaUtils.getAttributeStatusBigIconPath_Skill(model.Element, model.Value);
                cc.loader.loadRes(path, cc.SpriteFrame, function (err, sp) {
                    if (err) {
                        console.log('下載錯誤：' + err);
                        return;
                    } else {
                        self.SkillBigIcon.getComponent(cc.Sprite).spriteFrame = sp;//設定圖像
                        self.SkillBigIcon.runAction(cc.scaleTo(0.2, 1));
                        //
                        self.scheduleOnce(function delay(params) {
                            //
                            var fadeoutAction = cc.fadeOut(0.5);
                            var actionTo = cc.scaleTo(0.2, 0.2);
                            var actionBy = null;
                            if (RoleType === 'Rival') {
                                actionBy = cc.moveTo(0.5, cc.p(self.node.width / 2 - 100, self.node.height / 2 - 50));//右上
                            } else {
                                actionBy = cc.moveTo(0.5, cc.p(-self.node.width / 2 + 100, self.node.height / 2 - 50));//左上
                            }

                            //
                            var finished = cc.callFunc(function () {
                                self.SkillBigIcon.destroy();//結束節點
                                //動態加上狀態bar
                                self.AttributeControl.AddStatusNodeWithRoleAvatar(RoleType, model.Source, model.SourceID, model.Element, model.SourceName, model.Value, model);
                                //
                                self.AttributeUpdateBloodOrMagic(RoleType, model.Element, model.Value);
                                //
                                console.log('ActionFinishCallback start');
                                this.ActionFinishCallback();
                                console.log('ActionFinishCallback end');
                            }, self);
                            //縮小 移動 淡出
                            var action = cc.sequence(cc.spawn(actionBy, actionTo, fadeoutAction), finished);
                            self.SkillBigIcon.runAction(action);

                        }, 2);
                    }
                });
            } else if (model.Source === 'Skill' && model.Rounds <= 1) {
                console.log('技能狀態 , Rounds<=1');
                //Item
                //單一回合 狀態
                this.SkillTipLayer.getComponent('SkillTipControl').setStatusDescription(StatusDescription);
                //動態加上狀態提示
                // self.AttributeControl.AddStatusNodeWithRoleAvatar(RoleType, model.Source, model.SourceID, model.Element, model.SourceName, model.Value, model);
                self.AttributeUpdateBloodOrMagic(RoleType, model.Element, model.Value);
                self.scheduleOnce(function delay(params) {
                    this.ActionFinishCallback();
                }, 1.5);
            } else if (model.Source === 'Item' && model.Rounds > 1) {
                console.log('道具狀態');
                //增加道具提示 1秒延遲 [顯示、消失]
                this.SkillTipLayer.getComponent('SkillTipControl').setPropStatusDescription(StatusDescription);
                //Item
                //動態加上狀態提示
                self.AttributeControl.AddStatusNodeWithRoleAvatar(RoleType, model.Source, model.SourceID, model.Element, model.SourceName, model.Value, model);
                self.AttributeUpdateBloodOrMagic(RoleType, model.Element, model.Value);
            }
            else if (model.Source === 'Item' && model.Rounds <= 1) {
                console.log('道具狀態');
                //增加道具提示 1秒延遲 [顯示、消失]
                this.SkillTipLayer.getComponent('SkillTipControl').setPropStatusDescription(StatusDescription);
                self.AttributeUpdateBloodOrMagic(RoleType, model.Element, model.Value);
            } else {
                //
                console.log('null 狀態');
            }

        }
    },


    AttackShowDodge(dodgeDescription) {
        console.log(dodgeDescription);
        if (this.SkillTipLayer) this.SkillTipLayer.destroy();
        this.SkillTipLayer = cc.instantiate(this.SkillTipPrefab);
        this.node.addChild(this.SkillTipLayer);
        this.SkillTipLayer.setLocalZOrder(12);//設定Ｚ層級 [顯示需求]
        this.SkillTipLayer.setPosition(cc.p(0, (this.node.height / 2) - this.SkillTipLayer.height));
        this.SkillTipLayer.getComponent('SkillTipControl').setDodgeDescription(dodgeDescription);
    },

    /**
     * ------------------------------------------------------攻擊動畫配置
     */

    //事件結束
    ActionFinishCallback() {
        console.log('AnimationFinish');
        /*
         {
             "RoleType":'',//self or enemy [發生在哪一方]
             "Action":'',//'beforeRoundEffect' or 'Attack' or 'AttackEffect' or UpdateStatus
             "value":{}
         }
         */
        //如果技能提示存在 則消失
        self.AttackDetroySkillTipLayer();
        //去除第一個動作
        self.AttackSortList.splice(0, 1);//刪除第一個元素

        self.scheduleOnce(function delay(params) {
            this.doAttackSortList();//繼續執行
        }, 0.5);
        //繼續執行下一個動做

    },

    doAttackSortList() {
        if (this.AttackSortList && this.AttackSortList.length > 0) {
            console.log('this.AttackSortList have data');
            var AttackAction = this.AttackSortList[0];

            switch (AttackAction.Action) {
                case 'beforeRoundEffect':
                    console.log('beforeRoundEffect data');
                    if (AttackAction.RoleType == 'self') self.ProtagonistBeforeAttack(AttackAction.value);
                    else self.RivalBeforeAttack(AttackAction.value);
                    break;
                case 'Attack':
                    console.log('Attack data');
                    if (AttackAction.RoleType == 'self') self.ProtagonistAttackAnimation(AttackAction.value, AttackAction.name);
                    else self.RivalAttackAnimation(AttackAction.value, AttackAction.name);
                    break;
                case 'AttackEffect':
                    console.log('AttackEffect data');
                    console.log(AttackAction);
                    if (AttackAction.RoleType == 'self') self.ProtagonistAfterAttack(AttackAction.value, AttackAction.name);
                    else self.RivalAfterAttack(AttackAction.value, AttackAction.name);
                    break;
                case 'UpdateStatus':
                    console.log('UpdateStatus data');
                    self.UpdateStatusLayer(AttackAction.value);
                    break;
                default:

                    break;
            }

        } else {
            console.log('this.AttackSortList have not data');
            //執行GameNext
            this.socketControl.getComponent('SocketIoCtrl').doGameNext('next');
        }
    },

    /**
     * //todo 排列雙方執行順序
     * @param {*} isFirst  是否先攻
     * @param {*} ProtagonistAttackObject 主角攻擊資訊
     * @param {*} RivalAttackObject 對手攻擊資訊
     * @param {*} ProtagonistRoundEndEffect 主角最後狀態
     * @param {*} RivalRoundEndEffect 對手最後狀態
     */
    SortAttackAction(isFirst, ProtagonistAttackObject, RivalAttackObject, ProtagonistRoundEndEffect, RivalRoundEndEffect) {
        this.AttackSortList = [];
        // console.log(JSON.stringify(ProtagonistAttackObject));
        // console.log(JSON.stringify(RivalAttackObject));
        //
        if (isFirst) {
            //主角先執行排序 ProtagonistAttackList >> RivalAttackList
            this.Sort('Protagonist', ProtagonistAttackObject);
            this.Sort('Rival', RivalAttackObject);
        } else {
            //對手先執行排序 RivalAttackList >> ProtagonistAttackList
            this.Sort('Rival', RivalAttackObject);
            this.Sort('Protagonist', ProtagonistAttackObject);
        }

        //更新狀態
        var UpdateStatusModel = {
            'RoleType': '',
            "Action": 'UpdateStatus',
            'value': {
                'ProtagonistRoundEndEffect': ProtagonistRoundEndEffect,
                'RivalRoundEndEffect': RivalRoundEndEffect
            }
        }
        this.AttackSortList.push(UpdateStatusModel);


        //
        console.log('----AttackSortList start');
        console.log(this.AttackSortList);
        console.log('----AttackSortList end');
        this.doAttackSortList();
    },

    // 排列執行順序
    Sort(RoleType, AttackObject) {
        console.log('RoleType:' + RoleType + ' , ' + (RoleType === 'Protagonist' ? '主角攻擊' : '對手攻擊'));
        // console.log(AttackObject);

        //主角資訊
        var ProtagonistData = this.socketControl.getComponent('SocketIoCtrl').getParticipantData();
        //對手資訊
        var RivalData = this.socketControl.getComponent('SocketIoCtrl').getRivalData();


        if (AttackObject == null) return;//無內容

        //beforeRoundEffect [在 角色自身身份 所觸發]]
        if (AttackObject.beforeRoundEffect && AttackObject.beforeRoundEffect.length > 0) {
            AttackObject.beforeRoundEffect.forEach(Effect => {
                //
                var RoundEffectModel = {
                    'RoleType': RoleType === 'Protagonist' ? 'self' : 'enemy',
                    "Action": 'beforeRoundEffect',
                    'value': Effect
                }
                //
                this.AttackSortList.push(RoundEffectModel);
                console.log('增減益對象：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 技能或道具：' + (Effect.Source === 'Skill' ? '技能' : '道具') + ',增減益屬性：' + Effect.Element + ',值：' + Effect.Value);
            });
        }

        //Attack [在 角色敵對身份 觸發]]
        if (AttackObject.SkillPrototype_ID === -1) {
            //null 閒置
        } else {
            // 0 普通攻擊
            // 1 - either > 0 技能攻擊

            /**
             * SkillPrototype_ID
             * 閒置 =-1
             * 普攻 =0
             * 技能 >0
             */

            /**
             * AttackObject Damage
             * 技能閃避 =-1
             * 輔助 = 0
             * 技能命中 > 0
             */

            var ActionForWho = ''; //技能施放在誰身上
            //Effect.self 指向主角
            let selfEffect = AttackObject.Effect.self.find(effectItem => effectItem.SourceID === AttackObject.SkillPrototype_ID);
            //Effect.enemy 指向對手
            let enemyEffect = AttackObject.Effect.enemy.find(effectItem => effectItem.SourceID === AttackObject.SkillPrototype_ID);
            //攻擊的model
            var AttackModel = Object.create(null);
            //self AttackObject.Effect.self 對自己施放
            var SelfAttackEffectList = [];
            //enemy AttackObject.Effect.enemy 對對手施放
            var EnemyAttackEffectList = [];

            // console.log('主角姓名：' + ProtagonistData.Name);
            // console.log('對手姓名：' + RivalData.Name);

            if (AttackObject.SkillPrototype_ID == 0) {
                //普攻 //Damage 範圍 >0[命中] or -1[閃避]

                ActionForWho = RoleType === 'Protagonist' ? 'enemy' : 'self';
                let NormalAttack_name = RoleType === 'Protagonist' ? ProtagonistData.Name : RivalData.Name;
                console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ', 攻擊技能：' + AttackObject.SkillPrototype_Name);

                AttackModel = {
                    'name': NormalAttack_name,
                    'RoleType': ActionForWho,
                    "Action": 'Attack',
                    'value': AttackObject
                }
                this.AttackSortList.push(AttackModel);

            } else if (AttackObject.SkillPrototype_ID > 0) {
                //技能攻擊 //攻擊 //輔助 //Damage 範圍 =0[輔助]] ; >0[命中] or -1[閃避]
                if (AttackObject.Damage === 0) {
                    //輔助 //self & enemy => 攻擊後執行
                    if (selfEffect) {
                        ActionForWho = RoleType === 'Protagonist' ? 'self' : 'enemy';
                    } else {
                        ActionForWho = RoleType === 'Protagonist' ? 'enemy' : 'self';
                    }
                    let SkillAttack_name = RoleType === 'Protagonist' ? ProtagonistData.Name : RivalData.Name;
                    //輔助技能model
                    AttackModel = {
                        'name': SkillAttack_name,
                        'RoleType': ActionForWho,
                        "Action": 'Attack',
                        'value': AttackObject
                    };
                    // console.log(RoleType + ' 輔助技能 ActionForWho:' + ActionForWho + ',' + 'name:' + SkillAttack_name);

                    console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ', 輔助增減益技能：' + AttackObject.SkillPrototype_Name + ', 施放對象：' + (ActionForWho === 'self' ? '主角' : '對手'));

                    //self Effect model
                    //AttackEffect [當下對 自身身份 與 敵對身份 觸發了什麼狀態]
                    if (AttackObject.Effect.self && AttackObject.Effect.self.length > 0) {
                        //對自身 AttackObject.Effect.self
                        AttackObject.Effect.self.forEach(effect => {
                            let name = RoleType === 'Protagonist' ? ProtagonistData.Name : RivalData.Name;//誰施放的
                            var AttackEffectModel = {
                                'name': name,
                                'RoleType': 'self',//放給誰
                                'RoleType': RoleType === 'Protagonist' ? 'self' : 'enemy',
                                "Action": 'AttackEffect',
                                'value': effect
                            }
                            SelfAttackEffectList.push(AttackEffectModel);
                            console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ',狀態：' + effect.SourceName + ', 狀態賦予對象：' + (RoleType === 'Protagonist' ? '主角' : '對手'));
                        });
                    }
                    //enemy Effect model
                    if (AttackObject.Effect.enemy && AttackObject.Effect.enemy.length > 0) {
                        //對敵方 AttackObject.Effect.enemy
                        AttackObject.Effect.enemy.forEach(effect => {
                            let name = RoleType !== 'Protagonist' ? ProtagonistData.Name : RivalData.Name;//誰受到狀態
                            var AttackEffectModel = {
                                'name': name,
                                // 'RoleType': 'enemy',
                                'RoleType': RoleType === 'Protagonist' ? 'enemy' : 'self',
                                "Action": 'AttackEffect',
                                'value': effect
                            }
                            //
                            EnemyAttackEffectList.push(AttackEffectModel);
                            console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ',狀態：' + effect.SourceName + ', 狀態賦予對象：' + (RoleType !== 'Protagonist' ? '主角' : '對手'));
                        });
                    }

                    //順序 攻擊 -> self ->enemy
                    this.AttackSortList.push(AttackModel);
                    this.AttackSortList = this.AttackSortList.concat(SelfAttackEffectList);
                    this.AttackSortList = this.AttackSortList.concat(EnemyAttackEffectList);

                } else if (AttackObject.Damage > 0 || AttackObject.Damage == -1) {
                    //技能 攻擊 //self => 攻擊前執行 //enemy => 攻擊後執行
                    //ActionForWho 技能攻擊一率對 反向角色 Protagonist => enemy 。 Rival => self
                    ActionForWho = RoleType === 'Protagonist' ? 'enemy' : 'self';
                    let name = RoleType === 'Protagonist' ? ProtagonistData.Name : RivalData.Name;
                    //技能攻擊model
                    AttackModel = {
                        'name': name,
                        'RoleType': ActionForWho,
                        "Action": 'Attack',
                        'value': AttackObject
                    };
                    console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ' ,攻擊技能：' + AttackObject.SkillPrototype_Name + ', 施放對象：' + (ActionForWho === 'self' ? '主角' : '對手'));
                    //self Effect model
                    //AttackEffect [當下對 自身身份 與 敵對身份 觸發了什麼狀態]
                    if (AttackObject.Effect.self && AttackObject.Effect.self.length > 0) {
                        //對自身 AttackObject.Effect.self
                        AttackObject.Effect.self.forEach(effect => {
                            let name = RoleType !== 'Protagonist' ? ProtagonistData.Name : RivalData.Name;//誰受到效果
                            var AttackEffectModel = {
                                'name': name,
                                // 'RoleType': 'self',//放給誰
                                'RoleType': RoleType === 'Protagonist' ? 'self' : 'enemy',
                                "Action": 'AttackEffect',
                                'value': effect
                            }
                            SelfAttackEffectList.push(AttackEffectModel);
                            console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ',狀態：' + effect.SourceName + ', 狀態賦予對象：' + (RoleType === 'Protagonist' ? '主角' : '對手'));
                        });
                    }
                    //enemy Effect model
                    if (AttackObject.Effect.enemy && AttackObject.Effect.enemy.length > 0) {
                        //對敵方 AttackObject.Effect.enemy
                        AttackObject.Effect.enemy.forEach(effect => {
                            let name = RoleType !== 'Protagonist' ? ProtagonistData.Name : RivalData.Name;//誰受到效果
                            var AttackEffectModel = {
                                'name': name,
                                'RoleType': RoleType === 'Protagonist' ? 'enemy' : 'self',
                                "Action": 'AttackEffect',
                                'value': effect
                            }
                            //
                            EnemyAttackEffectList.push(AttackEffectModel);
                            console.log('攻擊方：' + (RoleType === 'Protagonist' ? '主角' : '對手') + ', 被攻擊方：' + (RoleType !== 'Protagonist' ? '主角' : '對手') + ',狀態：' + effect.SourceName + ', 狀態賦予對象：' + (RoleType !== 'Protagonist' ? '主角' : '對手'));
                        });

                    }

                    //順序  self -> 攻擊 -> enemy
                    this.AttackSortList = this.AttackSortList.concat(SelfAttackEffectList);
                    this.AttackSortList.push(AttackModel);
                    this.AttackSortList = this.AttackSortList.concat(EnemyAttackEffectList);

                } else {
                    //!<-1 
                    console.log('AttackObject.Damage !<-1 : ' + AttackObject.Damage);
                }
            } else {
                //null
                console.log('AttackObject.SkillPrototype_ID is not zero or >zero : ' + AttackObject.SkillPrototype_ID);
            }
        }
    },


    //todo 執行主角 攻擊前事件處理
    ProtagonistBeforeAttack(model) {
        //主角增減屬性
        if (model.Element === 'HP' || model.Element === 'MP') {
            //HP MP 增減
            this.AttributeUpdateBloodOrMagic('Protagonist', model.Element, model.Value);
        } else {
            //其他屬性 [擴增動畫]
        }

        //狀態前動作 delay 0.5秒
        this.scheduleOnce(function delay(params) {
            this.ActionFinishCallback();
        }, 0.5);

    },


    //todo 執行攻擊主角動畫 [全屏]
    ProtagonistAttackAnimation(model, name) {
        var RivalData = this.socketControl.getComponent('SocketIoCtrl').getRivalData();//動畫執行時間
        var ProtagonistData = this.socketControl.getComponent('SocketIoCtrl').getParticipantData();//動畫執行時間

        //耗魔    
        if (name === RivalData.Name) {
            var skill = RivalData.Skills.find(function (skill) {
                return skill.SkillPrototype_ID === model.SkillPrototype_ID;
            });
            if (skill) {
                //下修魔力
                if (skill.MpCost > 0) this.AttributeUpdateBloodOrMagic('Rival', 'MP', -skill.MpCost);
            }
        } else {
            var skill = ProtagonistData.Skills.find(function (skill) {
                return skill.SkillPrototype_ID === model.SkillPrototype_ID;
            });
            if (skill) {
                //下修魔力
                if (skill.MpCost > 0) this.AttributeUpdateBloodOrMagic('Protagonist', 'MP', -skill.MpCost);
            }
        }

        //主角動畫
        this.scheduleOnce(function delay(params) {
            //todo 顯示攻擊提示
            this.AttackShowSkillTipLayer(name, model.SkillPrototype_Name);
            if (model.SkillPrototype_ID == 0) {
                if (model.Damage >= 0) {
                    console.log(self.AttackSelfLayer);
                    if (self.AttackSelfLayer) {
                        if (name === RivalData.Name) this.EnemyLayerControl.doNormalAttack();//如果是對手施放 spine 才需要做動畫
                        this.AttackSelfLayer.getComponent('AttackSelfControl').useNormalAttackAnimation(1, 1);
                    }
                } else {
                    //閃避 提示 AttackShowDodge
                    var description = '成功闪过 ' + model.SkillPrototype_Name;
                    this.AttackShowDodge(description);
                    if (self.AttackSelfLayer) {
                        if (name === RivalData.Name) this.EnemyLayerControl.doNormalAttack();//如果是對手施放 spine 才需要做動畫
                        this.AttackSelfLayer.getComponent('AttackSelfControl').useNormalAttackAnimation(1, 1);
                    }
                }
            } else {
                if (model.Damage >= 0) {
                    //todo 顯示攻擊提示
                    this.AttackShowSkillTipLayer(name, model.SkillPrototype_Name);
                    console.log(self.AttackSelfLayer);
                    if (self.AttackSelfLayer) {
                        if (name === RivalData.Name) this.EnemyLayerControl.doSkillAttack();//如果是對手施放 spine 才需要做動畫
                        this.AttackSelfLayer.getComponent('AttackSelfControl').useSkillAnimation(model.SkillPrototype_ID);
                    }
                } else {
                    //閃避 提示 AttackShowDodge
                    var description = '成功闪过 ' + model.SkillPrototype_Name;
                    this.AttackShowDodge(description);

                    if (self.AttackSelfLayer) {
                        if (name === RivalData.Name) this.EnemyLayerControl.doSkillAttack();//如果是對手施放 spine 才需要做動畫
                        this.AttackSelfLayer.getComponent('AttackSelfControl').useSkillAnimation(model.SkillPrototype_ID);
                    }
                }
            }

            //todo 主角扣血 需延遲
            // var skill = RivalData.Skills.find(function (skill) {
            //     return skill.SkillPrototype_ID === model.SkillPrototype_ID;
            // });
            // var limit = 0;
            // if (skill) limit = skill.AttackTimes;//動畫執行時間
            // if (!limit || limit <= 0) limit = 1;

            //SkillUtils
            var skill = SkillUtils.getSkillData().find(function (skill) {
                return skill.ID == model.SkillPrototype_ID;
            });
            var limit = 0;
            if (skill) limit = skill.TimeSecond;//動畫執行時間
            if (!limit || limit <= 0) limit = 1;
            if (model.Damage > 0) {
                this.scheduleOnce(function delay(params) {
                    //扣主角的血
                    this.AttributeUpdateBloodOrMagic('Protagonist', 'HP', -model.Damage);
                }, limit);
            }
        }, 0.5);

    },

    //todo 執行主角攻擊動畫後 [新增狀態]
    ProtagonistAfterAttack(model, name) {
        //model = effect
        var SkillTitle = ArenaUtils.getAttrTitle(model.Element);//技能對應中文
        console.log('name:' + name);
        console.log('Element:' + ArenaUtils.getAttrTitle(model.Element));
        console.log('SourceName:' + model.SourceName);

        var description = name + "\n受到" + model.SourceName
            + "的影响\n造成" + SkillTitle
            + (model.Value >= 0 ? "增加" + model.Value + "点" : "损失" + (-model.Value) + "点")
            + "持续" + model.Rounds + "回合";

        this.AttackShowStatusDescriptionLayer(description, 'Protagonist', model);
    },

    //todo 執行對手 攻擊前事件處理
    RivalBeforeAttack(model) {
        //對手增減屬性
        if (model.Element === 'HP' || model.Element === 'MP') {
            //HP MP 增減
            this.AttributeUpdateBloodOrMagic('Rival', model.Element, model.Value);
        } else {
            //其他屬性
        }

        //狀態前動作 delay 0.5秒
        this.scheduleOnce(function delay(params) {
            this.ActionFinishCallback();
        }, 0.5);

    },


    //todo 執行攻擊對手動畫 [對手身上]
    RivalAttackAnimation(model, name) {
        var RivalData = this.socketControl.getComponent('SocketIoCtrl').getRivalData();
        var ProtagonistData = this.socketControl.getComponent('SocketIoCtrl').getParticipantData();

        //耗魔    
        if (name === RivalData.Name) {
            var skill = RivalData.Skills.find(function (skill) {
                return skill.SkillPrototype_ID === model.SkillPrototype_ID;
            });
            if (skill) {
                //下修魔力
                if (skill.MpCost > 0) this.AttributeUpdateBloodOrMagic('Rival', 'MP', -skill.MpCost);
            }
        } else {
            var skill = ProtagonistData.Skills.find(function (skill) {
                return skill.SkillPrototype_ID === model.SkillPrototype_ID;
            });
            if (skill) {
                //下修魔力
                if (skill.MpCost > 0) this.AttributeUpdateBloodOrMagic('Protagonist', 'MP', -skill.MpCost);
            }
        }

        //主角動畫
        this.scheduleOnce(function delay(params) {

            //動畫
            if (model.SkillPrototype_ID == 0) {
                if (model.Damage >= 0) {
                    //todo 顯示攻擊提示
                    this.AttackShowSkillTipLayer(name, model.SkillPrototype_Name);
                    console.log(self.AttackEnemyLayer);

                    if (name === RivalData.Name) this.EnemyLayerControl.doSkillAttack();//如果是對手施放 spine 才需要做動畫
                    if (name !== RivalData.Name) this.EnemyLayerControl.doHit();//受到攻擊動作

                    if (self.AttackEnemyLayer) {
                        this.AttackEnemyLayer.getComponent('AttackEnemyControl').useNormalAttackAnimation(1, 1);
                    }
                } else {
                    //閃避 提示 AttackShowDodge
                    var description = RivalData.Name + ' 成功閃過 ' + model.SkillPrototype_Name;
                    this.AttackShowDodge(description);

                    if (self.AttackEnemyLayer) {
                        this.AttackEnemyLayer.getComponent('AttackEnemyControl').useNormalAttackAnimation(1, 1);
                    }
                }
            } else {
                if (model.Damage >= 0) {
                    //todo 顯示攻擊提示
                    this.AttackShowSkillTipLayer(name, model.SkillPrototype_Name);
                    console.log(self.AttackEnemyLayer);

                    if (name === RivalData.Name) this.EnemyLayerControl.doSkillAttack();//如果是對手施放 spine 才需要做動畫
                    if (name !== RivalData.Name) this.EnemyLayerControl.doHit();//受到攻擊動作

                    if (self.AttackEnemyLayer) {
                        this.AttackEnemyLayer.getComponent('AttackEnemyControl').useSkillAnimation(model.SkillPrototype_ID);
                    }
                } else {
                    //閃避 提示 AttackShowDodge
                    var description = RivalData.Name + ' 成功閃過 ' + model.SkillPrototype_Name;
                    this.AttackShowDodge(description);
                    if (self.AttackEnemyLayer) {
                        this.AttackEnemyLayer.getComponent('AttackEnemyControl').useSkillAnimation(model.SkillPrototype_ID);
                    }
                }
            }

            //todo 主角扣血
            // var skill = ProtagonistData.Skills.find(function (skill) {
            //     return skill.SkillPrototype_ID > model.SkillPrototype_ID;
            // });
            // var limit = 0;
            // if (skill) limit = skill.AttackTimes;//動畫執行時間
            // if (!limit || limit <= 0) limit = 1;
            //SkillUtils
            var skill = SkillUtils.getSkillData().find(function (skill) {
                return skill.ID == model.SkillPrototype_ID;
            });
            var limit = 0;
            if (skill) limit = skill.TimeSecond;//動畫執行時間
            if (!limit || limit <= 0) limit = 1;
            if (model.Damage > 0) {
                this.scheduleOnce(function delay(params) {
                    //扣對手的血
                    this.AttributeUpdateBloodOrMagic('Rival', 'HP', -model.Damage);
                }, limit);
            }
        }, 0.5);
    },

    //todo 執行對手攻擊動畫 [新增狀態]
    RivalAfterAttack(model, name) {
        //model = effect
        var SkillTitle = ArenaUtils.getAttrTitle(model.Element);//技能對應中文
        console.log('name:' + name);
        console.log('Element:' + ArenaUtils.getAttrTitle(model.Element));
        console.log('SourceName:' + model.SourceName);
        //todo 
        var description = name + "\n受到" + model.SourceName
            + "的影响\n造成" + SkillTitle
            + (model.Value >= 0 ? "增加" + model.Value + "点" : "损失" + (-model.Value) + "点")
            + "持续" + model.Rounds + "回合";

        this.AttackShowStatusDescriptionLayer(description, 'Rival', model);
    },

    //更新個人總狀態列
    UpdateStatusLayer(model) {
        var ProtagonistRoundEndEffect = model.ProtagonistRoundEndEffect;
        var RivalRoundEndEffect = model.RivalRoundEndEffect;
        //更新主角本身狀態小圖
        this.AttributeControl.UpdateStatusNodeWithProtagonistAvatar(ProtagonistRoundEndEffect.StatusList);
        //更新對手狀態小圖
        this.AttributeControl.UpdateStatusNodeWithRivalAvatar(RivalRoundEndEffect.StatusList);
        //
        this.ActionFinishCallback();


    },

    /**
     * ------------------------------------- 對手節點
     */
    
    //顯示對手
    ShowRivalControl() {
        if (!this.EnemyLayer) this.EnemyLayer = this.node.getChildByName('EnemyLayer');
        if (!this.EnemyLayerControl) this.EnemyLayerControl = this.EnemyLayer.getComponent('EnemyLayerControl');

        var RivalData = this.socketControl.getComponent('SocketIoCtrl').getRivalData();
        //性別
        var gender = RivalData.MemberRole_Gender == false ? 'male' : 'female';
        //套裝屬性
        var armorType = RivalData.ArmorType == 0 ? 7 : RivalData.ArmorType;
        //武器屬性 'Weapon/ax01' 'Weapon/ax01'
        var weaponType = RivalData.WeaponType == 0 ? 1 : RivalData.WeaponType;
        
        //初始化對手
        this.EnemyLayerControl.init('0706Player', 'role', gender, (armorType == 6) ? 'A01' : 'A02', (weaponType == 1) ? 'Weapon/sword01' : 'Weapon/ax01');
        // this.EnemyLayerControl.init('0706Player', 'role','male', 'A01',  'Weapon/sword01');
    },


    /**
     * 結束
     */

    addFinishLayer(resultData) {
        //itemBar 消失
        this.AttributeItemsLayerShowOrNot(false);
        //計時器消失
        this.AttributeLayerNode.getChildByName('TopicCountLayer').active = false;
        //人物消失
        this.EnemyLayer.active = false;


        //顯示 結束畫面
        //檢視對象
        var socketID = this.socketControl.getComponent('SocketIoCtrl').getSocketId();
        //取得玩家本身的資訊
        var finishResult = resultData.find(result => result.HubConnectID === socketID);
        //紀錄結束資訊
        this.ArenaDataComponent.ArenaGameFinishData = finishResult.AnswerList;
        //
        if (finishResult.isWinner) {
            this.ArenaFinishGameLayerControl.showVictory(finishResult);//勝利
        } else {
            this.ArenaFinishGameLayerControl.showLose();//輸
        }
    },

    // start() {},

    // update (dt) {},
});
