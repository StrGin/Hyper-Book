import { Fx } from "./fx"
const deviceInfo = hmSetting.getDeviceInfo();
let { width, height } = deviceInfo;
const ANIMATION_TIME = 0.5

const PAGE_MASK = {
  center_x: width / 2,
  center_y: height / 2,
  radius: ((width ^ 2) + (height ^ 2)) ^ (1 / 2),
  color: 0x000000,
  alpha: 0,
};
const PAGE_INIT_MASK = {
  center_x: width / 2,
  center_y: height / 2,
  radius: ((width ^ 2) + (height ^ 2)) ^ (1 / 2),
  color: 0x000000,
  alpha: 255,
};

export function gotoPage(param) {
  hmUI.setStatusBarVisible(false);
  console.log(param.url);
  console.log(param.param);
  const page_mask = hmUI.createWidget(hmUI.widget.CIRCLE, PAGE_MASK);
  new Fx({
    begin: 0, // Initial value of function. 初始函数值
    end: 255, // Target value of function. 目标函数值
    fps: 60, // FPS. 帧率
    time: ANIMATION_TIME, // Total during time (s). 总时长(秒)
    style: Fx.Styles.EASE_OUT_EXPO, // Types of animation presets used, seeing @Fx.Style. 预设类型 见下面的Fx.Style
    onStop() {
      hmApp.gotoPage({ url: param.url, param: param.param || null});
      page_mask.setProperty(hmUI.prop.VISIBLE, true);
    }, // Callback function at the end of the animation. 动画结束后的回调函数
    func: (result) => {
      page_mask.setProperty(hmUI.prop.MORE, {
        center_x: PAGE_MASK.center_x,
        center_y: PAGE_MASK.center_y,
        radius: PAGE_MASK.radius,
        color: PAGE_MASK.color,
        alpha: result,
      });
    },
  })
}
export function pageInit(param) {
  hmUI.setStatusBarVisible(false);
  param.onStop();
  const page_mask = hmUI.createWidget(hmUI.widget.CIRCLE, PAGE_INIT_MASK);
  new Fx({
    begin: 255, // Initial value of function. 初始函数值
    end: 0, // Target value of function. 目标函数值
    fps: 60, // FPS. 帧率
    time: ANIMATION_TIME, // Total during time (s). 总时长(秒)
    style: Fx.Styles.EASE_OUT_EXPO, // Types of animation presets used, seeing @Fx.Style. 预设类型 见下面的Fx.Style
    onStop() {
      page_mask.setEnable(false);
      page_mask.setProperty(hmUI.prop.VISIBLE, false);
    }, // Callback function at the end of the animation. 动画结束后的回调函数

    // Callback function for each frame, the parameter is the current function value, the value range is [begin, end]
    // 每一帧的回调函数，参数为当前函数值，取值范围为[begin, end]
    func: (result) => {
      page_mask.setProperty(hmUI.prop.MORE, {
        center_x: PAGE_MASK.center_x,
        center_y: PAGE_MASK.center_y,
        radius: PAGE_MASK.radius,
        color: PAGE_MASK.color,
        alpha: result,
      });
    },
  })
}