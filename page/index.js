import { gettext } from 'i18n'
import { createSmoothTimer } from "../utils/smoothTimer"
import { pageInit , gotoPage} from "../utils/gotoPage"
import { LocalStorage } from "../utils/LocalStorage"
import VisLog from "../utils/vis-log"
Page({
  onInit() {
    pageInit({
      onStop() {
    //---------------------------------变量部分-------------------------------------
    let list = readFileSync('list.json')
    list = JSON.parse(list)
    const globalData = getApp()._options.globalData
    let time_view = globalData.time_func()
    const localStorage = new LocalStorage()
    const vis = new VisLog("index.js");
    let listEnd
    let hyper = 0
    //---------------------------------控件部分-------------------------------------
    let time_widget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 66,
      y: 26,
      w: 62,
      h: 40,
      color: 0xFFFFFF,
      text_size: 22.67,
      text: time_view
    })
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 19,
      y: 66,
      src: `hyperbook.png`
    }).addEventListener(hmUI.event.CLICK_UP, function (a) {
      hyper++
      if (hyper >= 3) {
        hyper = 0
        gotoPage({
          url:'page/Set',
        })
      }
    })
    for (let i = 0; i < list.length; i++) {
      hmUI.showToast({
        text: list[i].txtList[0]
      })
      if (localStorage.getItem(list[i].name + 'end') == undefined) {
        listEnd = '0%'
      }
      else {
        listEnd = ((localStorage.getItem(list[i].name + 'end') / calculateTotalFileSize(list[i].txtList)) * 100).toFixed(2)  + '%'
      }
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 3,
        y: 110 + i * 116,
        w: 186,
        h: 108,
        radius: 18,
        color: 0x222222
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url:'page/Details',
          param: JSON.stringify(list[i])
        })
      })
      hmUI.createWidget(hmUI.widget.IMG, {
        x: 18,
        y: 123 + i * 116,
        src: list[i].icon
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url:'page/Details',
          param: JSON.stringify(list[i])
        })
      })
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 85,
        y: 123 + i * 116,
        w: 86,
        h: 61,
        color: 0xFFFFFF,
        text_size: 18,
        text_style: hmUI.text_style.WRAP,
        text: list[i].name
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url:'page/Details',
          param: JSON.stringify(list[i])
        })
      })
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 85,
        y: 184 + i * 116,
        w: 86,
        h: 61,
        color: 0xBCBBBB,
        text_size: 14,
        text: (calculateTotalFileSize(list[i].txtList) / 1000000).toFixed(1) + 'MB'
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url:'page/Details',
          param: JSON.stringify(
            list[i]
)
        })
      })
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 132,
        y: 184 + i * 116,
        w: 86,
        h: 61,
        color: 0xBCBBBB,
        text_size: 14,
        text: listEnd
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url:'page/Details',
          param: JSON.stringify(
            list[i]
)
        })
      })
    }
    //---------------------------------函数部分-------------------------------------
    function calculateTotalFileSize(fileArray) {
      let totalSize = 0;
    
      for (let i = 0; i < fileArray.length; i++) {
          const stats = statSyncAsset(fileArray[i]);
          totalSize += stats.size;
      }
    
      return totalSize;
    }
    
    function statSyncAsset(filename) {
      const [fs_stat, err] = hmFS.stat_asset(filename);
          return fs_stat;

  }                
function utf8ArrayToString(array) {
    if (!array)
        return false;
    let result = "";
    for (let i = 0, j = array.length; i < j; i++) {
        let code = array[i];
        if (code >= 0 && code <= 0x7f) {
            code = (0x7f & code);
        } else if (code <= 0xdf) {
            code = ((0x1F & array[i]) << 6) | (0x3f & array[i + 1]);
            i += 1;
        } else if (code <= 0xef) {
            code = ((0x0f & array[i]) << 12) | ((0x3f & array[i + 1]) << 6) | (0x3f & array[i + 2]);
            i += 2;
        } else {
            return false;
        }
        let char = String.fromCharCode(code);
        result += char;
    }
    return result;
}
function readFileSync(filename) {
    const fs_stat = statSyncAsset(filename);
    if (!fs_stat) return 'notfile';
    var size2 = fs_stat.size;
    var e = '';
    var test_buf = new Uint8Array(size2);
    var file = hmFS.open_asset(filename, hmFS.O_RDONLY);
    hmFS.read(file, test_buf.buffer, 0, test_buf.length);
    hmFS.close(file);
    e = utf8ArrayToString(test_buf);
    return e;
}
new createSmoothTimer(
  1000,
  1000,
  () => {
    time_view = globalData.time_func()
    time_widget.setProperty(hmUI.prop.TEXT,time_view)
  })
}

})
  }
})
