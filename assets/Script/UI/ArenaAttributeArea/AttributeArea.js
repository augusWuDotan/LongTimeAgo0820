var self;
var ArenaUtils = require('ArenaUtils');
var PropsUtils = require('PropsUtils');
var ArenaCallback;//監聽
cc.Class({
    extends: cc.Component,

    properties: {
        //Protagonist 主角節點 
        ProtagonistLayerNode: {
            default: null,
            type: cc.Node
        },
        //Rival 對手節點
        RivalLayerNode: {
            default: null,
            type: cc.Node
        },
        //題目數量顯示節點
        TopicCountLayer: {
            default: null,
            type: cc.Node
        },
        //Protagonist label 主角對話框
        ProtagonistLabelNode: {
            default: null,
            type: cc.Node
        },
        //Rival label 主角對話框
        RivalLabelNode: {
            default: null,
            type: cc.Node
        },
        //Protagonist 主角節點 頭像背景
        ProtagonistAvatarBG: {
            default: null,
            type: cc.Sprite
        },
        //Protagonist 主角節點 頭像
        ProtagonistAvatar: {
            default: null,
            type: cc.Sprite
        },
        //Protagonist 主角節點 血條魔力背景
        ProtagonistHPMPBg: {
            default: null,
            type: cc.Sprite
        },
        //Protagonist 主角節點 血條支柱
        ProtagonistHPPillarBg: {
            default: null,
            type: cc.Sprite
        },
        //Protagonist 主角節點 魔力支柱
        ProtagonistMPPillarBg: {
            default: null,
            type: cc.Sprite
        },

        //Rival 主角節點 頭像背景
        RivalAvatarBG: {
            default: null,
            type: cc.Sprite
        },
        //Rival 主角節點 頭像
        RivalAvatar: {
            default: null,
            type: cc.Sprite
        },
        //Rival 主角節點 血條魔力背景
        RivalHPMPBg: {
            default: null,
            type: cc.Sprite
        },
        //Rival 主角節點 血條支柱
        RivalHPPillarBg: {
            default: null,
            type: cc.Sprite
        },
        //Rival 主角節點 魔力支柱
        RivalMPPillarBg: {
            default: null,
            type: cc.Sprite
        },

        //道具欄 prefab
        ItemPrefab: {
            default: null,
            type: cc.Prefab
        },

        //Protagonist 道具node
        ProtagonistItemBar: {
            default: null,
            type: cc.Node
        },
        //Rival 道具node
        RivalItemBar: {
            default: null,
            type: cc.Node
        },
        //增益 prefab
        AddPrefab: {
            default: null,
            type: cc.Prefab
        },
        //減益 prefab
        CutPrefab: {
            default: null,
            type: cc.Prefab
        },
        //顯示答題結果 prefab
        ShowTopicResultPrefab: {
            default: null,
            type: cc.Prefab
        },
        //statusBar
        statusVeiticalItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        //statusBar
        statusBarPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // AttributeAreaLayer/ProtagonistLayer/ProtagonistAvatarLayer/Protagonist_Avatar
        if (!this.ProtagonistavatarNode) this.ProtagonistavatarNode = this.node.getChildByName('ProtagonistLayer').getChildByName('ProtagonistAvatarLayer').getChildByName('Protagonist_Avatar');
        //AttributeAreaLayer/RivalLayer/RivalAvatarLayer/Rival_Avatar
        if (!this.RivalavatarNode) this.RivalavatarNode = this.node.getChildByName('RivalLayer').getChildByName('RivalAvatarLayer').getChildByName('Rival_Avatar');
        this.eventTouch(this.ProtagonistavatarNode);
        this.eventTouch(this.RivalavatarNode);
    },

    onDestroy() {
        // AttributeAreaLayer/ProtagonistLayer/ProtagonistAvatarLayer/Protagonist_Avatar
        if (!this.ProtagonistavatarNode) this.ProtagonistavatarNode = this.node.getChildByName('ProtagonistLayer').getChildByName('ProtagonistAvatarLayer').getChildByName('Protagonist_Avatar');
        //AttributeAreaLayer/RivalLayer/RivalAvatarLayer/Rival_Avatar
        if (!this.RivalavatarNode) this.RivalavatarNode = this.node.getChildByName('RivalLayer').getChildByName('RivalAvatarLayer').getChildByName('Rival_Avatar');
        this.eventTouchOff(this.ProtagonistavatarNode);
        this.eventTouchOff(this.RivalavatarNode);
    },

    eventTouch(node) {
        this.zoominScale = node.scale;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log(event.target);
            var avatarNode = event.target.parent;
            node.scale = (self.zoominScale - 0.05);
            if (event.target._name === 'Protagonist_Avatar') {
                //主角屬性
                console.log('主角屬性');
                //this.ProtagonistAttribute node , HP , MP , Name , this.ProtagonistEffectList
                self.ShowStatusBar(avatarNode, self.ProtagonistAttribute.Name, self.ProtagonistAttribute.curStatusList.HP, self.ProtagonistAttribute.curStatusList.MP, self.ProtagonistEffectList);
            } else if (event.target._name === 'Rival_Avatar') {
                //對手屬性
                console.log('對手屬性');
                //this.RivalAttribute
                self.ShowStatusBar(avatarNode, self.RivalAttribute.Name, self.RivalAttribute.curStatusList.HP, self.RivalAttribute.curStatusList.MP, self.RivalEffectList);
            } else {

            }

        }, this);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            node.scale = self.zoominScale;

        }, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            node.scale = self.zoominScale;

        }, this);
    },

    eventTouchOff(node) {
        node.off(cc.Node.EventType.TOUCH_START);
        node.off(cc.Node.EventType.TOUCH_END);
        node.off(cc.Node.EventType.TOUCH_CANCEL);
    },

    //設定回傳
    setArenaCallback(cal) {
        ArenaCallback = cal;
    },
    //初始化 參數、節點
    initData() {
        self = this;
        ArenaUtils.setConsole(false);//關閉ArenaUtils console
        this.AttackType = 'None';//競技場型別 single or Multiplayer
        this.ProtagonistAttribute = null;//玩家屬性
        this.RivalAttribute = null;//對手屬性
        this.UseProps = [];//儲存使用的道具
        this.firstShow = false;//第一次顯示
        this.GameOver = false;//是否陣亡
        this.labelShowtimes = 2;//叫囂顯示時間
        //預設物件狀態
        // this.ProtagonistLabelNode.active = false;//主角對話框 
        // this.RivalLabelNode.active = false;//對手對話框 

        //對手或是單機怪獸 對話框
        if (this.RivalLabelNode) {
            this.RivalLabel = this.RivalLabelNode.getComponentInChildren(cc.Label);
            if (this.RivalLabel) {
                console.log('RivalLabel init');
            }
        }
        //主角節點
        if (this.ProtagonistLayerNode) {
            this.ProtagonistHpMpBarLayer = this.ProtagonistLayerNode.getComponent('ProtagonistHpMpBar');
            if (this.ProtagonistHpMpBarLayer) {
                console.log('ProtagonistHpMpBarLayer init');
            }
        }
        //對手節點
        if (this.RivalLayerNode) {
            this.RivalHpMpBarLayer = this.RivalLayerNode.getComponent('RivalHpMpBar');
            if (this.RivalHpMpBarLayer) {
                console.log('RivalHpMpBarLayer init');
            }
        }
        //題目數量節點 | 計時器
        if (this.TopicCountLayer) {
            //題數
            this.TopicCountLabel = this.TopicCountLayer.getChildByName('TopicCount_Bg').getChildByName('TopicCount').getComponent(cc.Label);
            //計時器 progress
            this.ScheduleProgress = this.TopicCountLayer.getChildByName('progressBar').getComponent(cc.ProgressBar);
            // this.TopicCountLabel = this.TopicCountLayer.getComponentInChildren(cc.Label);
            if (this.TopicCountLabel && this.ScheduleProgress) {
                console.log('TopicCountLabel init');
                console.log('ScheduleProgress init');
            }
        }
    },

    // start() {},
    // update(dt) { },

    //初始屬性設定 
    //設定單機或是對戰  //單機 Single 或是 對戰 Multiplayer
    setAttackType(Type) {
        self = this;
        this.AttackType = Type;
    },

    //設定主角屬性資料
    setProtagonistAttributeData(Attribute) {
        console.log("---ProtagonistAttribute");
        console.log(Attribute);
        this.ProtagonistAttribute = Attribute;
        //console.log(this.ProtagonistAttribute);
        this.setProtagonistIcons(this.ProtagonistAttribute.Background_ID);
        this.initProtagonistItemBar(this.ProtagonistAttribute.Props);
        this.LoadProtagonistAvatar(this.ProtagonistAttribute.MemberRoleImg_URL);
    },

    //設定 對手(雙人對戰) 或是 屬性資料
    setRivalAttributeData(Attribute) {
        console.log("---RivalAttribute");
        console.log(Attribute);
        this.RivalAttribute = Attribute;
        //console.log(this.RivalAttribute);
        this.setRivalIcons(this.RivalAttribute.RoleType, this.RivalAttribute.Background_ID);//設定對手
        this.initRivalItemBar(this.RivalAttribute.Props);
        this.LoadRivalAvatar(this.RivalAttribute.MemberRoleImg_URL);
    },

    //主角陣亡
    ProtagonistGameOver() {
        this.GameOver = true;
        ArenaCallback('AttributeArea', 'ProtagonistGameOver');
    },

    //對手陣亡
    RivalGameOver() {
        this.GameOver = true;
        ArenaCallback('AttributeArea', 'RivalGameOver');
    },

    /**
     * //血量魔力值檢查是否需要增加(有可能已經滿了)
     * @param {*} RoleType 角色 Protagonist | Rival
     * @param {*} type 
     */
    checkRoleHpMpIsFill(RoleType, type) {
        if (RoleType == 'Protagonist') {
            if (type == 'HP') {
                return this.ProtagonistHpMpBarLayer.HpBar.progress == 1;
            } else if (type == 'MP') {
                return this.ProtagonistHpMpBarLayer.MpBar.progress == 1;
            } else {
                //console.log('你要補什麼？');
                return true;
            }
        } else if (RoleType == 'Rival') {
            if (type == 'HP') {
                return this.RivalHpMpBarLayer.HpBar.progress == 1;
            } else if (type == 'HP') {
                return this.RivalHpMpBarLayer.MpBar.progress == 1;
            } else {
                //console.log('你要補什麼？');
                return true;
            }
        } else {
            //console.log('沒這個角色');
            return true;
        }
    },

    /**
     * //魔力值檢查是否可以使用技能
     * @param {*} RoleType 角色 Protagonist | Rival
     * @param {*} type 
     * return 剩下的魔力值
     */
    checkRoleMpNumber(RoleType) {
        if (RoleType == 'Protagonist') {
            return this.ProtagonistHpMpBarLayer.magicVolume;
        } else if (RoleType == 'Rival') {
            return this.RivalHpMpBarLayer.magicVolume;
        } else {
            //console.log('沒這個角色');
            return 0;
        }
    },

    //區域動畫 進場
    AttributeAreaShow() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[4].name);
    },
    //區域動畫 進場 監聽
    AttributeAreaShowFinsh() {
        //console.log('AttributeAreaShowFinsh');
        //console.log(this.RivalAttribute);
        //console.log(this.ProtagonistAttribute);
        if (!this.firstShow) {
            //顯示道具
            this.ProtagonistItemBarShow();
            this.RivalItemBarShow();//
            //血條初始化
            this.initProtagonistBloodAndMagic(this.ProtagonistAttribute.curStatusList.HP, this.ProtagonistAttribute.curStatusList.MP, this.ProtagonistAttribute.StatusList.HP, this.ProtagonistAttribute.StatusList.MP);
            this.initRivalBloodAndMagic(this.RivalAttribute.curStatusList.HP, this.RivalAttribute.curStatusList.MP, this.RivalAttribute.StatusList.HP, this.RivalAttribute.StatusList.MP);

            //顯示對話 第一回合的叫囂
            this.scheduleOnce(function delay(params) {
                if (this.ProtagonistAttribute.Clamor !== '') {
                    this.AddRivalTalkContnet(this.RivalAttribute.Clamor);//
                } else {
                    this.AddRivalTalkContnet('哼！叱吒風雲唯我獨尊');//
                }
            }, 2);

            if (this.ProtagonistAttribute.Clamor !== '') {
                this.AddProtagonistTalkContnet(this.ProtagonistAttribute.Clamor);//
            } else {
                this.AddProtagonistTalkContnet('想當初打遍天下無敵手～');//
            }


            //僅僅第一次執行
            this.firstShow = true;
            //
            ArenaCallback('AttributeArea', 'AttributeAreaShowFinsh', 'AttributeAreaShowFinsh');//開啟動畫結束 //呼叫BossArea
        }
        ArenaCallback('AttributeArea', 'AttributeAreaShowFinsh', 'normal');//開啟動畫結束 //一般
    },

    //區域動畫 離場
    AttributeAreaClose() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[5].name);
    },
    //區域動畫 離場 監聽
    AttributeAreaCloseFinsh() {
        //console.log('AttributeAreaCloseFinsh');
    },

    /**
     * //主角圖示背景等圖像處理
     * @param {*} type 1-5
     */
    setProtagonistIcons(type) {
        var graghModel = ArenaUtils.getRolePath(type);
        //取得圖示路徑
        var HPMPBgActive = graghModel.HPMPBgActive;
        var AvatarBgPath = graghModel.AvatarBgPath;
        var HPMPBgPath = graghModel.HPMPBgPath;
        var HPMPPillarBgPath = graghModel.HPMPPillarBgPath;
        this.ProtagonistHPMPBg.node.active = HPMPBgActive;//是否顯示背景

        var urls = [];
        if (HPMPBgActive) urls.push(HPMPBgPath);
        urls.push(AvatarBgPath);
        urls.push(HPMPPillarBgPath);

        cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, spArray) {
            if (err) {
                console.log('下載錯誤：' + err);
                return;
            } else {
                // console.log('----spArray');
                // console.log(spArray);
                if (HPMPBgActive) {
                    self.ProtagonistHPMPBg.spriteFrame = spArray[0];
                    self.ProtagonistAvatarBG.spriteFrame = spArray[1];
                    self.ProtagonistHPPillarBg.spriteFrame = spArray[2];
                    self.ProtagonistMPPillarBg.spriteFrame = spArray[2];
                } else {
                    self.ProtagonistAvatarBG.spriteFrame = spArray[0];
                    self.ProtagonistHPPillarBg.spriteFrame = spArray[1];
                    self.ProtagonistMPPillarBg.spriteFrame = spArray[1];
                }
            }
        });

    },

    /**
     * //對手 圖示背景等圖像處理
     * @param {*} roleType 對手 rival,怪獸 monster,魔王 boss
     * @param {*} type 0-4
     */
    setRivalIcons(roleType, Indextype) {
        var graghModel = Object.create(null);
        switch (roleType) {
            case 'Role':
                graghModel = ArenaUtils.getRolePath(Indextype);
                break;
            //取得圖示路徑
            case 'monster'://怪獸
                graghModel = ArenaUtils.getMonsterPath(Indextype);
                break;
            case 'boss':
                graghModel = ArenaUtils.getBossPath(Indextype);
                break;
        }
        var HPMPBgActive = graghModel.HPMPBgActive;
        var AvatarBgPath = graghModel.AvatarBgPath;
        var HPMPBgPath = graghModel.HPMPBgPath;
        var HPMPPillarBgPath = graghModel.HPMPPillarBgPath;
        this.RivalHPMPBg.node.active = HPMPBgActive;

        var urls = [];
        if (HPMPBgActive) urls.push(HPMPBgPath);
        urls.push(AvatarBgPath);
        urls.push(HPMPPillarBgPath);

        cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, spArray) {
            if (err) {
                console.log('下載錯誤：' + err);
                return;
            } else {
                // console.log('----spArray');
                // console.log(spArray);
                if (HPMPBgActive) {
                    self.RivalHPMPBg.spriteFrame = spArray[0];
                    self.RivalAvatarBG.spriteFrame = spArray[1];
                    self.RivalHPPillarBg.spriteFrame = spArray[2];
                    self.RivalMPPillarBg.spriteFrame = spArray[2];
                } else {
                    self.RivalAvatarBG.spriteFrame = spArray[0];
                    self.RivalHPPillarBg.spriteFrame = spArray[1];
                    self.RivalMPPillarBg.spriteFrame = spArray[1];
                }
            }
        });
    },

    // 共用方法
    //初始化題目數量
    executeInitTopicCount(totalCount) {
        this.TopicCountLabel.string = '1' + '/' + totalCount;
    },

    //下一題
    executeNextTopic() {
        var counts = this.TopicCountLabel.string.split("/")
        if (counts.length != 2) {
            //console.log(counts.length);
            return
        }
        var countNow = parseInt(counts[0]);
        var countTotal = parseInt(counts[1]);
        if (countNow < countTotal) {
            countNow++;
            this.TopicCountLabel.string = countNow + '/' + countTotal;
        } else {
            this.TopicCountLabel.string = countNow + '/' + countTotal;
        }

    },

    //答題 計時器
    StartAnswerSchedule(second) {
        this.ScheduleProgress.unscheduleAllCallbacks();
        this.ScheduleProgress.progress = 1;
        this.scheduleTime = second;//設定的計時時間
        this.autoFinishControl = true;
        /**
         * 示例
         * second > 5 需求五秒
         * secondms > 5000 共5000毫秒
         * msOnce > 50 每 50 毫秒 一次
         * severalTimes > 共執行幾次 100-1次
         */
        var secondms = second * 1000;
        console.log(secondms);
        var msOnce = 10;//一次前進多少ms
        var severalTimes = secondms / msOnce;
        var num = 0;
        this.ScheduleProgress.schedule(function add(params) {
            num += msOnce;
            var Nprogress = 1 - (num / secondms);
            //progress show Nprogress 這裡顯示
            this.progress = Nprogress;
            /**
             * this.progress 歸0 的時候，
             * 如果 autoFinishControl 還是 true 則 系統自動關閉攻擊控制 並向伺服器發送攻擊命令
             * 反之則不動 等待他人 完成
             */
            if (this.progress === 0 && self.autoFinishControl) {
                //呼叫外部 執行 結束答題階段
                ArenaCallback('AttributeArea', 'StopAnswerControl', null);//關閉攻擊
            }
        }, msOnce / 1000, severalTimes - 1, msOnce / 1000);
    },

    //攻擊 計時器
    StartAttackSchedule(second) {
        this.ScheduleProgress.unscheduleAllCallbacks();
        this.ScheduleProgress.progress = 1;
        this.scheduleTime = second;//設定的計時時間
        this.autoFinishControl = true;
        /**
         * 示例
         * second > 5 需求五秒
         * secondms > 5000 共5000毫秒
         * msOnce > 50 每 50 毫秒 一次
         * severalTimes > 共執行幾次 100-1次
         */
        var secondms = second * 1000;
        console.log(secondms);
        var msOnce = 10;//一次前進多少ms
        var severalTimes = secondms / msOnce;
        var num = 0;
        this.ScheduleProgress.schedule(function add(params) {
            num += msOnce;
            var Nprogress = 1 - (num / secondms);
            //progress show Nprogress 這裡顯示
            this.progress = Nprogress;
            /**
             * this.progress 歸0 的時候，
             * 如果 autoFinishControl 還是 true 則 系統自動關閉攻擊控制 並向伺服器發送攻擊命令
             * 反之則不動 等待他人 完成
             */
            if (this.progress === 0 && self.autoFinishControl) {
                //呼叫外部 執行 結束攻擊階段
                ArenaCallback('AttributeArea', 'StopAttackControl', null);//關閉攻擊
            }
        }, msOnce / 1000, severalTimes - 1, msOnce / 1000);
    },

    //停止計時
    stopSchedule() {
        // 取得該節點的progress
        this.autoFinishControl = false;//
    },

    //取得 計時器 使用的時間
    getScheduleTime() {
        var useTime = Math.floor(this.scheduleTime * (1 - this.ScheduleProgress.progress) * 1000);
        this.stopSchedule();
        console.log(useTime);
        return useTime;
    },

    //加入 誰先攻layer
    AddTopicResult(ProtagonistAnswer, RivalAnswer) {
        if (this.ShowTopicNode) this.ShowTopicNode.destroy();
        //建立
        this.ShowTopicNode = cc.instantiate(this.ShowTopicResultPrefab);
        //將節點建立在選擇的組件上方
        this.node.addChild(this.ShowTopicNode);
        // 为狀態預置设置一个位置 [基本上都是底部]
        this.ShowTopicNode.setPosition(cc.p(0, 0));
        //設定Ｚ層級 [顯示需求]
        this.ShowTopicNode.setLocalZOrder(6);
        //顯示內容
        this.ShowTopicNode.getComponent('ShowTopicResult').initData(ProtagonistAnswer, RivalAnswer, this.ShowTopicResultCallBack);
    },

    //ShowTopicResultcallback
    ShowTopicResultCallBack(model) {
        // console.log('doAttack');
        ArenaCallback('AttributeArea', 'ShowTopicResultCallBack', model);//顯示誰先攻結束
    },

    //主角使用方法
    //設定主角圖
    LoadProtagonistAvatar(path) {
        cc.loader.load(path, function (err, tex) {
            if (err) {
                //console.log(err);
            } else {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                // self.ProtagonistAvatar.spriteFrame = spf;
            }
        });
    },

    //初始化血量//初始化魔力值
    initProtagonistBloodAndMagic(BloodVolume, MagicVolume, MaxBloodVolume, MaxMagicVolume) {
        console.log('BloodVolume:' + BloodVolume);
        console.log('MagicVolume:' + MagicVolume);
        //初始化上升
        if (this.ProtagonistHpMpBarLayer) this.ProtagonistHpMpBarLayer.init(BloodVolume, MagicVolume, MaxBloodVolume, MaxMagicVolume);
    },

    //血量上升（吃藥）
    AddProtagonistBlood(AddValume) {
        this.ProtagonistHpMpBarLayer.BloodUp(AddValume);
    },
    //血量下降 （遭受攻擊）
    CutProtagonistBlood(CutVolume) {
        //阻止超過progress 指定到達位置
        if ((this.ProtagonistHpMpBarLayer.bloodVolume - CutVolume) <= 0) {
            //沒有血量
            // this.ProtagonistGameOver();//主角陣亡
        }
        this.ProtagonistHpMpBarLayer.BloodDown(CutVolume);
    },

    //魔力上升（吃藥）
    AddProtagonistMagic(AddValume) {
        this.ProtagonistHpMpBarLayer.MagicUp(AddValume);
    },

    //魔力下降 （使用魔力）
    CutProtagonistMagic(CutVolume) {
        this.ProtagonistHpMpBarLayer.MagicDown(CutVolume);
    },

    /**
     * //檢查魔力
     * @returns 魔力值
     */
    checkMagic() {
        return this.ProtagonistHpMpBarLayer.getMagic();
    },

    // 主角對話
    AddProtagonistTalkContnet(content) {
        this.ProtagonistLabelNode.getComponent('TalkLayerControl').doProtagonistTalk(content);
    },

    //主角置物格
    initProtagonistItemBar(Items) {
        //這裡要呼叫處理的是 max=5 and 現在的格子
        for (var i = 0; i < Items.length; i++) {
            var Item = cc.instantiate(this.ItemPrefab);
            // 将新增的节点添加到 Canvas 节点下面
            this.ProtagonistItemBar.addChild(Item);
            Item.getComponent('ItemFrame')._tag = Items[i].Sort;
            Item.getComponent('ItemFrame').AttributeArea = this;
            Item.getComponent('ItemFrame').setItemPath('Protagonist', Items[i], true);
            Item.getComponent('ItemFrame').setCallBack(this.ProtagonistItemCallback);
            Item.setPosition(cc.p(0, 0));
        }
    },

    /**
     * //選擇道具回傳訊息
     * 顯示第幾個，可以使用哪一個道具的屬性
     * @param {*} tag 第幾個
     */
    ProtagonistItemCallback(itemData, Component) {
        var model = { 'Sort': itemData.Sort, 'Component': Component };
        console.log(itemData);
        console.log(model);
        self.UseProps.push(model);
        ArenaCallback('AttributeArea', 'ProtagonistItemCallback', model);//開啟動畫結束 //呼叫BossArea
        /**
         * [這裡使用 socketio 執行使用商品]
         * itemData  =  該商品訊息
         * 
         * [等待socketiio callback 這裡執行使用商品的圖像處理]
         * Component.UseThisItem();
         * 這個方法可以把道具使用掉，用於系統回應時的動作
         */
    },

    //使用道具
    UseItem(RoleType, Sort) {
        if (RoleType === 'Protagonist') {
            // var props = this.UseProps.filter(props => props.Sort == Sort);//剩下可以創立的節點 sourceName
            // console.log(props);
            // var propsComponent = props.Component;
            // propsComponent.UseThisItem(); 
            //ProtagonistItemBar 
            var childrens = this.ProtagonistItemBar.children;
            childrens.forEach(child => {
                if (child.getComponent('ItemFrame').itemData.Sort === Sort) {
                    child.getComponent('ItemFrame').UseThisItem();
                }
            });
        } else {
            var childrens = this.RivalItemBar.children;
            childrens.forEach(child => {
                if (child.getComponent('ItemFrame').itemData.Sort === Sort) {
                    child.getComponent('ItemFrame').UseThisItem();
                }
            });
        }
    },

    //主角道具欄顯示
    ProtagonistItemBarShow() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[0].name);
    },
    //主角道具欄顯示 監聽
    ProtagonistItemBarShowFinish() {
        //console.log('ProtagonistItemBarShowFinish');
    },
    //主角道具欄消失
    ProtagonistItemBarClose() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[1].name);
    },
    //主角道具欄消失 監聽
    ProtagonistItemBarCloseFinish() {
        //console.log('ProtagonistItemBarCloseFinish');
    },

    //(單機)BOSS or 怪獸 and (對戰)對手 使用方法
    //對手圖示
    //設定 對手圖
    LoadRivalAvatar(path) {
        cc.loader.load(path, function (err, tex) {
            if (err) {
                //console.log(err);
            } else {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                // self.RivalAvatar.spriteFrame = spf;
            }
        });
    },

    //對手血量調整
    //初始化血量/魔力值
    initRivalBloodAndMagic(BloodVolume, MagicVolume, MaxBloodVolume, MaxMagicVolume) {
        console.log('BloodVolume:' + BloodVolume);
        console.log('MagicVolume:' + MagicVolume);

        if (this.RivalHpMpBarLayer) this.RivalHpMpBarLayer.init(BloodVolume, MagicVolume, MaxBloodVolume, MaxMagicVolume);
    },
    //血量上升（吃藥）
    AddRivalBlood(AddValume) {
        this.RivalHpMpBarLayer.BloodUp(AddValume);
    },
    //血量下降 （遭受攻擊）
    CutRivalBlood(CutVolume) {
        //阻止超過progress 指定到達位置
        if ((this.RivalHpMpBarLayer.bloodVolume - CutVolume) <= 0) {
            //沒有血量
            // this.RivalGameOver();//對手死亡
        }
        this.RivalHpMpBarLayer.BloodDown(CutVolume);
    },

    // 對手魔力調整

    //魔力上升（吃藥）
    AddRivalMagic(AddValume) {
        this.RivalHpMpBarLayer.MagicUp(AddValume);
    },
    //魔力下降 （遭受攻擊）
    CutRivalMagic(CutVolume) {
        this.RivalHpMpBarLayer.MagicDown(CutVolume);
    },

    //對手對話
    AddRivalTalkContnet(content) {
        this.RivalLabelNode.getComponent('TalkLayerControl').doRivalTalk(content);
    },

    // 置物格 Single | Multiplayer
    initRivalItemBar(Items) {
        //如果是單機 怪獸不顯示 道具欄
        //這裡要呼叫處理的是 max=5 and 現在的格子
        if (this.AttackType == 'Single') {
            //console.log('不建立道具欄')
            return;
        } else if (this.AttackType == 'Multiplayer') {
            //console.log('建立道具欄')
        } else {
            //console.log('不知名對戰 不建立道具欄')
            return;
        }

        for (var i = 0; i < Items.length; i++) {
            var Item = cc.instantiate(this.ItemPrefab);
            // 将新增的节点添加到 Canvas 节点下面
            this.RivalItemBar.addChild(Item);
            Item.getComponent('ItemFrame')._tag = Items[i].Sort;
            Item.getComponent('ItemFrame').setItemPath('Rival', Items[i], true);
            Item.setPosition(cc.p(0, 0));
        }
    },

    //對手道具欄顯示
    RivalItemBarShow() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[2].name);
    },
    //主角道具欄顯示 監聽
    RivalItemBarShowFinish() {
        //console.log('RivalItemBarShowFinish');
    },

    //對手道具欄消失
    RivalItemBarClose() {
        this.node.getComponent(cc.Animation).playAdditive(this.node.getComponent(cc.Animation)._clips[3].name);
    },

    //主角道具欄消失 監聽
    RivalItemBarCloseFinish() {
        //console.log('RivalItemBarCloseFinish');
    },


    /**
     * 增益 減益 動態的狀態節點 顯示在血量魔力條上
     * @param {} RoleType Protagonist or Rival
     * @param {} attr_eng 增益或是減益的keytype 
     * @param {} statusValue 正負 量值
     */
    createStatusNodeWithHPMPBar(RoleType, attr_eng, statusValue) {
        //確定要加在哪一個節點
        // var mParentNode = RoleType === 'Protagonist' ? this.ProtagonistLayerNode : this.RivalLayerNode;
        var mParentNode = RoleType === 'Protagonist' ? this.ProtagonistLayerNode : this.node;
        //取得中文代表
        var attr_tw = ArenaUtils.getAttrTitle(attr_eng);
        //要使用的狀態預置體
        var usePrefab = null;
        if (statusValue >= 0) {
            usePrefab = this.AddPrefab;
        } else {
            usePrefab = this.CutPrefab;
        }
        //建立
        var statusNode = cc.instantiate(usePrefab);
        //將節點建立在選擇的組件上方
        mParentNode.addChild(statusNode);
        //scale 
        statusNode.scale = 1.4
        // 为狀態預置设置一个位置 [基本上都是底部]
        statusNode.setPosition(this.getStatusPosition(statusNode, mParentNode, RoleType));
        // 設定顯示的最高點 [父節點的高]
        statusNode.getComponent('StatusCircle').screenHeight = mParentNode.height;
        //
        statusNode.getComponent('StatusCircle').setSpeed(600);
        //設定Ｚ層級 [顯示需求]
        statusNode.setLocalZOrder(10);
        //設定文字
        console.log(attr_tw + (statusValue > 0 ? "+" + statusValue : statusValue));
        statusNode.getComponent('StatusCircle').init(attr_tw + (statusValue > 0 ? "+" + statusValue : statusValue));

        console.log(mParentNode);
    },
    //設定座標
    getStatusPosition(statusNode, mParentNode, RoleType) {
        var addX = cc.randomMinus1To1() * (mParentNode.width / 10);
        var randX = 0;
        if (RoleType === 'Rival') randX += addX;//對手
        var randY = 0 - (mParentNode.height / 2);
        return cc.p(randX, randY);
    },


    //
    UpdateStatusNodeWithProtagonistAvatar(effectList) {
        //找到建立的節點
        self.ProtagonistEffectList = effectList;

        var CreateNode = CreateNode = this.node.getChildByName('ProtagonistLayer').getChildByName('StatusLayer');

         //刪除現有的所有狀態子節點
         CreateNode.removeAllChildren();

         //判斷資料最大值 取其三顯示
         let maxIndex = 0;
         if (effectList) maxIndex = effectList.length >= 3 ? 3 : effectList.length;
 
         //重新建立三個狀態icon
         for (let i = 0; i < maxIndex; i++) {
             var effect = effectList[i]
             var statusPath = '';
             var SourceName = effect.SourceName;
             if (effect.Source === 'Skill') {
                 //技能狀態路徑
                 statusPath = ArenaUtils.getAttributeStatusIconPath_Skill(effect.Element, effect.Value);
             } else {
                 //道具路徑
                 statusPath = PropsUtils.getStatusBarPath(effect.SourceID);
                 console.log('道具路徑' + statusPath);
             }
 
             cc.loader.loadRes(statusPath, cc.SpriteFrame, function (err, sp) {
                 if (err) {
                     console.log('下載錯誤：' + err);
                     return;
                 } else {
                     //建立圖像
                     var SpriteNode = cc.instantiate(self.statusVeiticalItemPrefab);//建立節點
                     let iconSprie = SpriteNode.getComponent(cc.Sprite);//取得圖像component
                     
                     SpriteNode._name = effect.SourceName;//設定name
                     SpriteNode._tag = effect.element;//設定tag
                     CreateNode.addChild(SpriteNode);
                     SpriteNode.setPosition(cc.p(0, 0));//設置座標點 [這裡有layout屬性 設置 0,0 就會自動排列]
                
                     iconSprie.type = cc.Sprite.Type.SIMPLE;
                     iconSprie.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                     iconSprie.trim = true;
                     iconSprie.spriteFrame = sp;//設定圖像
                 }
             });
         }
    },


    //
    UpdateStatusNodeWithRivalAvatar(effectList) {
        //找到建立的節點
        self.RivalEffectList = effectList;
        var CreateNode = CreateNode = this.node.getChildByName('RivalLayer').getChildByName('StatusLayer');

        //刪除現有的所有狀態子節點
        CreateNode.removeAllChildren();

        //判斷資料最大值 取其三顯示
        let maxIndex = 0;
        if (effectList) maxIndex = effectList.length >= 3 ? 3 : effectList.length;

        //重新建立三個狀態icon
        for (let i = 0; i < maxIndex; i++) {
            var effect = effectList[i]
            var statusPath = '';
            var SourceName = effect.SourceName;
            if (effect.Source === 'Skill') {
                //技能狀態路徑
                statusPath = ArenaUtils.getAttributeStatusIconPath_Skill(effect.Element, effect.Value);
            } else {
                //道具路徑
                statusPath = PropsUtils.getStatusBarPath(effect.SourceID);
                console.log('道具路徑' + statusPath);
            }

            cc.loader.loadRes(statusPath, cc.SpriteFrame, function (err, sp) {
                if (err) {
                    console.log('下載錯誤：' + err);
                    return;
                } else {
                    //建立圖像
                    var SpriteNode = cc.instantiate(self.statusVeiticalItemPrefab);//建立節點
                    let iconSprie = SpriteNode.getComponent(cc.Sprite);//取得圖像component
                    // SpriteNode.width = 60;
                    // SpriteNode.height = 60;
                    SpriteNode._name = effect.SourceName;//設定name
                    SpriteNode._tag = effect.element;//設定tag
                    CreateNode.addChild(SpriteNode);
                    SpriteNode.setPosition(cc.p(0, 0));//設置座標點 [這裡有layout屬性 設置 0,0 就會自動排列]
                    // var size = sp.getOriginalSize();//取得圖片大小
                    // let zoomScale = CreateNode.height / size.height;//設置圖像縮小比例
                    // if (zoomScale < 1) SpriteNode.scale = zoomScale;//只縮小不放大
                    // else console.log('不放大');
                    iconSprie.type = cc.Sprite.Type.SIMPLE;
                    iconSprie.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    iconSprie.trim = true;
                    iconSprie.spriteFrame = sp;//設定圖像
                    //顯示方式 直接出線
                    // var fadeinAction = cc.fadeIn(0.5);
                    // SpriteNode.runAction(fadeinAction);
                }
            });
        }
    },

    /**
    *  狀態圖示 顯示在 角色頭像上 [最多顯示三個]
    * @param {} RoleType Protagonist or Rival
    * @param {*} Source Skill or Item
    * @param {*} SourceID 技能或是道具ID
    * @param {*} element 技能影響的參數對應值 ex : HP
    * @param {*} SourceName 技能或是道具名字
    * @param {*} volume 量值 +-
    *  @param {*} effect 值
    */
    AddStatusNodeWithRoleAvatar(RoleType, Source, SourceID, element, SourceName, volume, effect) {
        if (effect.Rounds <= 1) return;//剩餘 回合數 <= 1 不建立小圖示
        console.log('比對開始');
        //找到建立的節點
        var CreateNode = null;
        var haveSameEffect = false;
        if (RoleType === 'Protagonist') {
            if (self.ProtagonistEffectList) {
                console.log('比對主角狀態');
                //檢查是否有相同內容
                self.ProtagonistEffectList.forEach(mEffect => {
                    // console.log('mEffect.Source:'+mEffect.Source + ' ,Source:'+Source);
                    // console.log('mEffect.SourceID:'+mEffect.SourceID + ' ,SourceID:'+SourceID);
                    // console.log('mEffect.SourceName:'+mEffect.SourceName + ' ,SourceName:'+SourceName);
                    // console.log('mEffect.element:'+mEffect.Element + ' ,element:'+element);
                    if (mEffect.Source === Source && mEffect.SourceID === SourceID && mEffect.SourceName === SourceName && mEffect.Element === element) {
                        //todo 修改剩餘回合 ＆ 增減數直
                        mEffect.Rounds = effect.Rounds;
                        mEffect.Value = volume;
                        haveSameEffect = true;
                    }
                });

                if (!haveSameEffect) self.ProtagonistEffectList.push(effect);
            }
            else {
                self.ProtagonistEffectList = [];
                self.ProtagonistEffectList.push(effect);
            }
            CreateNode = this.node.getChildByName('ProtagonistLayer').getChildByName('StatusLayer');
        } else if (RoleType === 'Rival') {
            if (self.RivalEffectList) {
                console.log('比對對手狀態');
                //檢查是否有相同內容
                self.RivalEffectList.forEach(mEffect => {
                    // console.log('mEffect.Source:'+mEffect.Source + ' ,Source:'+Source);
                    // console.log('mEffect.SourceID:'+mEffect.SourceID + ' ,SourceID:'+SourceID);
                    // console.log('mEffect.SourceName:'+mEffect.SourceName + ' ,SourceName:'+SourceName);
                    // console.log('mEffect.element:'+mEffect.Element + ' ,element:'+element);
                    if (mEffect.Source === Source && mEffect.SourceID === SourceID && mEffect.SourceName === SourceName && mEffect.Element === element) {
                        //todo 修改剩餘回合 ＆ 增減數直
                        mEffect.Rounds = effect.Rounds;
                        mEffect.Value = volume;
                        haveSameEffect = true;
                    }
                });
                if (!haveSameEffect) self.RivalEffectList.push(effect);

            }
            else {
                self.RivalEffectList = [];
                self.RivalEffectList.push(effect);
            }
            CreateNode = this.node.getChildByName('RivalLayer').getChildByName('StatusLayer');
        } else {
            //debug
            CreateNode = self.node;
        }

        /**
         * 判斷現在的子節點數量 [最多僅能放三個]
         * 主角狀態節點路徑： AttributeAreaLayer/ProtagonistLayer/ProtagonistAvatarLayer/StatusLayer
         * 主角狀態節點路徑： AttributeAreaLayer/RivalLayer/RivalAvatarLayer/StatusLayer
         */
        var Childs = CreateNode.children.length;//現在子節點的數量
        if (Childs >= 3) {
            console.log('已經顯示三個狀態了')
            return;
        }

        if (haveSameEffect) {
            console.log('已經具有該狀態')
            return;
        }

        //取得對應狀態種類
        var statusPath = '';
        if (Source === 'Skill') {
            //技能狀態路徑
            statusPath = ArenaUtils.getAttributeStatusIconPath_Skill(element, volume);
        } else {
            //道具路徑
            statusPath = PropsUtils.getStatusBarPath(SourceID);
        }

        cc.loader.loadRes(statusPath, cc.SpriteFrame, function (err, sp) {
            if (err) {
                console.log('下載錯誤：' + err);
                return;
            } else {
                //建立圖像
                var SpriteNode = cc.instantiate(self.statusVeiticalItemPrefab);//建立節點
                let iconSprie = SpriteNode.getComponent(cc.Sprite);//取得圖像component
                // SpriteNode.width = 60;
                // SpriteNode.height = 60;
                SpriteNode._name = SourceName;//設定name
                SpriteNode._tag = element;//設定tag
                SpriteNode.opacity = 0;//設定透明度
                CreateNode.addChild(SpriteNode);
                SpriteNode.setPosition(cc.p(0, 0));//設置座標點 [這裡有layout屬性 設置 0,0 就會自動排列]
                // var size = sp.getOriginalSize();//取得圖片大小
                // let zoomScale = CreateNode.height / size.height;//設置圖像縮小比例
                // if (zoomScale < 1) SpriteNode.scale = zoomScale;//只縮小不放大
                // else console.log('不放大');
                iconSprie.type = cc.Sprite.Type.SIMPLE;
                iconSprie.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                iconSprie.trim = true;
                iconSprie.spriteFrame = sp;//設定圖像
                //顯示方式 漸出
                var fadeinAction = cc.fadeIn(0.5);
                SpriteNode.runAction(fadeinAction);
            }
        });
    },

    /**
     * 顯示 StatusBar 狀態
     * @param {*} AvatarNode 
     * @param {*} name 
     * @param {*} hp 
     * @param {*} mp 
     * @param {*} effectList 
     */
    ShowStatusBar(AvatarNode, name, hp, mp, effectList) {
        console.log(effectList);
        if (this.StatusBar) this.StatusBar.destroy();
        this.StatusBar = cc.instantiate(this.statusBarPrefab);
        this.node.addChild(this.StatusBar);
        this.StatusBar.setLocalZOrder(7);//設定Ｚ層級 [顯示需求]
        this.StatusBarControl = this.StatusBar.getComponent('StatusBar');
        this.StatusBarControl.initData(AvatarNode, name, hp, mp, effectList);
        this.StatusBar.setPosition(cc.p(0, 0));
    },

});
