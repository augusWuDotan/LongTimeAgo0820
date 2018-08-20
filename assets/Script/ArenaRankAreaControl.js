var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //----------------- 選 看自己排名 或是 多人排名
        ArenaShowSelf: {
            default: null,
            type: cc.Node
        },
        ArenaShowPerson: {
            default: null,
            type: cc.Node
        },
        SelfPress: {
            default: null,
            type: cc.SpriteFrame
        },
        SelfNormal: {
            default: null,
            type: cc.SpriteFrame
        },
        PersonPress: {
            default: null,
            type: cc.SpriteFrame
        },
        PersonNormal: {
            default: null,
            type: cc.SpriteFrame
        },
        //-----------------
        //----------------- reword , daily , weekly use spriteframe
        rewordPress: {
            default: null,
            type: cc.SpriteFrame
        },
        rewordNormal: {
            default: null,
            type: cc.SpriteFrame
        },
        dailyPress: {
            default: null,
            type: cc.SpriteFrame
        },
        dailyNormal: {
            default: null,
            type: cc.SpriteFrame
        },
        weeklyPress: {
            default: null,
            type: cc.SpriteFrame
        },
        weeklyNormal: {
            default: null,
            type: cc.SpriteFrame
        },
        //-----------------
        //----------------- Group
        GroupContent: {
            default: null,
            type: cc.Node
        },
        //-----------------

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //取得memberID 預設3
        this.memberId = 3;
        this.ConnectData = null;
        // console.log(cc.game._sceneInfos);
        self = this;
        //漸顯
        this.node.opacity = 0;
        var action = cc.fadeIn(1.0);
        this.node.runAction(action);

        //提醒
        this.AlertTipLayer = cc.find('AlertTipeLayer');

        //取得socketIO
        this.socketControl = cc.find('SocketControl');
        if (this.socketControl) {
            this.socketControl.getComponent('SocketIoCtrl').setArenaCallBack(this.ArenaCallBack);
        }

        //競技場的資料
        this.ArenaData = cc.find('ArenaData');
        if (this.ArenaData) {
            console.log('this.ArenaData is init');
            this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
        }

        //背景音控制
        this.AudioControl = cc.find('AudioControl');
        if (this.AudioControl) {
            console.log('this.AudioControl is init');
            //todo ArenaList 背景音樂
            this.AudioControl.getComponent('AudioControl').PlayArenaList();
        }


        //---- 預設[倒數時間 node 動畫]
        this.rule_bg = this.node.getChildByName('arena_rule_bg');
        this.scheduleOnce(function delaytime(params) {
            self.rule_bg.getComponent(cc.Animation).play(self.rule_bg.getComponent(cc.Animation)._clips[0].name);
        }, 0.5);

        //---- 預設[看排名案件]
        this.ArenaShowPerson.getComponent(cc.Sprite).spriteFrame = this.PersonPress;
        this.ArenaShowSelf.getComponent(cc.Sprite).spriteFrame = this.SelfNormal;
        this.initShowRankTypeBtnTouch();//初始化看各人排名或是所有人的排名 點擊事件

        //---- 個人或是所有
        this.ShowRankLayer = this.node.getChildByName('showRankLayer');
        if (this.ShowRankLayer) this.ShowRankLayer.getComponent('showRankControl').init();

        //倒數時間組件
        this.rule_bg_ten_hour = this.rule_bg.getChildByName('hour_Ten');
        this.rule_bg_hour = this.rule_bg.getChildByName('hour_single');
        this.rule_bg_ten_minute = this.rule_bg.getChildByName('minute_Ten');
        this.rule_bg_minute = this.rule_bg.getChildByName('minute_single');
        this.rule_bg_ten_second = this.rule_bg.getChildByName('second_Ten');
        this.rule_bg_second = this.rule_bg.getChildByName('second_single');
        var milliseconds_debug = 15000000;
        this.isOpenArena = false;//true 開啟競技場倒數 ; false 關閉競技場倒數
        this.doReciprocalTime(milliseconds_debug);

        //reword | daily | weekly
        this.ListStatus = 'daily';
        this.rewordTab = this.node.getChildByName('GroupTab').getChildByName('tab_reward');
        this.dailyTab = this.node.getChildByName('GroupTab').getChildByName('tab_daily');
        this.weeklyTab = this.node.getChildByName('GroupTab').getChildByName('tab_weekly');
        this.initRankTabTouch();//初始化TAB

        //groupContent
        this.RankItem = cc.find('RankItem');
        this.addDailyRankData();

        //寶箱 ＆ 進度條
        this.TreasureLayerControl = this.node.getChildByName('TreasureLayer').getComponent('TreasureLayerControl');
        this.TreasureLayerControl.init();

        //title
        this.ArenaTitle = this.node.getChildByName('ArenaTitle');

    },

    initShowRankTypeBtnTouch() {
        this.touchRankTypeNode = null;//觸摸和離開都是同一個按鍵
        this.currentRankTypeNode = this.ArenaShowPerson;//觸摸和離開都是同一個按鍵

        this.ArenaShowPerson.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log( 'ArenaShowPerson TOUCH_START');
            //console.log(event);
            if (event.target === self.currentRankTypeNode) {
                console.log('touch same');
            } else {
                self.touchRankTypeNode = event.target;
            }
            //
            self.ArenaShowPerson.scale = 0.85;
        }, this);
        this.ArenaShowPerson.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.ArenaShowPerson.scale = 1;
        }, this);
        this.ArenaShowPerson.on(cc.Node.EventType.TOUCH_END, function (event) {
            // console.log( 'ArenaShowPerson TOUCH_END');
            //console.log(event);
            if (event.target === self.currentRankTypeNode) {
                console.log('touch same');
            } else {
                if (self.touchRankTypeNode === event.target) {
                    self.currentRankTypeNode = event.target;
                    self.touchRankTypeNode = null;
                    self.ArenaShowPerson.getComponent(cc.Sprite).spriteFrame = self.PersonPress;
                    self.ArenaShowSelf.getComponent(cc.Sprite).spriteFrame = self.SelfNormal;
                    //todo 執行看所有
                    console.log('show person');
                    //
                    self.ShowRankLayer.getComponent('showRankControl').showPerson();
                }
            }
            self.ArenaShowPerson.scale = 1;
        }, this);


        this.ArenaShowSelf.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log( 'ArenaShowSelf TOUCH_START');
            //console.log(event);
            if (event.target === self.currentRankTypeNode) {
                console.log('touch same');
            } else {
                self.touchRankTypeNode = event.target;
            }
            self.ArenaShowSelf.scale = 0.85;
        }, this);
        this.ArenaShowSelf.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // console.log( 'ArenaShowSelf TOUCH_CANCEL');
            self.ArenaShowSelf.scale = 1;
        }, this);
        this.ArenaShowSelf.on(cc.Node.EventType.TOUCH_END, function (event) {
            // console.log('ArenaShowSelf TOUCH_END');
            //console.log(event);
            if (event.target === self.currentRankTypeNode) {
                console.log('touch same');
            } else {
                if (self.touchRankTypeNode === event.target) {
                    self.currentRankTypeNode = event.target;
                    self.touchRankTypeNode = null;
                    self.ArenaShowPerson.getComponent(cc.Sprite).spriteFrame = self.PersonNormal;
                    self.ArenaShowSelf.getComponent(cc.Sprite).spriteFrame = self.SelfPress;
                    //todo 執行看個人
                    console.log('show self');
                    self.ShowRankLayer.getComponent('showRankControl').showSelf();
                }
            }
            self.ArenaShowSelf.scale = 1;
        }, this);
    },

    initRankTabTouch() {
        this.touchTabNode = null;//觸摸和離開都是同一個按鍵
        this.currentTabNode = this.dailyTab;//觸摸和離開都是同一個按鍵
        this.dailyTab.getComponent(cc.Sprite).spriteFrame = this.dailyPress;

        this.rewordTab.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (event.target === self.currentTabNode) {
                console.log('touch same tab');
            } else {
                self.touchTabNode = event.target;
            }
            //
            self.rewordTab.scale = 0.85;
        }, this);
        this.rewordTab.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.rewordTab.scale = 1;
        }, this);
        this.rewordTab.on(cc.Node.EventType.TOUCH_END, function (event) {

            if (event.target === self.currentTabNode) {
                console.log('touch same tab');
            } else {
                if (self.touchTabNode === event.target) {
                    console.log('show reword');
                    let currentNodeName = self.currentTabNode.name;
                    console.log('currentNodeName:' + currentNodeName);
                    self.currentTabNode = event.target;
                    self.touchTabNode = null;
                    self.rewordTab.getComponent(cc.Sprite).spriteFrame = self.rewordPress;
                    if (currentNodeName == 'tab_daily') {
                        self.dailyTab.getComponent(cc.Sprite).spriteFrame = self.dailyNormal;
                    } else {
                        self.weeklyTab.getComponent(cc.Sprite).spriteFrame = self.weeklyNormal;
                    }
                    //todo show reword
                    self.TabReword();
                }
            }
            self.rewordTab.scale = 1;
        }, this);

        this.dailyTab.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (event.target === self.currentTabNode) {
                console.log('touch same tab');
            } else {
                self.touchTabNode = event.target;
            }
            //
            self.dailyTab.scale = 0.85;
        }, this);
        this.dailyTab.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.dailyTab.scale = 1;
        }, this);
        this.dailyTab.on(cc.Node.EventType.TOUCH_END, function (event) {

            if (event.target === self.currentTabNode) {
                console.log('touch same tab');
            } else {
                if (self.touchTabNode === event.target) {
                    console.log('show reword');
                    let currentNodeName = self.currentTabNode.name;
                    console.log('currentNodeName:' + currentNodeName);
                    self.currentTabNode = event.target;
                    self.touchTabNode = null;
                    self.dailyTab.getComponent(cc.Sprite).spriteFrame = self.dailyPress;
                    if (currentNodeName == 'tab_reward') {
                        self.rewordTab.getComponent(cc.Sprite).spriteFrame = self.rewordNormal;
                    } else {
                        self.weeklyTab.getComponent(cc.Sprite).spriteFrame = self.weeklyNormal;
                    }
                    //todo show day
                    self.TabDaily();
                }
            }
            self.dailyTab.scale = 1;
        }, this);

        this.weeklyTab.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (event.target === self.currentTabNode) {
                console.log('touch same tab');
            } else {
                self.touchTabNode = event.target;
            }
            //
            self.weeklyTab.scale = 0.85;
        }, this);
        this.weeklyTab.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.weeklyTab.scale = 1;
        }, this);
        this.weeklyTab.on(cc.Node.EventType.TOUCH_END, function (event) {

            if (event.target === self.currentTabNode) {
                console.log('touch same tab');
            } else {
                if (self.touchTabNode === event.target) {
                    console.log('show reword');
                    let currentNodeName = self.currentTabNode.name;
                    console.log('currentNodeName:' + currentNodeName);
                    self.currentTabNode = event.target;
                    self.touchTabNode = null;
                    self.weeklyTab.getComponent(cc.Sprite).spriteFrame = self.weeklyPress;
                    if (currentNodeName == 'tab_reward') {
                        self.rewordTab.getComponent(cc.Sprite).spriteFrame = self.rewordNormal;
                    } else {
                        self.dailyTab.getComponent(cc.Sprite).spriteFrame = self.dailyNormal;
                    }
                    //todo show week
                    self.TabWeekly();
                }
            }
            self.weeklyTab.scale = 1;
        }, this);
    },

    start() {
        var debugToken = '';
        if (this.socketControl) this.socketControl.getComponent('SocketIoCtrl').doConnect(this.ArenaDataComponent.getMemberID(), this.ArenaDataComponent.getArenaId(), false, debugToken);
    },

    onDestroy() {
        this.ArenaShowPerson.off(cc.Node.EventType.TOUCH_START);
        this.ArenaShowPerson.off(cc.Node.EventType.TOUCH_CANCEL);
        this.ArenaShowPerson.off(cc.Node.EventType.TOUCH_END);
        this.ArenaShowSelf.off(cc.Node.EventType.TOUCH_START);
        this.ArenaShowSelf.off(cc.Node.EventType.TOUCH_CANCEL);
        this.ArenaShowSelf.off(cc.Node.EventType.TOUCH_END);

    },


    ArenaCallBack(ComponentName, functionName, resultData) {
        //確定有資料或是null
        if (!ComponentName) return;
        if (!functionName) return;
        if (!resultData) return;

        switch (ComponentName) {
            case 'socket':
                self.SocketCallBack(functionName, resultData);
                break;

            default:
                break;
        }
    },

    SocketCallBack(functionName, resultData) {
        switch (functionName) {
            case 'disconnect':
                // this.AlertTipLayer.getComponent('Alert').LeaveFunc = function(){};//設定執行方法
                this.AlertTipLayer.getComponent('Alert').initErrorAlert('連線中斷' + resultData);
                this.AlertTipLayer.setPosition(960, 540);
                break;

            case 'ConncetCallback':
                //顯示rank資訊    
                // var action = cc.fadeIn(1.0);
                // self.btn.runAction(action);
                self.ConnectData = self.socketControl.getComponent('SocketIoCtrl').getConnectData();
                console.log(self.ConnectData);
                self.doInitView(self.ConnectData);

                break;
            case 'showRoom':
                //連線清單
                console.log('----RoomData');
                self.RoomData = self.socketControl.getComponent('SocketIoCtrl').getRoomData();
                console.log(self.RoomData);
                break;
            default:
                break;
        }
    },

    doInitView(ConnectData) {
        //標題標題標題
        self.ArenaTitle.getComponent(cc.Label).string = ConnectData.result_content.Arena_Name;
    },

    /**
     * //倒數時間 初始化
     * @param {*} ms 毫秒
     */
    doReciprocalTime(ms) {
        this.ms = ms / 1000;//秒

        let chour = Math.floor(this.ms / 3600);
        let tenhour = Math.floor(chour / 10);
        let hour = Math.floor(Math.floor(this.ms / 3600) % 10);

        let cminute = Math.floor(Math.floor(this.ms % 3600) / 60);
        let tenminute = Math.floor(cminute / 10);
        let minute = Math.floor(cminute % 10);

        let csecond = Math.floor(this.ms % 60);
        let tensecond = Math.floor(csecond / 10);
        let second = Math.floor(csecond % 10);

        this.showTime(tenhour, hour, tenminute, minute, tensecond, second);

        this.unschedule(this.startSchedule);
        this.schedule(this.startSchedule, 1);
    },

    //排程倒數
    startSchedule() {
        this.ms--;

        let chour = Math.floor(this.ms / 3600);
        let tenhour = Math.floor(chour / 10);
        let hour = Math.floor(Math.floor(this.ms / 3600) % 10);

        let cminute = Math.floor(Math.floor(this.ms % 3600) / 60);
        let tenminute = Math.floor(cminute / 10);
        let minute = Math.floor(cminute % 10);

        let csecond = Math.floor(this.ms % 60);
        let tensecond = Math.floor(csecond / 10);
        let second = Math.floor(csecond % 10);

        this.showTime(tenhour, hour, tenminute, minute, tensecond, second);
    },

    //顯示剩下時間
    showTime(hour_ten, hour, minute_ten, minute, second_ten, second) {
        if (hour_ten > 9) {
            let day = Math.floor((hour_ten * 10 + hour) / 24);
            let day_hour = Math.floor((hour_ten * 10 + hour) % 24);
            console.log(day + '天 ' + day_hour + '小時 ' + minute_ten + '' + minute + '分鐘 ' + second_ten + '' + second + '秒');
            this.rule_bg_ten_hour.getComponent(cc.Label).string = day + '\n天';
            this.rule_bg_hour.getComponent(cc.Label).string = day_hour + '\n時';
            this.rule_bg_ten_minute.getComponent(cc.Label).string = minute_ten + '';
            this.rule_bg_minute.getComponent(cc.Label).string = minute + '';
            this.rule_bg_ten_second.getComponent(cc.Label).string = second_ten + '';
            this.rule_bg_second.getComponent(cc.Label).string = second + '';
        } else {
            console.log(hour_ten + '' + hour + '小時 ' + minute_ten + '' + minute + '分鐘 ' + second_ten + '' + second + '秒');
            this.rule_bg_ten_hour.getComponent(cc.Label).string = hour_ten + '';
            this.rule_bg_hour.getComponent(cc.Label).string = hour + '';
            this.rule_bg_ten_minute.getComponent(cc.Label).string = minute_ten + '';
            this.rule_bg_minute.getComponent(cc.Label).string = minute + '';
            this.rule_bg_ten_second.getComponent(cc.Label).string = second_ten + '';
            this.rule_bg_second.getComponent(cc.Label).string = second + '';
        }

        if (hour_ten == 0 && hour == 0 && minute_ten == 0 && minute == 0 && second_ten == 0 && second == 0) {
            //
            if (this.isOpenArena) {
                console.log('開啟競技場');
            } else {
                console.log('關閉競技場');
            }
            this.unschedule(this.startSchedule);
        }
    },

    //todo reword tab
    TabReword() {
        this.addRewordRankData();
    },

    //todo Daily tab
    TabDaily() {
        this.addDailyRankData();
    },

    //todo Weekly tab
    TabWeekly() {
        this.addWeekRankData();
    },

    addRewordRankData() {
        this.GroupContent.removeAllChildren();//清除子項目
    },

    addDailyRankData() {
        this.GroupContent.removeAllChildren();//清除子項目

        for (let i = 0; i < 10; i++) {
            var item = cc.instantiate(this.RankItem);
            this.GroupContent.addChild(item);
            item.setPosition(cc.p(0, 0));
            item.getComponent('RankItem').init(i + 1, '北京大学', '吴小弟', 12, 100);
        }
    },

    addWeekRankData() {
        this.GroupContent.removeAllChildren();//清除子項目

        for (let i = 0; i < 10; i++) {
            var item = cc.instantiate(this.RankItem);
            this.GroupContent.addChild(item);
            item.setPosition(cc.p(0, 0));
            item.getComponent('RankItem').init(i + 1, '北京大学', '吴小弟', 14, 200);
        }
    },


    //todo 對戰規則
    FightRule() {
        console.log('fight rule');
    },

    //前往配對頁面
    goPair() {
        if (this.socketControl) {
            this.scheduleOnce(function (params) {
                cc.director.loadScene("FightArena");
            }, 0.5);
        }
    },

    Back() {
        if (this.socketControl) {
            this.scheduleOnce(function (params) {
                cc.director.loadScene("ArenaListAreaScene");
            }, 0.3);
        }
    },


    getData() {
        return {
            "result_status": false,
            "result_message": null,
            "result_content": {
                "Arena_ID": 2,
                "Type": "Event",
                "Arena_Name": "低年級競技場",
                "BeginDate": "2018-06-01T00:00:00",
                "EndDate": "2018-06-30T00:00:00",
                "DailyRank": [],
                "MonthRank": [],
                "SeasonRank": [],
                "TotalRank": [],
                "ArenaRewardModel": [
                    {
                        "RankMin": 1,
                        "RankMax": 1,
                        "PropsPrototype_ID": 10,
                        "RewardProps": {
                            "PropsPrototype_ID": 10,
                            "PropsPrototype_Name": "競技場神人寶箱",
                            "PropsType_ID": 2,
                            "PropsPrototype_Img": "",
                            "Description": "隨機獲得神人套裝一件"
                        },
                        "Count": 1
                    },
                    {
                        "RankMin": 2,
                        "RankMax": 2,
                        "PropsPrototype_ID": 8,
                        "RewardProps": {
                            "PropsPrototype_ID": 8,
                            "PropsPrototype_Name": "洗鍊藥水",
                            "PropsType_ID": 1,
                            "PropsPrototype_Img": "",
                            "Description": "重置角色配點點數"
                        },
                        "Count": 5
                    },
                    {
                        "RankMin": 3,
                        "RankMax": 3,
                        "PropsPrototype_ID": 8,
                        "RewardProps": {
                            "PropsPrototype_ID": 8,
                            "PropsPrototype_Name": "洗鍊藥水",
                            "PropsType_ID": 1,
                            "PropsPrototype_Img": "",
                            "Description": "重置角色配點點數"
                        },
                        "Count": 1
                    },
                    {
                        "RankMin": 4,
                        "RankMax": 100,
                        "PropsPrototype_ID": 18,
                        "RewardProps": {
                            "PropsPrototype_ID": 18,
                            "PropsPrototype_Name": "初級防禦增強卷軸",
                            "PropsType_ID": 4,
                            "PropsPrototype_Img": "",
                            "Description": "使用後，該場戰鬥持續增加自身防禦10%"
                        },
                        "Count": 3
                    },
                    {
                        "RankMin": 4,
                        "RankMax": 100,
                        "PropsPrototype_ID": 19,
                        "RewardProps": {
                            "PropsPrototype_ID": 19,
                            "PropsPrototype_Name": "初級敏捷增強卷軸",
                            "PropsType_ID": 4,
                            "PropsPrototype_Img": "",
                            "Description": "使用後，該場戰鬥持續增加自身敏捷10%"
                        },
                        "Count": 3
                    },
                    {
                        "RankMin": 4,
                        "RankMax": 100,
                        "PropsPrototype_ID": 20,
                        "RewardProps": {
                            "PropsPrototype_ID": 20,
                            "PropsPrototype_Name": "初級攻擊增強卷軸",
                            "PropsType_ID": 4,
                            "PropsPrototype_Img": "",
                            "Description": "使用後，該場戰鬥持續增加自身攻擊10%"
                        },
                        "Count": 3
                    },
                    {
                        "RankMin": 4,
                        "RankMax": 100,
                        "PropsPrototype_ID": 21,
                        "RewardProps": {
                            "PropsPrototype_ID": 21,
                            "PropsPrototype_Name": "初級精神增強卷軸",
                            "PropsType_ID": 4,
                            "PropsPrototype_Img": "",
                            "Description": "使用後，該場戰鬥持續增加自身精神10%"
                        },
                        "Count": 3
                    },
                    {
                        "RankMin": 101,
                        "RankMax": 9999,
                        "PropsPrototype_ID": 5,
                        "RewardProps": {
                            "PropsPrototype_ID": 5,
                            "PropsPrototype_Name": "白色藥水",
                            "PropsType_ID": 1,
                            "PropsPrototype_Img": "",
                            "Description": "恢復血量約300點(依角色恢復值增減)"
                        },
                        "Count": 500
                    }
                ],
                "ArenaProgressPointsModel": [
                    {
                        "ArenaProgressPoints_ID": 4,
                        "Wins": 50,
                        "AddPoints": 100
                    },
                    {
                        "ArenaProgressPoints_ID": 5,
                        "Wins": 100,
                        "AddPoints": 150
                    },
                    {
                        "ArenaProgressPoints_ID": 6,
                        "Wins": 150,
                        "AddPoints": 200
                    }
                ]
            }
        };
    },

    // update (dt) {},
});
