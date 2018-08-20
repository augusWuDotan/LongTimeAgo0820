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
        backButtonClickCallback: {
            default: null,
            visible: false
        },
        onError: {
            default: null,
            visible: false
        },
        shopType: {
            default: '',
            visible: false   
        },
        heavyArmorGoodsList: {
            default: [],
            visible: false   
        },
        heavyArmorCountdown: {
            default: 0,
            visible: false
        },
        leatherGoodsList: {
            default: [],
            visible: false  
        },
        leatherCountdown: {
            default: 0,
            visible: false
        },
        clothGoodsList: {
            default: [],
            visible: false  
        },
        clothCountdown: {
            default: 0,
            visible: false
        },
        welcomeMessage: {
            default: '',
            visible: false
        },
        selectedGoods: {
            default: null,
            visible: false
        },
        selectedItem: {
            default: null,
            visible: false
        },
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

    onLoad () {
       
    },

    init(){
        this.setTabView();
        this.detailBoard.active = false;  
    },

    setTabView () {
        var self = this;
        var gridLayoutHorizontalItemCount = 3;
        var gridLayoutVerticalItemCount = 1;

        this.tabView.getComponent("TabView").getItemCount = function(currentTab) {
            var itemCount;

            switch (currentTab) {
                case 1:
                itemCount = self.heavyArmorGoodsList != null ? self.heavyArmorGoodsList.length : 0;
                break;
                case 0:
                itemCount = self.leatherGoodsList != null ? self.leatherGoodsList.length : 0;
                break;
                case 2:
                itemCount = self.clothGoodsList != null ? self.clothGoodsList.length : 0;
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
                'goodsColor': null
            };

            var itemCountInSinglePage = gridLayoutHorizontalItemCount * gridLayoutVerticalItemCount;
            var index = itemCountInSinglePage * currentPage + itemIndex;
            switch (currentTab) {
                case 1:
                data.goods = self.heavyArmorGoodsList[index];
                data.type = '鎧甲';
                break;
                case 0:
                data.goods = self.leatherGoodsList[index];
                data.type = '皮甲';
                break;
                case 2:
                data.goods = self.clothGoodsList[index];
                data.type = '布甲';
                break;
                default:
                break;
            }

            var goodsContainerImagePath;
            switch (data.goods.EquipmentLevel_ID) {
                case 1:
                data.rare = '普通'
                data.goodsColor = cc.Color.WHITE;
                goodsContainerImagePath = 'Texture/TabView/WhiteArmorGoodsContainer';
                break;
                case 2:
                data.rare = '精良'
                data.goodsColor = cc.Color.GREEN;
                goodsContainerImagePath = 'Texture/TabView/GreenArmorGoodsContainer';
                break;
                case 3:
                data.rare = '稀有'
                data.goodsColor = cc.Color.CYAN;
                goodsContainerImagePath = 'Texture/TabView/BlueArmorGoodsContainer';
                break;
                case 4:
                data.rare = '傳說'
                data.goodsColor = cc.Color.ORANGE;
                goodsContainerImagePath = 'Texture/TabView/OrangeArmorGoodsContainer';
                break;
                case 5:
                data.rare = '不朽'
                data.goodsColor = cc.Color.MAGENTA;
                goodsContainerImagePath = 'Texture/TabView/PurpleArmorGoodsContainer';
                break;
                default:
                break;
            }

            var itemNode = cc.instantiate(self.itemPrefab);
            itemNode.getComponent('ArmorItem').setPrice(data.goods.Price);
            itemNode.getComponent('ArmorItem').setSoldOut(data.goods.SoldOut);

            cc.loader.loadRes(goodsContainerImagePath, cc.SpriteFrame, function(error, spriteFrame) {
                if (error != null) {
                    self.onError(error);
                } else {
                    itemNode.getComponent('ArmorItem').setGoodsContainer(spriteFrame);
                }
            });

            if (data.goods.EquipmentType_Image != '' && data.goods.EquipmentType_Image != null) {
                cc.loader.load({url: data.goods.EquipmentType_Image, type: 'png'}, function (error, texture) {
                    if (error != null) {
                        self.onError(error);
                    } else {
                        var spriteFrame = new cc.SpriteFrame(texture);
                        itemNode.getComponent('ArmorItem').setGoods(spriteFrame);
                    }
                });
            }

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = self.node;
            clickEventHandler.component = "ArmorShop";
            clickEventHandler.handler = "didSelectGoods";
            clickEventHandler.customEventData = data;

            var toggle = itemNode.addComponent(cc.Toggle);
            toggle.clickEvents.push(clickEventHandler);
            
            return itemNode
        };

        var tabIconImagesPath = ["Texture/ArmorShop/LeatherIcon", "Texture/ArmorShop/HeavyArmorIcon", "Texture/ArmorShop/ClothIcon", "Texture/ArmorShop/ArmorIcon"]
        cc.loader.loadResArray(tabIconImagesPath, cc.SpriteFrame, function(error, spriteFrames) {
            if (error) {
                self.onError(error);
            } else {
                self.tabView.getComponent("TabView").setTabs(spriteFrames.slice(0,3), true);
                self.tabView.getComponent("TabView").setShopIcon(spriteFrames[3]);
            }
        })
        
        this.tabView.getComponent("TabView").setGridLayout(gridLayoutHorizontalItemCount, gridLayoutVerticalItemCount);
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

        this.heavyArmorGoodsList = null;
        this.heavyArmorCountdown = 0;
        this.heavyArmorIsUpdating = false;
        this.leatherGoodsList = null;
        this.leatherCountdown= 0;
        this.leatherIsUpdating = false;
        this.clothGoodsList = null;
        this.clothCountdown = 0;
        this.clothIsUpdating = false;
        this.welcomeMessage = '';

        var self = this;
        this.getGoodsList('7', function() {
            self.tabView.getComponent('TabView').showWelcomeMessage(self.welcomeMessage);
            self.tabView.getComponent('TabView').setItem();
        });

        this.node.setPosition(0, 0);
        this.tabView.getComponent('TabView').playWelcomeBoardAnimation();

        this.countdownCallback = function() {
            self.heavyArmorCountdown -= 1;
            self.leatherCountdown -= 1;
            self.clothCountdown -= 1;

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
                console.log(JSON.stringify(json));
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    switch (id) {
                        case '6':
                        self.heavyArmorGoodsList = json.result_content.EquipmentModels;
                        self.heavyArmorCountdown = json.result_content.RefreshTime;
                        self.welcomeMessage = json.result_content.Message;
                        break;
                        case '7':
                        self.leatherGoodsList = json.result_content.EquipmentModels;
                        self.leatherCountdown = json.result_content.RefreshTime;
                        break;
                        case '8':
                        self.clothGoodsList = json.result_content.EquipmentModels;
                        self.clothCountdown = json.result_content.RefreshTime;
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
            if (this.heavyArmorCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.heavyArmorCountdown)
            }
            break;
            case 1:
            if (this.leatherCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.leatherCountdown)
            }
            break;
            case 2:
            if (this.clothCountdown < 0) {
                dateString = '下次刷新剩餘 00:00:00'
            } else {
                dateString = '下次刷新剩餘 ' + this.getDateString(this.clothCountdown)
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
            if (this.heavyArmorCountdown < 0) {
                if (this.heavyArmorIsUpdating == false) {
                    this.heavyArmorIsUpdating = true;
                    this.getGoodsList('6', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.heavyArmorCountdown);
                        self.heavyArmorIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.heavyArmorCountdown);
            }
            break;
            case 1:
            if (this.leatherCountdown < 0) {
                if (this.leatherIsUpdating == false) {
                    this.leatherIsUpdating = true
                    this.getGoodsList('7', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.leatherCountdown);
                        self.leatherIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.leatherCountdown);
            }
            break;
            case 2:
            if (this.clothCountdown < 0) {
                if (this.clothIsUpdating == false) {
                    this.clothIsUpdating = true;
                    this.getGoodsList('8', function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                        self.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + self.getDateString(self.clothCountdown);
                        self.clothIsUpdating = false;
                    });
                }
            } else {
                this.tabView.getComponent('TabView').countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 ' + this.getDateString(this.clothCountdown);
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
            var goodsContainer = cc.instantiate(event.target.getComponent('ArmorItem').goodsContainer);
            this.detailBoard.getComponent('ArmorDetailBoard').setDetail(customEventData, goodsContainer);
            
            if (this.selectedItem != null) {
                this.selectedItem.getComponent('ArmorItem').changeState(false);
            }
            event.target.getComponent('ArmorItem').changeState(true);
            this.selectedItem = event.target;

            if (this.detailBoard.active == false) {
                this.detailBoard.active = true;
                this.tabView.getComponent('TabView').welcomeBoard.active = false;
            }
        }

        if (isAutoSelect != true) {
            cc.audioEngine.playEffect(this.selectedGoodsAudio, false, 1);
        }
    },

    buyButtonClick () {
        var self = this;
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        this.AlertTipLayer.getComponent('Alert').LeaveFunc =function () {
            self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
            self.buy();
        };//設定執行方法
        this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否購買\n'+self.selectedGoods.Equipment_Name );
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

                    var shopId = self.tabView.getComponent('TabView').currentTabIndex + 6;
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
