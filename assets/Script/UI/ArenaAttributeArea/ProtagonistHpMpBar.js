
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.05,
        HpBar: {
            type: cc.ProgressBar,
            default: null
        },
        MpBar: {
            type: cc.ProgressBar,
            default: null
        },
        //HP上升
        HPUP_audio: {
            default: null,
            url: cc.AudioClip
        },
        //HP下降
        HPDOWN_audio: {
            default: null,
            url: cc.AudioClip
        },
        //HP上升
        MPUP_audio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.bloodMaxVolume = 0;//血量最大值
        this.magicMaxVolume = 0;//魔力最大值
        this.bloodVolume = 0;//現在的血量
        this.magicVolume = 0;//現在的魔力
    },

    start() {
        console.log('start');
    },

    onDestroy() {
        console.log('onDestroy');
    },

    //
    onEnable() {
        console.log('onEnable');
    },

    onDisable() {
        console.log('onDisable');
    },

    getBlood() {
        return this.bloodVolume;
    },

    getMagic() {
        return this.magicVolume;
    },

    //初始化
    init(BloodVolume, MagicVolume, MaxBloodVolume, MaxMagicVolume) {
        this.bloodMaxVolume = MaxBloodVolume;//血量最大值
        this.magicMaxVolume = MaxMagicVolume;//魔力最大值
        this.bloodVolume = BloodVolume;
        this.magicVolume = MagicVolume;
        this.HpBar.progress = 0;
        this.MpBar.progress = 0;
        this.bloodProgress = this.bloodVolume / this.bloodMaxVolume;
        this.MagicProgress = this.magicVolume / this.magicMaxVolume;
        this.unscheduleAllCallbacks();
        this.schedule(this.initBloodProgress, 0.001);
        this.schedule(this.initMagicProgress, 0.001);
    },

    initBloodProgress() {
        var progress = this.HpBar.progress;
        progress += this.speed;
        // console.log(progress);
        if (progress >= this.bloodProgress) {
            progress = this.bloodProgress;
            self.HpBar.progress = progress;
            // self.MpBar.progress = progress;
            this.unschedule(this.initBloodProgress);
        } else {
            self.HpBar.progress = progress;
            // self.MpBar.progress = progress;
        }
    },

    initMagicProgress() {
        var progress = this.MpBar.progress;
        progress += this.speed;
        // console.log(progress);
        if (progress >= this.MagicProgress) {
            progress = this.MagicProgress;
            // self.HpBar.progress = progress;
            self.MpBar.progress = progress;
            this.unschedule(this.initMagicProgress);
        } else {
            // self.HpBar.progress = progress;
            self.MpBar.progress = progress;
        }
    },

    /**
     * 下降血量
     * @param {*} volume  
     */
    BloodDown(volume) {
        // console.log('BloodDown:'+mProgress);
        //音效
        cc.audioEngine.playEffect(this.HPDOWN_audio, false, 0.8);
        console.log('BloodDown volume:' + volume);
        console.log('BloodDown bloodVolume:' + this.bloodVolume);
        console.log('BloodDown bloodMaxVolume:' + this.bloodMaxVolume);
        this.bloodVolume = this.bloodVolume + volume;
        if (this.bloodVolume <= 0) this.bloodVolume = 0;
        let mProgress = this.bloodVolume / this.bloodMaxVolume;
        console.log('BloodDown mProgress:' + mProgress);

        this.HpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
        this.HpBar.getComponent(cc.ProgressBar).schedule(function () {
            var progress = self.HpBar.progress;
            progress -= self.speed;
            // console.log(progress);
            if (progress <= mProgress) {
                progress = mProgress;
                self.HpBar.progress = progress;
                self.HpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
            } else {
                self.HpBar.progress = progress;
            }
        }, 0.005);
    },

    /**
     * 上升血量
     * @param {*} volume 
     */
    BloodUp(volume) {

        //音效
        cc.audioEngine.playEffect(this.HPUP_audio, false, 0.8);
        console.log('BloodDown volume:' + volume);
        console.log('BloodDown bloodVolume:' + this.bloodVolume);
        console.log('BloodDown bloodMaxVolume:' + this.bloodMaxVolume);
        this.bloodVolume = this.bloodVolume + volume;
        if (this.bloodVolume >= this.bloodMaxVolume) this.bloodVolume = this.bloodMaxVolume;
        let mProgress = this.bloodVolume / this.bloodMaxVolume;
        console.log('BloodUp mProgress:' + mProgress);
        this.HpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
        this.HpBar.getComponent(cc.ProgressBar).schedule(function () {
            var progress = self.HpBar.progress;
            progress += self.speed;
            if (progress >= mProgress) {
                progress = mProgress;
                self.HpBar.progress = progress;
                self.HpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
            } else {
                self.HpBar.progress = progress;
            }
        }, 0.001);
    },

    /**
     * 下降魔力
     * @param {*} volume 
     */
    MagicDown(volume) {
        //音效
        cc.audioEngine.playEffect(this.MPUP_audio, false, 0.8);
        console.log('BloodDown volume:' + volume);
        console.log('BloodDown magicVolume:' + this.magicVolume);
        console.log('BloodDown magicMaxVolume:' + this.magicMaxVolume);
        //計算  
        this.magicVolume = this.magicVolume + volume;
        if (this.magicVolume <= 0) this.magicVolume = 0;
        let mProgress = this.magicVolume / this.magicMaxVolume;
        console.log('MagicDown mProgress:' + mProgress);
        this.MpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
        this.MpBar.getComponent(cc.ProgressBar).schedule(function () {
            var progress = self.MpBar.progress;
            progress -= self.speed;
            // console.log(progress);
            if (progress <= mProgress) {
                progress = mProgress;
                self.MpBar.progress = progress;
                self.MpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
            } else {
                self.MpBar.progress = progress;
            }
        }, 0.001);
    },

    /**
     * 上升魔力
     * @param {*} volume 
     */
    MagicUp(volume) {
        console.log('BloodDown volume:' + volume);
        console.log('BloodDown magicVolume:' + this.magicVolume);
        console.log('BloodDown magicMaxVolume:' + this.magicMaxVolume);
        this.magicVolume = this.magicVolume + volume;
        if (this.magicVolume >= this.magicMaxVolume) this.magicVolume = this.magicMaxVolume;
        let mProgress = this.magicVolume / this.magicMaxVolume;
        console.log('MagicUp mProgress:' + mProgress);
        this.MpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
        this.MpBar.getComponent(cc.ProgressBar).schedule(function () {
            var progress = self.MpBar.progress;
            progress += self.speed;
            // console.log(progress);
            if (progress >= mProgress) {
                progress = mProgress;
                self.MpBar.progress = progress;
                self.MpBar.getComponent(cc.ProgressBar).unscheduleAllCallbacks();
            } else {
                self.MpBar.progress = progress;
            }
        }, 0.001);
    },


    update(dt) {
    },

});
