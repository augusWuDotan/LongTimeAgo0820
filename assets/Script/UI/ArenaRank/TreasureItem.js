cc.Class({
    extends: cc.Component,

    properties: {
        Box: {
            default: null,
            type: cc.Sprite
        },
        WoodenBox_close: {
            default: null,
            type: cc.SpriteFrame
        },
        WoodenBox_ready: {
            default: null,
            type: cc.SpriteFrame
        },
        WoodenBox_open: {
            default: null,
            type: cc.SpriteFrame
        },
        GoldBox_close: {
            default: null,
            type: cc.SpriteFrame
        },
        GoldBox_ready: {
            default: null,
            type: cc.SpriteFrame
        },
        GoldBox_open: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    /**
     * 設定寶箱id&類型
     * @param {*} id 
     * @param {*} type 
     * @param {*} isReady 預設值的下一個可以打開
     */
    init(id, type, isReady, isOpen) {
        this.treasureID = id;
        this.treasureType = type;
        this.isOpen = isOpen;
        this.isReady = isReady;
        if (this.treasureType == 1) {
            if (this.isReady) this.Box.spriteFrame = this.WoodenBox_ready;
            else this.Box.spriteFrame = this.WoodenBox_close;
        } else {
            if (this.isReady) this.Box.spriteFrame = this.GoldBox_ready;
            else this.Box.spriteFrame = this.GoldBox_close;
        }
    },

    onLoad() { },

    setOpen() {
        console.log(this.node);
        if (this.treasureType == 1) {
            this.Box.spriteFrame = this.WoodenBox_open;
        } else {
            this.Box.spriteFrame = this.GoldBox_open;
        }
        this.isOpen = true;
    },

    setReady() {
        console.log(this.node);
        this.isReady = true;
        if (this.treasureType == 1) {
            this.Box.spriteFrame = this.WoodenBox_ready;
        } else {
            this.Box.spriteFrame = this.GoldBox_ready;
        }
    },



    start() {

    },

    // update (dt) {},
});
