var ConnectCallback = {
    "result_status": false,
    "result_message": null,
    "result_content": {
      "Arena_ID": 2,
      "Type": "Event",
      "Arena_Name": "低年級競技場",
      "BeginDate": "2018-06-01T00:00:00",
      "EndDate": "2018-06-30T00:00:00",
      "DailyRank": [],
      "MonthRank": [],
      "SeasonRank": [],
      "TotalRank": [],
      "ArenaRewardModel": [
        {
          "RankMin": 1,
          "RankMax": 1,
          "PropsPrototype_ID": 10,
          "RewardProps": {
            "PropsPrototype_ID": 10,
            "PropsPrototype_Name": "競技場神人寶箱",
            "PropsType_ID": 2,
            "PropsPrototype_Img": "",
            "Description": "隨機獲得神人套裝一件"
          },
          "Count": 1
        },
        {
          "RankMin": 2,
          "RankMax": 2,
          "PropsPrototype_ID": 8,
          "RewardProps": {
            "PropsPrototype_ID": 8,
            "PropsPrototype_Name": "洗鍊藥水",
            "PropsType_ID": 1,
            "PropsPrototype_Img": "",
            "Description": "重置角色配點點數"
          },
          "Count": 5
        },
        {
          "RankMin": 3,
          "RankMax": 3,
          "PropsPrototype_ID": 8,
          "RewardProps": {
            "PropsPrototype_ID": 8,
            "PropsPrototype_Name": "洗鍊藥水",
            "PropsType_ID": 1,
            "PropsPrototype_Img": "",
            "Description": "重置角色配點點數"
          },
          "Count": 1
        },
        {
          "RankMin": 4,
          "RankMax": 100,
          "PropsPrototype_ID": 18,
          "RewardProps": {
            "PropsPrototype_ID": 18,
            "PropsPrototype_Name": "初級防禦增強卷軸",
            "PropsType_ID": 4,
            "PropsPrototype_Img": "",
            "Description": "使用後，該場戰鬥持續增加自身防禦10%"
          },
          "Count": 3
        },
        {
          "RankMin": 4,
          "RankMax": 100,
          "PropsPrototype_ID": 19,
          "RewardProps": {
            "PropsPrototype_ID": 19,
            "PropsPrototype_Name": "初級敏捷增強卷軸",
            "PropsType_ID": 4,
            "PropsPrototype_Img": "",
            "Description": "使用後，該場戰鬥持續增加自身敏捷10%"
          },
          "Count": 3
        },
        {
          "RankMin": 4,
          "RankMax": 100,
          "PropsPrototype_ID": 20,
          "RewardProps": {
            "PropsPrototype_ID": 20,
            "PropsPrototype_Name": "初級攻擊增強卷軸",
            "PropsType_ID": 4,
            "PropsPrototype_Img": "",
            "Description": "使用後，該場戰鬥持續增加自身攻擊10%"
          },
          "Count": 3
        },
        {
          "RankMin": 4,
          "RankMax": 100,
          "PropsPrototype_ID": 21,
          "RewardProps": {
            "PropsPrototype_ID": 21,
            "PropsPrototype_Name": "初級精神增強卷軸",
            "PropsType_ID": 4,
            "PropsPrototype_Img": "",
            "Description": "使用後，該場戰鬥持續增加自身精神10%"
          },
          "Count": 3
        },
        {
          "RankMin": 101,
          "RankMax": 9999,
          "PropsPrototype_ID": 5,
          "RewardProps": {
            "PropsPrototype_ID": 5,
            "PropsPrototype_Name": "白色藥水",
            "PropsType_ID": 1,
            "PropsPrototype_Img": "",
            "Description": "恢復血量約300點(依角色恢復值增減)"
          },
          "Count": 500
        }
      ],
      "ArenaProgressPointsModel": [
        {
          "ArenaProgressPoints_ID": 4,
          "Wins": 50,
          "AddPoints": 100
        },
        {
          "ArenaProgressPoints_ID": 5,
          "Wins": 100,
          "AddPoints": 150
        },
        {
          "ArenaProgressPoints_ID": 6,
          "Wins": 150,
          "AddPoints": 200
        }
      ]
    }
  };

module.exports = ConnectCallback;