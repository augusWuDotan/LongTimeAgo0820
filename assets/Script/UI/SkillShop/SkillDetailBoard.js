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
        mpPropLabel: {
            default: null,
            type: cc.Node
        },
        priceLabel: {
            default: null,
            type: cc.Node
        },
        descriptionLabel: {
            default: null,
            type: cc.Node
        },
        skillSign: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    setDetail (data, skillContainer) {
        this.itemNameLabel.getComponent(cc.Label).string = data.skill.SkillPrototype_Name;
        this.itemNameLabel.color = data.skillColor;
        this.itemContainer.removeAllChildren(true);
        skillContainer.parent = this.itemContainer;
        this.typePropLabel.getComponent(cc.Label).string = data.type;
        this.mpPropLabel.getComponent(cc.Label).string = data.skill.MpCost;
        this.priceLabel.getComponent(cc.Label).string = data.skill.Price;
        this.descriptionLabel.getComponent(cc.Label).string = data.skill.Description;

        this.isReversed = false;
        this.setSkillSign(data.skill.SkillPrototype_Sign.split(','));
    },

    setSkillSign (skillSignNumbers) {
        var ctx = this.skillSign.getComponent(cc.Graphics);
        ctx.clear();

        var skillSignNumber = skillSignNumbers[0];
        var point = this.getPoint(parseInt(skillSignNumber));
        ctx.moveTo(point.x, point.y);

        this.skillSignNumbers = skillSignNumbers;
        this.currentSkillSignIndex = 1;
        this.currentLinePercent = 0;
        this.schedule(this.updateDrawLine, 0.02);
    },

    updateDrawLine () {
        this.currentLinePercent += 0.02;

        var previousPoint = this.getPoint(parseInt(this.skillSignNumbers[this.currentSkillSignIndex - 1]));
        var nextPoint = this.getPoint(parseInt(this.skillSignNumbers[this.currentSkillSignIndex]));

        var currentPointX = previousPoint.x + ((nextPoint.x - previousPoint.x) * this.currentLinePercent);
        var currentPointY = previousPoint.y + ((nextPoint.y - previousPoint.y) * this.currentLinePercent);

        var ctx = this.skillSign.getComponent(cc.Graphics);
        ctx.lineTo(currentPointX, currentPointY);
        ctx.stroke();

        if (this.currentLinePercent >= 1) {
            this.currentSkillSignIndex += 1;
            if (this.currentSkillSignIndex < this.skillSignNumbers.length) {
                this.currentLinePercent = 0;
            } else {
                if (this.isReversed == false) {
                    this.skillSignNumbers = this.skillSignNumbers.reverse()
                    ctx.clear();

                    var point = this.getPoint(parseInt(this.skillSignNumbers[0]));
                    ctx.moveTo(point.x, point.y);

                    this.currentSkillSignIndex = 1
                    this.currentLinePercent = 0;
                    this.isReversed = true;
                } else {
                    this.unschedule(this.updateDrawLine);
                }
            }
        }
    },

    getPoint (skillDot) {
        switch (skillDot) {
            case 0:
            return new cc.p(20, 180);
            case 1:
            return new cc.p(100, 180);
            case 2:
            return new cc.p(180, 180);
            case 3:
            return new cc.p(20, 100);
            case 4:
            return new cc.p(100, 100);
            case 5:
            return new cc.p(180, 100);
            case 6:
            return new cc.p(20, 20);
            case 7:
            return new cc.p(100, 20);
            case 8:
            return new cc.p(180, 20);
            default:
            break;
        }
    }
});
