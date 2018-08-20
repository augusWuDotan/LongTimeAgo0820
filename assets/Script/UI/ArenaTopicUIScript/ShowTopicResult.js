var self;
var AttributeCallback;

cc.Class({
    extends: cc.Component,

    properties: {
        MeWIn: {
            default: null,
            url: cc.AudioClip
        },
        RivalWin: {
            default: null,
            url: cc.AudioClip
        },
        either: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.test();
    },

    initData(ProtagonistAnswer, RivalAnswer, Callback) {
        AttributeCallback = Callback;
        this.ProtagonistAnswer = ProtagonistAnswer
        this.audio = null;
        //
        this.isProtagonistWin = false;
        if (ProtagonistAnswer.Permission.Permission && !RivalAnswer.Permission.Permission) {
            this.isProtagonistWin = true;
        } else if (!ProtagonistAnswer.Permission.Permission && RivalAnswer.Permission.Permission) {
            this.isProtagonistWin = false;
        } else if (ProtagonistAnswer.Permission.Permission && RivalAnswer.Permission.Permission) {
            //雙方都答對
            if (ProtagonistAnswer.Permission.Answer_Time < RivalAnswer.Permission.Answer_Time) {
                //主角先答
                this.isProtagonistWin = true;
            } else {
                //對手先答
                this.isProtagonistWin = false;
            }
        } else {
            //一起錯
            this.isProtagonistWin = null
        }
        console.log('isProtagonistWin:' + this.isProtagonistWin);

        //選擇path
        var CorrectTexture = cc.url.raw('/resources/Texture/Topic/answercorrect.png');//取得正確圖示
        var WrongTexture = cc.url.raw('/resources/Texture/Topic/answerwrong.png');//取得錯誤圖示 
        if (this.isProtagonistWin != null) {
            this.audio = this.isProtagonistWin ? this.MeWIn : this.RivalWin;//誰先攻音效
            var CenterTexture = cc.url.raw(this.isProtagonistWin ? '/resources/Texture/Topic/first_right.png' : '/resources/Texture/Topic/first_left.png');//取得中間圖示
            this.node.getChildByName('Protagonist').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(ProtagonistAnswer.Permission.Permission ? CorrectTexture : WrongTexture);
            this.node.getChildByName('Rival').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(RivalAnswer.Permission.Permission ? CorrectTexture : WrongTexture);
            this.node.getChildByName('FirstAttackDirection').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(CenterTexture);
        }
        else {
            console.log('平手 一起錯');
            console.log(this.either);
            this.audio = this.either;//平手音效
            var CenterTexture = cc.url.raw('/resources/Texture/Topic/no_attack.png');//取得中間圖示
            this.node.getChildByName('Protagonist').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(ProtagonistAnswer.Permission.Permission ? CorrectTexture : WrongTexture);
            this.node.getChildByName('Rival').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(RivalAnswer.Permission.Permission ? CorrectTexture : WrongTexture);
            this.node.getChildByName('FirstAttackDirection').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(CenterTexture);
        }

        this.show();
    },

    show() {
        console.log(this.audio);
        if(this.audio)cc.audioEngine.playEffect(this.audio, false, 0.8);
        this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation)._clips[0].name);
    },

    close() {
        this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation)._clips[1].name);
    },

    showFinish() {
        console.log('--showFinish--')
        this.scheduleOnce(function delay(params) {
            this.close();
        }, 2);
    },

    closeFinish() {
        console.log('--closeFinish--')
        if (AttributeCallback) {
            var model = { 'ProtagonistAnswer': this.ProtagonistAnswer, 'isProtagonistWin': this.isProtagonistWin };
            AttributeCallback(model);
        }
    },

    start() {

    },

    // update (dt) {},
});
