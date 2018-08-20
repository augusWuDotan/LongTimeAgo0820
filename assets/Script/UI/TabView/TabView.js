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
        // 所有 Tab 的容器
        tabsContainer: {
            default: null,
            type: cc.Node
        },
        // 顯示當前選中 Tab 的 Icon
        currentTab: {
            default: null,
            type: cc.Node
        },
        prevButton: {
            default: null,
            type: cc.Node
        },
        nextButton: {
            default: null,
            type: cc.Node
        },
        gridLayout: {
            default: null,
            type: cc.Node
        },
        countdownContainer: {
            default: null,
            type: cc.Node
        },
        countdownLabel: {
            default: null,
            type: cc.Node
        },
        welcomeBoard: {
            default: null,
            type: cc.Node
        },
        welcomeMessageLabel: {
            default: null,
            type: cc.Node
        },
        shopIcon: {
            default: null,
            type: cc.Node
        },
        tabNormalSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            visible: false
        },
        tabPressedSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            visible: false
        }, 
        // 所有 Tab icon 的 Sprite frame
        tabIconSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame],
            visible: false
        },
        // 所有 Tab 的按鈕陣列
        tabButtons: {
            default: [],
            type: [cc.Button],
            visible: false
        },
        // 當前 Tab 項目
        currentTabIndex: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        // 當前 Grid 頁數
        currentPageIndex: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        // 當前 Tab 內所有項目數量
        totalItemCount: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        // 單一頁 Grid 項目數量
        itemCountInSinglePage: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        // 取得 Grid 內項目數量的方法
        getItemCount: {
            default: null,
            visible: false
        },
        // 取得 Grid 內物件的方法
        getItem: {
            default: null,
            visible: false
        },
        tabClickCallback: {
            default: null,
            visible: false
        },
        didSetItem: {
            default: null,
            visible: false
        },
        tabButtonAudio: {
            url: cc.AudioClip,
            default: null
        },
        pageButtonAudio: {
            url: cc.AudioClip,
            default: null
        },
        typeAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.prevButton.active = false;
        this.nextButton.active = false;
    },

    // start () {},

    // update (dt) {},

    setTabs (tabIconSpriteFrames, isFromTop) {
        var self = this;

        this.currentTab.getComponent(cc.Sprite).spriteFrame = tabIconSpriteFrames[0];
        this.tabIconSpriteFrames = tabIconSpriteFrames;
        this.tabButtons = [];

        var tabNormalImagePath = 'Texture/TabView/TabNormal';
        var tabPressedImagePath = 'Texture/TabView/TabPressed';
        cc.loader.loadResArray([tabNormalImagePath, tabPressedImagePath], cc.SpriteFrame, function (error, spriteFrames) {
            if (error) {
                console.log('DEV Error: ' + error)
            } else {
                self.tabNormalSpriteFrame = spriteFrames[0];
                self.tabPressedSpriteFrame = spriteFrames[1];
                setTabs(isFromTop);
            }
        })

        function setTabs(isFromTop) {
            var tabsContainerSize = self.tabsContainer.getContentSize();

            // 從下方開始生成按鈕的話圖片順序要反轉
            if (isFromTop == false) {
                self.tabIconSpriteFrames.reverse();
            }

            // 試算生成所有 Tab 加間隔總寬，以決定 Tab 和間隔大小
            var tabWidthScale = self.tabNormalSpriteFrame.getRect().width / self.tabNormalSpriteFrame.getRect().height;
            var tabHeightScale = self.tabNormalSpriteFrame.getRect().height / self.tabNormalSpriteFrame.getRect().width;
            var trialHeight = tabsContainerSize.height / (self.tabIconSpriteFrames.length + 1);
            // 防止在 Tab 數量少的時候高度過高
            if (trialHeight > tabsContainerSize.height * 0.16) {
                trialHeight = tabsContainerSize.height * 0.16
            }
            var trialWidth = trialHeight * tabWidthScale;
            var tabWidth
            var tabHeight
            if (trialWidth > tabsContainerSize.width) {
                tabWidth = tabsContainerSize.width;
                tabHeight = tabsContainerSize.width * tabHeightScale;
            } else {
                tabWidth = trialWidth;
                tabHeight = trialHeight;
            }

            var trialSpacing = (tabsContainerSize.height - (tabHeight * self.tabIconSpriteFrames.length)) / (self.tabIconSpriteFrames.length - 1)
            var spacing
            // 防止在 Tab 數量少的時候間格過大
            if (trialSpacing > tabsContainerSize.height * 0.04) {
                spacing = tabsContainerSize.height * 0.04;
            } else {
                spacing = trialSpacing;
            }
            
            // 跑迴圈正式生成 Tab
            for (var i = 0; i < self.tabIconSpriteFrames.length; i++) {
                // 設定 Tab 的 Node
                var tabNode = new cc.Node();
                tabNode.setContentSize(tabWidth, tabHeight);

                var pointX = -(tabsContainerSize.width / 2) + tabWidth / 2;
                var pointY
                if (isFromTop == true) {
                    pointY = tabsContainerSize.height / 2 - tabNode.height / 2 - (tabHeight + spacing) * i;
                } else {
                    pointY = -(tabsContainerSize.height / 2) + tabNode.height / 2 + (tabHeight + spacing) * i;
                }
                tabNode.setPosition(pointX, pointY);

                if (isFromTop == true) {
                    tabNode.tag = i;
                    if (i == 0) {
                        tabNode.scale = 1.3
                        tabNode.anchorX = 0.4
                    }
                } else {
                    tabNode.tag = self.tabIconSpriteFrames.length - 1 - i;
                    if (self.tabIconSpriteFrames.length - 1 - i == 0) {
                        tabNode.scale = 1.3
                        tabNode.anchorX = 0.4
                    }
                }

                // 設定 Tab 的 Sprite
                var tabSprite = tabNode.addComponent(cc.Sprite);
                tabSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;

                // 設定 Tab 的 Button
                var tabButton = tabNode.addComponent(cc.Button);
                if (isFromTop == true) {
                    if (i == 0) {
                        tabButton.normalSprite = self.tabPressedSpriteFrame;
                    } else {
                        tabButton.normalSprite = self.tabNormalSpriteFrame;
                    }
                } else {
                    if (self.tabIconSpriteFrames.length - 1 - i == 0) {
                        tabButton.normalSprite = self.tabPressedSpriteFrame;
                    } else {
                        tabButton.normalSprite = self.tabNormalSpriteFrame;
                    }
                }
                
                tabButton.pressedSprite = self.tabPressedSpriteFrame;
                tabButton.transition = cc.Button.Transition.SPRITE;

                // 設定 Tab icon
                var tabIconSpriteFrame = self.tabIconSpriteFrames[i];
                var tabIconHeightScale = tabIconSpriteFrame.getRect().height / tabIconSpriteFrame.getRect().width;
                var tabIconWidth = tabWidth * 0.6;
                var tabIconHeight = tabIconWidth * tabIconHeightScale;

                var tabIconNode = new cc.Node();
                tabIconNode.setContentSize(tabIconWidth, tabIconHeight);
                var tabIconSprite = tabIconNode.addComponent(cc.Sprite);
                tabIconSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                tabIconSprite.spriteFrame = tabIconSpriteFrame;

                if (isFromTop == true) {
                    if (i == 0) {
                        tabIconNode.scale = 1.3
                        tabIconNode.anchorX = 0.4
                    }
                } else {
                    if (self.tabIconSpriteFrames.length - 1 - i == 0) {
                        tabIconNode.scale = 1.3
                        tabIconNode.anchorX = 0.4
                    }
                }

                tabNode.addChild(tabIconNode);

                // 設定 Button 的點擊事件
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = self.node;
                clickEventHandler.component = "TabView";
                clickEventHandler.handler = "tabButtonClick";
                if (isFromTop == true) {
                    clickEventHandler.customEventData = i;
                } else {
                    clickEventHandler.customEventData = self.tabIconSpriteFrames.length - 1 - i;
                }
                tabButton.clickEvents.push(clickEventHandler);

                self.tabButtons.push(tabButton);
                self.tabsContainer.addChild(tabNode);
            }

            if (isFromTop == false) {
                self.tabIconSpriteFrames.reverse();
                self.tabButtons.reverse();
            }
        }
    },

    tabButtonClick (event, customEventData) {
        for (i = 0; i < this.tabButtons.length; i++) {
            var tabButton = this.tabButtons[i];
            var tabIconNode = tabButton.node.children[0];

            if (i == customEventData) {
                tabButton.normalSprite = this.tabPressedSpriteFrame;
                tabButton.node.scale = 1.3;
                tabButton.node.anchorX = 0.4
                tabIconNode.scale = 1.3
                tabIconNode.anchorX = 0.4
            } else {
                tabButton.normalSprite = this.tabNormalSpriteFrame;
                tabButton.node.scale = 1;
                tabButton.node.anchorX = 0.5
                tabIconNode.scale = 1
                tabIconNode.anchorX = 0.5
            }
        }

        this.currentTab.getComponent(cc.Sprite).spriteFrame = this.tabIconSpriteFrames[customEventData];
        this.currentTabIndex = customEventData;

        this.removeAllItem();
        this.setItem();

        if (this.tabClickCallback != null) {
            this.tabClickCallback();
        }

        cc.audioEngine.playEffect(this.tabButtonAudio, false, 1);
    },

    pageButtonClick (event, customEventData) {
        var self = this;

        function getItemCount() {
            if ((self.totalItemCount / self.itemCountInSinglePage) - self.currentPageIndex >= 1) {
                return self.itemCountInSinglePage;
            } else if ((self.totalItemCount / self.itemCountInSinglePage) - self.currentPageIndex >= 0) {
                return self.totalItemCount % self.itemCountInSinglePage;
            } else if ((self.totalItemCount / self.itemCountInSinglePage) - self.currentPageIndex < 0) {
                return 0;
            }
        }

        function setItem(itemCount) {
            self.gridLayout.removeAllChildren(true);
            for (i = 0; i < itemCount; i++) {
                var item = self.getItem(self.currentTabIndex, self.currentPageIndex, i);
                self.gridLayout.addChild(item);
            }
        }

        function setPageButtonActive() {
            self.prevButton.active = self.currentPageIndex > 0;
            var totalPage = self.totalItemCount / self.itemCountInSinglePage;
            self.nextButton.active = self.currentPageIndex + 1 < totalPage;
        }

        switch (customEventData) {
            case "PREV":
            if (this.currentPageIndex > 0) {
                this.currentPageIndex -= 1;
                setItem(this.itemCountInSinglePage);
                setPageButtonActive();
            }
            break;
            case "NEXT":
            this.currentPageIndex += 1;
            var itemCount = getItemCount()
            if (itemCount == 0) {
                this.currentPageIndex -= 1;
            } else {
                setItem(itemCount);
                setPageButtonActive();
            }
            break;
            default:
            break;
        }

        cc.audioEngine.playEffect(this.pageButtonAudio, false, 1);
    },

    // 設定 GridLayout
    setGridLayout (horizontalItemCount, verticalItemCount) {
        this.gridLayout.cascadeOpacity = false;

        var gridLayoutSize = this.gridLayout.getContentSize();
        var spacing = gridLayoutSize.width * 0.04;

        var gridLayout = this.gridLayout.getComponent(cc.Layout);
        gridLayout.type = cc.Layout.Type.GRID;
        gridLayout.resizeMode = cc.Layout.ResizeMode.CHILDREN
        // 計算 Item 大小，最後 -1 為補正值
        var cellSizeWidth = (gridLayoutSize.width - (spacing * horizontalItemCount)) / horizontalItemCount - 1;
        var cellSizeHeight = (gridLayoutSize.height - (spacing * verticalItemCount)) / verticalItemCount - 1;
        gridLayout.cellSize = new cc.size(cellSizeWidth, cellSizeHeight);
        gridLayout.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
        gridLayout.spacingX = spacing;
        gridLayout.spacingY = spacing;
        gridLayout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        gridLayout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
        gridLayout.padding = spacing / 2;

        this.itemCountInSinglePage = horizontalItemCount * verticalItemCount;
    },

    removeAllItem () {
        this.prevButton.active = false;
        this.nextButton.active = false;
        this.gridLayout.removeAllChildren(true);
    },

    setItem () {
        this.removeAllItem();
        this.currentPageIndex = 0
        this.totalItemCount = this.getItemCount(this.currentTabIndex);

        if (this.totalItemCount > this.itemCountInSinglePage) {
            for (i = 0; i < this.itemCountInSinglePage; i++) {
                var item = this.getItem(this.currentTabIndex, this.currentPageIndex, i);
                this.gridLayout.addChild(item);
            }
            this.nextButton.active = true;
        } else {
            for (i = 0; i < this.totalItemCount; i++) {
                var item = this.getItem(this.currentTabIndex, this.currentPageIndex, i);
                this.gridLayout.addChild(item);
            }
            this.nextButton.active = false;
        }

        if (this.didSetItem != null && this.totalItemCount != 0) {
            this.didSetItem();
        }
    },

    setCountdownActive (active) {
        this.countdownContainer.active = active;
    },

    setWelcomeMessage(message) {
        this.welcomeMessageLabel.getComponent(cc.Label).string = message;
    },

    setShopIcon(spriteFrame) {
        this.shopIcon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    playWelcomeBoardAnimation () {
        this.welcomeBoard.getComponent(cc.Animation).play('WelcomeBoardShow');
    },

    showWelcomeMessage (message) {
        this.welcomeMessage = message;
        this.currentMessageIndex = 0;

        this.schedule(this.updateWelcomeMessage, 0.1, message.length, 1);
    },

    updateWelcomeMessage () {
        this.currentMessageIndex += 1;
        var message = this.welcomeMessage.slice(0, this.currentMessageIndex);

        this.welcomeMessageLabel.getComponent(cc.Label).string = message;

        // cc.audioEngine.playEffect(this.typeAudio, false, 1);
    },

    close () {
        for (i = 0; i < this.tabButtons.length; i++) {
            var tabButton = this.tabButtons[i];
            var tabIconNode = tabButton.node.children[0];

            if (i == 0) {
                tabButton.normalSprite = this.tabPressedSpriteFrame;
                tabButton.node.scale = 1.3;
                tabButton.node.anchorX = 0.4
                tabIconNode.scale = 1.3
                tabIconNode.anchorX = 0.4
            } else {
                tabButton.normalSprite = this.tabNormalSpriteFrame;
                tabButton.node.scale = 1;
                tabButton.node.anchorX = 0.5
                tabIconNode.scale = 1
                tabIconNode.anchorX = 0.5
            }
        }

        this.currentTab.getComponent(cc.Sprite).spriteFrame = this.tabIconSpriteFrames[0];
        this.currentTabIndex = 0;

        this.removeAllItem();
        this.unschedule(this.updateWelcomeMessage);
        this.welcomeMessageLabel.getComponent(cc.Label).string = '';
        this.welcomeBoard.active = true;
        this.countdownLabel.getComponent(cc.Label).string = '下次刷新剩餘 00:00:00'
    }
});
