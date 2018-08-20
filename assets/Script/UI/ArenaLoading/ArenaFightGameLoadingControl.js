
var self;
var ArenaCallback;//監聽
cc.Class({
    extends: cc.Component,

    properties: {

        LoadingAnimation: {
            default: null,
            type: cc.Animation,
        },

        AlertDialogPreFab: {
            default: null,
            type: cc.Prefab,
        },

        LoadingStart: {
            default: null,
            url: cc.AudioClip
        },

        LoadingEnd: {
            default: null,
            url: cc.AudioClip
        },

        people_pair: {
            default: null,
            url: cc.AudioClip
        },

        people_show: {
            default: null,
            url: cc.AudioClip
        },


        time: {
            default: null,
            url: cc.AudioClip
        },

        time_0: {
            default: null,
            url: cc.AudioClip
        },

        vs: {
            default: null,
            url: cc.AudioClip
        },

        vs2: {
            default: null,
            url: cc.AudioClip
        },
    },
    //

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    init() {
        self = this;
    },

    //設定監聽
    setArenaCallback(cal) {
        ArenaCallback = cal;
        this.LoadProgress = this.node.getChildByName('LoadProgress').getComponent(cc.ProgressBar);
        this.LoadProgress.progress = 0;
        //
        this.LoadControl = cc.find('LoadControl');
        if (this.LoadControl) {
            console.log(this.LoadControl);
            this.LoadControl.getComponent('LoadControl').init(this.LoadCall);
        }
    },

    //
    LoadCall(progressRate) {
        //
        if (progressRate < 1) {
            //todo顯示進度
            // console.log('進度：'+progressRate);
            self.LoadProgress.progress = progressRate;
        } else if (progressRate == 1) {
            // console.log('進度：'+progressRate);
            console.log('準備執行倒數');
            //動畫音效已經配置到定位
            //執行倒數
            self.scheduleOnce(function changePeople(params) {
                this.showLoadingCountingStart();
            }, 1);
        }
    },

    //設定主角資訊
    setRoleData(RoleData) {
        this.RoleAttributeBgLayer = this.node.getChildByName('AttributeLayer').getChildByName('RoleAttributeBgLayer');
        this.RoleHead = this.RoleAttributeBgLayer.getChildByName('Head');
        this.RoleAttrLayer = this.RoleAttributeBgLayer.getChildByName('attrLayer');

        //設定漸顯
        var HeadfadeInAction = cc.fadeIn(0.5);
        var AttrfadeInAction = cc.fadeIn(0.5);
        this.RoleHead.runAction(HeadfadeInAction);
        this.RoleAttrLayer.runAction(AttrfadeInAction);

        //設定層級圖示
        this.setTitleBg(this.RoleHead, RoleData.Background_ID, RoleData.MemberRoleImg_URL);
        //設定資料
        this.setAttribute(this.RoleHead, this.RoleAttrLayer, RoleData);
        //設定配對中的動畫與計時
        this.scheduleOnce(function delay(params) {
            this.showPairScroll();
            this.showTime();
        }, 1);
    },

    //設定對手資訊
    setRivalData(RivalData) {
        console.log(RivalData);
        this.RivalAttributeBgLayer = this.node.getChildByName('AttributeLayer').getChildByName('RivalAttributeBgLayer');
        this.RoleHead = this.RivalAttributeBgLayer.getChildByName('Head');
        this.RoleAttrLayer = this.RivalAttributeBgLayer.getChildByName('attrLayer');

        //設定層級圖示
        this.setTitleBg(this.RoleHead, RivalData.Background_ID, RivalData.MemberRoleImg_URL);
        //設定資料
        this.setAttribute(this.RoleHead, this.RoleAttrLayer, RivalData);

        //延遲
        this.scheduleOnce(function setData() {
            this.StopPairScrollFinish();//配對成功
        }, 0.5);
    },

    //設定資料
    setAttribute(HeadNode, AttrNode, RivalData) {

        //等級
        HeadNode.getChildByName('LevelBg').getChildByName('LevelLabel').getComponent(cc.Label).string = RivalData.MemberRole_Lv;
        //姓名
        AttrNode.getChildByName('NameLayer').getChildByName('NameLayer').getChildByName('NameLabel').getComponent(cc.Label).string = RivalData.Name;
        //稱號
        AttrNode.getChildByName('DesignationLayer').getChildByName('DesignationLayer').getChildByName('DesignationLabel').getComponent(cc.Label).string = RivalData.ArenaTitle_Name;
        //姓名
        AttrNode.getChildByName('WinLayer').getChildByName('WinLayer').getChildByName('WinLabel').getComponent(cc.Label).string = RivalData.RoleWinScore;
        //稱號
        AttrNode.getChildByName('CombatLayer').getChildByName('CombatLayer').getChildByName('CombatLabel').getComponent(cc.Label).string = RivalData.FightScore;

    },

    //設定層級圖示
    setTitleBg(HeadNode, UserTitleID, avatarPath) {
        var AvatarBgPath = '';
        var LevelBgPath = '';
        var AvatarPath = avatarPath;
        switch (UserTitleID) {
            case 1:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head1.png';
                LevelBgPath = '/Texture/protagonist/AttributeArea_head_bg/role1_level.png';//
                break;
            case 2:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head2.png';
                LevelBgPath = '/Texture/protagonist/AttributeArea_head_bg/role2_level.png';//
                break;
            case 3:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head3.png';
                LevelBgPath = '/Texture/protagonist/AttributeArea_head_bg/role3_level.png';//
                break;
            case 4:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head4.png';
                LevelBgPath = '/Texture/protagonist/AttributeArea_head_bg/role4_level.png';//
                break;
            case 5:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head5.png';
                LevelBgPath = '/Texture/protagonist/AttributeArea_head_bg/role5_level.png';//
                break;
            default:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head1.png';
                LevelBgPath = '/Texture/protagonist/AttributeArea_head_bg/role1_level.png';//
                break;
        }

        // AvatarBg
        if (AvatarBgPath != '') {
            //
            cc.loader.loadRes(AvatarBgPath, cc.SpriteFrame, function (err, sp) {
                //console.log(sp);
                //console.log(err);
                if (err) {
                    return;
                } else {
                    
                    HeadNode.getComponent(cc.Sprite).spriteFrame = sp;
                }
            });
        }

        // LevelBgPath
        if (LevelBgPath != '') {
            //
            cc.loader.loadRes(LevelBgPath, cc.SpriteFrame, function (err, sp) {
                //console.log(sp);
                //console.log(err);
                if (err) {
                    return;
                } else {
                    HeadNode.getChildByName('LevelBg').getComponent(cc.Sprite).spriteFrame = sp;
                }
            });
        }

        if (avatarPath !== '') {
            //頭像
            cc.loader.load(avatarPath, function (err, tex) {
                if (err) {
                    //console.log(err);
                } else {
                    //todo 暫時不顯示
                    var spf = new cc.SpriteFrame();
                    spf.initWithTexture(tex);
                    // HeadNode.getChildByName('HeadPhoto').getComponent(cc.Sprite).spriteFrame = spf;
                }
            });
        }

    },

    //離開配對
    LeavaPair() {
        if (!this.LeaveBtn) return;//
        if (!this.LeavaPairCanClick) {
            this.LeavaPairCanClick = true;
        } else {
            return;
        }
        console.log('LeavaPair');
        this.isLeave = false;
        //停止現在的所有計時器
        this.unscheduleAllCallbacks();

        //加入一個show
        this.Toast = cc.instantiate(this.AlertDialogPreFab);
        this.node.addChild(this.Toast);
        this.Toast.getComponent('AlertDialog').setLabel('系統請求中');
        this.Toast.getComponent('AlertDialog').show();
        this.Toast.setLocalZOrder(10);

        //暫停現在還在執行的動畫
        this.node.getComponent(cc.Animation).pause();
        //暫停配對計時
        this.pauseTime();
        //像後台請求
        ArenaCallback('FightLoading', 'LeavePair', this.LeavePairCall);
    },

    //是否離開成功
    LeavePairCall(isLeave) {
        if (isLeave) {
            //離開
            self.isLeave = true;
            //停止現在的所有計時器 [防呆避免當下還有其他被重新呼叫的計時器]
            self.unscheduleAllCallbacks();
            //
            self.Toast.getComponent('AlertDialog').Gone();
            //執行離開動畫
            self.showLoadingEndStart();
        } else {
            //已經配對
            self.Toast.getComponent('AlertDialog').setLabel('系統已經配對');
            self.scheduleOnce(function name(params) {
                this.Toast.getComponent('AlertDialog').Gone();
            }, 1);

        }
    },

    //執行 loadingStart animation
    showLoadingStart() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[2].name);
    },
    //listener loadingStart finish
    showLoadingStartFinish() {
        console.log('showLoadingStartFinish');
    },
    //火焰燃燒
    showFire() {
        this.showLoadingVsStart();//火焰
    },

    //顯示時間
    showTime() {
        this.TimeCount = 0;//計數加總

        //TimeLayer visiable
        var fadeInAction = cc.fadeIn(0.5);
        if (!this.TimeLayer) this.TimeLayer = this.node.getChildByName('AttributeLayer').getChildByName('RivalAttributeBgLayer').getChildByName('PairScrollLayer').getChildByName('TimeLayer');
        this.TimeLayer.runAction(fadeInAction);
        //LeaveBtn visiable
        var btnfadeInAction = cc.fadeIn(0.5);
        if (!this.LeaveBtn) this.LeaveBtn = this.node.getChildByName('AttributeLayer').getChildByName('AttributeLayerVsBgLayer').getChildByName('number_bg').getChildByName('LeaveBtn');
        this.LeaveBtn.runAction(btnfadeInAction);

        //運用 label 來執行 計數
        this.TimeLayer.getChildByName('TimerLabel').getComponent(cc.Label).schedule(function (params) {
            self.TimeCount++;
            let minute = Math.floor(self.TimeCount / 60);
            let second = Math.floor(self.TimeCount % 60);
            let minuteStr = minute > 9 ? minute + "" : "0" + minute;
            let secondStr = second > 9 ? second + "" : "0" + second;
            //
            this.string = minuteStr + " : " + secondStr;

            //機器人請求
            if (self.TimeCount == 3) {
                self.doMachinePair();
            }

        }, 1);
    },

    //暫停時間計時
    pauseTime() {
        //取消這個組件的所有計時器
        this.TimeLayer.getChildByName('TimerLabel').getComponent(cc.Label).unscheduleAllCallbacks();
    },

    //暫停時間計時
    StartTime() {
        //運用 label 來執行 計數
        this.TimeLayer.getChildByName('TimerLabel').getComponent(cc.Label).schedule(function (params) {
            self.TimeCount++;
            let minute = Math.floor(self.TimeCount / 60);
            let second = Math.floor(self.TimeCount % 60);
            let minuteStr = minute > 9 ? minute + "" : "0" + minute;
            let secondStr = second > 9 ? second + "" : "0" + second;
            this.string = minuteStr + " : " + secondStr;


        }, 1);
    },

    //顯示時間
    FinishTime() {
        this.TimeCount = 0;//計數加總
        //
        var fadeOutAction = cc.fadeOut(0.5);
        if (!this.TimeLayer) this.TimeLayer = this.node.getChildByName('AttributeLayer').getChildByName('RivalAttributeBgLayer').getChildByName('PairScrollLayer').getChildByName('TimeLayer');
        this.TimeLayer.runAction(fadeOutAction);
        //LeaveBtn visiable
        var btnfadeOutAction = cc.fadeOut(0.5);
        if (!this.LeaveBtn) this.LeaveBtn = this.node.getChildByName('AttributeLayer').getChildByName('AttributeLayerVsBgLayer').getChildByName('number_bg').getChildByName('LeaveBtn');
        this.LeaveBtn.runAction(btnfadeOutAction);

        //取消這個組件的所有計時器
        this.TimeLayer.getChildByName('TimerLabel').getComponent(cc.Label).unscheduleAllCallbacks();
    },

    //請求機器人配對
    doMachinePair() {
        console.log('loading doMachinePair');
        if (ArenaCallback) ArenaCallback('FightLoading', 'doMachinePair', null);
    },

    //顯示配對
    showPairScroll() {
        var action = cc.fadeIn(1.0);
        this.node.getChildByName('AttributeLayer').getChildByName('RivalAttributeBgLayer').getChildByName('PairScrollLayer').runAction(action);//漸漸出現
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[5].name);
    },

    //配對停止配對
    StopPairScrollFinish() {
        var action = cc.fadeOut(1.0);
        this.node.getChildByName('AttributeLayer').getChildByName('RivalAttributeBgLayer').getChildByName('PairScrollLayer').runAction(action);//漸漸出現
        //延遲
        this.scheduleOnce(function changePeople(params) {
            this.node.getComponent(cc.Animation).stop(this.node.getComponent(cc.Animation)._clips[5].name);
            this.showLoadingAddPeople();
        }, 1);
    },

    //執行 LoadingAddPeople animation
    showLoadingAddPeople() {
        console.log('showLoadingAddPeople');
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[4].name);
    },
    //listener loadingAddPeople finish
    showLoadingAddPeopleFinish() {
        // this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[2].name);
        console.log('showLoadingAddPeopleFinish');
        //todo執行加載數據
        this.LoadSkillAtlas();
    },

    //執行 LoadingCountingStart animation
    showLoadingCountingStart() {
        console.log('showLoadingCountingStart');
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[0].name);
    },
    //listener LoadingCountingStart finish
    showLoadingCountingStartFinish() {
        // this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[2].name);
        console.log('showLoadingCountingStartFinish');
        this.showLoadingEndStart();
    },

    //執行 LoadingVsStart animation
    showLoadingVsStart() {
        console.log('showLoadingVsStart');
        var action = cc.fadeIn(1.0);
        this.node.getChildByName('AttributeLayer').getChildByName('VsBgAnimation').runAction(action);//漸漸出現
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[1].name);
    },
    //執行 LoadingVsStart animation
    StopLoadingVsStart() {
        console.log('StopLoadingVsStart');
        var action = cc.fadeOut(0.5);
        this.node.getChildByName('AttributeLayer').getChildByName('VsBgAnimation').runAction(action);//漸漸出現
        this.scheduleOnce(function name(params) {
            this.node.getComponent(cc.Animation).stop(this.node.getComponent(cc.Animation)._clips[1].name);
        }, 0.3);
    },
    //listener LoadingVsStart finish
    showLoadingVsStartFinish() {
        // null
        console.log('showLoadingVsStartFinish');
    },

    //執行 LoadingEnd animation
    showLoadingEndStart() {
        console.log('showLoadingEndStart');
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[3].name);
        this.StopLoadingVsStart();//停止火焰
    },
    //listener LoadingEnd finish
    showLoadingEndFinish() {
        console.log('showLoadingEndFinish');
        if (this.isLeave && this.isLeave == true) {
            console.log('離開配對');
            ArenaCallback('FightLoading', 'showLoadingEndFinish', 'leave');
            this.node.destroy();
        } else {
            console.log('一般結束');
            ArenaCallback('FightLoading', 'showLoadingEndFinish', 'pair');
            this.node.destroy();
        }
    },


    //開始loading
    audio_LoadingStart() {
        if (this.doorClose) {
            cc.audioEngine.playEffect(this.LoadingStart, false, 0.7);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/people_show.mp3', function load(err, audioclip) {
                self.doorClose = audioclip;
                cc.audioEngine.playEffect(self.LoadingStart, false, 0.8);
            });
        }
    },

    //結束loading
    audio_LoadingEnd() {
        if (this.doorClose) {
            cc.audioEngine.playEffect(this.LoadingEnd, false, 0.7);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/open.mp3', function load(err, audioclip) {
                self.doorClose = audioclip;
                cc.audioEngine.playEffect(self.LoadingEnd, false, 0.8);
            });
        }
    },

    //顯示玩家
    audio_pair() {
        if (this.people_pair) {
            cc.audioEngine.playEffect(this.people_pair, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/people_wait.mp3', function load(err, audioclip) {
                self.people_show = audioclip;
                cc.audioEngine.playEffect(self.people_pair, false, 0.8);
            });
        }
    },


    //顯示玩家
    audio_people_show() {
        if (this.people_show) {
            cc.audioEngine.playEffect(this.people_show, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/findpeople_alert.mp3', function load(err, audioclip) {
                self.people_show = audioclip;
                cc.audioEngine.playEffect(self.people_show, false, 0.8);
            });
        }
    },


    //倒數時間
    audio_time() {
        if (this.time) {
            cc.audioEngine.playEffect(this.time, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/time.mp3', function load(err, audioclip) {
                self.time = audioclip;
                cc.audioEngine.playEffect(self.time, false, 0.8);
            });
        }
    },

    //倒數時間_0
    audio_time_0() {
        if (this.time_0) {
            cc.audioEngine.playEffect(this.time_0, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/time_0.mp3', function load(err, audioclip) {
                self.time_0 = audioclip;
                cc.audioEngine.playEffect(self.time_0, false, 0.8);
            });
        }
    },

    //vs
    audio_vs() {
        if (this.vs) {
            cc.audioEngine.playEffect(this.vs, false, 1);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/vs.mp3', function load(err, audioclip) {
                self.vs = audioclip;
                cc.audioEngine.playEffect(self.vs, false, 0.8);
            });
        }
    },

    //vs
    audio_vs2() {
        if (this.vs2) {
            cc.audioEngine.playEffect(this.vs2, false, 1);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/vs2.mp3', function load(err, audioclip) {
                self.vs2 = audioclip;
                cc.audioEngine.playEffect(self.vs2, false, 0.8);
            });
        }
    },

    // todo執行加載數據方法
    LoadSkillAtlas() {
        //取得socketIO
        var socketControl = cc.find('SocketControl');
        if (socketControl) {
            var ParticipantData = socketControl.getComponent('SocketIoCtrl').getParticipantData();
            var RivalData = socketControl.getComponent('SocketIoCtrl').getRivalData();
            if (this.LoadControl) {
                this.LoadControl.getComponent('LoadControl').loadSelfSkill(RivalData.Skills);//下載對手技能圖集 敵對我
                this.LoadControl.getComponent('LoadControl').loadEnemySkill(ParticipantData.Skills);//下載我方技能圖集 我對敵
                this.LoadControl.getComponent('LoadControl').loadNormalAttack(//下載普通攻擊
                    ParticipantData.WeaponType, ParticipantData.AtkCrystal,
                    RivalData.WeaponType, RivalData.AtkCrystal);
                this.LoadControl.getComponent('LoadControl').LoadPath();//下載
                this.LoadControl.getComponent('LoadControl').preloadAudio();//預加載音效黨
            }else{
                console.log('LoadControl not exit');
            }
        } else {
            console.log('socketControl not exit');
        }
    },

    start() {

    },

    // update (dt) {},
});
