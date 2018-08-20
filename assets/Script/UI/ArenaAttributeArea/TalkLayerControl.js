var self;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    /**
     * 主角 對話
     * 使用 animation
     * talklayerOpen2
     * talklayerClose2
     */
    doProtagonistTalk(Content) {
        self = this;
        this.Content = Content;
        this.closeName = 'talklayerClose2';
        this.TalkLabel = this.node.getChildByName('Talk_Label').getComponent(cc.Label);
        this.node.getComponent(cc.Animation).playAdditive('talklayerOpen2');
    },

    /**
     * 對手 對話
     * 使用 animation
     * talklayerOpen1 
     * talklayerClose1
     */
    doRivalTalk(Content) {
        self = this;
        this.Content = Content;
        this.closeName = 'talklayerClose1';
        this.TalkLabel = this.node.getChildByName('Talk_Label').getComponent(cc.Label);
        this.node.getComponent(cc.Animation).playAdditive('talklayerOpen1');
    },

    finishOpen() {
        this.showContent();
    },

    showContent() {
      
        self.scheduleOnce(function show(params) {
            this.TalkLabel.string = this.Content;
        }, 0.1);

        self.scheduleOnce(function delay(params) {
            this.node.getComponent(cc.Animation).playAdditive(this.closeName);
        }, 1);
    },


    //清除文字
    ClearContent() {
        this.Content = '';
        this.TalkLabel.string = '';
    }
    // update (dt) {},
});
