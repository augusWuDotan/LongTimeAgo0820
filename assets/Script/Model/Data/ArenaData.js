
cc.Class({
    extends: cc.Component,

    properties: {
        //會員ID
        MemberID: {
            default: -1,
            visible: false,
            type: cc.Integer
        },

        //會員info
        MemberInfo: {
            default: -1,
            visible: false,
        },

        //進入的 競技場 ID
        ArenaId: {
            default: -1,
            visible: false,
        },

        //競技場對戰房間ID
        ArenaGameRoomId: {
            default: -1,
            visible: false,
        },

        //結束資訊
        ArenaGameFinishData: {
            default: null,
            visible: false
        },

        //機器人開關
        isBot: {
            default: false,
            visible: false,
        },

        //機器人答對率
        BotCorrectPer: {
            default: 0.7,
            visible: false,
        },
    },

    /**
     * ---------------- MemberID 會員ID
     * @param {*} ID 
     */
    setMemberID(ID) {
        this.MemberID = ID;
    },

    getMemberID() {
        return this.MemberID;
    },

    /**
     * ---------------- ArenaId 
     * @param {*} ID 
     */

    setArenaId(ID) {
        this.ArenaId = ID;
    },

    getArenaId() {
        return this.ArenaId;
    },

    /**
     * ---------------- RoomID
     * @param {*} ID 
     */
    setArenaGameRoomId(ID) {
        this.ArenaGameRoomId = ID;
    },

    getArenaGameRoomId() {
        return this.ArenaGameRoomId;
    },



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},
});
