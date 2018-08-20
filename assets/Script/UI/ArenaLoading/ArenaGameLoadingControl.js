var self;
var ArenaCallback;//監聽
cc.Class({
    extends: cc.Component,

    properties: {
        LoadingAnimation: {
            default: null,
            type: cc.Animation,
        },

        open: {
            default: null,
            url: cc.AudioClip
        },

        people_show: {
            default: null,
            url: cc.AudioClip
        },

        doorClose: {
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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        /*
        這裡是 單機版對戰的正式loading
        這裡需要

        >（左上）
        >遊戲主角的 姓名、圖片、稱號，稱號會變更「圖片背景、姓名背景、稱號背景」
        
        >（兩側）
        >遊戲主角大圖、Boss大圖

        >（兩側下方）
        >遊戲主角戰力值、Boss戰力值    
        */
    },

    //設定監聽
    setArenaCallback(cal) {
        self = this;
        ArenaCallback = cal;
        // console.log(ArenaCallback);
    },

    //設定主角資訊
    setRoleData(Name, type, FightingScore) {
        this.RoleFightingScoreLabel = this.node.getChildByName('ProtagonistCombatPowerValueLayer')
            .getChildByName('ProtagonistCombatPowerValue').getChildByName('PowerValueLabel');
        this.RoleFightingScoreLabel.getComponent(cc.Label).string = FightingScore

        //處理好 資料回傳
        ArenaCallback(this.node.name, 'setRoleData');
    },

    //設定對手資訊
    setRivalData(Name, type, FightingScore) {
        this.RivalFightingScoreLabel = this.node.getChildByName('RivalCombatPowerValueLayer')
            .getChildByName('ProtagonistCombatPowerValue').getChildByName('PowerValueLabel');
        this.RivalFightingScoreLabel.getComponent(cc.Label).string = FightingScore

        ArenaCallback(this.node.name, 'setRivalData');
    },

    //(show) Loading畫面 first step
    showLoadingLayerFirstStep() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[0].name);
    },

    //(show) Loading畫面 first step - 人物顯示
    showLoadingLayerFirstStepRoleVisiable() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[3].name);
    },

    //(show) Loading畫面 Second step
    showLoadingLayerSecondStep() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[2].name);
    },

    //(close) Loading畫面 
    CloseLoadingLayer() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[1].name);
    },

    //監聽 first step finish
    showScreenFinish() {
        // this.showLoadingLayerSecondStep();
        // Loading畫面 first step finish
        ArenaCallback(this.node.name, 'showScreenFinish');//回傳已經顯示畫面 準備要顯示人物
    },

    //監聽 first step 人物顯示 finish 
    showLoadingLayerFirstStepRoleVisiableFinish() {
        ArenaCallback(this.node.name, 'showLoadingLayerFirstStepRoleVisiableFinish');//回傳已經顯示畫面 準備要顯示倒數
    },

    //監聽 Second step finish
    showFinish() {
        ArenaCallback(this.node.name, 'showFinish');//回傳已經顯示畫面 準備要顯示
    },

    //關門
    audio_doorClose() {
        if (this.doorClose) {
            cc.audioEngine.playEffect(this.doorClose, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/door_close.mp3', function load(err, audioclip) {
                self.doorClose = audioclip;
                cc.audioEngine.playEffect(self.doorClose, false, 0.8);
            });
        }
    },

    //開門
    audio_open() {
        if (this.open) {
            cc.audioEngine.playEffect(this.open, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/open.mp3', function load(err, audioclip) {
                self.open = audioclip;
                cc.audioEngine.playEffect(self.open, false, 0.8);
            });
        }
    },

    //顯示玩家
    audio_people_show() {
        if (this.people_show) {
            cc.audioEngine.playEffect(this.people_show, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/people_show.mp3', function load(err, audioclip) {
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
            cc.audioEngine.playEffect(this.vs, false, 0.8);
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
            cc.audioEngine.playEffect(this.vs2, false, 0.8);
        } else {
            cc.loader.loadRes('/Sfx/ArenaLoad/vs2.mp3', function load(err, audioclip) {
                self.vs2 = audioclip;
                cc.audioEngine.playEffect(self.vs2, false, 0.8);
            });
        }
    },

    CloseFinish() {
        ArenaCallback(this.node.name, 'CloseFinish');//關閉結束
        this.node.destroy();//銷毀對象
    },

    start() {

    },

    // update (dt) {},
});
