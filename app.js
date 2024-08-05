App({
  globalData: {
    book_id: 0,
    time_func () {     
      const time = hmSensor.createSensor(hmSensor.id.TIME)
      let formattedMinute = (time.minute < 10) ? '0' + time.minute.toString() : time.minute.toString()
      return ((time.hour < 10) ? '0' + time.hour.toString() : time.hour.toString()) + ':' + formattedMinute
  }
  },
  onCreate(options) {
    console.log('app on create invoke')
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})