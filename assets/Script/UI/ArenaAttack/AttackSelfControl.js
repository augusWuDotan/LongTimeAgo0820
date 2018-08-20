var self;
var AnimationFinishCallback;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setCallback(cal){
        AnimationFinishCallback = cal;
    },

    init() {
        self = this;
        //
        this.SkillAltasModel = null;//使用的技能動畫圖集
        this.NormalAltas = null;//使用的技能動畫圖集
        //
        this.showAnimationlayer = this.node.getComponent(cc.Animation);
        if (this.showAnimationlayer) this.showAnimationlayer.on('finished', this.onFinished, this);
        //
        this.LoadControl = cc.find('LoadControl').getComponent('LoadControl');
        if (this.LoadControl) {
            console.log('this.LoadControl init');
            //把所有的動畫裝載
            this.SkillAltasModel = this.LoadControl.getSKillAtlas('self');
            this.NormalAltas = this.LoadControl.getNormalAtlas('self');
            //建立技能動畫
            if (this.SkillAltasModel) {
                this.SkillAltasModel.forEach(model => {
                    self.addAnimation(model);
                });
            }
            //建立普通攻擊
            if (this.NormalAltas) {
                this.NormalAltas.forEach(model => {
                    self.addAnimation(model);
                });
            }
        }
    },

    addAnimation(model) {
        /*
        {
            "ID": 9,
            "Name": "保護盾",
            "EffectSelf": "self_role_sword",
            "EffectEnemy": "enemy_sword",
            "Audio": "",
            "TimeSecond": 1,
            "EffectType": "self",
            "LoadEffect": "AutoAtlas/Skills/self/self_role_sword",
            "atlas":{}
        }
        ,
        {
            "EquipmentTypeID": 1,
            "EquipmentCrystalID": 1,
            "EffectSelf": "self_role_sword",
            "EffectEnemy": "enemy_sword",
            "Audio": "",
            "TimeSecond": 1,
            "EffectType": "self",
            "LoadEffect": "AutoAtlas/Skills/self/self_role_sword",
            "atlas":{}
        }
        */

        var SpriteFrames = model.atlas.getSpriteFrames();
        var clip = cc.AnimationClip.createWithSpriteFrames(SpriteFrames, SpriteFrames.length / model.TimeSecond);
        clip._name = model.EffectSelf;
        this.showAnimationlayer.addClip(clip, clip.name);
        console.log(clip);
         
    },

    //使用技能
    useSkillAnimation(SkillID) {
        //    
        if (!this.SkillAltasModel) {
            console.log('you doesn\'t add skill atlas');
            return;
        }
        //
        if (this.SkillAltasModel.length === 0) {
            console.log('your animation atlas modle length is 0');
            return;
        }
        //
        var Skill = this.SkillAltasModel.find(model => model.ID === SkillID);
        console.log(Skill);
        if (Skill) var ClipName = Skill.EffectSelf;
        if (ClipName) this.showAnimationlayer.playAdditive(ClipName);
        //播放技能音效
        if (Skill)this.playSkillVoice(Skill);
    },

    //使用普通攻擊
    useNormalAttackAnimation(EquipmentType_ID, EquipmentCrystal_ID) {
        //    
        if (!this.NormalAltas) {
            console.log('you doesn\'t add normal atlas');
            return;
        }
        //
        if (this.NormalAltas.length === 0) {
            console.log('your normal animation atlas modle length is 0');
            return;
        }
        //
        var Normal = this.NormalAltas.find(model => model.EquipmentTypeID === EquipmentType_ID && model.EquipmentCrystalID === EquipmentCrystal_ID);
        if (Normal) var ClipName = Normal.EffectSelf;
        if (ClipName) this.showAnimationlayer.playAdditive(ClipName);
        console.log(Normal);
        if (Normal) this.playNomaleAttackVoice(Normal);
    },

     //播放技能音效
     playSkillVoice(Skill){
        /*
         {
              "ID": 6,
              "Name": "乾坤一擲",
              "EffectSelf": "self_monster_skill_hit",
              "EffectEnemy": "enemy_skill_hit",
              "Audio": "hit.mp3",
              "TimeSecond": 1,
              "IsShock": 1,
              "SkillIconPath": "hit"
            }
        */

        //防呆 
        if(!Skill ||  Skill === null){
            console.log('Skill not find');
            return;
        }
        //沒音樂
        if(Skill.Audio === ''){
            console.log('Audio is non');
            return;
        }
        //執行播放
        var Path = cc.url.raw('resources/Sfx/Skill/'+Skill.Audio) ;
        console.log(Path);
        cc.audioEngine.playEffect(Path, false, 0.7);
    },

    //播放普通攻擊音效
    playNomaleAttackVoice(Normal) {
        /*
          {
            "EquipmentTypeID": 5,
            "EquipmentCrystalID": 1,
            "EffectSelf": "self_role_wand_normal",
            "EffectEnemy": "enemy_wand_normal",
            "Audio": "wand.mp3",
            "TimeSecond": 1,
            "IsShock": 0,
            "SkillIconPath": ""
            }
        */
        //防呆 
        if (!Normal || Normal === null) {
            console.log('Normal not find');
            return;
        }
        //沒音樂
        if (Normal.Audio === '') {
            console.log('Audio is non');
            return;
        }
        //執行播放
        var Path = cc.url.raw('resources/Sfx/Skill/' + Normal.Audio);
        console.log(Path);
        cc.audioEngine.playEffect(Path, false, 0.7);
    },


    onFinished() {
        console.log('Attack self finish');
        // this.animation.setCurrentTime(0);
        this.node.getComponent(cc.Sprite).spriteFrame = null;
        AnimationFinishCallback();//通知結束
    },

    onDestroy() {
        if (this.showAnimationlayer) this.showAnimationlayer.off('finished', this.onFinished, this);
    },


    start() {

    },

    // update (dt) {},
});
