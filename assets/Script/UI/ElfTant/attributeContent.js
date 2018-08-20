
cc.Class({
    extends: cc.Component,

    properties: {
        allPointLabel: {
            default: null,
            type: cc.Label
        },
        //----- 現有素質
        ConLabel: {
            default: null,
            type: cc.Label
        },
        StrLabel: {
            default: null,
            type: cc.Label
        },
        VitLabel: {
            default: null,
            type: cc.Label
        },
        SpdLabel: {
            default: null,
            type: cc.Label
        },
        IntLabel: {
            default: null,
            type: cc.Label
        },
        //-----更新素質
        ConUpdateLabel: {
            default: null,
            type: cc.Label
        },
        StrUpdateLabel: {
            default: null,
            type: cc.Label
        },
        VitUpdateLabel: {
            default: null,
            type: cc.Label
        },
        SpdUpdateLabel: {
            default: null,
            type: cc.Label
        },
        IntUpdateLabel: {
            default: null,
            type: cc.Label
        },
        //-----進度
        scheduleNameLabel: {
            default: null,
            type: cc.Label
        },
        scheduleVolueLabel: {
            default: null,
            type: cc.Label
        },
        //-----勝敗場
        winScoreLabel: {
            default: null,
            type: cc.Label
        },
        AllGameNumberLabel: {
            default: null,
            type: cc.Label
        },
        //pack頁 component
        PackLayer: {
            default: null,
            serializable: false
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        
    },

    /**
     * 
     * @param {*} allPoint 所有點數
     * @param {*} strength 力量
     * @param {*} magic 魔力
     * @param {*} endurance 耐力
     * @param {*} speed 速度
     * @param {*} focus 命中
     * @param {*} HP 血量
     * @param {*} MP 魔力
     * @param {*} schedule 進度值
     * @param {*} winScore 競技場勝場
     * @param {*} AllGameNumberScore 總場數
     */
    initAttribute(allPoint, strength, magic, endurance, speed, focus, HP, MP, schedule, winScore, AllGameNumberScore) {
        this.MaxPoint = allPoint;
        this.allPoint = allPoint;
        this.strength = strength;
        this.magic = magic;
        this.endurance = endurance;
        this.speed = speed;
        this.focus = focus;
        this.HP = HP;
        this.MP = MP;

        this.strengthUpdateValue = 0;
        this.magicUpdateValue = 0;
        this.enduranceUpdateValue = 0;
        this.speedUpdateValue = 0;
        this.focusUpdateValue = 0;

        this.allPointLabel.string = this.allPoint;
        this.ConLabel.string = this.strength;
        this.StrLabel.string = this.magic;
        this.VitLabel.string = this.endurance;
        this.SpdLabel.string = this.speed;
        this.IntLabel.string = this.focus;
        this.clearUpdateLabel();//清除加點label
    
        //進度
        this.scheduleVolueLabel.string = schedule;
        //勝場敗場
        this.winScoreLabel.string = winScore;
        this.AllGameNumberLabel.string = AllGameNumberScore;

        this.EnableOrNotAllCut(false);
        if(this.allPoint>0)this.EnableOrNotAllAdd(true);
    },

    clearUpdateLabel() {
        this.ConUpdateLabel.string = '';
        this.StrUpdateLabel.string = '';
        this.VitUpdateLabel.string = '';
        this.IntUpdateLabel.string = '';
        this.SpdUpdateLabel.string = '';
    },

    addPoint(event) {
        var self = this;
        console.log(event.target.parent.name);
        if (self.allPoint <= 0) {
            console.log('no point')
            return;
        } else {
            self.allPoint--;
            self.allPointLabel.string = self.allPoint;
            
        }
        var attributeNode = null;
        var attributeCount = 0;
        var updateCount = 0;
        switch (event.target.parent.name) {
            case 'ConLayer':
                attributeNode = self.ConUpdateLabel;
                attributeCount = self.strength;
                self.strengthUpdateValue++;
                updateCount = self.strengthUpdateValue;
                break;
            case 'StrLayer':
                attributeNode = self.StrUpdateLabel;
                attributeCount = self.magic;
                self.magicUpdateValue++;
                updateCount = self.magicUpdateValue;
                break;
            case 'VitLayer':
                attributeNode = self.VitUpdateLabel;
                attributeCount = self.endurance;
                self.enduranceUpdateValue++;
                updateCount = self.enduranceUpdateValue;
                break;
            case 'SpdLayer':
                attributeNode = self.SpdUpdateLabel;
                attributeCount = self.speed;
                self.speedUpdateValue++;
                updateCount = self.speedUpdateValue;
                break;
            case 'IntLayer':
                attributeNode = self.IntUpdateLabel;
                attributeCount = self.focus;
                self.focusUpdateValue++;
                updateCount = self.focusUpdateValue;
                break;
            default:
                //null
                break;
        }
        var updateValue = ((updateCount == 0) ? '' : ((updateCount > 0) ? (" +" + updateCount) : (' ' + updateCount)));
        attributeNode.string = updateValue;

        if(self.allPoint == 0){
            this.EnableOrNotAllAdd(false);
        }
        this.EnableOrNotSelectAllCut();
    },


    cutPoint(event) {
        var self = this;
        console.log(event.target.parent.name);

        var attributeNode = null;
        var attributeCount = 0;
        var updateCount = 0;
        switch (event.target.parent.name) {
            case 'ConLayer':
                attributeNode = self.ConUpdateLabel;
                attributeCount = self.strength;
                if (self.strengthUpdateValue > 0) {
                    self.strengthUpdateValue--;
                    self.allPoint++;
                }
                updateCount = self.strengthUpdateValue;
                break;
            case 'StrLayer':
                attributeNode = self.StrUpdateLabel;
                attributeCount = self.magic;
                if (self.magicUpdateValue > 0) {
                    self.magicUpdateValue--;
                    self.allPoint++;
                }
                updateCount = self.magicUpdateValue;
                break;
            case 'VitLayer':
                attributeNode = self.VitUpdateLabel;
                attributeCount = self.endurance;
                if (self.enduranceUpdateValue > 0) {
                    self.enduranceUpdateValue--;
                    self.allPoint++;
                }
                updateCount = self.enduranceUpdateValue;
                break;
            case 'SpdLayer':
                attributeNode = self.SpdUpdateLabel;
                attributeCount = self.speed;
                if (self.speedUpdateValue > 0) {
                    self.speedUpdateValue--;
                    self.allPoint++;
                }
                updateCount = self.speedUpdateValue;
                break;
            case 'IntLayer':
                attributeNode = self.IntUpdateLabel;
                attributeCount = self.focus;
                if (self.focusUpdateValue > 0) {
                    self.focusUpdateValue--;
                    self.allPoint++;
                }
                updateCount = self.focusUpdateValue;
                break;
            default:
                //null
                break;
        }

        self.allPointLabel.string = self.allPoint;
        var updateValue = ((updateCount == 0) ? '' : ((updateCount > 0) ? (" +" + updateCount) : (' ' + updateCount)));
        attributeNode.string = updateValue;

        if(self.allPoint > 0){
            this.EnableOrNotAllAdd(true);
            this.EnableOrNotSelectAllCut();
        }
    },
    //
    EnableOrNotSelectAllCut(){
      if(this.ConUpdateLabel.string != '') this.node.getChildByName('ConLayer').getChildByName('cut').getComponent(cc.Button).interactable = true;
      else this.node.getChildByName('ConLayer').getChildByName('cut').getComponent(cc.Button).interactable = false;
      if(this.StrUpdateLabel.string != '') this.node.getChildByName('StrLayer').getChildByName('cut').getComponent(cc.Button).interactable = true;
      else this.node.getChildByName('StrLayer').getChildByName('cut').getComponent(cc.Button).interactable = false;
      if(this.VitUpdateLabel.string != '') this.node.getChildByName('VitLayer').getChildByName('cut').getComponent(cc.Button).interactable = true;
      else this.node.getChildByName('VitLayer').getChildByName('cut').getComponent(cc.Button).interactable = false;
      if(this.SpdUpdateLabel.string != '') this.node.getChildByName('SpdLayer').getChildByName('cut').getComponent(cc.Button).interactable = true;
      else this.node.getChildByName('SpdLayer').getChildByName('cut').getComponent(cc.Button).interactable = false;
      if(this.IntUpdateLabel.string != '') this.node.getChildByName('IntLayer').getChildByName('cut').getComponent(cc.Button).interactable = true;
      else this.node.getChildByName('IntLayer').getChildByName('cut').getComponent(cc.Button).interactable = false;
    },

    EnableOrNotAllCut(boo){
        this.node.getChildByName('ConLayer').getChildByName('cut').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('StrLayer').getChildByName('cut').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('VitLayer').getChildByName('cut').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('SpdLayer').getChildByName('cut').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('IntLayer').getChildByName('cut').getComponent(cc.Button).interactable = boo;
    },

    EnableOrNotAllAdd(boo){
        this.node.getChildByName('ConLayer').getChildByName('add').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('StrLayer').getChildByName('add').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('VitLayer').getChildByName('add').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('SpdLayer').getChildByName('add').getComponent(cc.Button).interactable = boo;
        this.node.getChildByName('IntLayer').getChildByName('add').getComponent(cc.Button).interactable = boo;
    },

    //送出設定 OK btn
    updadteSetting() {
        console.log('updadteSetting');
        var self = this;
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        this.AlertTipLayer.getComponent('Alert').LeaveFunc = function () {
            self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
            self.updateValue();
        };//設定執行方法
        this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否改變屬性？');
        this.AlertTipLayer.setPosition(960, 540);
    },

    //
    updateValue() {

        this.strength += this.strengthUpdateValue;
        this.strengthUpdateValue = 0;
        this.magic += this.magicUpdateValue;
        this.magicUpdateValue = 0;
        this.endurance += this.enduranceUpdateValue;
        this.enduranceUpdateValue = 0;
        this.speed += this.speedUpdateValue;
        this.speedUpdateValue = 0;
        this.focus += this.focusUpdateValue;
        this.focusUpdateValue = 0;

        this.ConLabel.string = this.strength;
        this.StrLabel.string = this.magic;
        this.VitLabel.string = this.endurance;
        this.SpdLabel.string = this.speed;
        this.IntLabel.string = this.focus;

        this.ConUpdateLabel.string = '';
        this.StrUpdateLabel.string = '';
        this.VitUpdateLabel.string = '';
        this.SpdUpdateLabel.string = '';
        this.IntUpdateLabel.string = '';

        //todo 送出 請求 api

        this.EnableOrNotAllCut(false);
        if(this.allPoint>0)this.EnableOrNotAllAdd(true);
    },

    //memory
    goArenaMemory() {
        console.log('memory');
        this.PackLayer.ElfTantLayer.openArenaMemory();
    },
    // update (dt) {},
});
