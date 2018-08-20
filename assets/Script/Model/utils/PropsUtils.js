
var PropsUtils = {
  isConsole: true,//是否顯示console

  /**
   * 道具比對讀取路徑[ 回傳圖像路徑 ] 
   * var texture = cc.url.raw("/resources/Texture/common/empty_item.png");
   * >> /resources/Texture/common/empty_item.png <<
   * @param {*} ID 道具指定對應
   */
  getPath(ID) {
    let path = '';
    console.log('ID: ' + ID);
    let PropsModel = this.getPropsData().find(props => props.ID === ID);
    if (!PropsModel || PropsModel == null) {
      path = '/resources/Texture/props/default_item.png';
    } else {
      if (PropsModel.FileName === '') {
        path = '/resources/Texture/props/default_item.png';
      } else {
        path = '/resources/Texture/props/' + PropsModel.FileName + '.png';
      }
    }
    //
    if (this.isConsole) console.log('props: ' + path);
    return path;
  },

  //取得 經驗 金幣 競技場金幣
  getEitherPath(key) {
    var path = '';
    switch (key) {

      case 'Money':
        path = '/resources/Texture/common/coin.png';
        break;
      case 'ArenaPoints':
        path = '/resources/Texture/common/coin_fight.png';
        break;
      case 'Exp':
        path = '/resources/Texture/common/exp.png';
        break;
      default:
        path = '/resources/Texture/common/coin.png';
        break;
    }

    return path;
  },

  /**
  * 道具比對讀取路徑[ 回傳圖像路徑 ] 
  * var texture = cc.url.raw("/resources/Texture/common/empty_item.png");
  * >> /resources/Texture/common/empty_item.png <<
  * @param {*} ID 道具指定對應
  */
  getStatusBarPath(ID) {
    let path = '';
    console.log('ID: ' + ID);
    let PropsModel = this.getPropsData().find(props => props.ID === ID);
    if (!PropsModel || PropsModel == null) {
      path = '/Texture/props/default_item';
    } else {
      if (PropsModel.FileName === '') {
        path = '/Texture/props/default_item';
      } else {
        path = '/Texture/props/' + PropsModel.FileName;
      }

    }
    //
    if (this.isConsole) console.log('props: ' + path);
    return path;
  },



  getPropsData() {
    return [
      {
        "ID": 1,
        "PropName": "红色药水",
        "FileName": "Red_potion",
        "EitherFileName": ""
      },
      {
        "ID": 4,
        "PropName": "橙色药水",
        "FileName": "Orange_potion",
        "EitherFileName": ""
      },
      {
        "ID": 5,
        "PropName": "白色药水",
        "FileName": "White_potion",
        "EitherFileName": ""
      },
      {
        "ID": 6,
        "PropName": "蓝色药水",
        "FileName": "Blue_potion",
        "EitherFileName": ""
      },
      {
        "ID": 7,
        "PropName": "高级蓝色药水",
        "FileName": "Senior_blue_potion",
        "EitherFileName": ""
      },
      {
        "ID": 8,
        "PropName": "洗链药水",
        "FileName": "Chain_washing_potion",
        "EitherFileName": ""
      },
      {
        "ID": 9,
        "PropName": "竞技场学徒宝箱",
        "FileName": "Arena_Apprentice_Treasure_Chest",
        "EitherFileName": "Open_Arena_Apprentice_Treasure_Chest"
      },
      {
        "ID": 10,
        "PropName": "竞技场神人宝箱",
        "FileName": "Arena_Gods_Treasure_Chest",
        "EitherFileName": "Open_arena_gods_treasure_chest"
      },
      {
        "ID": 11,
        "PropName": "【龙】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 12,
        "PropName": "【潭】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 13,
        "PropName": "【王】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 14,
        "PropName": "【国】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 15,
        "PropName": "【上】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 16,
        "PropName": "【线】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 17,
        "PropName": "【庆】集字卡",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 18,
        "PropName": "初级防御增强卷轴",
        "FileName": "Primary_defense_enhanced_reel",
        "EitherFileName": ""
      },
      {
        "ID": 19,
        "PropName": "初级敏捷增强卷轴",
        "FileName": "Junior_Agile_Enhancement_Scroll",
        "EitherFileName": ""
      },
      {
        "ID": 20,
        "PropName": "初级攻击增强卷轴",
        "FileName": "Primary_attack_enhancement_scroll",
        "EitherFileName": ""
      },
      {
        "ID": 21,
        "PropName": "初级精神增强卷轴",
        "FileName": "Primary_spirit_enhanced_scroll",
        "EitherFileName": ""
      },
      {
        "ID": 23,
        "PropName": "金币",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 26,
        "PropName": "沼泽小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 28,
        "PropName": "深海小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 29,
        "PropName": "机械小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 30,
        "PropName": "丛林小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 31,
        "PropName": "荒漠小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 32,
        "PropName": "熔岩小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 33,
        "PropName": "极冰小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 34,
        "PropName": "鬼火小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 35,
        "PropName": "骷颅小宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 36,
        "PropName": "深海金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 37,
        "PropName": "机械金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 38,
        "PropName": "丛林金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 39,
        "PropName": "荒漠金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 40,
        "PropName": "熔岩金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 41,
        "PropName": "极冰金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 42,
        "PropName": "鬼火金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 43,
        "PropName": "骷颅金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 44,
        "PropName": "沼泽金宝箱",
        "FileName": "",
        "EitherFileName": ""
      },
      {
        "ID": 45,
        "PropName": "金色钱币",
        "FileName": "Golden_coin",
        "EitherFileName": ""
      },
      {
        "ID": 46,
        "PropName": "紫色钱币",
        "FileName": "Purple_coin",
        "EitherFileName": ""
      }
    ];
  },

  //設定console
  setConsole(boo) {
    this.isConsole = boo;
  },

};
module.exports = PropsUtils;