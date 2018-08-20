
var SkillUtils = {
  isConsole: true,//是否顯示console


  getSkill(Skills) {
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
    var skillIds = [];
    Skills.forEach(skill => {
      skillIds.push(skill.SkillPrototype_ID);
    });
    if (this.isConsole) console.log(skillIds);
    //
    var Skillmodels = this.getSkillData().filter(skillmodel => skillIds.includes(skillmodel.ID));
    if (this.isConsole) console.log(Skillmodels);
    //
    return Skillmodels;
  },

  /**
   * @method getNormalModel
   */
  getNormalModel(EquipmentType_ID, EquipmentCrystal_ID) {

    if (!EquipmentType_ID) return null;
    if (!EquipmentCrystal_ID) return null;

    var NormalModel = this.getNormalData().find(normalModel => (normalModel.EquipmentTypeID === EquipmentType_ID && normalModel.EquipmentCrystalID === EquipmentCrystal_ID));
    var model = NormalModel;
    if (model) {
      return model;
    } else {
      return null;
    }
  },

  /**
   * 取得技能Icon
   */
  getSkillIconPath(SkillID) {
    var Skill = this.getSkillData().find(Skillmodel => (Skillmodel.ID === SkillID));
    if (Skill) {
      if (Skill.SkillIconPath === '') {
        return '';
      } else {
        return '/Texture/ArenaAttack/AttackSkill/' + Skill.SkillIconPath;
      }
    } else {
      return '';
    }
  },

  /**
   * @method getSkillData 取得技能相關對應表
   */
  getSkillData() {
    return [
      {
        "ID": 6,
        "Name": "乾坤一掷",
        "EffectSelf": "self_skill_hit",
        "EffectEnemy": "enemy_skill_hit",
        "isTarget": false,
        "Audio": "hit.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "hit"
      },
      {
        "ID": 7,
        "Name": "暴风连斩",
        "EffectSelf": "self_skill_storm",
        "EffectEnemy": "enemy_skill_storm",
        "isTarget": false,
        "Audio": "storm.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "storm"
      },
      {
        "ID": 8,
        "Name": "破山击",
        "EffectSelf": "self_skill_broken",
        "EffectEnemy": "enemy_skill_broken",
        "isTarget": false,
        "Audio": "broken.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "broken"
      },
      {
        "ID": 9,
        "Name": "保护盾",
        "EffectSelf": "self_skill_protection",
        "EffectEnemy": "enemy_skill_protection",
        "isTarget": true,
        "Audio": "protection.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "protection"
      },
      {
        "ID": 12,
        "Name": "钝化攻击",
        "EffectSelf": "self_skill_cutdamage",
        "EffectEnemy": "enemy_skill_cutdamage",
        "isTarget": false,
        "Audio": "cutdamage.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "cutdamage"
      },
      {
        "ID": 13,
        "Name": "抹毒",
        "EffectSelf": "self_skill_poison",
        "EffectEnemy": "enemy_skill_poison",
        "isTarget": false,
        "Audio": "poison.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "poison"
      },
      {
        "ID": 14,
        "Name": "破灭攻击",
        "EffectSelf": "self_monster_skill_destroy",
        "EffectEnemy": "enemy_skill_destroy",
        "isTarget": false,
        "Audio": "destroy.mp3",
        "TimeSecond": 2,
        "IsShock": 0,
        "SkillIconPath": "destroy"
      },
      {
        "ID": 15,
        "Name": "衰弱咒",
        "EffectSelf": "self_skill_weakness",
        "EffectEnemy": "enemy_skill_weakness",
        "isTarget": false,
        "Audio": "weakness.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "weakness"
      },
      {
        "ID": 16,
        "Name": "战斗准备",
        "EffectSelf": "self_skill_prepare",
        "EffectEnemy": "enemy_skill_prepare",
        "isTarget": true,
        "Audio": "prepare.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "prepare"
      },
      {
        "ID": 17,
        "Name": "起死回生",
        "EffectSelf": "self_skill_deathback",
        "EffectEnemy": "enemy_skill_deathback",
        "isTarget": true,
        "Audio": "deathback.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "deathback"
      },
      {
        "ID": 18,
        "Name": "乾坤一掷",
        "EffectSelf": "self_skill_hit",
        "EffectEnemy": "enemy_skill_hit",
        "isTarget": false,
        "Audio": "hit.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "hit"
      },
      {
        "ID": 19,
        "Name": "乾坤一掷",
        "EffectSelf": "self_skill_hit",
        "EffectEnemy": "enemy_skill_hit",
        "isTarget": false,
        "Audio": "hit.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "hit"
      },
      {
        "ID": 20,
        "Name": "乾坤一掷",
        "EffectSelf": "self_skill_hit",
        "EffectEnemy": "enemy_skill_hit",
        "isTarget": false,
        "Audio": "hit.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "hit"
      },
      {
        "ID": 23,
        "Name": "乾坤一掷",
        "EffectSelf": "self_skill_hit",
        "EffectEnemy": "enemy_skill_hit",
        "isTarget": false,
        "Audio": "hit.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "hit"
      },
      {
        "ID": 26,
        "Name": "乾坤一掷",
        "EffectSelf": "self_skill_hit",
        "EffectEnemy": "enemy_skill_hit",
        "isTarget": false,
        "Audio": "hit.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "hit"
      },
      {
        "ID": 27,
        "Name": "破山击",
        "EffectSelf": "self_skill_broken",
        "EffectEnemy": "enemy_skill_broken",
        "isTarget": false,
        "Audio": "broken.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "broken"
      },
      {
        "ID": 30,
        "Name": "破山击",
        "EffectSelf": "self_skill_broken",
        "EffectEnemy": "enemy_skill_broken",
        "isTarget": false,
        "Audio": "broken.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "broken"
      },
      {
        "ID": 31,
        "Name": "破山击",
        "EffectSelf": "self_skill_broken",
        "EffectEnemy": "enemy_skill_broken",
        "isTarget": false,
        "Audio": "broken.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "broken"
      },
      {
        "ID": 32,
        "Name": "破山击",
        "EffectSelf": "self_skill_broken",
        "EffectEnemy": "enemy_skill_broken",
        "isTarget": false,
        "Audio": "broken.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "broken"
      },
      {
        "ID": 33,
        "Name": "破山击",
        "EffectSelf": "self_skill_broken",
        "EffectEnemy": "enemy_skill_broken",
        "isTarget": false,
        "Audio": "broken.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "broken"
      },
      {
        "ID": 34,
        "Name": "暴风连斩",
        "EffectSelf": "self_skill_storm",
        "EffectEnemy": "enemy_skill_storm",
        "isTarget": false,
        "Audio": "storm.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "storm"
      },
      {
        "ID": 35,
        "Name": "暴风连斩",
        "EffectSelf": "self_skill_storm",
        "EffectEnemy": "enemy_skill_storm",
        "isTarget": false,
        "Audio": "storm.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "storm"
      },
      {
        "ID": 36,
        "Name": "暴风连斩",
        "EffectSelf": "self_skill_storm",
        "EffectEnemy": "enemy_skill_storm",
        "isTarget": false,
        "Audio": "storm.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "storm"
      },
      {
        "ID": 37,
        "Name": "暴风连斩",
        "EffectSelf": "self_skill_storm",
        "EffectEnemy": "enemy_skill_storm",
        "isTarget": false,
        "Audio": "storm.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "storm"
      },
      {
        "ID": 38,
        "Name": "保护盾",
        "EffectSelf": "self_skill_protection",
        "EffectEnemy": "enemy_skill_protection",
        "isTarget": true,
        "Audio": "protection.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "protection"
      },
      {
        "ID": 39,
        "Name": "保护盾",
        "EffectSelf": "self_skill_protection",
        "EffectEnemy": "enemy_skill_protection",
        "isTarget": true,
        "Audio": "protection.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "protection"
      },
      {
        "ID": 40,
        "Name": "保护盾",
        "EffectSelf": "self_skill_protection",
        "EffectEnemy": "enemy_skill_protection",
        "isTarget": true,
        "Audio": "protection.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "protection"
      },
      {
        "ID": 41,
        "Name": "保护盾",
        "EffectSelf": "self_skill_protection",
        "EffectEnemy": "enemy_skill_protection",
        "isTarget": true,
        "Audio": "protection.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "protection"
      },
      {
        "ID": 42,
        "Name": "钝化攻击",
        "EffectSelf": "self_skill_cutdamage",
        "EffectEnemy": "enemy_skill_cutdamage",
        "isTarget": false,
        "Audio": "cutdamage.mp3",
        "TimeSecond": 2,
        "IsShock": 0,
        "SkillIconPath": "cutdamage"
      },
      {
        "ID": 43,
        "Name": "钝化攻击",
        "EffectSelf": "self_skill_cutdamage",
        "EffectEnemy": "enemy_skill_cutdamage",
        "isTarget": false,
        "Audio": "cutdamage.mp3",
        "TimeSecond": 2,
        "IsShock": 0,
        "SkillIconPath": "cutdamage"
      },
      {
        "ID": 44,
        "Name": "钝化攻击",
        "EffectSelf": "self_skill_cutdamage",
        "EffectEnemy": "enemy_skill_cutdamage",
        "isTarget": false,
        "Audio": "cutdamage.mp3",
        "TimeSecond": 2,
        "IsShock": 0,
        "SkillIconPath": "cutdamage"
      },
      {
        "ID": 45,
        "Name": "抹毒",
        "EffectSelf": "self_skill_poison",
        "EffectEnemy": "enemy_skill_poison",
        "isTarget": false,
        "Audio": "poison.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "poison"
      },
      {
        "ID": 46,
        "Name": "抹毒",
        "EffectSelf": "self_skill_poison",
        "EffectEnemy": "enemy_skill_poison",
        "isTarget": false,
        "Audio": "poison.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "poison"
      },
      {
        "ID": 47,
        "Name": "抹毒",
        "EffectSelf": "self_skill_poison",
        "EffectEnemy": "enemy_skill_poison",
        "isTarget": false,
        "Audio": "poison.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "poison"
      },
      {
        "ID": 48,
        "Name": "破灭攻击",
        "EffectSelf": "self_skill_destroy",
        "EffectEnemy": "enemy_skill_destroy",
        "isTarget": false,
        "Audio": "destroy.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "destroy"
      },
      {
        "ID": 49,
        "Name": "破灭攻击",
        "EffectSelf": "self_skill_destroy",
        "EffectEnemy": "enemy_skill_destroy",
        "isTarget": false,
        "Audio": "destroy.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "destroy"
      },
      {
        "ID": 50,
        "Name": "衰弱咒",
        "EffectSelf": "self_skill_weakness",
        "EffectEnemy": "enemy_skill_weakness",
        "isTarget": false,
        "Audio": "weakness.mp3",
        "TimeSecond": 2,
        "IsShock": 0,
        "SkillIconPath": "weakness"
      },
      {
        "ID": 51,
        "Name": "衰弱咒",
        "EffectSelf": "self_skill_weakness",
        "EffectEnemy": "enemy_skill_weakness",
        "isTarget": false,
        "Audio": "weakness.mp3",
        "TimeSecond": 2,
        "IsShock": 0,
        "SkillIconPath": "weakness"
      },
      {
        "ID": 52,
        "Name": "战斗准备",
        "EffectSelf": "self_skill_prepare",
        "EffectEnemy": "enemy_skill_prepare",
        "isTarget": true,
        "Audio": "prepare.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "prepare"
      },
      {
        "ID": 53,
        "Name": "火球术",
        "EffectSelf": "self_magic_fire1",
        "EffectEnemy": "enemy_magic_fire1",
        "isTarget": false,
        "Audio": "fire1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire1"
      },
      {
        "ID": 54,
        "Name": "闪电术",
        "EffectSelf": "self_magic_light1",
        "EffectEnemy": "enemy_magic_light1",
        "isTarget": false,
        "Audio": "light1.mp3",
        "TimeSecond": 3,
        "IsShock": 1,
        "SkillIconPath": "light1"
      },
      {
        "ID": 55,
        "Name": "闪电术",
        "EffectSelf": "self_magic_light1",
        "EffectEnemy": "enemy_magic_light1",
        "isTarget": false,
        "Audio": "light1.mp3",
        "TimeSecond": 3,
        "IsShock": 1,
        "SkillIconPath": "light1"
      },
      {
        "ID": 56,
        "Name": "闪电术",
        "EffectSelf": "self_magic_light1",
        "EffectEnemy": "enemy_magic_light1",
        "isTarget": false,
        "Audio": "light1.mp3",
        "TimeSecond": 3,
        "IsShock": 1,
        "SkillIconPath": "light1"
      },
      {
        "ID": 57,
        "Name": "金光阵",
        "EffectSelf": "self_magic_light2",
        "EffectEnemy": "enemy_magic_light2",
        "isTarget": true,
        "Audio": "light2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "light2"
      },
      {
        "ID": 58,
        "Name": "金光阵",
        "EffectSelf": "self_magic_light2",
        "EffectEnemy": "enemy_magic_light2",
        "isTarget": true,
        "Audio": "light2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "light2"
      },
      {
        "ID": 59,
        "Name": "罡气护体",
        "EffectSelf": "self_magic_light3",
        "EffectEnemy": "enemy_magic_light3",
        "isTarget": true,
        "Audio": "light3.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "light3"
      },
      {
        "ID": 60,
        "Name": "盘根错节",
        "EffectSelf": "self_magic_grass1",
        "EffectEnemy": "enemy_magic_grass1",
        "isTarget": false,
        "Audio": "grass1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass1"
      },
      {
        "ID": 61,
        "Name": "盘根错节",
        "EffectSelf": "self_magic_grass1",
        "EffectEnemy": "enemy_magic_grass1",
        "isTarget": false,
        "Audio": "grass1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass1"
      },
      {
        "ID": 62,
        "Name": "盘根错节",
        "EffectSelf": "self_magic_grass1",
        "EffectEnemy": "enemy_magic_grass1",
        "isTarget": false,
        "Audio": "grass1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass1"
      },
      {
        "ID": 63,
        "Name": "津露",
        "EffectSelf": "self_magic_grass2",
        "EffectEnemy": "enemy_magic_grass2",
        "isTarget": true,
        "Audio": "grass2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass2"
      },
      {
        "ID": 64,
        "Name": "津露",
        "EffectSelf": "self_magic_grass2",
        "EffectEnemy": "enemy_magic_grass2",
        "isTarget": true,
        "Audio": "grass2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass2"
      },
      {
        "ID": 65,
        "Name": "飞石术",
        "EffectSelf": "self_magic_stone1",
        "EffectEnemy": "enemy_magic_stone1",
        "isTarget": false,
        "Audio": "stone1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone1"
      },
      {
        "ID": 66,
        "Name": "飞石术",
        "EffectSelf": "self_magic_stone1",
        "EffectEnemy": "enemy_magic_stone1",
        "isTarget": false,
        "Audio": "stone1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone1"
      },
      {
        "ID": 67,
        "Name": "飞石术",
        "EffectSelf": "self_magic_stone1",
        "EffectEnemy": "enemy_magic_stone1",
        "isTarget": false,
        "Audio": "stone1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone1"
      },
      {
        "ID": 68,
        "Name": "落石术",
        "EffectSelf": "self_magic_stone2",
        "EffectEnemy": "enemy_magic_stone2",
        "isTarget": false,
        "Audio": "stone2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone2"
      },
      {
        "ID": 69,
        "Name": "落石术",
        "EffectSelf": "self_magic_stone2",
        "EffectEnemy": "enemy_magic_stone2",
        "isTarget": false,
        "Audio": "stone2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone2"
      },
      {
        "ID": 70,
        "Name": "巨石压顶",
        "EffectSelf": "self_magic_stone3",
        "EffectEnemy": "enemy_magic_stone3",
        "isTarget": false,
        "Audio": "stone3.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone3"
      },
      {
        "ID": 71,
        "Name": "寒冰术",
        "EffectSelf": "self_magic_ice1",
        "EffectEnemy": "enemy_magic_ice1",
        "isTarget": false,
        "Audio": "ice1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice1"
      },
      {
        "ID": 72,
        "Name": "寒冰术",
        "EffectSelf": "self_magic_ice1",
        "EffectEnemy": "enemy_magic_ice1",
        "isTarget": false,
        "Audio": "ice1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice1"
      },
      {
        "ID": 73,
        "Name": "寒冰术",
        "EffectSelf": "self_magic_ice1",
        "EffectEnemy": "enemy_magic_ice1",
        "isTarget": false,
        "Audio": "ice1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice1"
      },
      {
        "ID": 74,
        "Name": "冰冻术",
        "EffectSelf": "self_magic_ice2",
        "EffectEnemy": "enemy_magic_ice2",
        "isTarget": false,
        "Audio": "ice2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice2"
      },
      {
        "ID": 75,
        "Name": "冰冻术",
        "EffectSelf": "self_magic_ice2",
        "EffectEnemy": "enemy_magic_ice2",
        "isTarget": false,
        "Audio": "ice2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice2"
      },
      {
        "ID": 76,
        "Name": "冰甲术",
        "EffectSelf": "self_magic_ice3",
        "EffectEnemy": "enemy_magic_ice3",
        "isTarget": false,
        "Audio": "ice3.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice3"
      },
      {
        "ID": 77,
        "Name": "火球术",
        "EffectSelf": "self_magic_fire1",
        "EffectEnemy": "enemy_magic_fire1",
        "isTarget": false,
        "Audio": "fire1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire1"
      },
      {
        "ID": 78,
        "Name": "三昧真火",
        "EffectSelf": "self_magic_fire2",
        "EffectEnemy": "enemy_magic_fire2",
        "isTarget": false,
        "Audio": "fire2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire2"
      },
      {
        "ID": 79,
        "Name": "三昧真火",
        "EffectSelf": "self_magic_fire2",
        "EffectEnemy": "enemy_magic_fire2",
        "isTarget": false,
        "Audio": "fire2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire2"
      },
      {
        "ID": 80,
        "Name": "狂乱轰炸",
        "EffectSelf": "self_magic_fire3",
        "EffectEnemy": "enemy_magic_fire3",
        "isTarget": false,
        "Audio": "fire3.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire3"
      },
      {
        "ID": 81,
        "Name": "毒气沼泽",
        "EffectSelf": "self_magic_grass3",
        "EffectEnemy": "enemy_magic_grass3",
        "isTarget": false,
        "Audio": "grass3.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass3"
      },
      {
        "ID": 82,
        "Name": "闪电术",
        "EffectSelf": "self_magic_light1",
        "EffectEnemy": "enemy_magic_light1",
        "isTarget": false,
        "Audio": "light1.mp3",
        "TimeSecond": 3,
        "IsShock": 1,
        "SkillIconPath": "light1"
      },
      {
        "ID": 83,
        "Name": "闪电术",
        "EffectSelf": "self_magic_light1",
        "EffectEnemy": "enemy_magic_light1",
        "isTarget": false,
        "Audio": "light1.mp3",
        "TimeSecond": 3,
        "IsShock": 1,
        "SkillIconPath": "light1"
      },
      {
        "ID": 84,
        "Name": "闪电术",
        "EffectSelf": "self_magic_light1",
        "EffectEnemy": "enemy_magic_light1",
        "isTarget": false,
        "Audio": "light1.mp3",
        "TimeSecond": 3,
        "IsShock": 1,
        "SkillIconPath": "light1"
      },
      {
        "ID": 85,
        "Name": "盘根错节",
        "EffectSelf": "self_magic_grass1",
        "EffectEnemy": "enemy_magic_grass1",
        "isTarget": false,
        "Audio": "grass1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass1"
      },
      {
        "ID": 86,
        "Name": "盘根错节",
        "EffectSelf": "self_magic_grass1",
        "EffectEnemy": "enemy_magic_grass1",
        "isTarget": false,
        "Audio": "grass1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass1"
      },
      {
        "ID": 87,
        "Name": "寒冰术",
        "EffectSelf": "self_magic_ice1",
        "EffectEnemy": "enemy_magic_ice1",
        "isTarget": false,
        "Audio": "ice1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice1"
      },
      {
        "ID": 88,
        "Name": "寒冰术",
        "EffectSelf": "self_magic_ice1",
        "EffectEnemy": "enemy_magic_ice1",
        "isTarget": false,
        "Audio": "ice1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice1"
      },
      {
        "ID": 89,
        "Name": "火球术",
        "EffectSelf": "self_magic_fire1",
        "EffectEnemy": "enemy_magic_fire1",
        "isTarget": false,
        "Audio": "fire1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire1"
      },
      {
        "ID": 90,
        "Name": "火球术",
        "EffectSelf": "self_magic_fire1",
        "EffectEnemy": "enemy_magic_fire1",
        "isTarget": false,
        "Audio": "fire1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire1"
      },
      {
        "ID": 91,
        "Name": "飞石术",
        "EffectSelf": "self_magic_stone1",
        "EffectEnemy": "enemy_magic_stone1",
        "isTarget": false,
        "Audio": "stone1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone1"
      },
      {
        "ID": 92,
        "Name": "飞石术",
        "EffectSelf": "self_magic_stone1",
        "EffectEnemy": "enemy_magic_stone1",
        "isTarget": false,
        "Audio": "stone1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone1"
      },
      {
        "ID": 93,
        "Name": "飞石术",
        "EffectSelf": "self_magic_stone1",
        "EffectEnemy": "enemy_magic_stone1",
        "isTarget": false,
        "Audio": "stone1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone1"
      },
      {
        "ID": 94,
        "Name": "落石术",
        "EffectSelf": "self_magic_stone2",
        "EffectEnemy": "enemy_magic_stone2",
        "isTarget": false,
        "Audio": "stone2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "stone2"
      },
      {
        "ID": 95,
        "Name": "寒冰术",
        "EffectSelf": "self_magic_ice1",
        "EffectEnemy": "enemy_magic_ice1",
        "isTarget": false,
        "Audio": "ice1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice1"
      },
      {
        "ID": 96,
        "Name": "火球术",
        "EffectSelf": "self_magic_fire1",
        "EffectEnemy": "enemy_magic_fire1",
        "isTarget": false,
        "Audio": "fire1.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire1"
      },
      {
        "ID": 97,
        "Name": "盘根错节",
        "EffectSelf": "self_magic_grass1",
        "EffectEnemy": "enemy_magic_grass1",
        "isTarget": false,
        "Audio": "grass1.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass1"
      },
      {
        "ID": 98,
        "Name": "津露",
        "EffectSelf": "self_magic_grass2",
        "EffectEnemy": "enemy_magic_grass2",
        "isTarget": true,
        "Audio": "grass2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "grass2"
      },
      {
        "ID": 99,
        "Name": "金光阵",
        "EffectSelf": "self_magic_grass2",
        "EffectEnemy": "enemy_magic_light2",
        "isTarget": true,
        "Audio": "light2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "light2"
      },
      {
        "ID": 100,
        "Name": "冰冻术",
        "EffectSelf": "self_magic_ice2",
        "EffectEnemy": "enemy_magic_ice2",
        "isTarget": false,
        "Audio": "ice2.mp3",
        "TimeSecond": 3,
        "IsShock": 0,
        "SkillIconPath": "ice2"
      },
      {
        "ID": 101,
        "Name": "三昧真火",
        "EffectSelf": "self_magic_fire2",
        "EffectEnemy": "enemy_magic_fire2",
        "isTarget": false,
        "Audio": "fire2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire2"
      },
      {
        "ID": 102,
        "Name": "三昧真火",
        "EffectSelf": "self_magic_fire2",
        "EffectEnemy": "enemy_magic_fire2",
        "isTarget": false,
        "Audio": "fire2.mp3",
        "TimeSecond": 2,
        "IsShock": 1,
        "SkillIconPath": "fire2"
      }
    ];
  },

  /**
   * @method getNormalData 取得普攻對應表
   */
  getNormalData() {
    return [
      {
        "EquipmentTypeID": 5,
        "EquipmentCrystalID": 1,
        "EffectSelf": "self_role_wand_normal",
        "EffectEnemy": "enemy_wand_normal",
        "Audio": "wand.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 5,
        "EquipmentCrystalID": 2,
        "EffectSelf": "self_role_wand_normal_light",
        "EffectEnemy": "enemy_wand_normal_light",
        "Audio": "wand.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 5,
        "EquipmentCrystalID": 3,
        "EffectSelf": "self_role_wand_normal_grass",
        "EffectEnemy": "enemy_wand_normal_grass",
        "Audio": "wand.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 5,
        "EquipmentCrystalID": 4,
        "EffectSelf": "self_role_wand_normal_ice",
        "EffectEnemy": "enemy_wand_normal_ice",
        "Audio": "wand.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 5,
        "EquipmentCrystalID": 5,
        "EffectSelf": "self_role_wand_normal_fire",
        "EffectEnemy": "enemy_wand_normal_fire",
        "Audio": "wand.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 5,
        "EquipmentCrystalID": 6,
        "EffectSelf": "self_role_wand_normal_stone",
        "EffectEnemy": "enemy_wand_normal_stone",
        "Audio": "wand.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 4,
        "EquipmentCrystalID": 1,
        "EffectSelf": "self_role_scimitar",
        "EffectEnemy": "enemy_scimitar",
        "Audio": "scimitar.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 4,
        "EquipmentCrystalID": 2,
        "EffectSelf": "self_role_scimitar_light",
        "EffectEnemy": "enemy_scimitar_light",
        "Audio": "scimitar.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 4,
        "EquipmentCrystalID": 3,
        "EffectSelf": "self_role_scimitar_grass",
        "EffectEnemy": "enemy_scimitar_grass",
        "Audio": "scimitar.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 4,
        "EquipmentCrystalID": 4,
        "EffectSelf": "self_role_scimitar_ice",
        "EffectEnemy": "enemy_scimitar_ice",
        "Audio": "scimitar.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 4,
        "EquipmentCrystalID": 5,
        "EffectSelf": "self_role_scimitar_fire",
        "EffectEnemy": "enemy_scimitar_fire",
        "Audio": "scimitar.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 4,
        "EquipmentCrystalID": 6,
        "EffectSelf": "self_role_scimitar_light",
        "EffectEnemy": "enemy_scimitar_light",
        "Audio": "scimitar.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 3,
        "EquipmentCrystalID": 1,
        "EffectSelf": "self_role_hammer",
        "EffectEnemy": "enemy_hammer",
        "Audio": "hammer.mp3",
        "TimeSecond": 0.6,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 3,
        "EquipmentCrystalID": 2,
        "EffectSelf": "self_role_hammer_light",
        "EffectEnemy": "enemy_hammer_light",
        "Audio": "hammer.mp3",
        "TimeSecond": 0.6,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 3,
        "EquipmentCrystalID": 3,
        "EffectSelf": "self_role_hammer_grass",
        "EffectEnemy": "enemy_hammer_grass",
        "Audio": "hammer.mp3",
        "TimeSecond": 0.6,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 3,
        "EquipmentCrystalID": 4,
        "EffectSelf": "self_role_hammer_ice",
        "EffectEnemy": "enemy_hammer_ice",
        "Audio": "hammer.mp3",
        "TimeSecond": 0.6,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 3,
        "EquipmentCrystalID": 5,
        "EffectSelf": "self_role_hammer_fire",
        "EffectEnemy": "enemy_hammer_fire",
        "Audio": "hammer.mp3",
        "TimeSecond": 0.6,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 3,
        "EquipmentCrystalID": 6,
        "EffectSelf": "self_role_hammer_stone",
        "EffectEnemy": "enemy_hammer_stone",
        "Audio": "hammer.mp3",
        "TimeSecond": 0.6,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 2,
        "EquipmentCrystalID": 1,
        "EffectSelf": "self_role_ax",
        "EffectEnemy": "enemy_hammer",
        "Audio": "ax.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 2,
        "EquipmentCrystalID": 2,
        "EffectSelf": "self_role_ax_light",
        "EffectEnemy": "enemy_ax_light",
        "Audio": "ax.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 2,
        "EquipmentCrystalID": 3,
        "EffectSelf": "self_role_ax_grass",
        "EffectEnemy": "enemy_ax_grass",
        "Audio": "ax.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 2,
        "EquipmentCrystalID": 4,
        "EffectSelf": "self_role_ax_ice",
        "EffectEnemy": "enemy_ax_ice",
        "Audio": "ax.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 2,
        "EquipmentCrystalID": 5,
        "EffectSelf": "self_role_ax_fire",
        "EffectEnemy": "enemy_ax_fire",
        "Audio": "ax.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 2,
        "EquipmentCrystalID": 6,
        "EffectSelf": "self_role_ax_stone",
        "EffectEnemy": "enemy_ax_stone",
        "Audio": "ax.mp3",
        "TimeSecond": 0.5,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 1,
        "EquipmentCrystalID": 1,
        "EffectSelf": "self_role_sword",
        "EffectEnemy": "enemy_sword",
        "Audio": "sword.mp3",
        "TimeSecond": 0.8,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 1,
        "EquipmentCrystalID": 2,
        "EffectSelf": "self_role_sword_light",
        "EffectEnemy": "enemy_sword_light",
        "Audio": "sword.mp3",
        "TimeSecond": 0.8,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 1,
        "EquipmentCrystalID": 3,
        "EffectSelf": "self_role_sword_grass",
        "EffectEnemy": "enemy_sword_grass",
        "Audio": "sword.mp3",
        "TimeSecond": 0.8,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 1,
        "EquipmentCrystalID": 4,
        "EffectSelf": "self_role_sword_ice",
        "EffectEnemy": "enemy_sword_ice",
        "Audio": "sword.mp3",
        "TimeSecond": 0.8,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 1,
        "EquipmentCrystalID": 5,
        "EffectSelf": "self_role_sword_fire",
        "EffectEnemy": "enemy_sword_fire",
        "Audio": "sword.mp3",
        "TimeSecond": 0.8,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 1,
        "EquipmentCrystalID": 6,
        "EffectSelf": "self_role_sword_stone",
        "EffectEnemy": "enemy_sword_stone",
        "Audio": "sword.mp3",
        "TimeSecond": 0.8,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 9,
        "EquipmentCrystalID": 1,
        "EffectSelf": "self_normal_monster",
        "EffectEnemy": "",
        "Audio": "tearing.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 9,
        "EquipmentCrystalID": 2,
        "EffectSelf": "self_normal_ligh",
        "EffectEnemy": "",
        "Audio": "tearing1.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 9,
        "EquipmentCrystalID": 3,
        "EffectSelf": "self_normal_grass",
        "EffectEnemy": "",
        "Audio": "tearing2.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 9,
        "EquipmentCrystalID": 4,
        "EffectSelf": "self_normal_ice",
        "EffectEnemy": "",
        "Audio": "tearing.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 9,
        "EquipmentCrystalID": 5,
        "EffectSelf": "self_normal_fire",
        "EffectEnemy": "",
        "Audio": "tearing1.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      },
      {
        "EquipmentTypeID": 9,
        "EquipmentCrystalID": 6,
        "EffectSelf": "self_normal_stone",
        "EffectEnemy": "",
        "Audio": "tearing2.mp3",
        "TimeSecond": 1,
        "IsShock": 0,
        "SkillIconPath": ""
      }
     ];
  },

  //設定console
  setConsole(boo) {
    this.isConsole = boo;
  },

};
module.exports = SkillUtils;