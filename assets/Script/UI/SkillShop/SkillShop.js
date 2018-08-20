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
        physicalSkillList: {
            default: [],
            visible: false
        },
        goldSkillList: {
            default: [],
            visible: false
        },
        woodSkillList: {
            default: [],
            visible: false
        },
        waterSkillList: {
            default: [],
            visible: false
        },
        fireSkillList: {
            default: [],
            visible: false
        },
        earthSkillList: {
            default: [],
            visible: false
        },
        welcomeMessage: {
            default: '',
            visible: false
        },
        selectedSkill: {
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
        selectedSkillAudio: {
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
            var itemCount;

            switch (currentTab) {
                case 0:
                itemCount = self.physicalSkillList != null ? self.physicalSkillList.length : 0;
                break;
                case 1:
                itemCount = self.goldSkillList != null ? self.goldSkillList.length : 0;
                break;
                case 2:
                itemCount = self.woodSkillList != null ? self.woodSkillList.length : 0;
                break;
                case 3:
                itemCount = self.waterSkillList != null ? self.waterSkillList.length : 0;
                break;
                case 4:
                itemCount = self.fireSkillList != null ? self.fireSkillList.length : 0;
                break;
                case 5:
                itemCount = self.earthSkillList != null ? self.earthSkillList.length : 0;
                break;
                default:
                break;
            }

            return itemCount
        }

        this.tabView.getComponent("TabView").getItem = function(currentTab, currentPage, itemIndex) {
            var data = {
                'skill': null,
                'type': null,
                'skillColor': null
            };

            var itemCountInSinglePage = gridLayoutHorizontalItemCount * gridLayoutVerticalItemCount;
            var index = itemCountInSinglePage * currentPage + itemIndex;
            var skillContainerImagePath;
            switch (currentTab) {
                case 0:
                data.skill = self.physicalSkillList[index];
                data.type = '物理';
                data.skillColor = cc.Color.WHITE;
                skillContainerImagePath = 'Texture/TabView/PhysicalSkillContainer';
                break;
                case 1:
                data.skill = self.goldSkillList[index];
                data.type = '金';
                data.skillColor = cc.Color.YELLOW;
                skillContainerImagePath = 'Texture/TabView/GoldSkillContainer';
                break;
                case 2:
                data.skill = self.woodSkillList[index];
                data.type = '木';
                data.skillColor = cc.Color.GREEN;
                skillContainerImagePath = 'Texture/TabView/WoodSkillContainer';
                break;
                case 3:
                data.skill = self.waterSkillList[index];
                data.type = '水';
                data.skillColor = cc.Color.CYAN;
                skillContainerImagePath = 'Texture/TabView/WaterSkillContainer';
                break;
                case 4:
                data.skill = self.fireSkillList[index];
                data.type = '火';
                data.skillColor = cc.Color.RED;
                skillContainerImagePath = 'Texture/TabView/FireSkillContainer';
                break;
                case 5:
                data.skill = self.earthSkillList[index];
                data.type = '土';
                data.skillColor = cc.Color.ORANGE;
                skillContainerImagePath = 'Texture/TabView/EarthSkillContainer';
                break;
                default:
                break;
            }

            var itemNode = cc.instantiate(self.itemPrefab);
            itemNode.getComponent('SkillItem').setPrice(data.skill.Price);

            cc.loader.loadRes(skillContainerImagePath, cc.SpriteFrame, function(error, spriteFrame) {
                if (error != null) {
                    self.onError(error);
                } else {
                    itemNode.getComponent('SkillItem').setSkillContainer(spriteFrame);
                }
            });

            if (data.skill.SkillPrototype_Img != '' && data.skill.SkillPrototype_Img != null) {
                cc.loader.load({url: data.skill.SkillPrototype_Img, type: 'jpg'}, function (error, texture) {
                    if (error != null) {
                        self.onError(error);
                    } else {
                        var spriteFrame = new cc.SpriteFrame(texture);
                        itemNode.getComponent('SkillItem').setSkill(spriteFrame);
                    }
                });
            }

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = self.node;
            clickEventHandler.component = "SkillShop";
            clickEventHandler.handler = "didSelectSkill";
            clickEventHandler.customEventData = data;

            var toggle = itemNode.addComponent(cc.Toggle);
            toggle.clickEvents.push(clickEventHandler);
            
            return itemNode
        };

        var tabIconImagesPath = ["Texture/SkillShop/PhysicalIcon", "Texture/SkillShop/GoldIcon", "Texture/SkillShop/WoodIcon", "Texture/SkillShop/WaterIcon", "Texture/SkillShop/FireIcon", "Texture/SkillShop/EarthIcon", "Texture/SkillShop/SkillIcon"]
        cc.loader.loadResArray(tabIconImagesPath, cc.SpriteFrame, function(error, spriteFrames) {
            if (error) {
                self.onError(error);
            } else {
                self.tabView.getComponent("TabView").setTabs(spriteFrames.slice(0,6), true);
                self.tabView.getComponent("TabView").setShopIcon(spriteFrames[6]);
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
        this.physicalSkillList = null;
        this.goldSkillList = null;
        this.woodSkillList = null;
        this.waterSkillList = null;
        this.fireSkillList = null;
        this.earthSkillList = null;
        this.welcomeMessage = '';

        var self = this;
        this.getSkillList(function() {
            self.tabView.getComponent('TabView').showWelcomeMessage(self.welcomeMessage);
            self.tabView.getComponent('TabView').setItem();
        });

        this.node.setPosition(0, 0);
        this.tabView.getComponent('TabView').playWelcomeBoardAnimation();

        cc.audioEngine.playEffect(this.openAudio, false, 1);
    },

    // Call API 取得技能列表
    getSkillList (callback) {
        var self = this;
        var dataNode = cc.director.getScene().getChildByName("DataNode");
        var token = dataNode.getComponent('DataNode').token;

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getSkillShopGoodsList(token, function(json, error) {
            if (error != null) {
                if (self.onError != null) {
                    self.onError(error);
                }
            } else {
                console.log('------');
                console.log(JSON.stringify(json));
                console.log('------');
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    self.welcomeMessage = json.result_content.Message;

                    var skills = json.result_content.SkillModels;
                    for (i = 0; i < skills.length; i++) {
                        var skill = skills[i];
                        switch (skill.Crystal_ID) {
                            case 1:
                            self.physicalSkillList = skill.Skill;
                            break;
                            case 2:
                            self.goldSkillList = skill.Skill;
                            break;
                            case 3:
                            self.woodSkillList = skill.Skill;
                            break;
                            case 4:
                            self.waterSkillList = skill.Skill;
                            break;
                            case 5:
                            self.fireSkillList = skill.Skill;
                            break;
                            case 6:
                            self.earthSkillList = skill.Skill;
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
        this.didSelectSkill(event, customEventData, true);
    },

    didSelectSkill (event, customEventData, isAutoSelect) {
        if (this.selectedItem === event.target == false) {
            this.selectedSkill = customEventData.skill;
            var skillContainer = cc.instantiate(event.target.getComponent('SkillItem').skillContainer);
            this.detailBoard.getComponent('SkillDetailBoard').setDetail(customEventData, skillContainer);
            
            if (this.selectedItem != null) {
                this.selectedItem.getComponent('SkillItem').changeState(false);
            }
            event.target.getComponent('SkillItem').changeState(true);
            this.selectedItem = event.target;

            if (this.detailBoard.active == false) {
                this.detailBoard.active = true;
                this.tabView.getComponent('TabView').welcomeBoard.active = false;
            }
        }

        if (isAutoSelect != true) {
            cc.audioEngine.playEffect(this.selectedSkillAudio, false, 1);
        }
    },

    //購買按鍵
    buyButtonClick () {

        var self = this;
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        this.AlertTipLayer.getComponent('Alert').LeaveFunc =function () {
            self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
            self.buy();
        };//設定執行方法
        this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否學習 '+self.selectedSkill.SkillPrototype_Name );
        this.AlertTipLayer.setPosition(960, 540);
    
        cc.audioEngine.playEffect(this.buyButtonAudio, false, 1);
    },

    //購買
    buy(){

        var self = this;
        var dataNode = cc.director.getScene().getChildByName("DataNode");
        var token = dataNode.getComponent('DataNode').token;

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.buySkillShopGoods(token, this.selectedSkill.SkillPrototype_ID, function(json, error) {
            if (error != null) {
                self.onError(error);
            } else {
                if (json.result_status == false) {
                    var message = json.result_message;
                    self.onError(message);
                } else {
                    self.onError('購買 ' + self.selectedSkill.SkillPrototype_Name + ' 成功');

                    var member = json.result_content.MemberRoleModels;
                    self.coinLabel.getComponent(cc.Label).string = member.MemberRole_Golds;
                    self.battleCoinLabel.getComponent(cc.Label).string = member.MemberRole_ArenaPoints;

                    self.getSkillList(function() {
                        self.tabView.getComponent('TabView').removeAllItem();
                        self.tabView.getComponent('TabView').setItem();
                    });
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
