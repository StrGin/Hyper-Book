import { gettext } from 'i18n'
import { createSmoothTimer } from "../utils/smoothTimer"
import { pageInit , gotoPage} from "../utils/gotoPage"
import { LocalStorage } from "../utils/LocalStorage"
import VisLog from "../utils/vis-log"

try {
Page({
  onInit(params) {
    pageInit({
      onStop() {
    //---------------------------------变量部分-------------------------------------
    const vis = new VisLog('read.js')
    const globalData = getApp()._options.globalData
    let param = JSON.parse(params)
    const localStorage = new LocalStorage()
    let results = Number(getTextCharCount(localStorage.getItem('fontSize', 22)))
    let time_view = globalData.time_func()
    let start = localStorage.getItem(param.name + 'start', 0)
    let end = localStorage.getItem(param.name + 'end', results * getChineseCharByteCount(param.code))
    const battery = hmSensor.createSensor(hmSensor.id.BATTERY)
    hmUI.setLayerScrolling(false)
    //---------------------------------控件部分-------------------------------------
    let time_widget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 65,
      y: 15,
      w: 62,
      h: 40,
      color: 0xFFFFFF,
      text_size: 22.67,
      text: time_view
    })
    let batteryView = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 51,
      y: 43,
      w: 176,
      h: 325,
      color: 0x838383,
      text_size: 20,
      text: 'BAT ' + battery.current + '%'
    })
    let textView = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 8,
      y: 83,
      w: 176,
      h: 325,
      color: 0xFFFFFF,
      text_size: 22,
      text_style: hmUI.text_style.WRAP,
      text: readFileSync(globalData.book_id, start, end)
    })
    let stageView = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 61,
      y: 423,
      w: 72,
      h: 31,
      color: 0x838383,
      text_size: 20,
      text: ((localStorage.getItem(param.name + 'end') / calculateTotalFileSize(param.txtList)) * 100).toFixed(2) + '%'
    })
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      src: 'h.png'
    }).addEventListener(hmUI.event.CLICK_UP, function (info) {
      start -= results * getChineseCharByteCount(param.code)
      end -= results * getChineseCharByteCount(param.code)
      localStorage.setItem(param.name + 'start', start)
      localStorage.setItem(param.name + 'end', end)
      stageView.setProperty(hmUI.prop.TEXT, ((localStorage.getItem(param.name + 'end') / calculateTotalFileSize(param.txtList)) * 100).toFixed(2) + '%')
      textView.setProperty(hmUI.prop.TEXT, readFileSync(globalData.book_id, start, end))
    })
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 358,
      src: 'h.png'
    }).addEventListener(hmUI.event.CLICK_UP, function (info) {
      start += results * getChineseCharByteCount(param.code)
      end += results * getChineseCharByteCount(param.code)
      localStorage.setItem(param.name + 'start', start)
      localStorage.setItem(param.name + 'end', end)
      stageView.setProperty(hmUI.prop.TEXT, ((localStorage.getItem(param.name + 'end') / calculateTotalFileSize(param.txtList)) * 100).toFixed(2) + '%')
      textView.setProperty(hmUI.prop.TEXT, readFileSync(globalData.book_id, start, end))
    })
    //---------------------------------函数部分-------------------------------------
    function calculateTotalFileSize(fileArray) {
      let totalSize = 0;
      for (let i = 0; i < fileArray.length; i++) {
          const stats = statSyncAsset(fileArray[i]);
          totalSize += stats.size;
      }
      return totalSize;
    }
    function getChineseCharByteCount(encoding) {
      switch (encoding.toLowerCase()) {
        case 'utf-8':
          return 3;
        case 'utf-16le':
          return 2;
        case 'gb2312':
        case 'gbk':
        case 'gb18030':
          return 2;
        default:
          vis.warn('不支持的编码');
          return 2
      }
    }

    function getTextCharCount(fontSize) {
      let { height: charHeight } = hmUI.getTextLayout('字', { text_size: fontSize, text_width: 176, wrapped: 1 });
      let charsPerLine = Math.floor(176 / fontSize);
      let lines = Math.floor(325 / charHeight);
      let totalChars = charsPerLine * lines;
      return totalChars;
    }
    
    function decodeUtf8(array, outLimit = Infinity, startPosition = 0) {
      let out = "";
      let length = array.length;
    
      let i = startPosition,
        c, char2, char3;
      while (i < length && out.length < outLimit) {
        c = array[i++];
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12:
          case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(
              ((c & 0x1f) << 6) | (char2 & 0x3f)
            );
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(
              ((c & 0x0f) << 12) |
              ((char2 & 0x3f) << 6) |
              ((char3 & 0x3f) << 0)
            );
            break;
        }
      }
    
      return [out, i - startPosition];
    }
    
    function Utf8ArrayToStr(array) {
      return decodeUtf8(array)[0];
    }
    
    function arrayToString(array, encoding, start, end) {
      let result = "";
      switch (encoding.toLowerCase()) {
        case "utf-8":
          let utf8Array = array.slice(start, end);
          result = Utf8ArrayToStr(utf8Array);
          break;

        case "utf-16le":
          for (let i = start, j = Math.min(array.length, end); i < j; i += 2) {
            let code = (array[i + 1] << 8) | array[i];
            let char = String.fromCharCode(code);
            result += char;
          }
          break;

        case "gb2312":
          for (let i = start, j = Math.min(array.length, end); i < j;) {
            let code = array[i];
            if (code >= 0xA1 && code <= 0xF7) {
              code = ((code - 0xA1) * 94) + (array[i + 1] - 0xA1);
              i += 2;
            } else if (code >= 0xA1 && code <= 0xFE) {
              code = ((code - 0xA1) * 94) + (array[i + 1] - 0xA1);
              i += 2;
            }
            let char = String.fromCharCode(code);
            result += char;
          }
          break;

        case "gbk":
          for (let i = start, j = Math.min(array.length, end); i < j;) {
            let code = array[i];
            if (code >= 0x81 && code <= 0xFE) {
              code = ((code - 0x81) * 190) + (array[i + 1] - 0x40);
              i += 2;
            } else if (code >= 0x40 && code <= 0x7E) {
              i += 1;
            } else if (code >= 0x80) {
              return false;
            }
            let char = String.fromCharCode(code);
            result += char;
          }
          break;

        case "gb18030":
          for (let i = start, j = Math.min(array.length, end); i < j;) {
            let code = array[i];
            if (code >= 0x81 && code <= 0xFE) {
              if (array[i + 1] >= 0x30 && array[i + 1] <= 0x39) {
                code = ((code - 0x81) * 10 * 126 * 10) + ((array[i + 1] - 0x30) * 126 * 10) + ((array[i + 2] - 0x81) * 10) + (array[i + 3] - 0x30);
                i += 4;
              } else {
                code = ((code - 0x81) * 190) + (array[i + 1] - 0x40);
                i += 2;
              }
            } else if (code >= 0x40 && code <= 0x7E) {
              i += 1;
            } else if (code >= 0x80) {
              return false;
            }
            let char = String.fromCharCode(code);
            result += char;
          }
          break;

        default:
          return false;
      }

      return result;
    }

    function statSyncAsset(filename) {
      const [fs_stat, err] = hmFS.stat_asset(filename);
        return fs_stat;
    }

    function readFileSync(filename, startByte, endByte) {
      const fs_stat = statSyncAsset(filename);
      var size2 = Math.min(fs_stat.size, endByte) - startByte; // 限制读取的字节数
      if (size2 <= 0) return ''; // 如果范围无效，返回空字符串
      var e = '';
      var test_buf = new Uint8Array(size2);
      var file = hmFS.open_asset(filename, hmFS.O_RDONLY);
      hmFS.seek(file, startByte, hmFS.SEEK_SET); // 移动文件指针到起始字节
      hmFS.read(file, test_buf.buffer, 0, test_buf.length);
      hmFS.close(file);
      e = arrayToString(test_buf, param.code, 0, size2);
      return e;
    }
    new createSmoothTimer(
      1000,
      1000,
      () => {
        time_view = globalData.time_func()
        time_widget.setProperty(hmUI.prop.TEXT, time_view)
        batteryView.setProperty(hmUI.prop.TEXT, 'BAT ' + battery.current + '%')
      })
    }

  })
  }
})}
catch (e) {
  vis.log('LifeCycle Error', e)
      e && e.stack && e.stack.split(/\n/).forEach((i) => vis.log('error stack', i))
}