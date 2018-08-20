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
        rarePropLabel: {
            default: null,
            type: cc.Node
        },
        atkPropLabel: {
            default: null,
            type: cc.Node
        },
        defPropLabel: {
            default: null,
            type: cc.Node
        },
        agiPropLabel: {
            default: null,
            type: cc.Node
        },
        intPropLabel: {
            default: null,
            type: cc.Node
        },
        resPropLabel: {
            default: null,
            type: cc.Node
        },
        criPropLabel: {
            default: null,
            type: cc.Node
        },
        matkPropLabel: {
            default: null,
            type: cc.Node
        },
        mdefPropLabel: {
            default: null,
            type: cc.Node
        },
        hpPropLabel: {
            default: null,
            type: cc.Node
        },
        mpPropLabel: {
            default: null,
            type: cc.Node
        },
        dodPropLabel: {
            default: null,
            type: cc.Node
        },
        hitPropLabel: {
            default: null,
            type: cc.Node
        },
        priceLabel: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    setDetail (data, goodsContainer) {
        this.itemNameLabel.getComponent(cc.Label).string = data.goods.Equipment_Name;
        this.itemNameLabel.color = data.goodsColor;
        this.itemContainer.removeAllChildren(true);
        goodsContainer.parent = this.itemContainer;
        this.typePropLabel.getComponent(cc.Label).string = data.type;
        this.rarePropLabel.getComponent(cc.Label).string = data.rare;
        this.priceLabel.getComponent(cc.Label).string = data.goods.Price;

        this.atkPropLabel.getComponent(cc.Label).string = '0'
        this.atkPropLabel.color = cc.Color.WHITE;
        this.defPropLabel.getComponent(cc.Label).string = '0'
        this.defPropLabel.color = cc.Color.WHITE;
        this.agiPropLabel.getComponent(cc.Label).string = '0'
        this.agiPropLabel.color = cc.Color.WHITE;
        this.intPropLabel.getComponent(cc.Label).string = '0'
        this.intPropLabel.color = cc.Color.WHITE;
        this.resPropLabel.getComponent(cc.Label).string = '0'
        this.resPropLabel.color = cc.Color.WHITE;
        this.criPropLabel.getComponent(cc.Label).string = '0'
        this.criPropLabel.color = cc.Color.WHITE;
        this.matkPropLabel.getComponent(cc.Label).string = '0'
        this.matkPropLabel.color = cc.Color.WHITE;
        this.mdefPropLabel.getComponent(cc.Label).string = '0'
        this.mdefPropLabel.color = cc.Color.WHITE;
        this.hpPropLabel.getComponent(cc.Label).string = '0'
        this.hpPropLabel.color = cc.Color.WHITE;
        this.mpPropLabel.getComponent(cc.Label).string = '0'
        this.mpPropLabel.color = cc.Color.WHITE;
        this.dodPropLabel.getComponent(cc.Label).string = '0'
        this.dodPropLabel.color = cc.Color.WHITE;
        this.hitPropLabel.getComponent(cc.Label).string = '0'
        this.hitPropLabel.color = cc.Color.WHITE;

        for (i = 0; i < data.goods.EquipmentElement.length; i++) {
            switch (data.goods.EquipmentElement[i].ElementNum) {
                case 1:
                this.atkPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 2:
                this.defPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 3:
                this.agiPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 4:
                this.intPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 5:
                this.resPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 6:
                this.matkPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 7:
                this.mdefPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 8:
                this.hpPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 9:
                this.mpPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 10:
                this.criPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 11:
                this.dodPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                case 12:
                this.hitPropLabel.getComponent(cc.Label).string = data.goods.EquipmentElement[i].ElementValue;
                break;
                default:
                break;
            }
        }

        for (i = 0; i < data.goods.RandomElementModels.length; i++) {
            switch (data.goods.RandomElementModels[i].ElementNum) {
                case 1:
                this.atkPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.atkPropLabel.color = cc.Color.GREEN;
                break;
                case 2:
                this.defPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.defPropLabel.color = cc.Color.GREEN;
                break;
                case 3:
                this.agiPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.agiPropLabel.color = cc.Color.GREEN;
                break;
                case 4:
                this.intPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.intPropLabel.color = cc.Color.GREEN;
                break;
                case 5:
                this.resPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.resPropLabel.color = cc.Color.GREEN;
                break;
                case 6:
                this.matkPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.matkPropLabel.color = cc.Color.GREEN;
                break;
                case 7:
                this.mdefPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.mdefPropLabel.color = cc.Color.GREEN;
                break;
                case 8:
                this.hpPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.hpPropLabel.color = cc.Color.GREEN;
                break;
                case 9:
                this.mpPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.mpPropLabel.color = cc.Color.GREEN;
                break;
                case 10:
                this.criPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.criPropLabel.color = cc.Color.GREEN;
                break;
                case 11:
                this.dodPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.dodPropLabel.color = cc.Color.GREEN;
                break;
                case 12:
                this.hitPropLabel.getComponent(cc.Label).string += ' + ' + data.goods.RandomElementModels[i].ElementValue;
                this.hitPropLabel.color = cc.Color.GREEN;
                break;
                default:
                break;
            }
        }
    }
});
