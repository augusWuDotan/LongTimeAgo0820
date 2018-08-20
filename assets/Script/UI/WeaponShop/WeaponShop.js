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
        coinLabel: {
            default: null,
            type: cc.Node
        },
        battleCoinLabel: {
            default: null,
            type: cc.Node
        },
        tabView: {
            default: null,
            type: cc.Node
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        detailBoard: {
            default: null,
            type: cc.Node
        },
        backButtonClickCallback: null,
        onError: null,

        shopType: '',
        swordGoodsList: null,
        swordCountdown: 0,
        axeGoodsList: null,
        axeCountdown: 0,
        hammerGoodsList: null,
        hammerCountdown: 0,
        spearGoodsList: null,
        spearCountdown: 0,
        wandGoodsList: null,
        wandCountdown: 0,
        welcomeMessage: '',

        selectedGoods: null,
        selectedItem: null,

        openAudio: {
            url: cc.AudioClip,
            default: null
        },
        buyButtonAudio: {
            url: cc.AudioClip,
            default: null
        },
        selectedGoodsAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // 初始化介面
    onLoad () {
        
    },

    init(){
        this.setTabView();
        this.detailBoard.active = false;  
    },

    setTabView () {
        var self = this;

        this.tabView.getComponent("TabView").getItemCount = function(currentTab) {
            var itemCount;

            switch (currentTab) {
                case 0:
                itemCount = self.swordGoodsList != null ? self.swordGoodsList.length : 0;
                break;
                case 1:
                itemCount = self.axeGoodsList != null ? self.axeGoodsList.length : 0;
                break;
                case 2:
                itemCount = self.hammerGoodsList != null ? self.hammerGoodsList.length : 0;
                break;
                case 3:
                itemCount = self.spearGoodsList != null ? self.spearGoodsList.length : 0;
                break;
                case 4:
                itemCount = self.wandGoodsList != null ? self.wandGoodsList.length : 0;
                break;
                default:
                break;
            }

            return itemCount
        }

        this.tabView.getComponent("TabView").getItem = function(currentTab, currentPage, itemIndex) {
            var data = {
                'goods': null,
                'type': null,
                'rare': null,
                'goodsColor': null,
                'goodsContainer': null
            };

            switch (currentTab) {
                case 0:
                data.goods = self.swordGoodsList[itemIndex];
                data.type = '劍';
                break;
                case 1:
                data.goods = self.axeGoodsList[itemIndex];
                data.type = '斧';
                break;
                case 2:
                data.goods = self.hammerGoodsList[itemIndex];
                data.type = '槌';
                break;
                case 3:
                data.goods = self.spearGoodsList[itemIndex];
                data.type = '矛';
                break;
                case 4:
                data.goods = self.wandGoodsList[itemIndex];
                data.type = '杖';
                break;
                default:
                break;
            }

            var goodsContainerImagePath;
            switch (data.goods.EquipmentLevel_ID) {
                case 1:
                data.rare = '普通'
                data.goodsColor = cc.Color.WHITE;
                goodsContainerImagePath = 'Texture/TabView/WhiteGoodsContainer';
                break;
                case 2:
                data.rare = '精良'
                data.goodsColor = cc.Color.GREEN;
                goodsContainerImagePath = 'Texture/TabView/GreenGoodsContainer';
                break;
                case 3:
                data.rare = '稀有'
                data.goodsColor = cc.Color.CYAN;
                goodsContainerImagePath = 'Texture/TabView/BlueGoodsContainer';
                break;
                case 4:
                data.rare = '傳說'
                data.goodsColor = cc.Color.ORANGE;
                goodsContainerImagePath = 'Texture/TabView/OrangeGoodsContainer';
                break;
                case 5:
                data.rare = '不朽'
                data.goodsColor = cc.Color.MAGENTA;
                goodsContainerImagePath = 'Texture/TabView/PurpleGoodsContainer';
                break;
                default:
                break;
            }

            var itemNode = cc.instantiate(self.itemPrefab);
            itemNode.getComponent('WeaponItem').setPrice(data.goods.Price);
            itemNode.getComponent('WeaponItem').setSoldOut(data.goods.SoldOut);

            cc.loader.loadRes(goodsContainerImagePath, cc.SpriteFrame, function(error, spriteFrame) {
                if (error != null) {
                    self.onError(error);
                } else {
                    itemNode.getComponent('WeaponItem').setGoodsContainer(spriteFrame);
                }
            });

            if (data.goods.EquipmentType_Image != '' && data.goods.EquipmentType_Image != null) {
                cc.loader.load({url: data.goods.EquipmentType_Image, type: 'png'}, function (error, texture) {
                    if (error != null) {
                        self.onError(error);
                    } else {
                        var spriteFrame = new cc.SpriteFrame(texture);
                        itemNode.getComponent('WeaponItem').setGoods(spriteFrame);
                    }
                });
            }

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = self.node;
            clickEventHandler.component = "WeaponShop";
            clickEventHandler.handler = "didSelectGoods";
            clickEventHandler.customEventData = data;

            var toggle = itemNode.addComponent(cc.Toggle);
            toggle.clickEvents.push(clickEventHandler);
            
            return itemNode
        };

        var tabIconImagesPath = ["Texture/WeaponShop/SwordIcon", "Texture/WeaponShop/AxeIcon", "Texture/WeaponShop/HammerIcon", "Texture/WeaponShop/SpearIcon", "Texture/WeaponShop/WandIcon", "Texture/WeaponShop/WeaponIcon"]
        cc.loader.loadResArray(tabIconImagesPath, cc.SpriteFrame, function(error, spriteFrames) {
            if (error) {
                self.onError(error);
            } else {
                self.tabView.getComponent("TabView").setTabs(spriteFrames.slice(0,5), true);
                self.tabView.getComponent("TabView").setShopIcon(spriteFrames[5]);
            }
        })
        
        this.tabView.getComponent("TabView").setGridLayout(4, 2);
        this.tabView.getComponent('TabView').tabClickCallback = function() {
            self.updateCountdownLabelWithoutCallAPI();
        };

        this.tabView.getComponent('TabView').didSetItem = function() {
            if (self.detailBoard.active == true) {
                self.scheduleOnce(function() {
                    self.selectFirstItem();
                }, 0.1);
            }
        }
    },

    // start () {},

    // update (dt) {},

    // 刷新列表並顯示
    show (shopType) {
        this.shopType = shopType;

        this.swordGoodsList = null;
        this.swordCountdown = 0;
        this.swordIsUpdating = false;
        this.axeGoodsList = null;
        this.axeCountdown = 0;
        this.axeIsUpdating = false;
        this.hammerGoodsList = null;
        this.hammerCountdown = 0;
        this.hammerIsUpdating = false;
        this.spearGoodsList = null;
        this.spearCountdown = 0;
        this.spearIsUpdating = false;
        this.wandGoodsList = null;
        this.wandCountdown = 0;
        this.wandIsUpdating = false;
        this.welcomeMessage = '';

        var self = this;

        this.getGoodsList('1', function() {
            self.tabView.getComponent('TabView').showWelcomeMessage(self.welcomeMessage);
            self.tabView.getComponent('TabView').setItem();
        });

        this.node.setPosition(0, 0);
        this.tabView.getComponent('TabView').playWelcomeBoardAnimation();

        this.countdownCallback = function() {
            self.swordCountdown -= 1;
            self.axeCountdown -= 1;
            self.hammerCountdown -= 1;
            self.spearCountdown -= 1;
            self.wandCountdown -= 1;

            self.updateCountdownLabel();
        };
        this.schedule(this.countdownCallback, 1);

        cc.audioEngine.playEffect(this.openAudio, false, 1);
    },

    // Call API 取得商品列表
    getGoodsList (id, callback) {
        var self = this;
        var dataNode = cc.director.getScene().getChildByName("DataNode");
        var token = dataNode.getComponent('DataNode').token;

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getEquipmentShopGoodsList(token, id, this.shopType, function(json, error) {
            if (error != null) {
                if (self.onError != null) {
                    self.onError(error);
                }
            } else {
                console.log('----');
                console.log(JSON.stringify(json));
                console.log('----');
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    switch (id) {
                        case '1':
                        self.swordGoodsList = json.result_content.EquipmentModels;
                        self.swordCountdown = json.result_content.RefreshTime;
                        self.welcomeMessage = json.result_content.Message;
                        break;
                        case '2':
                        self.axeGoodsList = json.result_content.EquipmentModels;
                        self.axeCountdown = json.result_content.RefreshTime;
                        break;
                        case '3':
                        self.hammerGoodsList = json.result_content.EquipmentModels;
                        self.hammerCountdown = json.result_content.RefreshTime;
                        break;
                        case '4':
                        self.spearGoodsList = json.result_content.EquipmentModels;
                        self.spearCountdown = json.result_content.RefreshTime;
                        break;
                        case '5':
                        self.wandGoodsList = json.result_content.EquipmentModels;
                        self.wandCountdown = json.result_content.RefreshTime;
                        break;
                        default:
                        break;
                    }
                    callback();
                }
            }
        })
    },

    getDateString (secondsRemaining) {
        var hour = Math.floor(secondsRemaining / 3600);
        var hourString = hour < 10 ? '0' + hour : hour;
        var minute = Math.floor(secondsRemaining % 3600 / 60);
        var minuteString = minute < 10 ? '0' + minute : minute;
        var second = secondsRemaining % 60;
        var secondString = second < 10 ? '0' + second : second;
        return hourString + ':' + minuteString + ':' + secondString;
    },

    updateCountdownLabelWithoutCallAPI () {
        var dateString
        switch (this.tabView.getComponent('TabView').currentTabIndex) {
            case 0:
            if (this.swordCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.swordCountdown)
            }
            break;
            case 1:
            if (this.axeCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.axeCountdown)
            }
            break;
            case 2:
            if (this.hammerCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.hammerCountdown)
            }
            break;
            case 3:
            if (this.spearCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.spearCountdown)
            }
            break;
            case 4:
            if (this.wandCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.wandCountdown)
            }
            break;
            default:
            break
        }

        this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = dateString;
    },

    updateCountdownLabel () {
        var self = this;
        switch (this.tabView.getComponent('TabView').currentTabIndex) {
            case 0:
            if (this.swordCountdown < 0) {
                if (this.swordIsUpdating == false) {
                    this.swordIsUpdating = true;
                    this.getGoodsList('1', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.swordCountdown);
                        self.swordIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.swordCountdown);
            }
            break;
            case 1:
            if (this.axeCountdown < 0) {
                if (this.axeIsUpdating == false) {
                    this.axeIsUpdating = true;
                    this.getGoodsList('2', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.axeCountdown);
                        self.axeIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.axeCountdown);
            }
            break;
            case 2:
            if (this.hammerCountdown < 0) {
                if (this.hammerIsUpdating == false) {
                    this.hammerIsUpdating = true;
                    this.getGoodsList('3', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.hammerCountdown);
                        self.hammerIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.hammerCountdown);
            }
            break;
            case 3:
            if (this.spearCountdown < 0) {
                if (this.spearIsUpdating == false) {
                    this.spearIsUpdating = true;
                    this.getGoodsList('4', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.spearCountdown);
                        self.spearIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.spearCountdown);
            }
            break;
            case 4:
            if (this.wandCountdown < 0) {
                if (this.wandIsUpdating == false) {
                    this.wandIsUpdating = true
                    this.getGoodsList('5', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.wandCountdown);
                        self.wandIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.wandCountdown);
            }
            break;
            default:
            break
        }
    },

    selectFirstItem () {
        var firstItem = this.tabView.getComponent('TabView').gridLayout.children[0];
        var clickEventHandler = firstItem.getComponent(cc.Toggle).clickEvents[0];
        var customEventData = clickEventHandler.customEventData;
        var event = {
            'target': firstItem
        }
        this.didSelectGoods(event, customEventData, true);
    },

    didSelectGoods (event, customEventData, isAutoSelect) {
        if (this.selectedItem === event.target == false) {
            this.selectedGoods = customEventData.goods;
            var goodsContainer = cc.instantiate(event.target.getComponent('WeaponItem').goodsContainer);
            this.detailBoard.getComponent('WeaponDetailBoard').setDetail(customEventData, goodsContainer);

            if (this.selectedItem != null) {
                this.selectedItem.getComponent('WeaponItem').changeState(false);
            }
            event.target.getComponent('WeaponItem').changeState(true);
            this.selectedItem = event.target;
            
            if (this.detailBoard.active == false) {
                this.detailBoard.active = true;
                this.tabView.getComponent('TabView').welcomeBoard.active = false;
            }
        }

        if (isAutoSelect != true) {
            // this.selectedItem.getComponent('WeaponItem').selectedEffect();
            cc.audioEngine.playEffect(this.selectedGoodsAudio, false, 1);
        }
    },

    //購買點擊
    buyButtonClick () {
        var self = this;
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        this.AlertTipLayer.getComponent('Alert').LeaveFunc =function () {
            self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
            self.buy();
        };//設定執行方法
        this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否購買\n'+self.selectedGoods.Equipment_Name);
        this.AlertTipLayer.setPosition(960, 540);
    
        cc.audioEngine.playEffect(this.buyButtonAudio, false, 1);
    },

    buy(){
        var self = this;
        var dataNode = cc.director.getScene().getChildByName("DataNode");
        var token = dataNode.getComponent('DataNode').token;

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.buyEquipmentShopGoods(token, this.selectedGoods.KeyCode, function(json, error) {
            if (error != null) {
                self.onError(error);
            } else {
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    self.onError('購買 ' + self.selectedGoods.Equipment_Name + ' 成功');

                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    var shopId = self.tabView.getComponent('TabView').currentTabIndex + 1;
                    self.getGoodsList(shopId.toString(), function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                    });
                }
            }
        });
    },

    backButtonClick () {
        this.backButtonClickCallback(this.node);
        this.unschedule(this.countdownCallback);
        this.coinLabel.getComponent(cc.Label).string = '0';
        this.battleCoinLabel.getComponent(cc.Label).string = '0';
        this.tabView.getComponent('TabView').close();
        this.detailBoard.active = false;
    }
});
