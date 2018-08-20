// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemNameLabel: {
            default: null,
            type: cc.Node
        },
        itemContainer: {
            default: null,
            type: cc.Node
        },
        typePropLabel: {
            default: null,
            type: cc.Node
        },
        descriptionLabel: {
            default: null,
            type: cc.Node
        },
        itemCountLabel: {
            default: null,
            type: cc.Node
        },
        priceLabel: {
            default: null,
            type: cc.Node
        },
        itemCount: {
            default: 1,
            visible: false
        },
        itemCountAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    setDetail (data, goodsContainer) {
        this.itemNameLabel.getComponent(cc.Label).string = data.goods.PropsPrototype_Name;
        this.itemContainer.removeAllChildren(true);
        goodsContainer.parent = this.itemContainer;
        this.typePropLabel.getComponent(cc.Label).string = data.type;
        this.descriptionLabel.getComponent(cc.Label).string = data.goods.Description;
        this.itemCountLabel.getComponent(cc.Label).string = '1';
        this.priceLabel.getComponent(cc.Label).string = data.goods.Price;

        this.itemCount = 1;
    },

    plusButtonClick () {
        if (this.itemCount < 99) {
            this.itemCount += 1;
            this.itemCountLabel.getComponent(cc.Label).string = this.itemCount;
            cc.audioEngine.playEffect(this.itemCountAudio, false, 1);
        }
    },

    minusButtonClick () {
        if (this.itemCount > 1) {
            this.itemCount -= 1;
            this.itemCountLabel.getComponent(cc.Label).string = this.itemCount;
            cc.audioEngine.playEffect(this.itemCountAudio, false, 1);
        }
    },

    resetItemCount () {
        this.itemCount = 1;
        this.itemCountLabel.getComponent(cc.Label).string = this.itemCount;
    }
});
