var Ready4FightCallback = {
  "HubConnectID": "qwBQ-ZZlLr7lmHVcAAAI",
  "MemberRole_ID": 3,
  "AreaID": "Arena2",
  "FightScore": 996,
  "RoleType": "Role",
  "MemberRoleImg_URL": "http://mosaandnasa.com/Cocos-hotfix/board/photo/role_icon.png",
  "Name": "bibi2",
  "ArenaTitle_ID": 3,
  "ArenaTitle_Name": "聖人",
  "Background_ID": 5,
  "MemberRole_Lv": 50,
  "RoleWinScore": 0,
  "Skills": [
    {
      "SkillPrototype_ID": 6,
      "SkillPrototype_Name": "乾坤一擲",
      "SkillPrototype_Sign": "0,3,4",
      "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/7a584203c3b624cf306e6e4387efed35.jpg",
      "MpCost": 10,
      "AttackTimes": 1,
      "Description": "給予對象1.1倍的傷害，自身命中率降低3%",
      "Sort": 1
    },
    {
      "SkillPrototype_ID": 7,
      "SkillPrototype_Name": "暴風連斬",
      "SkillPrototype_Sign": "0,1,2,4,6,7,8",
      "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/09a8216f1d5eb2ba41624efea02e31b7.jpg",
      "MpCost": 20,
      "AttackTimes": 2,
      "Description": "同一攻擊對象，2次攻擊，共造成1.15倍傷害",
      "Sort": 2
    },
    {
      "SkillPrototype_ID": 8,
      "SkillPrototype_Name": "破山擊",
      "SkillPrototype_Sign": "0,1,4",
      "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/cd19bf465812fa0e789122dc305a3656.jpg",
      "MpCost": 10,
      "AttackTimes": 1,
      "Description": "給予對象1.07倍的傷害，自身減少防禦力和精神力5%",
      "Sort": 3
    },
    {
      "SkillPrototype_ID": 9,
      "SkillPrototype_Name": "保護盾",
      "SkillPrototype_Sign": "3,0,1,4",
      "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/3188de444496f565116230d784b488c0.jpg",
      "MpCost": 20,
      "AttackTimes": 1,
      "Description": "增加40%防禦力和40%魔抗，持續2回合",
      "Sort": 4
    },
    {
      "SkillPrototype_ID": 12,
      "SkillPrototype_Name": "鈍化攻擊",
      "SkillPrototype_Sign": "2,4,6,7,8",
      "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/92ccf759ae7825b32324e3771d96cf6c.jpg",
      "MpCost": 30,
      "AttackTimes": 1,
      "Description": "給予對象1.0倍的傷害，下一回合對象攻擊力降低30%",
      "Sort": 5
    }
  ],
  "Props": [
    {
      "PropsPrototype_ID": 1,
      "PropsPrototype_Name": "紅色藥水",
      "PropsType_ID": 1,
      "CallScript": "AddHp(100,'point',0,socket)",
      "PropsPrototype_Img": "",
      "Description": "恢復血量約100點(依角色恢復值增減)",
      "Sort": 1
    },
    {
      "PropsPrototype_ID": 1,
      "PropsPrototype_Name": "紅色藥水",
      "PropsType_ID": 1,
      "CallScript": "AddHp(100,'point',0,socket)",
      "PropsPrototype_Img": "",
      "Description": "恢復血量約100點(依角色恢復值增減)",
      "Sort": 2
    },
    {
      "PropsPrototype_ID": 4,
      "PropsPrototype_Name": "橙色藥水",
      "PropsType_ID": 1,
      "CallScript": "AddHp(200,'point',0,socket)",
      "PropsPrototype_Img": "",
      "Description": "恢復血量約200點(依角色恢復值增減)",
      "Sort": 3
    },
    {
      "PropsPrototype_ID": 18,
      "PropsPrototype_Name": "初級防禦增強卷軸",
      "PropsType_ID": 4,
      "CallScript": "AddDef(10,'percent',30,socket,18)",
      "PropsPrototype_Img": "",
      "Description": "使用後，該場戰鬥持續增加自身防禦10%",
      "Sort": 4
    },
    {
      "PropsPrototype_ID": 20,
      "PropsPrototype_Name": "初級攻擊增強卷軸",
      "PropsType_ID": 4,
      "CallScript": "AddAtk(10,'percent',30,socket,20)",
      "PropsPrototype_Img": "",
      "Description": "使用後，該場戰鬥持續增加自身攻擊10%",
      "Sort": 5
    }
  ],
  "StatusList": {
    "Def": 688,
    "MDef": 24,
    "MP": 3520,
    "MAtk": 44,
    "HP": 2296,
    "CriticalRate": 0,
    "Res": 40,
    "DodgeRate": 0,
    "Int": 0,
    "HitRate": 0,
    "Agi": 520,
    "Atk": 520
  },
  "curStatusList": {
    "Def": 688,
    "MDef": 24,
    "MP": 3520,
    "MAtk": 44,
    "HP": 2296,
    "CriticalRate": 0,
    "Res": 40,
    "DodgeRate": 0,
    "Int": 0,
    "HitRate": 0,
    "Agi": 520,
    "Atk": 520
  },
  "isFighting": 1
};

module.exports = Ready4FightCallback;