//競技場使用 utils
var ArenaUtils = {
    isConsole: true,//是否顯示console
    /**
     * 取得人物素材
     * @param {*} type 人物角色 對應素材
     */
    getRolePath(type) {
        let HPMPBgActive = true;//是否顯示血條魔力條的背景
        let AvatarBgPath = ''; //頭像背景
        let HPMPBgPath = '';//血條魔力條背景
        let HPMPPillarBgPath = '';//血條魔力條底圖
        //配對路徑
        switch (type) {
            case 1:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head1.png';
                HPMPBgPath = '';//
                HPMPPillarBgPath = '/Texture/protagonist/AttributeArea_hpmp_background/role_hpmp1_bar.png';
                break;
            case 2:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head2.png';
                HPMPBgPath = '/Texture/protagonist/AttributeArea_background/role_hpmp2_bg.png';
                HPMPPillarBgPath = '/Texture/protagonist/AttributeArea_hpmp_background/role_hpmp2_bar.png';
                break;
            case 3:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head3.png';
                HPMPBgPath = '/Texture/protagonist/AttributeArea_background/role_hpmp3_bg.png';
                HPMPPillarBgPath = '/Texture/protagonist/AttributeArea_hpmp_background/role_hpmp3_bar.png';
                break;
            case 4:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head4.png';
                HPMPBgPath = '/Texture/protagonist/AttributeArea_background/role_hpmp4_bg.png';
                HPMPPillarBgPath = '/Texture/protagonist/AttributeArea_hpmp_background/role_hpmp4_bar.png';
                break;
            case 5:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head5.png';
                HPMPBgPath = '/Texture/protagonist/AttributeArea_background/role_hpmp5_bg.png';
                HPMPPillarBgPath = '/Texture/protagonist/AttributeArea_hpmp_background/role_hpmp5_bar.png';
                break;
            default:
                AvatarBgPath = '/Texture/protagonist/AttributeArea_head_bg/role_head1.png';
                HPMPBgPath = '';//
                HPMPPillarBgPath = '/Texture/protagonist/AttributeArea_hpmp_background/role_hpmp1_bar.png';
                break;
        }

        //是否顯示血條跟魔力的背景 type = 1-5 , 1 和 超過5 不顯示
        if (type <= 1 || type > 5) {
            HPMPBgActive = false;
        } else {
            HPMPBgActive = true;
        }

        var model = {
            'AvatarBgPath': AvatarBgPath,
            'HPMPBgPath': HPMPBgPath,
            'HPMPPillarBgPath': HPMPPillarBgPath,
            'HPMPBgActive': HPMPBgActive
        };
        //
        if (this.isConsole) console.log(JSON.stringify(model));

        return model;
    },

    /**
    * 取得怪獸素材
    * @param {*} type 怪獸角色 對應素材
    */
    getMonsterPath(type) {
        let HPMPBgActive = true;//是否顯示血條魔力條的背景
        let AvatarBgPath = ''; //頭像背景
        let HPMPBgPath = '';//血條魔力條背景
        let HPMPPillarBgPath = '';//血條魔力條底圖
        //配對路徑
        switch (type) {
            case 1:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_boss_head_bg/monster_head1.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_monster_background/monster_hpmp1_bg.png';//
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp1_bar.png';
                break;
            case 2:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_boss_head_bg/monster_head2.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_monster_background/monster_hpmp2_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp2_bar.png';
                break;
            case 3:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_boss_head_bg/monster_head3.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_monster_background/monster_hpmp3_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp3_bar.png';
                break;
            case 4:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_boss_head_bg/monster_head4.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_monster_background/monster_hpmp4_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp4_bar.png';
                break;
            case 5:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_boss_head_bg/monster_head5.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_monster_background/monster_hpmp5_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp5_bar.png';
                break;
            default:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_boss_head_bg/monster_head1.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_monster_background/monster_hpmp1_bg.png';//
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp1_bar.png';
                break;
        }

        var model = {
            'AvatarBgPath': AvatarBgPath,
            'HPMPBgPath': HPMPBgPath,
            'HPMPPillarBgPath': HPMPPillarBgPath,
            'HPMPBgActive': HPMPBgActive
        };

        //
        if (this.isConsole) console.log(JSON.stringify(model));

        return model;
    },

    /**
   * 取得Boss素材
   * @param {*} type Boss角色 對應素材
   */
    getBossPath(type) {
        let HPMPBgActive = true;//是否顯示血條魔力條的背景
        let AvatarBgPath = ''; //頭像背景
        let HPMPBgPath = '';//血條魔力條背景
        let HPMPPillarBgPath = '';//血條魔力條底圖
        //配對路徑
        switch (type) {
            case 1:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_monster_head_bg/boss_head1.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_boss_background/boss_hpmp1_bg.png';//
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp1_bar.png';
                break;
            case 2:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_monster_head_bg/boss_head2.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_boss_background/boss_hpmp2_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp2_bar.png';
                break;
            case 3:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_monster_head_bg/boss_head3.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_boss_background/boss_hpmp3_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp3_bar.png';
                break;
            case 4:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_monster_head_bg/boss_head4.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_boss_background/boss_hpmp4_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp4_bar.png';
                break;
            case 5:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_monster_head_bg/boss_head5.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_boss_background/boss_hpmp5_bg.png';
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp5_bar.png';
                break;
            default:
                AvatarBgPath = '/Texture/rival/AttributeArea_rival_monster_head_bg/boss_head1.png';
                HPMPBgPath = '/Texture/rival/AttributeArea_rival_boss_background/boss_hpmp1_bg.png';//
                HPMPPillarBgPath = '/Texture/rival/AttributeArea_rival_hpmp_background/boss_hpmp1_bar.png';
                break;
        }

        var model = {
            'AvatarBgPath': AvatarBgPath,
            'HPMPBgPath': HPMPBgPath,
            'HPMPPillarBgPath': HPMPPillarBgPath,
            'HPMPBgActive': HPMPBgActive
        };

        //
        if (this.isConsole) console.log(JSON.stringify(model));

        return model;
    },

    /**
     * 取得屬性的中文  [增益 減益 增加扣除血量魔力使用]
     */
    getAttrTitle(attr_eng) {

        let attr_tw = '';
        switch (attr_eng) {
            case 'Atk': attr_tw = '攻击'; break;
            case 'Def': attr_tw = '防御'; break;
            case 'Agi': attr_tw = '敏捷'; break;
            case 'Int': attr_tw = '精神'; break;
            case 'Res': attr_tw = '恢复'; break;
            case 'MAtk': attr_tw = '魔攻'; break;
            case 'MDef': attr_tw = '魔抗'; break;
            case 'HP': attr_tw = '血量'; break;
            case 'MP': attr_tw = '魔量'; break;
            case 'CriticalRate': attr_tw = '必杀'; break;
            case 'DodgeRate': attr_tw = '闪避'; break;
            case 'HitRate': attr_tw = '命中'; break;
            default:
                break;
        }
        //
        if (this.isConsole) console.log(attr_tw);
        return attr_tw;
    },

     /**
     * 使用method 對應 屬性 [增益 減益 增加扣除血量魔力使用]
     */
    getAttrEng(method) {
        if (this.isConsole) console.log('method:'+method);
        let attr_eng = '';
        switch (method) {
            case 'AddAtk': attr_eng = 'Atk'; break;
            case 'AddDef': attr_eng = 'Def'; break;
            case 'AddAgi': attr_eng = 'Agi'; break;
            case 'AddInt': attr_eng = 'Int'; break;
            case 'AddRes': attr_eng = 'Res'; break;
            case 'AddMAtk': attr_eng = 'MAtk'; break;
            case 'AddMDef': attr_eng = 'MDef'; break;
            case 'AddHp': attr_eng = 'HP'; break;
            case 'AddMp': attr_eng = 'MP'; break;
            case 'AddCriticalRate': attr_eng = 'CriticalRate'; break;
            case 'AddDodgeRate': attr_eng = 'DodgeRate'; break;
            case 'AddHitRate': attr_eng = 'HitRate'; break;
            default:
            attr_eng = 'null';
                break;
        }
        //
        if (this.isConsole) console.log(attr_eng);
        return attr_eng;
    },

    //取得技能狀態圖示id SKill
    getAttributeStatusIconPath_Skill(source, volume) {
        let Path = '';
        switch (source) {
            case 'Atk':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/atk_up';
                else Path = '/Texture/arena_status/statusicon/atk_down';
                break;
            case 'Def':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/def_up';
                else Path = '/Texture/arena_status/statusicon/def_down'; break;
            case 'Agi':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/agi_up';
                else Path = '/Texture/arena_status/statusicon/agi_down';
                break;
            case 'Int':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/int_up';
                else Path = '/Texture/arena_status/statusicon/int_down';
                break;
            // case 'Res': attr_tw = '恢復'; break;
            case 'MAtk':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/matk_up';
                else Path = '/Texture/arena_status/statusicon/matk_down';
                break;
            case 'MDef':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/mdef_up';
                else Path = '/Texture/arena_status/statusicon/mdef_down';
                break;
            case 'HP':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/hp_up';
                else Path = '/Texture/arena_status/statusicon/hp_down';
                break;
            case 'MP':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/mp_up';
                else Path = '/Texture/arena_status/statusicon/mp_down';
                break;
            case 'CriticalRate':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/crit_up';
                else Path = '/Texture/arena_status/statusicon/crit_down';
                break;
            case 'DodgeRate':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/dodg_up';
                else Path = '/Texture/arena_status/statusicon/dodg_down';
                break;
            case 'HitRate':
                if (volume >= 0) Path = '/Texture/arena_status/statusicon/hit_up';
                else Path = '/Texture/arena_status/statusicon/hit_down';
                break;
        }
        return Path;
    },

    
    //取得技能狀態圖示id SKill SkillBigIcon
    getAttributeStatusBigIconPath_Skill(source, volume) {
        let Path = '';
        switch (source) {
            case 'Atk':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/atk_up';
                else Path = '/Texture/arena_status/statusBigIcon/atk_down';
                break;
            case 'Def':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/def_up';
                else Path = '/Texture/arena_status/statusBigIcon/def_down'; break;
            case 'Agi':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/agi_up';
                else Path = '/Texture/arena_status/statusBigIcon/agi_down';
                break;
            case 'Int':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/int_up';
                else Path = '/Texture/arena_status/statusBigIcon/int_down';
                break;
            // case 'Res': attr_tw = '恢復'; break;
            case 'MAtk':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/matk_up';
                else Path = '/Texture/arena_status/statusBigIcon/matk_down';
                break;
            case 'MDef':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/mdef_up';
                else Path = '/Texture/arena_status/statusBigIcon/mdef_down';
                break;
            case 'HP':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/hp_up';
                else Path = '/Texture/arena_status/statusBigIcon/hp_down';
                break;
            case 'MP':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/mp_up';
                else Path = '/Texture/arena_status/statusBigIcon/mp_down';
                break;
            case 'CriticalRate':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/crit_up';
                else Path = '/Texture/arena_status/statusBigIcon/crit_down';
                break;
            case 'DodgeRate':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/dodg_up';
                else Path = '/Texture/arena_status/statusBigIcon/dodg_down';
                break;
            case 'HitRate':
                if (volume >= 0) Path = '/Texture/arena_status/statusBigIcon/hit_up';
                else Path = '/Texture/arena_status/statusBigIcon/hit_down';
                break;
        }
        return Path;
    },

    //取得技能狀態圖示id Item
    getAttributeStatusIconPath_Item(SourceID, volume) {
        let Path = '';
        switch (SourceID) {
            default:
                Path = '/Texture/props/default_item.png';
                break;
        }
        return Path;
    },

    /**
     * 取得五芒星背景路徑
     * @param {*} type background_id 對應素材
     */
    getPentagramPath(type) {
        let PentagramPath = '';//五芒星背景路徑
        //配對路徑
        switch (type) {
            case 1:
                PentagramPath = '/Texture/ArenaAttack/AttackType/five_star1';
                break;
            case 2:
                PentagramPath = '/Texture/ArenaAttack/AttackType/five_star2';
                break;
            case 3:
                PentagramPath = '/Texture/ArenaAttack/AttackType/five_star3';
                break;
            case 4:
                PentagramPath = '/Texture/ArenaAttack/AttackType/five_star4';
                break;
            case 5:
                PentagramPath = '/Texture/ArenaAttack/AttackType/five_star5';
                break;
            default:

                break;
        }
        return PentagramPath;
    },


    /**
     * 取得技能icon路徑
     * @param {*} type 技能 對應素材
     */
    getSkillIconPath(skillId) {
        let skillPath = '';//五芒星背景路徑
        //配對路徑
        switch (skillId) {
            case 1:
                skillPath = '/Texture/ArenaAttack/AttackSkill/sample1';
                break;
            case 2:
                skillPath = '/Texture/ArenaAttack/AttackSkill/sample2';
                break;
            case 3:
                skillPath = '/Texture/ArenaAttack/AttackSkill/sample3';
                break;
            default:
                skillPath = '/Texture/ArenaAttack/AttackSkill/sample2';
                break;
        }
        return skillPath;
    },

    //設定console
    setConsole(boo) {
        this.isConsole = boo;
    },

};

module.exports = ArenaUtils;