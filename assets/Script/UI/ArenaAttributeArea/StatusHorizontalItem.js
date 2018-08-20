var self;
var ArenaUtils = require('ArenaUtils');
var PropsUtils = require('PropsUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initData(effect) {
        self = this;
        this.effect = effect;
        console.log(this.effect);
        console.log(this.node);
        var icon = this.node.getChildByName('icon');
        var SourceName = this.node.getChildByName('SourceName');
        var SourceEffect = this.node.getChildByName('SourceEffect');
        var SourceRemind = this.node.getChildByName('SourceRemind');
        //預設 不透明
        this.node.opacity = 0;
        SourceName.getComponent(cc.Label).string = effect.SourceName;
        SourceEffect.getComponent(cc.Label).string = effect.Value > 0 ? '+' + effect.Value : effect.Value;
        if (effect.Value > 0) SourceEffect.color = new cc.Color(0, 255, 0);
        else SourceEffect.color = new cc.Color(255, 0, 0);
        SourceRemind.getComponent(cc.Label).string = '剩餘 ' + effect.Rounds + ' 回合';
        //
        var statusPath = '';
        if (effect.Source === 'Skill') {
            //技能狀態路徑
            statusPath = ArenaUtils.getAttributeStatusIconPath_Skill(effect.Element, effect.Value);
        } else {
            //道具路徑
            statusPath = PropsUtils.getStatusBarPath(effect.SourceID);
        }

        //下載圖示
        cc.loader.loadRes(statusPath, cc.SpriteFrame, function (err, sp) {
            if (err) {
                console.log('下載錯誤：' + err);
                return;
            } else {

                // //建立圖像
                // var size = sp.getOriginalSize();//取得圖片大小
                // let zoomScale = icon.height / size.height;//設置圖像縮小比例
                // if (zoomScale < 1) icon.scale = zoomScale;//只縮小不放大
                // else console.log('不放大');
                icon.getComponent(cc.Sprite).type = cc.Sprite.Type.SIMPLE;
                icon.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM;
                icon.getComponent(cc.Sprite).trim = true;
                icon.getComponent(cc.Sprite).spriteFrame = sp;//設定圖像



                console.log('漸顯');
                icon.parent.runAction(cc.fadeIn(0.5));
            }
        });


    },

    start() {

    },

    // update (dt) {},
});
