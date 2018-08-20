var self;
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

    onLoad() { },

    start() { },

    init(AvatarUrl, Level,Name,RankingLevel) {
        self = this;
        this.LevelLabel = this.node.getChildByName('Level').getComponent(cc.Label);//第幾名
        this.LevelLabel.string = Level;

        this.TitleLabel = this.node.getChildByName('Title').getComponent(cc.Label);//第幾名
        this.TitleLabel.string = (Name+' Lv.'+RankingLevel);

        this.AvatarPhoto = this.node.getChildByName('avatar').getComponent(cc.Sprite);
        if (AvatarUrl != null && AvatarUrl != '') {
            //下載選擇圖片
            cc.loader.load(AtavarUrl, function (err, tex) {
                console.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
                if (!err) {
                    var spf = new cc.SpriteFrame();
                    spf.initWithTexture(tex);
                    self.AvatarPhoto.spriteFrame = spf;
                } else {
                    console.log('下載圖錯誤：' + err);
                    self.LoadAvatarAgain();//重新載入預設圖片
                }
            });
        } else {
            console.log('無此頭像')
            // self.LoadAvatarAgain();//重新載入預設圖片
        }
    },

    //下載預設圖片
    LoadAvatarAgain() {
        var AtavarUrl = '';
        cc.loader.load(AtavarUrl, function (err, tex) {
            console.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
            if (!err) {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                self.AvatarPhoto.spriteFrame = spf;
            } else {
                console.log('預設圖錯誤：' + err);
            }
        });
    },

    // update (dt) {},
});
