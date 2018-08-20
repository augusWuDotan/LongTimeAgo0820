
cc.Class({
    extends: cc.Component,

    properties: {
        //加成屬性
        attrTipPrefab: {
            default: null,
            type: cc.Prefab
        },
        //道具說明
        PropTipPrefab: {
            default: null,
            type: cc.Prefab
        },
        //技能說明
        skillTipPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {

    },

    /**
     * 初始化
     * @param {*} type attr | prop | skill
     * @param {*} result 資料來源 attr = 裝備屬性 | prop = 道具內容 | skill = 技能內容
     */
    init(type, result) {
        console.log(result);
        var self = this;

        this.node.removeAllChildren();
        //建立節點
        switch (type) {
            case 'attr':
                self.TipNode = cc.instantiate(self.attrTipPrefab);
                break;
            case 'prop':
                self.TipNode = cc.instantiate(self.PropTipPrefab);
                break;
            case 'skill':
                self.TipNode = cc.instantiate(self.skillTipPrefab);
                break;
            default:
                break;
        }
        this.node.addChild(this.TipNode);

        this.TipNode.setPosition(cc.p(0, 0));
        //初始化資料
        this.initDetail(type, result);
    },

    /**
    * 初始化內容
    * @param {*} type attr | prop | skill
    * @param {*} result 資料來源 attr = 裝備屬性 | prop = 道具內容 | skill = 技能內容
    */
    initDetail(type, result) {
        var self = this;
        switch (type) {
            case 'attr':
                self.attrDetail(result);
                break;
            case 'prop':
                self.propDetail(result);
                break;
            case 'skill':
                self.skillDetail(result);
                break;
            default:
                break;
        }
    },

    attrDetail(result) {
        if (!this.TipNode) return;
        if (this.TipNode.name != 'AttriDetailBoard') return;
        // console.log('this.TipNode.name:' + this.TipNode.name);
        this.title = this.TipNode.getChildByName('title');
        this.atkLabel = this.TipNode.getChildByName('atklabel');
        this.defLabel = this.TipNode.getChildByName('deflabel');
        this.agiLabel = this.TipNode.getChildByName('agilabel');
        this.intLabel = this.TipNode.getChildByName('intlabel');
        this.resLabel = this.TipNode.getChildByName('reslabel');
        this.criLabel = this.TipNode.getChildByName('crilabel');
        this.matkLabel = this.TipNode.getChildByName('matklabel');
        this.mdefLabel = this.TipNode.getChildByName('mdeflabel');
        this.hpLabel = this.TipNode.getChildByName('hplabel');
        this.mpLabel = this.TipNode.getChildByName('mplabel');
        this.dodLabel = this.TipNode.getChildByName('dodlabel');
        this.hitLabel = this.TipNode.getChildByName('hitlabel');

        var t = result.Equipment_Name.split(' ');
        var newTitle = t.join('\n');
        this.title.getComponent(cc.Label).string = newTitle;
        switch (result.EquipmentLevel_ID) {
            case 1:
                this.title.color = cc.Color.WHITE
                break;
            case 2:
                this.title.color = new cc.Color(0, 255, 0, 255);
                break;
            case 3:
                this.title.color = new cc.Color(0, 255, 255, 255);
                break;
            case 4:
                this.title.color = new cc.Color(138, 43, 226, 255);
                break;
            case 5:
                this.title.color = new cc.Color(255, 128, 0, 255);
                break;
            default:
                break;
        }

        //回覆初始數值
        var labels = [this.atkLabel, this.defLabel, this.agiLabel, this.intLabel, this.resLabel, this.criLabel,
        this.matkLabel, this.mdefLabel, this.hpLabel, this.mpLabel, this.dodLabel, this.hitLabel];
        this.resetStringToZero(labels);

        for (i = 0; i < result.EquipmentElement.length; i++) {
            var labelNode = null;
            switch (result.EquipmentElement[i].ElementNum) {
                case 1:
                    labelNode = this.atkLabel;
                    break;
                case 2:
                    labelNode = this.defLabel;
                    break;
                case 3:
                    labelNode = this.agiLabel;
                    break;
                case 4:
                    labelNode = this.intLabel;
                    break;
                case 5:
                    labelNode = this.resLabel;
                    break;
                case 6:
                    labelNode = this.matkLabel;
                    break;
                case 7:
                    labelNode = this.mdefLabel;
                    break;
                case 8:
                    labelNode = this.hpLabel;
                    break;
                case 9:
                    labelNode = this.mpLabel;
                    break;
                case 10:
                    labelNode = this.criLabel;
                    break;
                case 11:
                    labelNode = this.dodLabel;
                    break;
                case 12:
                    labelNode = this.hitLabel;
                    break;
                default:
                    break;
            }
            labelNode.getComponent(cc.Label).string = result.EquipmentElement[i].ElementValue;
            if (result.EquipmentElement[i].ElementValue > 0) labelNode.color = cc.Color.GREEN;
            if (result.EquipmentElement[i].ElementValue == 0) labelNode.color = cc.Color.WHITE;
            if (result.EquipmentElement[i].ElementValue < 0) labelNode.color = cc.Color.RED;
        }

        for (i = 0; i < result.RandomElementModels.length; i++) {

            var labelNode = null;
            switch (result.EquipmentElement[i].ElementNum) {
                case 1:
                    labelNode = this.atkLabel;
                    break;
                case 2:
                    labelNode = this.defLabel;
                    break;
                case 3:
                    labelNode = this.agiLabel;
                    break;
                case 4:
                    labelNode = this.intLabel;
                    break;
                case 5:
                    labelNode = this.resLabel;
                    break;
                case 6:
                    labelNode = this.matkLabel;
                    break;
                case 7:
                    labelNode = this.mdefLabel;
                    break;
                case 8:
                    labelNode = this.hpLabel;
                    break;
                case 9:
                    labelNode = this.mpLabel;
                    break;
                case 10:
                    labelNode = this.criLabel;
                    break;
                case 11:
                    labelNode = this.dodLabel;
                    break;
                case 12:
                    labelNode = this.hitLabel;
                    break;
                default:
                    break;
            }
            var num = (parseInt(labelNode.getComponent(cc.Label).string) + result.RandomElementModels[i].ElementValue);
            if (num > 0) labelNode.color = cc.Color.GREEN;
            if (num == 0) labelNode.color = cc.Color.WHITE;
            if (num < 0) labelNode.color = cc.Color.RED;
            labelNode.getComponent(cc.Label).string = num;
        }
    },

    //prop
    propDetail(result) {
        if (!this.TipNode) return;
        if (this.TipNode.name != 'PropDetailBoard') return;

        this.title = this.TipNode.getChildByName('title');
        var t = result.PropsPrototype_Name.split(' ');
        var newTitle = t.join('\n');
        this.title.getComponent(cc.Label).string = newTitle;

        this.content = this.TipNode.getChildByName('content');
        this.content.getComponent(cc.Label).string = result.Description;
    },

    skillDetail(result) {
        if (!this.TipNode) return;
        if (this.TipNode.name != 'SkillDetailBoard') return;

        this.title = this.TipNode.getChildByName('title');
        var t = result.SkillPrototype_Name.split(' ');
        var newTitle = t.join('\n');
        this.title.getComponent(cc.Label).string = newTitle;

        this.content = this.TipNode.getChildByName('content');
        if (result.Description != null && result.Description != '') {
            this.content.getComponent(cc.Label).string = result.Description;
        } else {
            this.content.getComponent(cc.Label).string = '技能\n没有说明';
        }

        //動畫
        this.isReversed = false;
        this.unscheduleAllCallbacks();
        this.setSkillSign(result.SkillPrototype_Sign.split(','));
    },

    /**
     * //回覆label的數值為0
     * @param {*} nodes label節點
     */
    resetStringToZero(nodes) {
        nodes.forEach(node => {
            node.getComponent(cc.Label).string = '0'
            node.color = cc.Color.WHITE;
        });
    },


    //skill
    setSkillSign(skillSignNumbers) {
        this.skillSign = this.TipNode.getChildByName('SkillSign');
        var ctx = this.skillSign.getComponent(cc.Graphics);
        ctx.clear();
        
        var skillSignNumber = skillSignNumbers[0];
        var point = this.getPoint(parseInt(skillSignNumber));
        ctx.moveTo(point.x, point.y);

        this.skillSignNumbers = skillSignNumbers;
        this.currentSkillSignIndex = 1;
        this.currentLinePercent = 0;

        this.schedule(this.updateDrawLine, 0.015);
    },

    updateDrawLine() {

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

    getPoint(skillDot) {
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

    // update (dt) {},
});
