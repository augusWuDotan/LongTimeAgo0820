var self;
var ArenaUtils = require('ArenaUtils');
var SkillUtils = require('SkillUtils');
var PentagramControlCallback;

cc.Class({
    extends: cc.Component,

    properties: {
        //五芒星節點
        PentagramAttackNode: {
            default: null,
            type: cc.Node
        },
        //攻擊管理
        AttackControl: {
            default: null,
            serializable: false
        },
        //攻擊管理
        ArenaGameControl: {
            default: null,
            serializable: false
        },
        //
        show_audio: {
            default: null,
            url: cc.AudioClip
        },
        showbtn_audio: {
            default: null,
            url: cc.AudioClip
        },
        //
        click_audio: {
            default: null,
            url: cc.AudioClip
        },
        //
        clickNormal_audio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    // start() {
    // },

    // update(dt) {
    // },

    //設定技能
    setAttackType(SkillData, type, isBot) {
        self = this;
        this.isBot = isBot;
        this.canClick = false;
        this.SkillData = SkillData;//設定
        this.drawSkill(SkillData);//設定技能 顯示技能圖示
        this.drawLevelBg(type);//設定角色層級 顯示五芒星背景
    },

    //設定callback
    setPentagramControlCallback(cal) {
        PentagramControlCallback = cal;
    },

    //顯示出場動畫
    ShowAnim() {
        this.PentagramAttackNode.getComponent(cc.Animation).play(this.PentagramAttackNode.getComponent(cc.Animation)._clips[0].name);
        //顯示音效
        cc.audioEngine.playEffect(this.show_audio, false, 0.5);
    },
    //顯示結束動畫 
    CloseAnim(index) {
        this.PentagramAttackNode.getComponent(cc.Animation).play(this.PentagramAttackNode.getComponent(cc.Animation)._clips[1].name);
        if (PentagramControlCallback) {
            PentagramControlCallback('Pentagram', 'ClickListener', index);
        }
    },
    //顯示按鈕音效
    ShowBtnAudio() {
        //音效
        cc.audioEngine.playEffect(this.showbtn_audio, false, 0.5);
    },

    //點擊事件
    ClickListener(event, index) {
        if (!this.canClick) return;
        var SkillIndex = parseInt(index);
        if (SkillIndex !== 0) {
            console.log('檢查技能');
            var skills = this.SkillData.filter(skill => skill.Sort === parseInt(index));
            if (skills.length != 1) {
                console.log('該位置沒有技能');
                return;
            }
        }
        console.log('檢查魔力');
        if (this.ArenaGameControl) {
            var magicVolume = this.ArenaGameControl.AttributeControl.checkMagic();
            if(SkillIndex != 0){
                if (magicVolume < this.SkillData[SkillIndex-1].MpCost) {
                    console.log('魔力不足');
                    return;
                }
            }else{
                console.log('普通攻擊');
            }     
        } else {
            console.log('沒有檢查魔力');
        }

        //音效
        if (SkillIndex != 0) cc.audioEngine.playEffect(this.click_audio, false, 0.3);
        else cc.audioEngine.playEffect(this.clickNormal_audio, false, 0.3);

        this.canClick = false;
        this.CloseAnim(SkillIndex);
        console.log(SkillIndex);//char
    },

    //監聽 開啟動畫結束禎
    PentagramAttackButtonShow() {
        console.log('PentagramAttackButtonShowfinished');
        if (PentagramControlCallback) {
            PentagramControlCallback('Pentagram', 'PentagramAttackButtonShow');
        }
        this.canClick = true;

        //this.isBot 自動
        console.log('isbot' + this.isBot);
        if (this.isBot) {
            console.log('use bot');
            //決定要用哪一個
            var number = Math.floor(cc.random0To1() * 6);
            var magicVolume = this.ArenaGameControl.AttributeControl.checkMagic();
            if (this.ArenaGameControl && number != 0) {
                //number-1 => 0~4  this.SkillData.length = 5
                if (magicVolume < this.SkillData[number-1].MpCost) {
                    console.log('魔力不足');
                    number = 0;
                }
            } else {
                console.log('沒有檢查魔力');
            }

            //找出該節點
            var ButtonNode = this.node.children[number];
            console.log(ButtonNode);
            //
            this.scheduleOnce(function delay(params) {
                ButtonNode.getComponent(cc.Button).clickEvents[0].emit([number.toString()]);
                var scale1Action = cc.scaleTo(0.3, 0.8, 0.8);
                var scale2Action = cc.scaleTo(0.3, 1, 1);
                var action = cc.sequence(
                    scale1Action,
                    scale2Action
                )
                ButtonNode.runAction(action);
            }, 2);
        }
    },

    //監聽 關閉動畫結束禎
    PentagramAttackButtonClose() {
        console.log('PentagramAttackButtonClosefinished');
        //destroy
        this.node.parent.destroy();
    },

    /**
     * //繪製背景 依據角色的級別來繪製
     * @param {*} Type 
     */
    drawLevelBg(Type) {
        var StateUrl = ArenaUtils.getPentagramPath(Type);
        console.log('更改五芒星背景：' + StateUrl);

        cc.loader.loadRes(StateUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                console.error(err.message || err);
                return;
            } else {
                console.log(spriteFrame);
            }
            self.PentagramAttackNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    drawSkill(SkillData) {
        /*
             {
                    "SkillPrototype_ID": 6,
                    "SkillPrototype_Name": "乾坤一擲",
                    "SkillPrototype_Sign": "0,3,4",
                    "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
                    "MpCost": 10,
                    "AttackTimes": 1,
                    "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
                    "Sort": 1
                }
        */
        //
        var SpriteNode = [this.PentagramAttackNode.getChildByName('AttackOne'), this.PentagramAttackNode.getChildByName('AttackTwo'),
        this.PentagramAttackNode.getChildByName('AttackThree'), this.PentagramAttackNode.getChildByName('AttackFour'), this.PentagramAttackNode.getChildByName('AttackFive')];
        var magicVolume = this.ArenaGameControl.AttributeControl.checkMagic();//現存魔力
        //
        var LoadUrls = [];//預存路徑陣列
        var LoadSpriteNode = [];//預存節點陣列 確認顯示icon位置
        //建立配對陣列
        var skillIndex = 0;
        SkillData.forEach(skill => {
            if (skill.SkillPrototype_ID !== null && skill.SkillPrototype_ID !== -1) {
                LoadSpriteNode.push(SpriteNode[(skill.Sort - 1)]);
                let path = SkillUtils.getSkillIconPath(skill.SkillPrototype_ID);
                if (path === '') {
                    LoadUrls.push('/Texture/ArenaAttack/AttackSkill/' + 'hit');
                } else {
                    LoadUrls.push(path);
                }
                //配置檢查本次可否使用 魔力不足則詼諧
                if(magicVolume<skill.MpCost){
                    SpriteNode[(skill.Sort - 1)].getComponent(cc.Button).interactable = false;
                }
            }
            skillIndex++;
        });

        //load all
        cc.loader.loadResArray(LoadUrls, cc.SpriteFrame, (err, res) => {
            if (err) {
                console.error(err.message || err);
                return;
            } else {
                console.log(res);
            }

            for (let i = 0; i < res.length; i++) {
                //
                var spriteFrame = res[i];
                var oldSphw = spriteFrame.getOriginalSize().height > spriteFrame.getOriginalSize().width ? spriteFrame.getOriginalSize().width : spriteFrame.getOriginalSize().height;
                var spriteNode = LoadSpriteNode[i];
                var spHw = spriteNode.height > spriteNode.width ? spriteNode.width : spriteNode.height;//取得當下節點的 高度寬度;
                var mScale = (spHw / 2) / oldSphw;//計算縮放比

                //如果有節點之後再繼續處理圖示
                if (spriteNode && spriteFrame) {
                    // console.log('show');
                    spriteNode.getChildByName('Skill').opacity = 255;
                    spriteNode.getChildByName('Skill').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    spriteNode.getChildByName('Skill').scale = mScale;
                } else {
                    spriteNode.getChildByName('Skill').opacity = 0;
                }

            }
        });
    },




});
