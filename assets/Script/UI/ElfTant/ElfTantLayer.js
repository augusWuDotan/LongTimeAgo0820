
cc.Class({
    extends: cc.Component,

    properties: {
        //badge level
        badge1: {
            default: null,
            type: cc.SpriteFrame
        },
        badge2: {
            default: null,
            type: cc.SpriteFrame
        },
        badge3: {
            default: null,
            type: cc.SpriteFrame
        },
        badge4: {
            default: null,
            type: cc.SpriteFrame
        },
        badge5: {
            default: null,
            type: cc.SpriteFrame
        },
        //---- 稱號等級icon背景
        roleLevelBg1: {
            default: null,
            type: cc.SpriteFrame
        },
        roleLevelBg2: {
            default: null,
            type: cc.SpriteFrame
        },
        roleLevelBg3: {
            default: null,
            type: cc.SpriteFrame
        },
        roleLevelBg4: {
            default: null,
            type: cc.SpriteFrame
        },
        roleLevelBg5: {
            default: null,
            type: cc.SpriteFrame
        },
        //回去的方法
        // backClick:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() { },

    /**
     * 
     * @param {*} titleLavel 稱號等級
     * @param {*} currentExperience 已經獲得的經驗值
     * @param {*} maxExperience 最大經驗值
     * @param {*} roleLevel 人物等級
     * @param {*} Cost 金幣
     * @param {*} ArenaCost 競技幣 
     */
    init(titleLavel, currentExperience, maxExperience, roleLevel, Cost, ArenaCost) {

        //設定值
        this.titleLavel = titleLavel;
        this.currentExperience = currentExperience;
        this.maxExperience = maxExperience;
        this.roleLevel = roleLevel;
        this.Cost = Cost;
        this.ArenaCost = ArenaCost;

        //叫囂
        this.TalkDialogLayer = this.node.getChildByName('TalkDialogLayer');//叫囂
        this.TalkDialogLayer.active = true;//變動 叫囂 存在狀態

        //badge and rolelevel bg //由稱號等級設定 等級背景 與 徽章icon 
        //由稱號等級 初始化徽章dialog
        this.badgeDialogLayer = this.node.getChildByName('badgeDialogLayer');//徽章
        this.badgeDialogLayer.active = true;//變動 徽章 存在狀態
        this.badgeDialogLayer.getComponent('badgeDialog').init(this.titleLavel);
        //exp 數值、progressBar
        this.exp = this.node.getChildByName('exp');//經驗
        this.currectExp = this.exp.getChildByName('expResult').getChildByName('currect');//已經獲得經驗
        this.maxExp = this.exp.getChildByName('expResult').getChildByName('max');//最大經驗
        this.exp.getComponent(cc.ProgressBar).progress = (this.currentExperience / this.maxExperience);
        this.currectExp.getComponent(cc.Label).string = this.currentExperience;
        this.maxExp.getComponent(cc.Label).string = this.maxExperience;
        this.checkBadgeAndLevelBg();

        //rolelevel
        this.roleLevelLabel = this.exp.getChildByName('level_bg').getChildByName('level');//角色等級
        this.roleLevelLabel.getComponent(cc.Label).string = this.roleLevel;

        //Cost ArenaCost 
        this.gold = this.node.getChildByName('gold');//金幣
        this.gold.getChildByName('coin_fight').getChildByName('count').getComponent(cc.Label).string = ArenaCost;
        this.gold.getChildByName('coin').getChildByName('count').getComponent(cc.Label).string = Cost;

        //屬性
        this.PackLayer = this.node.getChildByName('PackLayer');
        if (this.PackLayer) {
            this.PackLayer.getComponent('PackLayer').ElfTantLayer = this;
            this.PackLayer.getComponent('PackLayer').ContentState = 'attribute';
            this.PackLayer.getComponent('PackLayer').init();
        }

        //itemLayer 道具欄
        this.itemLayer = this.node.getChildByName('itemLayer');
        if (this.itemLayer) {
            this.itemLayer.getComponent('itemLayer').init();
        }

        //skillLayer 技能五芒星
        this.skillLayer = this.node.getChildByName('skillLayer');
        if (this.skillLayer) {
            this.skillLayer.getComponent('skillLayer').init(this.titleLavel);
        }
    },

    show() {
        this.node.active = true;
        this.node.setPosition(cc.p(0, 0));
    },

    //back
    back() {
        this.node.setPosition(cc.p(1920, -1080));
        this.node.active = false;
    },

    //--- talk 
    openTalkDialog() {
        this.TalkDialogLayer.active = true;
        this.TalkDialogLayer.getChildByName('TalkDialog').getChildByName('editLayer').getChildByName('edit').getComponent(cc.EditBox).string = this.node.getChildByName('backpack_talk').getChildByName('content').getComponent(cc.Label).string;
        this.TalkDialogLayer.setPosition(cc.p(0, 0));
    },

    closeTalkDialog() {
        this.TalkDialogLayer.setPosition(cc.p(-1920, -1080));
        this.TalkDialogLayer.active = false;
    },

    //設定叫囂對話 
    doSetTalk() {
        this.node.getChildByName('TalkDialogLayer').setPosition(cc.p(-1920, -1080));
        var content = this.node.getChildByName('TalkDialogLayer').getChildByName('TalkDialog').getChildByName('editLayer').getChildByName('edit').getComponent(cc.EditBox).string;
        this.node.getChildByName('TalkDialogLayer').getChildByName('TalkDialog').getChildByName('editLayer').getChildByName('edit').getComponent(cc.EditBox).string = '';

        if (content != null && content.length > 0) {
            console.log(content);
            this.node.getChildByName('backpack_talk').getChildByName('content').getComponent(cc.Label).string = content;
        } else {
            console.log('no content');
        }
    },

    //--- badge
    checkBadgeAndLevelBg() {
        var self = this;

        switch (this.titleLavel) {
            case 1:
                self.node.getChildByName('badge').getComponent(cc.Sprite).spriteFrame = self.badge1;
                self.exp.getChildByName('level_bg').getComponent(cc.Sprite).spriteFrame = self.roleLevelBg1;
                break;
            case 2:
                self.node.getChildByName('badge').getComponent(cc.Sprite).spriteFrame = self.badge2;
                self.exp.getChildByName('level_bg').getComponent(cc.Sprite).spriteFrame = self.roleLevelBg2;
                break;
            case 3:
                self.node.getChildByName('badge').getComponent(cc.Sprite).spriteFrame = self.badge3;
                self.exp.getChildByName('level_bg').getComponent(cc.Sprite).spriteFrame = self.roleLevelBg3;
                break;
            case 4:
                self.node.getChildByName('badge').getComponent(cc.Sprite).spriteFrame = self.badge4;
                self.exp.getChildByName('level_bg').getComponent(cc.Sprite).spriteFrame = self.roleLevelBg4;
                break;
            case 5:
                self.node.getChildByName('badge').getComponent(cc.Sprite).spriteFrame = self.badge5;
                self.exp.getChildByName('level_bg').getComponent(cc.Sprite).spriteFrame = self.roleLevelBg5;
                break;
            default:
                self.node.getChildByName('badge').getComponent(cc.Sprite).spriteFrame = self.badge1;
                self.exp.getChildByName('level_bg').getComponent(cc.Sprite).spriteFrame = self.roleLevelBg1;
                break;
        }
    },

    //打開徽章
    openBadgeDialog() {
        this.badgeDialogLayer.setPosition(cc.p(0, 0));
        this.badgeDialogLayer.active = true;
    },

    //收起徽章
    closeBadgeDialog() {
        this.badgeDialogLayer.setPosition(cc.p(-1920, 0));
        this.badgeDialogLayer.active = false;
    },

    //打開對戰紀錄
    openArenaMemory(){
        this.node._parent.getChildByName('ArenaMemoryLayer').active = true;
        this.node._parent.getChildByName('ArenaMemoryLayer').setPosition(cc.p(0,0));
        this.node.setPosition(cc.p(1920,-1080));
        // console.log(this.node);
    },

    //------ item  設定道具
    setProp(info, propContent) {
        return this.itemLayer.getComponent('itemLayer').setProp(info, propContent);
    },

    //------ skill 設定技能
    setSkill(info) {
        return this.skillLayer.getComponent('skillLayer').setSkill(info);
    },

    /**
     * 
     * 控制組件的顯示 (預設為 開啟屬性)
     * ContentState < attribute equipment weapon prop skill >
     */

    changeVisiableState(ContentState) {
        console.log('ContentState:' + ContentState);
        var self = this;
        var backpack_talk = this.node.getChildByName('backpack_talk');
        var backpack_rock = this.node.getChildByName('backpack_rock');
        var itemLayer = this.node.getChildByName('itemLayer');
        var skillLayer = this.node.getChildByName('skillLayer');
        var RoleSPine = this.node.getChildByName('RoleSpine');
        

        switch (ContentState) {
            case 'attribute':
                backpack_talk.active = true;
                backpack_rock.active = true;
                itemLayer.active = false;
                skillLayer.active = false;
                RoleSPine.active = true;
                
                break;
            case 'equipment':
                backpack_talk.active = false;
                backpack_rock.active = true;
                itemLayer.active = false;
                skillLayer.active = false;
                RoleSPine.active = true;
                
                break;
            case 'weapon':
                backpack_talk.active = false;
                backpack_rock.active = true;
                itemLayer.active = false;
                skillLayer.active = false;
                RoleSPine.active = true;
               
                break;
            case 'prop':
                backpack_talk.active = false;
                backpack_rock.active = false;
                itemLayer.active = true;
                skillLayer.active = false;
                RoleSPine.active = false;
            
                break;
            case 'skill':
                backpack_talk.active = false;
                backpack_rock.active = false;
                itemLayer.active = false;
                skillLayer.active = true;
                RoleSPine.active = false;
        
                break;
            default:
                break;
        }
    },

    // update (dt) {},
});
