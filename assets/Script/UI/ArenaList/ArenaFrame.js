var self;
var ArenaListCallBack;
cc.Class({
    extends: cc.Component,

    properties: {
        //競技場列表Item 整體
        ArenaFrame: {
            default: null,
            type: cc.Node
        },
        //競技場列表Item 圖
        ArenaPhoto: {
            default: null,
            type: cc.Sprite
        },
        //競技場列表Item 圖
        ArenaComingsoonPhoto: {
            default: null,
            type: cc.Node
        },
        //競技場列表Item 標題
        ArenaItemTitle: {
            default: null,
            type: cc.Label
        },
        //競技場 Mark
        ArenaItemMark: {
            default: null,
            type: cc.Sprite
        },
        //競技場列表Item 天數 十位數
        TenDigitsLabel: {
            default: null,
            type: cc.Label
        },
        //競技場列表Item 天數 個位數
        DigitsLabel: {
            default: null,
            type: cc.Label
        },
        //競技場列表Item 開放時段 1
        OpenTimesOne: {
            default: null,
            type: cc.Label
        },
        //競技場列表Item 開放時段 2
        OpenTimesTwo: {
            default: null,
            type: cc.Label
        },
        //競技場列表Item 開放時段 3
        OpenTimesThree: {
            default: null,
            type: cc.Label
        },
        //競技場型別圖示1 競技場
        ArenaType1: {
            default: null,
            type: cc.SpriteFrame
        },
        //競技場型別圖示2 活動競技場
        ArenaType2: {
            default: null,
            type: cc.SpriteFrame
        },
        //競技場型別圖示3 班級競技場
        ArenaType3: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    /**
     * 初始化
     * @param {*} cal 回傳機制
     * @param {*} ArenaID 點擊index
     * @param {*} type 點擊項目
     * @param {*} isStart 是否可以點擊
     */
    init(cal, ArenaID, Type, isStart) {
        self = this;
        this.ArenaID = ArenaID;
        this.isStart = isStart;
        this.ArenaComingsoonPhoto.active = !isStart;
        ArenaListCallBack = cal;

        switch (Type) {
            case 1:
                this.ArenaItemMark.spriteFrame = this.ArenaType1;
                break;
            case 2:
                this.ArenaItemMark.spriteFrame = this.ArenaType2;
                break;
            case 3:
                this.ArenaItemMark.spriteFrame = this.ArenaType3;
                break;
        }
    },

    //事件
    ClickAction() {
        //管制是否開放
        if (!this.isStart) return;
        //
        if (ArenaListCallBack) ArenaListCallBack(this.ArenaID);
    },

    start() {

    },

    // update (dt) {},
});
