var self;
var ArenaCallBack;//競技場回傳機制
var SocketControl;
var ArenaConfig = require('ArenaConfig');
//
var ArenaList = Object.create(null);;//競技場的種類
var ConnectData = Object.create(null);;//競技場的內容[ranking]
var RoomData = Object.create(null);;//目前這個競技場的人數
var ReadyData = Object.create(null);;//配對中 的callback
var GameStartData = Object.create(null);//開始戰鬥的資訊 的callback
var ParticipantData = Object.create(null);//主角資訊
var ParticipantSkills = Object.create(null);//主角資訊
var RivalData = Object.create(null);//對手資訊
var RivalSkills = Object.create(null);//對手資訊
var ParticipantSubjectData = Object.create(null);;//主角題目
var RoleAnwserData = Object.create(null);//雙方有一方答題
var AnwserData = Object.create(null);//雙方每一回合答題結束
var AttackData = Object.create(null);//每一次的攻擊回傳

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (ArenaConfig) console.log('ArenaConfig url: ' + ArenaConfig.SocketIO_URL);
    },

    initSocketControl() {
        if (ArenaConfig) console.log('ArenaConfig url: ' + ArenaConfig.SocketIO_URL);
        
        self = this;
        // var opts = {"force new connection" : false  , timeout: 2500000};
        var opts = { forceNew: true, 'timeout': 300000, 'reconnection': true, 'reconnectionDelay': 3000 };
        // SocketControl = io.connect(ArenaConfig.SocketIO_URL,opts);
        SocketControl = io.connect(ArenaConfig.SocketIO_URL, opts);
        
        //初始化 SocketIO 狀態監聽
        this.initConnectState();
        //初始化 SocketIO 資料監聽
        this.initCallback();
        // //啟動連接
        // SocketControl.open();
    },

    getSocketId() {
        if (SocketControl) return SocketControl.id;
        else return null;
    },

    getConnect(){
        return (SocketControl) ? SocketControl.connected : false; 
    },

    disConnect(){
        SocketControl.close();
    },

    //初始化 SocketIO 狀態監聽
    initConnectState() {
        //已連接
        SocketControl.on("connect", function (err) {
            console.log("connect");
            console.log("connect =>" + 'id = ' + SocketControl.id);
            if (ArenaCallBack) {
                ArenaCallBack('socket', 'connect', SocketControl.id);
            }
        });
        //錯誤訊息
        SocketControl.on("error", function (error) {
            console.log("error");
            if (ArenaCallBack) {
                ArenaCallBack('socket', 'error', error);
            }

        });
        //連接錯誤
        SocketControl.on("connect_error", function (error) {
            console.log("connect_error: " + error);
            if (ArenaCallBack) {
                ArenaCallBack('socket', 'error', error);
            }
        });
        //連接超時
        SocketControl.on("connect_timeout", function (timeout) {
            console.log("connect_timeout: " + timeout);
        });
        //斷開連接
        SocketControl.on("disconnect", function (reason) {
            console.log("disconnect: " + reason);
            if (ArenaCallBack) {
                ArenaCallBack('socket', 'disconnect', reason);
            }
        });
        //？
        SocketControl.on("reconnect_attempt", function (attemptNumber) {
            console.log("reconnect_attempt: " + attemptNumber);
        });
        //重新連接中
        SocketControl.on("reconnecting", function (attemptNumber) {
            console.log("reconnecting: " + attemptNumber);
        });
        //重新連接錯誤
        SocketControl.on("reconnect_error", function (error) {
            console.log("reconnect_error: " + error);
        });
        //重新連接失敗
        SocketControl.on("reconnect_failed", function () {
            console.log("reconnect_failed");
        });
        //即將有數據封包傳送
        SocketControl.on("ping", function () {
            //
            console.log("ping");
        });
        //封包傳送使用時間
        SocketControl.on("pong", function (latency) {
            //latency ms
            console.log("pong:" + latency);
        });
    },
    //設定AreanaCallBack
    setArenaCallBack(cal, name) {
        // console.log('setArenaCallBack : ' + name);
        ArenaCallBack = cal;
        console.log(ArenaCallBack);
    },

    //初始化 SocketIO 資料監聽
    initCallback() {

        //[debug]
        SocketControl.on(ArenaConfig.Client_debug, this.debugCallBack);
        //[pvp]監聽競技場區域訊息[]
        SocketControl.on(ArenaConfig.Client_ArenaList, this.ArenaListCallback);
        //[pvp]監聽連接訊息
        SocketControl.on(ArenaConfig.Client_Connect, this.ConncetCallback);
        //[pvp]重新進入配對
        SocketControl.on(ArenaConfig.Client_Restart, this.RestartCallback);
        //[pvp]監聽競技場房間訊息{}
        SocketControl.on(ArenaConfig.Client_showRoom, this.showRoom);
        // 監聽配對時 個人資訊回傳
        SocketControl.on(ArenaConfig.Client_ReadyCallback, this.ReadyCallback);
        // 監聽離開配對是否成功
        SocketControl.on(ArenaConfig.Client_CancelFightCallback, this.CancelFightCallback);
        // //角色配對完成監聽
        SocketControl.on(ArenaConfig.Client_GameStart, this.GameStart);
        // [第一個回答]
        SocketControl.on(ArenaConfig.Client_RoleAnwser, this.RoleAnwser);
        // [答題回傳]
        SocketControl.on(ArenaConfig.Client_AnswerCallback, this.AnswerCallback);
        // [使用道具]
        SocketControl.on(ArenaConfig.Client_UseItemsCallBack, this.UseItemCallBack);
        // [攻擊回傳]
        SocketControl.on(ArenaConfig.Client_AttackCallback, this.AttackCallback);
        // [下一步回傳]
        SocketControl.on(ArenaConfig.Client_GameNextCallBack, this.GameNextCallback);
        // [結束]]]
        SocketControl.on(ArenaConfig.Client_Victory, this.GameFinishCallback);

    },

    /**
     * debug
     */
    debugCallBack(debug) {
        console.log('-debug start-');
        // console.log(JSON.stringify(debug));
        console.log(debug);
        console.log('-debug end-');
    },

    /**
     * //取得競技場訊息
     * @param {*} MemberRole_ID //會員ID
     */
    doArenaList(MemberRole_ID) {
        SocketControl.emit(ArenaConfig.Service_doArenaList, MemberRole_ID);
    },


    //[pvp]監聽競技場區域訊息[]
    ArenaListCallback(ArenaListData) {
        console.log(ArenaListData);
        ArenaList = ArenaListData;
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'ArenaListCallback', ArenaListData);
        }
    },

    //[pvp]監聽競技場房間訊息{}
    showRoom(mRoomData) {
        console.log(mRoomData);
        RoomData = mRoomData;
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'showRoom', mRoomData);
        }
    },

    /**
     * [pvp]呼叫連接競技場
     * @param {*} MemberRole_ID //會員ID
     * @param {*} Arena_ID  //競技場ID
     * @param {*} ServerToken  //角色token
     * @param {*} isRe //是否重新連接
     */
    doConnect(MemberRole_ID, Arena_ID, isRe, ServerToken) {
        var ReStart = isRe ? isRe : false;
        var model = { 'MemberRole_ID': MemberRole_ID, 'Arena_ID': Arena_ID, 'isRe': ReStart };
        console.log(JSON.stringify(model));
        SocketControl.emit(ArenaConfig.Service_doConnect, model);
    },

    //[pvp]監聽連接訊息
    ConncetCallback(mConnectData) {
        console.log(mConnectData);
        ConnectData = mConnectData;
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'ConncetCallback', mConnectData);
        }
    },

    RestartCallback(isRestart) {
        console.log('isRestart:' + isRestart);
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'RestartCallback', isRestart);
        }
    },

    /** 
     * [pvp]呼叫連接競技場
     * @param {*} MemberRole_ID //會員ID
     * @param {*} Arena_ID  //競技場ID
     */
    doReady4Fight() {
        console.log('doReady4Fight');
        SocketControl.emit(ArenaConfig.Service_doReady4Fight)
    },

    //[pvp] 連接配對 系統馬上給予自己的資訊
    ReadyCallback(mReadyData) {
        console.log('ReadyCallback');
        ReadyData = mReadyData;
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'ReadyCallback', mReadyData);
        }
    },

    /** 
     * [pvp]請求連接機器人
     */
    doMachine() {
        console.log('doMachine');
        SocketControl.emit(ArenaConfig.Service_Waitting)
    },

    /** 
     * [pvp]請求離開配對
     */
    doCancelFight() {
        console.log('doCancelFight');
        SocketControl.emit(ArenaConfig.Service_CancelFight)
    },


    //[pvp] 監聽離開配對是否成功
    CancelFightCallback(CancelFightData) {
        console.log('CancelFightCallback');
        //true or false
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'CancelFightCallback', CancelFightData);
        }
    },

    //[pvp] 已經配對 系統給予雙方 房間訊息
    GameStart(mGameStartData) {
        GameStartData = mGameStartData;//
        //建立主角資訊、對手資訊、題目資訊
        //分辨誰是誰 Participants [取得主角與對手的資訊]
        var socketID = self.getSocketId();//先取得自己的socketID
        for (let role of mGameStartData.Participants) {
            if (role.HubConnectID === socketID) {
                ParticipantData = role;
                ParticipantSkills = role.Skills;
                console.log(JSON.stringify(ParticipantData));
                console.log('ParticipantData.curStatusList.HP: ' + ParticipantData.curStatusList.HP);
                console.log('ParticipantData.StatusList.HP: ' + ParticipantData.StatusList.HP);
                console.log('ParticipantData.curStatusList.MP: ' + ParticipantData.curStatusList.MP);
                console.log('ParticipantData.StatusList.MP: ' + ParticipantData.StatusList.MP);
            } else {
                RivalData = role;
                RivalSkills = role.Skills;
                console.log(RivalData);
                console.log('RivalData.curStatusList.HP: ' + RivalData.curStatusList.HP);
                console.log('RivalData.StatusList.HP: ' + RivalData.StatusList.HP);
                console.log('RivalData.curStatusList.MP: ' + RivalData.curStatusList.MP);
                console.log('RivalData.StatusList.MP: ' + RivalData.StatusList.MP);
            }
        }
        //[取得主角自己的題目]
        for (let subject of mGameStartData.subjects) {
            if (subject.HubConnectID === socketID) {
                ParticipantSubjectData = subject;
                console.log(ParticipantSubjectData);
            }
        }
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'GameStart', mGameStartData);
        }
    },

    /**
     * 答題
     * @param {\} OptionID 題目的optionID
     * @param {*} text --準備棄用--
     * @param {*} time 回傳ms 可使用時間依據 GameStart 回傳的 AnwserTimeLimit key num(s)
     */
    doAnwser(OptionID, time) {
        console.log('doAnswer');
        var model = { Answer: OptionID, Answer_Time: time }
        console.log(model);
        SocketControl.emit(ArenaConfig.Service_Answer, model);
    },

    //一方有答題的時候
    RoleAnwser(RoleAnwserData) {
        console.log(RoleAnwserData);
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'RoleAnwser', RoleAnwserData);
        }
    },

    //雙方答題回傳
    AnswerCallback(mAnswerData) {
        AnwserData = mAnswerData;
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'AnswerCallback', mAnswerData);
        }
    },

    /**
     * 執行 使用道具
     * @param {*} propsId 道具sort
     */
    doUserItems(propsId) {
        console.log('doUserItems');
        SocketControl.emit(ArenaConfig.Service_doUseItems, propsId);
    },

    //使用道具的回傳
    UseItemCallBack(UseItemsData) {
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'UseItemsCallBack', UseItemsData);
        }
    },

    /**
     * Attack 攻擊指令
     * @param {*} SkillSort 技能sort -1=閒置  0=普通攻擊  其餘=技能編號
     * @param {*} First 0 = 先攻擊 , 1 = 後攻擊
     */
    doAttack(SkillSort, First) {
        console.log('doAttack');
        //{"SkillSort":SkillSort,"First":0|1}
        var model = { 'SkillSort': SkillSort, 'First': First };
        //
        if (SocketControl) {
            console.log(model);
            SocketControl.emit(ArenaConfig.Service_doAttack, model);
        }
    },

    //AttackCallback
    AttackCallback(Attack) {
        // console.log(JSON.stringify(AttackData));
        AttackData = Attack;
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'AttackCallback', AttackData);
        }
    },

    /**
     * GameNext 下一步
     * @param {*} status 狀態 next 下一步[沒有出現finish or 非最後一題] | finish 結算 [攻擊動畫出現finish or 最後一題結束]
     */
    doGameNext(status) {
        console.log('doGameNext status : ' + status);
        if (SocketControl) SocketControl.emit(ArenaConfig.Service_doGameNext, status);
    },

    //GameNextCallback
    GameNextCallback(GameNextData) {
        // console.log(JSON.stringify(GameNextData));
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'GameNextCallback', GameNextData);
        }
    },

    //結束
    GameFinishCallback(GameFinishData) {
        console.log(JSON.stringify(GameFinishData));
        if (ArenaCallBack) {
            ArenaCallBack('socket', 'GameFinishCallback', GameFinishData);
        }
    },



    // start() {    },

    // update (dt) {},

    /**
     * get
     */
    //競技場區域資料
    getArenaList() {
        return ArenaList;
    },
    //競技場區 rank
    getConnectData() {
        return ConnectData;
    },
    //目前這個競技場的人數
    getRoomData() {
        return RoomData;
    },
    //配對中 的callback
    getReadyData() {
        return ReadyData;
    },
    //開始戰鬥的資訊 的callback
    getGameStartData() {
        return GameStartData;
    },
    //取得攻擊時間
    getAttackTime() {
        return GameStartData.AttackTimeLimit;
    },
    //取得答題時間
    getAnswerTime() {
        return GameStartData.AnwserTimeLimit;
    },
    //主角資訊
    getParticipantData() {
        return ParticipantData;
    },
    //對手資訊
    getRivalData() {
        return RivalData;
    },
    //主角題目
    getParticipantSubjectData() {
        return ParticipantSubjectData;
    },
    //雙方每一回合答題結束 回傳的data
    getAnwserData() {
        return AnwserData;
    },
    //雙方每一回合攻擊結束 回傳的data
    getAnwserData() {
        return AttackData;
    },
    //主角技能
    getParticipantSkills(){
        return ParticipantSkills;
    },
    //對手技能
    getRivalSkills(){
        return RivalSkills;
    },
});
