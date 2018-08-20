
cc.Class({
    extends: cc.Component,

    properties: {
        type: null,
        info: null,
        IsInEquipment: false,//是否裝備
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() { },

    /**
     * 
     * @param {*} type 物品型別
     * @param {*} info 物品屬性
     * @param {*} type 物品在哪一頁
     * @param {*} type 物品在哪一個index
     * @param {*} type 點選到物品需要回傳的方法
     */
    init(type, info, page, pageIndex, selectfuc, isInEquipment) {
        var self = this;
        this.type = type;
        this.info = info;
        this.page = page;
        this.pageIndex = pageIndex;
        this.selectfuc = selectfuc;//回傳方法
        if (isInEquipment) this.IsInEquipment = isInEquipment;//是否裝備
        //
        this.NameNode = this.node.getChildByName('Container').getChildByName('Name');
        this.Container = this.node.getChildByName('Container');
        this.goodphotoNode = this.node.getChildByName('Container').getChildByName('goodphoto');
        this.SelectedLightNode = this.node.getChildByName('Container').getChildByName('SelectedLight');
        //
        this.checkData();
    },


    checkData() {
        var self = this;

        //道具、裝備、套裝、技能
        switch (this.type) {
            case 'armor':
            case 'weapon':
                if (this.NameNode) this.NameNode.getComponent(cc.Label).string = this.info.Equipment_Name;
                if (this.info.EquipmentType_Image != '' && this.info.EquipmentType_Image != null) {
                    cc.loader.load({ url: this.info.EquipmentType_Image, type: 'png' }, function (error, texture) {
                        if (error != null) {
                            self.onError(error);
                        } else {
                            var spriteFrame = new cc.SpriteFrame(texture);
                            self.goodphotoNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        }
                    });
                }
                break;
            case 'prop':
                if (this.NameNode) this.NameNode.getComponent(cc.Label).string = this.info.PropsPrototype_Name;
                this.Count = this.Container.getChildByName('countLayer').getChildByName('countLabel');
                this.Count.getComponent(cc.Label).string = this.info.PropsType_count;
                if (this.info.PropsPrototype_Img != '' && this.info.PropsPrototype_Img != null) {
                    cc.loader.load({ url: this.info.PropsPrototype_Img, type: 'png' }, function (error, texture) {
                        if (error != null) {
                            self.onError(error);
                        } else {
                            var spriteFrame = new cc.SpriteFrame(texture);
                            self.goodphotoNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        }
                    });
                }
                break;
            case 'skill':
                if (this.NameNode) this.NameNode.getComponent(cc.Label).string = this.info.SkillPrototype_Name;
                this.Container.getChildByName('skillLevel').getChildByName('Label').getComponent(cc.Label).string = 'Lv.'+this.info.Limit_Lv;//等級
                if (this.info.SkillPrototype_Img != '' && this.info.SkillPrototype_Img != null) {
                    cc.loader.load({ url: this.info.SkillPrototype_Img, type: 'png' }, function (error, texture) {
                        if (error != null) {
                            self.onError(error);
                        } else {
                            var spriteFrame = new cc.SpriteFrame(texture);
                            self.goodphotoNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        }
                    });
                }
                break;

            default:
                break;
        }


        var ContainerImagePath;
        switch (this.type) {
            case 'armor':
                ContainerImagePath = self.armorContainerPath(self.info.EquipmentLevel_ID);
                break;
            case 'weapon':
                ContainerImagePath = self.weaponContainerPath(self.info.EquipmentLevel_ID);
                break;
            case 'prop':
                //null
                break;
            case 'skill':
                ContainerImagePath = self.skillContainerPath(self.info.Crystal_ID);
                break;
            default:
                break;
        }

        if (ContainerImagePath != '' && ContainerImagePath != null) {
            cc.loader.loadRes(ContainerImagePath, cc.SpriteFrame, function (error, spriteFrame) {
                if (error != null) {
                    self.onError(error);
                } else {
                    self.Container.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }

        if (this.type == 'armor' || this.type == 'weapon') {
            //檢查是否裝備
            if (this.IsInEquipment) {
                //是
                this.Container.getChildByName('IsInEquipment').active = true;
            } else {
                //否
                this.Container.getChildByName('IsInEquipment').active = false;
            }
        }

    },
    //使用道具
    useProp(count) {
        if (!this.Count) return;
        this.info.PropsType_count = count;
        this.Count.getComponent(cc.Label).string = this.info.PropsType_count;
    },

    //armor
    armorContainerPath(EquipmentLevel_ID) {
        var goodsContainerImagePath;
        switch (EquipmentLevel_ID) {
            case 1:
                goodsContainerImagePath = 'Texture/TabView/WhiteArmorGoodsContainer';
                break;
            case 2:
                goodsContainerImagePath = 'Texture/TabView/GreenArmorGoodsContainer';
                break;
            case 3:
                goodsContainerImagePath = 'Texture/TabView/BlueArmorGoodsContainer';
                break;
            case 4:
                goodsContainerImagePath = 'Texture/TabView/OrangeArmorGoodsContainer';
                break;
            case 5:
                goodsContainerImagePath = 'Texture/TabView/PurpleArmorGoodsContainer';
                break;
            default:
                goodsContainerImagePath = 'Texture/TabView/WhiteArmorGoodsContainer';
                break;
        }
        return goodsContainerImagePath;
    },

    //weapon
    weaponContainerPath(EquipmentLevel_ID) {
        var goodsContainerImagePath;
        switch (EquipmentLevel_ID) {
            case 1:
                goodsContainerImagePath = 'Texture/TabView/WhiteGoodsContainer';
                break;
            case 2:
                goodsContainerImagePath = 'Texture/TabView/GreenGoodsContainer';
                break;
            case 3:
                goodsContainerImagePath = 'Texture/TabView/BlueGoodsContainer';
                break;
            case 4:
                goodsContainerImagePath = 'Texture/TabView/OrangeGoodsContainer';
                break;
            case 5:
                goodsContainerImagePath = 'Texture/TabView/PurpleGoodsContainer';
                break;
            default:
                goodsContainerImagePath = 'Texture/TabView/WhiteGoodsContainer';
                break;
        }
        return goodsContainerImagePath;
    },

    //skill
    skillContainerPath(Crystal_ID) {
        var skillContainerImagePath;
        switch (Crystal_ID) {
            case 1:
                skillContainerImagePath = 'Texture/TabView/PhysicalSkillContainer';
                break;
            case 2:
                skillContainerImagePath = 'Texture/TabView/GoldSkillContainer';
                break;
            case 3:
                skillContainerImagePath = 'Texture/TabView/WoodSkillContainer';
                break;
            case 4:
                skillContainerImagePath = 'Texture/TabView/WaterSkillContainer';
                break;
            case 5:
                skillContainerImagePath = 'Texture/TabView/FireSkillContainer';
                break;
            case 6:
                skillContainerImagePath = 'Texture/TabView/EarthSkillContainer';
                break;
            default:
                break;
        }
        return skillContainerImagePath;
    },

    selectClick() {
        if (this.selectfuc) this.selectfuc(this.node);
    },

    //變更裝備狀態
    changeEquipmentState() {
        if (this.type == 'armor' || this.type == 'weapon') {
            this.IsInEquipment = !this.IsInEquipment;
            //檢查是否裝備
            if (this.IsInEquipment) {
                //是
                this.Container.getChildByName('IsInEquipment').active = true;
            } else {
                //否
                this.Container.getChildByName('IsInEquipment').active = false;
            }
        }
    },
    // update (dt) {},
});
