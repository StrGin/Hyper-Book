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
    const globalData = getApp()._options.globalData
    let time_view = globalData.time_func()
    const localStorage = new LocalStorage()
    let textList = ['字号','翻页','进度','加载']
    let goList = ['Size','Flip','Progress','Load']
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
      text: '设置'
    })
    for (let i = 0; i < textList.length; i++) {
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 12,
        y: 118 + i * 78,
        w: 168,
        h: 74,
        radius: 20,
        color: 0x222222
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
          gotoPage({
            url: 'page/' + goList[i]
          })
      })
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 25,
        y: 135 + i * 78,
        w: 120,
        h: 42,
        text: textList[i],
        text_size: 26.67,
        color: 0xFFFFFF
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url: 'page/' + goList[i]
        })
    })
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 164,
        y: 146 + i * 78,
        src: 'go.png'
      }).addEventListener(hmUI.event.CLICK_UP, function (info) {
        gotoPage({
          url: 'page/' + goList[i]
        })
    })
    }
    //---------------------------------函数部分-------------------------------------
    
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
