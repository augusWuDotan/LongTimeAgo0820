var self;
var PropsUtils = require('PropsUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        //動畫
        VictoryAnim: {
            default: null,
            type: cc.Node,
        },
        //bg動畫
        VictorybgAnim: {
            default: null,
            type: cc.Node,
        },
        //獎勵 金幣 經驗
        RewardLayoutOne: {
            default: null,
            type: cc.Node,
        },
        //獎勵 道具
        RewardLayoutTwo: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    init(RoleFinishData) {
        self = this;
        //計算使用長度
        this.RewardLayer = this.node.getChildByName('RewardLayer');
        //開始勝利圖是動畫
        this.VictoryAnim.getComponent(cc.Animation).play('Victory');
        this.VictorybgAnim.getComponent(cc.Animation).play('Victorybg');
        //建立獎勵
        this.addReword(RoleFinishData.Reward);
    },

    //建立獎勵
    addReword(reword) {
        console.log(reword);
        this.RewardLayoutOne.removeAllChildren();
        this.RewardLayoutTwo.removeAllChildren();
        this.rewardItem = this.node.getChildByName('RewardItem');
        //第一排
        reword.TopList.forEach(keyValue => {
            console.log(Object.keys(keyValue)[0]);
            console.log(Object.values(keyValue)[0]);
            let value = Object.values(keyValue)[0];
            if (value != 0) {
                var path = PropsUtils.getEitherPath(Object.keys(keyValue)[0]).replace("/resources", "").replace(".png", "");
                cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) {
                        console.error(err.message || err);
                        return;
                    } else {
                        console.log(spriteFrame);
                    }
                    var item = cc.instantiate(self.rewardItem);
                    item.setPosition(cc.p(0, 0));
                    var icon = item.getChildByName('icon').getComponent(cc.Sprite);
                    var num = item.getChildByName('num').getComponent(cc.Label);
                    icon.type = cc.Sprite.Type.SLICED;
                    icon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
                    console.log(item.getChildByName('icon').getContentSize());
                    console.log(spriteFrame.getOriginalSize());
                    var widthScale = 77 / spriteFrame.getOriginalSize().width;
                    var heightScale = 77 / spriteFrame.getOriginalSize().height;
                    var scale = (widthScale > heightScale ? widthScale : heightScale);
                    console.log('scale:' + scale);
                    item.getChildByName('icon').scale = scale;

                    icon.spriteFrame = spriteFrame;
                    num.string = '+' + value;

                    self.RewardLayoutOne.addChild(item);
                });
            }
        });
        //第二排
        reword.DownList.forEach(keyValue => {
            console.log(Object.keys(keyValue)[0]);
            console.log(Object.values(keyValue)[0]);
            let value = Object.values(keyValue)[0];
            //確定 並下載 圖樣

            if (value != 0) {
                var path = PropsUtils.getPath(Object.values(keyValue)[0]).replace("/resources", "").replace(".png", "");
                cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) {
                        console.error(err.message || err);
                        return;
                    } else {
                        console.log(spriteFrame);
                    }
                    var item = cc.instantiate(self.rewardItem);
                    item.setPosition(cc.p(0, 0));
                    var icon = item.getChildByName('icon').getComponent(cc.Sprite);
                    var num = item.getChildByName('num').getComponent(cc.Label);
                    icon.type = cc.Sprite.Type.SLICED;
                    icon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
                    console.log(item.getChildByName('icon').getContentSize());
                    console.log(spriteFrame.getOriginalSize());
                    var widthScale = 77 / spriteFrame.getOriginalSize().width;
                    var heightScale = 77 / spriteFrame.getOriginalSize().height;
                    var scale = (widthScale > heightScale ? widthScale : heightScale);
                    console.log('scale:' + scale);
                    item.getChildByName('icon').scale = scale;

                    icon.spriteFrame = spriteFrame;
                    num.string = '+1';

                    self.RewardLayoutTwo.addChild(item);
                });
            }
        });
    },


    // start () {    },

    // update (dt) {},
});
