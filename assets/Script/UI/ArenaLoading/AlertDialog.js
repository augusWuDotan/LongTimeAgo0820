
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    show() {
        var action = cc.fadeIn(0.5);
        this.node.runAction(action);
    },

    Gone() {
        this.node.destroy();
    },

    setLabel(content) {
        this.ContentLabel = this.node.getChildByName('AlertLabel').getComponent(cc.Label);
        this.ContentLabel.string = content;
    },


    start() {

    },

    // update (dt) {},
});
