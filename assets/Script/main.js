
var httpRequest = require('XMLHttpRequest');
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        Tab1Normal: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab1Press: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab2Normal: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab2Press: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab3Normal: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab3Press: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab4Normal: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab4Press: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab5Normal: {
            default: null,
            type: cc.SpriteFrame
        },
        Tab5Press: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        cc.director.preloadScene("ArenaListAreaScene", function () {
            cc.log('ArenaListAreaScene scene preloaded');
        });
        //
        this.node.opacity = 0;
        var fadeInAction = cc.fadeIn(0.5);
        this.node.runAction(fadeInAction);
        //
        this.dataNode = cc.find("DataNode");
        // cc.game.addPersistRootNode(this.dataNode);

        //
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        cc.game.addPersistRootNode(this.AlertTipLayer);//儲存提醒為永久節點

    },

    start() {
        this.request = new httpRequest();
        this.gteServerToken();
        this.initShop();//初始化商店
        this.initElfTant();//初始化精靈漲

    },

    //初始化商店
    initShop() {
        this.currentTab = null;
        //
        this.weaponShop = this.node.getChildByName('Shop').getChildByName('WeaponShop');
        if (this.weaponShop) {
            this.weaponShop.getComponent('WeaponShop').backButtonClickCallback = this.backShop;
            this.weaponShop.getComponent('WeaponShop').onError = this.showAlert;
            this.weaponShop.getComponent('WeaponShop').init();
        }
        //
        this.armorShop = this.node.getChildByName('Shop').getChildByName('ArmorShop');
        if (this.armorShop) {
            this.armorShop.getComponent('ArmorShop').backButtonClickCallback = this.backShop;
            this.armorShop.getComponent('ArmorShop').onError = this.showAlert;
            this.armorShop.getComponent('ArmorShop').init();
        }
        //
        this.itemShop = this.node.getChildByName('Shop').getChildByName('ItemShop');
        if (this.itemShop) {
            this.itemShop.getComponent('ItemShop').backButtonClickCallback = this.backShop;
            this.itemShop.getComponent('ItemShop').onError = this.showAlert;
            this.itemShop.getComponent('ItemShop').init();
        }
        //
        this.skillShop = this.node.getChildByName('Shop').getChildByName('SkillShop');
        if (this.skillShop) {
            this.skillShop.getComponent('SkillShop').backButtonClickCallback = this.backShop;
            this.skillShop.getComponent('SkillShop').onError = this.showAlert;
            this.skillShop.getComponent('SkillShop').init();
        }
    },

    backShop(node) {
        //武器
        if (node.name == 'WeaponShop') node.setPosition(-1920, 1080);
        //套裝
        if (node.name == 'ArmorShop') node.setPosition(0, 1080);
        //技能
        if (node.name == 'SkillShop') node.setPosition(1920, 1080);
        //道具
        if (node.name == 'ItemShop') node.setPosition(3840, 1080);
        //
        node.active = false;

    },

    //初始化精靈帳篷
    initElfTant() {
        //
        this.ElfTantLayer = this.node.getChildByName('ElfTantLayer');
        this.ElfTantLayer.active = true;
    },

    //錯誤dialog
    showAlert(message) {
        console.log('showAlert:' + message);
        if (!this.AlertTipLayer) {
            this.AlertTipLayer = cc.find('AlertTipeLayer');
            cc.game.addPersistRootNode(this.AlertTipLayer);//儲存為永久節點
        }
        // this.AlertTipLayer.getComponent('Alert').LeaveFunc = function(){};//設定執行方法
        this.AlertTipLayer.getComponent('Alert').initErrorAlert(message);
        this.AlertTipLayer.setPosition(960, 540);
    },

    //打開武器店
    weaponShopButtonClick(event) {
        this.weaponShop.active = true;
        this.weaponShop.getComponent('WeaponShop').show('1');
    },

    //打開套裝店
    armorShopButtonClick(event) {
        this.armorShop.active = true;
        this.armorShop.getComponent('ArmorShop').show('1');
    },

    //打開道具店
    itemShopButtonClick(event) {
        this.itemShop.active = true;
        this.itemShop.getComponent('ItemShop').show();
    },

    //打開技能店
    skillShopButtonClick(event) {
        this.skillShop.active = true;
        this.skillShop.getComponent('SkillShop').show();
    },

    //前往精靈帳篷
    goElfTant() {
        this.scheduleOnce(function () {
            if (this.ElfTantLayer) {
                this.ElfTantLayer.getComponent('ElfTantLayer').init(5, 5000, 20000, 20, 10000, 100);
                this.ElfTantLayer.getComponent('ElfTantLayer').show();
            }
        }, 0.2);
    },

    goMenu() {
        this.scheduleOnce(function menu() {
            cc.director.loadScene("MenuScene");
        }, 0.1);
    },

    //競技場
    goArena() {
        this.scheduleOnce(function Arena() {
            cc.director.loadScene("ArenaListAreaScene");
        }, 0.1);
    },

    //關卡 type = 前往的種類
    goLevel(event, type) {
        console.log(type);
        this.dataNode.getComponent('DataNode').levelType = parseInt(type);
        this.scheduleOnce(function level() {
            cc.director.loadScene("LevelScene");
        }, 0.1);
    },

    goMail() {
        this.scheduleOnce(function level() {
            cc.director.loadScene("Mail");
        }, 0.1);
    },

    //取得伺服器token
    gteServerToken() {
        var self = this;

        this.request.serverAccess(function (json, error) {
            if (error != null) {
                // self.showAlert(error);
                console.log(error);
            } else {
                if (json.result_status == false) {
                    var message = json.result_message;
                    // self.showAlert(message);
                    console.log(message);
                } else {
                    var token = json.result_content;
                    console.log('Server token: ' + token);
                    self.getUserToken(token);
                }
            }
        });
    },

    //取得玩家token
    getUserToken(serverToken) {
        var self = this;
        var account = 'Test1';
        var password = '1234';
        this.request.loginForDragon(serverToken, account, password, function (json, error) {
            if (error != null) {
                self.showAlert(error);
                console.log(error);
            } else {
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.showAlert(message);
                    console.log(message);
                } else {
                    var token = json.result_content;
                    console.log('User token: ' + token);
                    self.dataNode.getComponent('DataNode').token = json.result_content;
                    self.getMemberInfo(token);
                }
            }
        });
    },

    //取得個人資訊
    getMemberInfo(userToken) {
        this.request.members(userToken, function (json, error) {
            if (error != null) {
                // self.showAlert(error);
                console.log(error);
            } else {
                console.log(JSON.stringify(json));
                if (json.result_status == false) {
                    var message = json.result_message;
                    // self.showAlert(message);
                    console.log(message);
                } else {
                    self.dataNode.getComponent('DataNode').userInfo = json.result_content;
                }
            }
        });
    },



    // update (dt) {},
});
