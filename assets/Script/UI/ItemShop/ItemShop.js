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
        potionGoodsList: {
            default: [],
            visible: false
        },
        reelGoodsList: {
            default: [],
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
        var gridLayoutHorizontalItemCount = 4;
        var gridLayoutVerticalItemCount = 2;

        this.tabView.getComponent("TabView").getItemCount = function(currentTab) {
            var itemCount

            switch (currentTab) {
                case 0:
                itemCount = self.potionGoodsList != null ? self.potionGoodsList.length : 0;
                break;
                case 1:
                itemCount = self.reelGoodsList != null ? self.reelGoodsList.length : 0;
                break;
                default:
                break;
            }

            return itemCount
        }

        this.tabView.getComponent("TabView").getItem = function(currentTab, currentPage, itemIndex) {
            var data = {
                'goods': null,
                'type': null
            };

            var itemCountInSinglePage = gridLayoutHorizontalItemCount * gridLayoutVerticalItemCount;
            var index = itemCountInSinglePage * currentPage + itemIndex;
            switch (currentTab) {
                case 0:
                data.goods = self.potionGoodsList[index];
                data.type = self.potionGoodsList[index].PropsType_Name;
                break;
                case 1:
                data.goods = self.reelGoodsList[index];
                data.type = self.reelGoodsList[index].PropsType_Name;
                break;
                default:
                break;
            }

            var goodsContainerImagePath = 'Texture/TabView/WhiteGoodsContainer';

            var itemNode = cc.instantiate(self.itemPrefab);
            itemNode.getComponent('Item').setPrice(data.goods.Price);

            cc.loader.loadRes(goodsContainerImagePath, cc.SpriteFrame, function(error, spriteFrame) {
                if (error != null) {
                    self.onError(error);
                } else {
                    itemNode.getComponent('Item').setGoodsContainer(spriteFrame);
                }
            });

            if (data.goods.PropsPrototype_Img != '' && data.goods.PropsPrototype_Img != null) {
                cc.loader.load({url: data.goods.PropsPrototype_Img, type: 'png'}, function (error, texture) {
                    if (error != null) {
                        self.onError(error);
                    } else {
                        var spriteFrame = new cc.SpriteFrame(texture);
                        itemNode.getComponent('Item').setGoods(spriteFrame);
                    }
                });
            }

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = self.node;
            clickEventHandler.component = "ItemShop";
            clickEventHandler.handler = "didSelectGoods";
            clickEventHandler.customEventData = data;

            var toggle = itemNode.addComponent(cc.Toggle);
            toggle.clickEvents.push(clickEventHandler);
            
            return itemNode
        };

        var tabIconImagesPath = ["Texture/ItemShop/HealthIcon", "Texture/ItemShop/ReelIcon", "Texture/ItemShop/ItemIcon"]
        cc.loader.loadResArray(tabIconImagesPath, cc.SpriteFrame, function(error, spriteFrames) {
            if (error) {
                self.onError(error);
            } else {
                self.tabView.getComponent("TabView").setTabs(spriteFrames.slice(0,2), true);
                self.tabView.getComponent("TabView").setShopIcon(spriteFrames[2]);
            }
        })
        
        this.tabView.getComponent("TabView").setGridLayout(gridLayoutHorizontalItemCount, gridLayoutVerticalItemCount);
        this.tabView.getComponent("TabView").setCountdownActive(false);
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
    show () {
        this.potionGoodsList = [];
        this.reelGoodsList = []
        this.welcomeMessage = '';

        var self = this;
        this.getGoodsList(function() {
            self.tabView.getComponent('TabView').showWelcomeMessage(self.welcomeMessage);
            self.tabView.getComponent('TabView').setItem();
        });

        this.node.setPosition(0, 0);
        this.tabView.getComponent('TabView').playWelcomeBoardAnimation();

        cc.audioEngine.playEffect(this.openAudio, false, 1);
    },

    // Call API 取得商品列表
    getGoodsList (callback) {
        var self = this;
        var dataNode = cc.director.getScene().getChildByName("DataNode");
        var token = dataNode.getComponent('DataNode').token;

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getItemShopGoodsList(token, function(json, error) {
            if (error != null) {
                if (self.onError != null) {
                    self.onError(error);
                }
            } else {
                console.log('-----');
                console.log(JSON.stringify(json));
                console.log('-----');
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    self.welcomeMessage = json.result_content.Message;

                    var goods = json.result_content.PropModels;
                    for (i = 0; i < goods.length; i++) {
                        var tempGoods = goods[i];
                        switch (tempGoods.PropsType_ID) {
                            case 1:
                            self.potionGoodsList.push(tempGoods);
                            break;
                            case 4:
                            self.reelGoodsList.push(tempGoods);
                            break;
                            default:
                            break;
                        }
                    }

                    callback();
                }
            }
        })
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
            var goodsContainer = cc.instantiate(event.target.getComponent('Item').goodsContainer);
            this.detailBoard.getComponent('ItemDetailBoard').setDetail(customEventData, goodsContainer);
            
            if (this.selectedItem != null) {
                this.selectedItem.getComponent('Item').changeState(false);
            }
            event.target.getComponent('Item').changeState(true);
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
        var itemCount = this.detailBoard.getComponent('ItemDetailBoard').itemCount;
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        this.AlertTipLayer.getComponent('Alert').LeaveFunc =function () {
            self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
            self.buy();
        };//設定執行方法
        this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否購買'+itemCount+'個'+self.selectedGoods.PropsPrototype_Name );
        this.AlertTipLayer.setPosition(960, 540);
    
        cc.audioEngine.playEffect(this.buyButtonAudio, false, 1);
    },

    buy(){
        var self = this;
        var dataNode = cc.director.getScene().getChildByName("DataNode");
        var token = dataNode.getComponent('DataNode').token;
        var itemId = this.selectedGoods.PropsPrototype_ID;
        var itemCount = this.detailBoard.getComponent('ItemDetailBoard').itemCount;

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.buyItemShopGoods(token, itemId, itemCount, function(json, error) {
            if (error != null) {
                self.onError(error);
            } else {
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    self.onError('購買 ' + self.selectedGoods.PropsPrototype_Name + ' 成功');

                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    self.detailBoard.getComponent('ItemDetailBoard').resetItemCount();
                }
            }
        });
    },

    backButtonClick () {
        this.backButtonClickCallback(this.node);
        this.coinLabel.getComponent(cc.Label).string = '0';
        this.battleCoinLabel.getComponent(cc.Label).string = '0';
        this.tabView.getComponent('TabView').close();
        this.detailBoard.active = false;
    }
});
