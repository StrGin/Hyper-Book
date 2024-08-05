import { createSmoothTimer } from "../utils/smoothTimer"
import { pageInit, gotoPage } from "../utils/gotoPage"
import { LocalStorage } from "../utils/LocalStorage"

Page({
  onInit() {
    pageInit({
      onStop() {
        //---------------------------------变量部分-------------------------------------
        const globalData = getApp()._options.globalData
        let time_view = globalData.time_func()
        const localStorage = new LocalStorage()
        let viewNumber = localStorage.getItem('fontSize', 22)
        let button_number = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        //---------------------------------控件部分-------------------------------------
        const time_widget = hmUI.createWidget(hmUI.widget.TEXT, {
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
          w: 141,
          h: 44,
          color: 0x61DE97,
          text_size: 26.67,
          text: '字号'
        })

        hmUI.createWidget(hmUI.widget.STROKE_RECT, {
          x: 9,
          y: 120,
          w: 175,
          h: 52,
          radius: 15,
          line_width: 3,
          color: 0x61DE97
        }).addEventListener(hmUI.event.CLICK_UP, function (a) {
          viewNumber = viewNumber.slice(0, -1)
          view.setProperty(hmUI.prop.TEXT, viewNumber)
        })

        const view = hmUI.createWidget(hmUI.widget.TEXT, {
          x: 21,
          y: 125,
          w: 157,
          h: 50,
          color: 0x61DE97,
          text_size: 24,
          char_space: 3,
          text: viewNumber
        })

        view.addEventListener(hmUI.event.CLICK_UP, function (a) {
          viewNumber = viewNumber.slice(0, -1)
          view.setProperty(hmUI.prop.TEXT, viewNumber)
        })

        for (let i = 1; i < 10; i++) {
          let x = 5 + (i - 1) % 3 * 63;
          let y = 207 + Math.floor((i - 1) / 3) * 63;
          hmUI.createWidget(hmUI.widget.BUTTON, {
            x: x,
            y: y,
            w: 60,
            h: 60,
            normal_color: 0x222222,
            press_color: 0x101010,
            text_size: 26.67,
            color: 0xFFFFFF,
            text: button_number[i - 1],
            radius: 18,
            click_func: () => {
              if (viewNumber == 0) viewNumber = ''
              viewNumber += button_number[i - 1].toString()
              view.setProperty(hmUI.prop.TEXT, viewNumber)
            }
          })
        }

        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: 30,
          y: 398,
          w: 60,
          h: 60,
          normal_color: 0x222222,
          press_color: 0x101010,
          text_size: 26.67,
          color: 0xFFFFFF,
          text: 0,
          radius: 18,
          click_func: () => {
            if (viewNumber == 0) viewNumber = ''
            viewNumber += '0'
            view.setProperty(hmUI.prop.TEXT, viewNumber)
          }
        })

        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: 99,
          y: 398,
          w: 60,
          h: 60,
          normal_color: 0x17BE5F,
          press_color: 0x037B37,
          text_size: 39.67,
          color: 0xFFFFFF,
          radius: 18,
          click_func: () => {
            localStorage.setItem('fontSize', viewNumber)
            hmApp.goBack()
          }
        })

        hmUI.createWidget(hmUI.widget.IMG, {
          x: 114,
          y: 414,
          src: 'check.png'
        }).addEventListener(hmUI.event.CLICK_UP, function (a) {
          localStorage.setItem('fontSize', viewNumber)
          hmApp.goBack()
        })

        //---------------------------------函数部分-------------------------------------
        new createSmoothTimer(
          1000,
          1000,
          () => {
            time_view = globalData.time_func()
            time_widget.setProperty(hmUI.prop.TEXT, time_view)
          })
      }
    })
  }
})