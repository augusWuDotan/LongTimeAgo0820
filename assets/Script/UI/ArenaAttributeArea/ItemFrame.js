var self;
var callBack;
var PropsUtils = require('PropsUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        ProsIcon: {
            default: null,
            type: cc.Sprite
        },
        // 暫存 Game 對象引用 [可以取得]
        AttributeArea: {
            default: null,
            serializable: false
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.role = '';
        this.itemPath = '';
        this.canClick = false;
    },

    setItemPath(role, itmeData, canClick) {
        //
        this.role = role;
        this.itemData = itmeData;
        this.canClick = canClick;
        var Path = '';
        if (this.itemData.PropsPrototype_ID !== null) {
            
            var texture = cc.url.raw(PropsUtils.getPath(this.itemData.PropsPrototype_ID));
            this.ProsIcon.spriteFrame = new cc.SpriteFrame(texture);
            
        } else {
            this.canClick = false;
            // Path = '/Texture/common/empty_item';
            var texture = cc.url.raw("/resources/Texture/common/empty_item.png");
            this.ProsIcon.spriteFrame = new cc.SpriteFrame(texture);
        }

    },

    setCallBack(cal) {
        callBack = cal;
    },

    //設定為空
    setEmpty() {
        var texture = cc.url.raw("/resources/Texture/common/empty_item.png");
        this.ProsIcon.spriteFrame = new cc.SpriteFrame(texture);
    },

    clickListener(event, num) {
        console.log('clickListener: ' + this._tag);
        if (!this.canClick) {
            console.log('無法點擊');
            return;//使用過後不可以被點擊
        }
        if (!this.AttributeArea) {
            console.log('對手身份無管理員實例');
            return;//如果是對手不會有該管理員實例 
        }
        if (this.AttributeArea.GameOver) {
            console.log('已經結束 不可以在點擊道具');
            return;//利用管理員實例 在遊戲結束後 不可被點擊
        }
    
        //
        if (callBack) {
            //執行使用道具
            console.log('執行使用道具');
            callBack(this.itemData, this);
        }
    },

    UseThisItem() {
        console.log('use this item')
        this.canClick = false;
        var texture = cc.url.raw("/resources/Texture/common/empty_item.png");
        this.ProsIcon.spriteFrame = new cc.SpriteFrame(texture);
    },


    start() {

    },

    // update (dt) {},
});
