var self;
cc.Class({
    extends: cc.Component,

    properties: {
        wave:{
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.init('0706Player', 'role', 'female', 'A02', 'Weapon/ax01');
    },

    /**
     * 初始化
     * @param {*} roleType role || monster || boss
     * @param {*} gender is role not '' 性別 male || female
     * @param {*} EquipmentType 裝備型別 A01 | A02
     * @param {*} WeaponType  武器種類 Weapon/ax01 斧| Weapon/sword01劍   [04_Weapon]
     */
    init(SpinePath, roleType, gender, EquipmentType, WeaponType) {
        self = this;
        this.node.opacity = 0;

        this.sp_skeleton = null;
        var url = 'AutoAtlas/spine/' + SpinePath;
        cc.loader.loadRes(url, sp.SkeletonData, function (err, SkeletonData) {
            console.log('---');
            if (!err) console.log(SkeletonData);
            else {
                console.log(err);
                return;
            }
            console.log('---');

            var child = new cc.Node();
            self.sp_skeleton = child.addComponent(sp.Skeleton);
            child.scale = 0.3;
            child.position = cc.p(0, -200);
            child.setLocalZOrder(1);
            self.sp_skeleton.skeletonData = SkeletonData;
            self.sp_skeleton.defaultAnimation = 'idle';//需預設
            self.sp_skeleton.defaultSkin = 'A01';//需預設
            self.sp_skeleton.loop = true;
            self.node.addChild(child);

            if (WeaponType) self.setWeaponType(WeaponType);
            if (EquipmentType) self.setEquipmentType(EquipmentType);
            if (roleType) self.setRoleType(roleType);
            if (gender) self.setGender(gender);

            var fadeinAction = cc.fadeIn(0.5);
            self.node.runAction(fadeinAction);

            self.scheduleOnce(function delay(params) {
                console.log('wave');
                cc.audioEngine.play(this.wave, false, 1);
                this.doNormalAttack();
                //音效
            }, 1);
        });
    },

    setRoleType(roleType) {
        //use different RoleType
    },
    setGender(gender) {

        if (gender === 'male') {
            this.GenderMale();
        } else {
            this.GenderFeMale();
        }

    },

    //男性
    GenderMale() {
        this.sp_skeleton.setAttachment('01_hair_e_right', 'Boy_Head/b_hair_e_right');
        this.sp_skeleton.setAttachment('01_eye_white', 'Boy_Head/b_eye_white');
        this.sp_skeleton.setAttachment('01_eyeball', 'Boy_Head/b_eyeball');
        this.sp_skeleton.setAttachment("01_hair_d_right2", 'Boy_Head/b_hair_e_right');
        this.sp_skeleton.setAttachment('01_face', 'Boy_Head/b_face');
        this.sp_skeleton.setAttachment('01_hair_e_left', 'Boy_Head/b_hair_e_left');
        this.sp_skeleton.setAttachment('01_eyeliner', 'Boy_Head/b_eyeliner');
        this.sp_skeleton.setAttachment('01_mouth', 'Boy_Head/b_mouth');
        this.sp_skeleton.setAttachment('01_eyebrow', 'Boy_Head/b_eyebrow');
        this.sp_skeleton.setAttachment('01_hair_d', 'Boy_Head/b_hair_d');
        this.sp_skeleton.setAttachment('01_hair_c', 'Boy_Head/b_hair_c');
        this.sp_skeleton.setAttachment('01_hair_b', 'Boy_Head/b_hair_b');
        this.sp_skeleton.setAttachment('01_hair', 'Boy_Head/b_hair_a');
    },

    //女性
    GenderFeMale() {
        this.sp_skeleton.setAttachment('01_hair_e_right', 'Girl_Head/g_hair_e');
        this.sp_skeleton.setAttachment('01_eye_white', 'Girl_Head/g_eye_white');
        this.sp_skeleton.setAttachment('01_eyeball', 'Girl_Head/g_eyeball');
        this.sp_skeleton.setAttachment('01_hair_d_right2', 'Girl_Head/g_hair_d_right2');//null
        this.sp_skeleton.setAttachment('01_face', 'Girl_Head/g_face');
        this.sp_skeleton.setAttachment('01_hair_e_left', 'Girl_Head/g_hair_d_right');
        this.sp_skeleton.setAttachment('01_eyeliner', 'Girl_Head/g_eyeliner');
        this.sp_skeleton.setAttachment('01_mouth', 'Girl_Head/g_mouth');
        this.sp_skeleton.setAttachment('01_eyebrow', 'Girl_Head/g_eyebrow');
        this.sp_skeleton.setAttachment('01_hair_d', 'Girl_Head/g_hair_d_left');
        this.sp_skeleton.setAttachment('01_hair_c', 'Girl_Head/g_hair_c');
        this.sp_skeleton.setAttachment('01_hair_b', 'Girl_Head/g_hair_b');
        this.sp_skeleton.setAttachment('01_hair', 'Girl_Head/g_hair_a');
    },

    //服裝 A01 A02
    setEquipmentType(EquipmentType) {
        this.sp_skeleton.setSkin(EquipmentType);
    },

    //
    setWeaponType(WeaponType) {
        console.log('setWeaponType');
        this.sp_skeleton.setAttachment('04_Weapon', WeaponType);
    },

    //普通攻擊
    doNormalAttack() {
        this.sp_skeleton.setAnimation(1, 'attack1', false);
        this.sp_skeleton.addAnimation(1, 'idle', true);
    },
    //技能攻擊
    doSkillAttack() {
        this.sp_skeleton.setAnimation(1, 'attack2', false);
        this.sp_skeleton.addAnimation(1, 'idle', true);
    },
    //受到攻擊
    doHit() {
        this.sp_skeleton.setAnimation(1, 'hit', false);
        this.sp_skeleton.addAnimation(1, 'idle', true);
    },


    start() {

    },

    // update (dt) {},
});
