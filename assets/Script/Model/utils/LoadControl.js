
var self;
var LoadCallback;
var SkillUtils = require('SkillUtils');
/**
 * Skill load 節點
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        // //下載技能圖集
        // this.loadSelfSkill(
        //     [
        //         {
        //             "SkillPrototype_ID": 78,
        //             "SkillPrototype_Name": "三昧真火",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 98,
        //             "SkillPrototype_Name": "森林之泉",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 17,
        //             "SkillPrototype_Name": "起死回生",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 52,
        //             "SkillPrototype_Name": "戰鬥準備",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 74,
        //             "SkillPrototype_Name": "冰凍術",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         }
        //     ]);

        // this.loadEnemySkill(
        //     [
        //         {
        //             "SkillPrototype_ID": 78,
        //             "SkillPrototype_Name": "三昧真火",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 98,
        //             "SkillPrototype_Name": "森林之泉",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 17,
        //             "SkillPrototype_Name": "起死回生",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 52,
        //             "SkillPrototype_Name": "戰鬥準備",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         },
        //         {
        //             "SkillPrototype_ID": 74,
        //             "SkillPrototype_Name": "冰凍術",
        //             "SkillPrototype_Sign": "0,3,4",
        //             "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
        //             "MpCost": 10,
        //             "AttackTimes": 1,
        //             "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
        //             "Sort": 1
        //         }
        //     ]
        // );

        // this.loadNormalAttack(1, 1, 1, 1);//下載普通攻擊

        // this.LoadPath();//下載

        // this.preloadAudio();//預加載音效黨
    },

    start() { },

    /**
     * 
     * @param {*} selfSkills 對手對手對手
     * @param {*} enemySkills 
     */
    init(cal) {
        self = this;
        LoadCallback = cal;
        this.SkillModel = [];
        this.NormalModel = [];
        this.Skillpath = [];
        
    },


    /**
     * 建立 攻擊 我方 的動畫下載路徑
     * 建立 輔助 對手 的動畫下載路徑
     * @param {*} skill 
     */
    loadSelfSkill(skill) {
        var skills = SkillUtils.getSkill(skill);
        skills.forEach(model => {
            // {
            //     "ID": 9,
            //     "Name": "保護盾",
            //     "EffectSelf": "self_skill_protection",
            //     "EffectEnemy": "enemy_skill_protection",
            //     "Audio": ""
            // }
            model.EffectType = 'self';
            model.LoadEffect = 'AutoAtlas/Skills/self/' + model.EffectSelf;
            //如果是 對手 自身的輔助技能 
            if (model.isTarget) {
                model.EffectType = 'enemy';
                model.LoadEffect = 'AutoAtlas/Skills/enemy/' + model.EffectEnemy;
            }
            this.SkillModel.push(model);
        });
    },

    /**
     * 建立 攻擊 對手 的動畫下載路徑
     * 建立 輔助 自身 的動畫下載路徑
     * @param {*} skill 
     */
    loadEnemySkill(skill) {
        var skills = SkillUtils.getSkill(skill);
        skills.forEach(model => {
            //{
            //     "ID": 9,
            //     "Name": "保護盾",
            //     "EffectSelf": "self_skill_protection",
            //     "EffectEnemy": "enemy_skill_protection",
            //     "Audio": ""
            //}
            model.EffectType = 'enemy';
            model.LoadEffect = 'AutoAtlas/Skills/enemy/' + model.EffectEnemy;
            //如果是 對手 自身的輔助技能 
            if (model.isTarget) {
                model.EffectType = 'self';
                model.LoadEffect = 'AutoAtlas/Skills/self/' + model.EffectSelf;
            }
            this.SkillModel.push(model);
        });
    },

    /**
     * 建立 雙方普通攻擊的動畫下載路徑
     * @param {*} RoleEquipmentType_ID 主角 拿的武器種類
     * @param {*} RoleEquipmentCrystal_ID 主角 屬性
     * @param {*} RivalEquipmentType_ID 對手 拿的武器種類
     * @param {*} RivalEquipmentCrystal_ID 對手 屬性
     */
    loadNormalAttack(RoleEquipmentType_ID, RoleEquipmentCrystal_ID, RivalEquipmentType_ID, RivalEquipmentCrystal_ID) {
        var RoleNormalSkillModel = SkillUtils.getNormalModel(RoleEquipmentType_ID, RoleEquipmentCrystal_ID);
        var RivalNormalSkillModel = SkillUtils.getNormalModel(RivalEquipmentType_ID, RivalEquipmentCrystal_ID);
        //
        if (RoleNormalSkillModel != null) {
            RoleNormalSkillModel.EffectType = 'enemy';
            RoleNormalSkillModel.LoadEffect = 'AutoAtlas/Skills/enemy/' + RoleNormalSkillModel.EffectEnemy;
            this.NormalModel.push(RoleNormalSkillModel);
        }
        //
        if (RivalNormalSkillModel != null) {
            RivalNormalSkillModel.EffectType = 'self';
            RivalNormalSkillModel.LoadEffect = 'AutoAtlas/Skills/self/' + RivalNormalSkillModel.EffectSelf;
            this.NormalModel.push(RivalNormalSkillModel);
        }
        //
        console.log(this.NormalModel);
    },

    /**
     * 下載所有需求動畫
     */
    LoadPath() {
        if (this.SkillModel.length === 0) {
            //null
        } else {
            console.log('----');
            console.log(this.SkillModel);
            console.log('----');

            this.SkillModel.forEach(model => {
                //{
                //     "ID": 9,
                //     "Name": "保護盾",
                //     "EffectSelf": "self_skill_protection",
                //     "EffectEnemy": "enemy_skill_protection",
                //     "Audio": "",
                //     "EffectType": "" , //enemy or self
                //     "LoadEffect": "" //path
                //}
                this.Skillpath.push(model.LoadEffect);//加入下載路徑
            });

            console.log(this.Skillpath);
        }
        //
        if (this.NormalModel.length === 0) {
            //null
        } else {
            console.log('----');
            console.log(this.NormalModel);
            console.log('----');

            this.NormalModel.forEach(model => {
                // {
                //     "EquipmentTypeID": 1, // 1-5 武器種類
                //     "EquipmentCrystalID": 1, //1-6 攻擊屬性 
                //     "EffectSelf": "self_monster_skill_prepare", // 對方 攻擊 己方
                //     "EffectEnemy": "enemy_skill_prepare", // 己方 攻擊 對方
                //     "Audio": "", //音效
                //     "TimeSecond": 1, //enemy or self
                //     "EffectType": "" , //enemy or self
                //     "LoadEffect": "" //path
                // }
                this.Skillpath.push(model.LoadEffect);//加入下載路徑
            });
            console.log('----NormalModel');
            console.log(this.Skillpath);
        }
        //
        if (this.Skillpath.length === 0) return;
        else {
            //下載
            cc.loader.loadResArray(this.Skillpath, cc.SpriteAtlas,

                function (completedCount, totalCount, item) {
                    // console.log(completedCount+','+totalCount);
                    // console.log(Math.floor(completedCount / totalCount * 100) + '%');
                 
                    var per = completedCount / totalCount;
                    if(per !== 1)LoadCallback(completedCount / totalCount);//回傳進度

                    //debug
                    // if (completedCount === totalCount) {
                    //     self.test();
                    // }
                },

                function (err, Assets) {
                    if (err) console.log(err);
                    else console.log(Assets);
                    var index = 0;
                    Assets.forEach(atlas => {
                        console.log(atlas);
                        if (self.SkillModel.length > index) self.SkillModel[index].atlas = atlas;
                        else self.NormalModel[(index - self.SkillModel.length)].atlas = atlas;
                        index++;
                    });
                    console.log('----');
                    console.log(self.SkillModel);
                    console.log(self.NormalModel);
                    console.log('----');

                    LoadCallback(1);//如果需要下載的東西 已經都被保存在 暫存內 前面不會執行 「需要被動」回傳進度
                }
            );
        }
    },

    /**
     * 預加載 音效
     */
    preloadAudio() {
        var set = new Set();
        this.VoicePath = [];

        //預加載 技能音效
        if (this.SkillModel.length > 0) {
            this.SkillModel.forEach(model => {
                //model.Audio
                if (model.Audio !== '' && model.Audio !== null) {
                    if (!set.has(model.Audio)) {
                        //不含
                        set.add(model.Audio);//加入
                        this.VoicePath.push(model.Audio);
                    }
                }
            });
        }
        //預加載 普攻音效
        if (this.NormalModel.length > 0) {
            this.NormalModel.forEach(model => {
                //model.Audio
                if (model.Audio !== '' && model.Audio !== null) {
                    if (!set.has(model.Audio)) {
                        //不含
                        set.add(model.Audio);//加入
                        this.VoicePath.push(model.Audio);
                    }
                }
            });
        }
        //實際預載
        if (this.VoicePath.length > 0) {
            console.log('預載音頻數量：'+this.VoicePath.length);
            this.VoicePath.forEach(path => {
                cc.audioEngine.preload(cc.url.raw('resources/Sfx/Skill/' + path));
            });
        }
    },

    //測試
    test() {
        console.log('-------');
        console.log(this.SkillModel);
        console.log('-------');
        var skillModel = this.getSKillAtlas(52, 'self');
        console.log(skillModel);
        var normalModel = this.getNormalAtlas(1, 1, 'self');
        console.log(normalModel);
    },

    /**
     * @param {*} type enemy or self [對誰攻擊]
     */
    getSKillAtlas(type) {
        return this.SkillModel.filter(model => model.EffectType === type);
    },

    /**
     * @param {*} type enemy or self [對誰攻擊]
     */
    getNormalAtlas(type) {
        return this.NormalModel.filter(model => model.EffectType === type);
    },

    /**
     * 釋放資源
     */
    releaseAll() {
        //釋放 預加載 技能音效
        // if (this.VoicePath.length > 0) {
           
        // }
        this.VoicePath.forEach(Path => {
            cc.audioEngine.uncache(cc.url.raw('resources/Sfx/Skill/' + Path));
        });

        //釋放 動畫圖集
        this.Skillpath.forEach(path => {
            cc.loader.release(path);
        });
    },

    onDestroy() {
        
    },



    // update (dt) {},
});
