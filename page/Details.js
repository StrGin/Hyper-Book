import { gettext } from 'i18n'
import { createSmoothTimer } from "../utils/smoothTimer"
import { LocalStorage } from "../utils/LocalStorage"
import { gotoPage ,pageInit} from "../utils/gotoPage"
import VisLog from "../utils/vis-log"

Page({
  onInit(params) {
    pageInit({
      onStop() {
    //---------------------------------变量部分-------------------------------------
    const globalData = getApp()._options.globalData
    let time_view = globalData.time_func()
    let param = JSON.parse(params)
    const { height } = hmUI.getTextLayout(param.description, {
      text_size: 14,
      text_width: 158,
      wrapped: 1 // 文本换行
    })
    const localStorage = new LocalStorage()
    const vis = new VisLog('details.js')
    let listEnd
    if (localStorage.getItem(param.name + 'end') == undefined) {
      listEnd = '0%'
    }
    else {
      listEnd = ((localStorage.getItem(param.name + 'end') / calculateTotalFileSize(param.txtList)) * 100).toFixed(2)  + '%'
    }
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
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 19,
      y: 66,
      w: 159,
      h: 44,
      color: 0x61DE97,
      text_size: 26.67,
      text: param.name
    })
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 18,
      y: 110,
      src: param.icon
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 90,
      y: 110,
      w: 86,
      h: 61,
      color: 0xBCBBBB,
      text_size: 14,
      text: gettext('阅读进度')
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 90,
      y: 126,
      w: 86,
      h: 61,
      color: 0xFFFFFF,
      text_size: 18,
      text: listEnd
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 90,
      y: 151,
      w: 86,
      h: 61,
      color: 0xBCBBBB,
      text_size: 14,
      text: gettext('内存占用')
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 90,
      y: 167,
      w: 86,
      h: 61,
      color: 0xFFFFFF,
      text_size: 18,
      text: (calculateTotalFileSize(param.txtList) / 1000000).toFixed(1) + 'MB'
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 19,
      y: 196,
      w: 86,
      h: 61,
      color: 0xBCBBBB,
      text_size: 14,
      text: gettext('大体简介')
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 19,
      y: 217,
      w: 158,
      h: 104,
      color: 0xFFFFFF,
      text_size: 14,
      text_style: hmUI.text_style.WRAP,
      text: param.description
    })

hmUI.createWidget(hmUI.widget.TEXT, {
  x: 19,
  y: height + 217,
  w: 86,
  h: 61,
  color: 0xBCBBBB,
  text_size: 14,
  text: gettext('书籍列表')
})
for (let i = 0; i < param.txtList.length; i++) {
  hmUI.createWidget(hmUI.widget.BUTTON, {
    x: 19,
    y: height + 241 + i * 44,
    w: 158,
    h: 39,
    normal_color: 0x222222,
    press_color: 0x101010,
    radius: 8,
    click_func() {
      globalData.book_id = param.txtList[i]
      hmApp.gotoPage({
        url:'page/Read',
        param: JSON.stringify(param)
      })
    }
  })
  hmUI.createWidget(hmUI.widget.TEXT, {
    x: 32,
    y: height + 245 + i * 44,
    w: 116,
    h: 27,
    color: 0xFFFFFF,
    text_size: 18,
    text: param.txtList[i]
  }).addEventListener(hmUI.event.CLICK_DOWN, () => {
    globalData.book_id = param.txtList[i]
      hmApp.gotoPage({
        url:'page/Read',
        param: JSON.stringify(param)
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
      if (err == 0) {
          return fs_stat;
      } else {
          return null;
      }
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
