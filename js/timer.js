const DECLENSION_OF_TIMES = {
  day: ['день', 'дня', 'дней'],
  hour: ['час', 'часа', 'часов'],
  minute: ['минута', 'минуты', 'минут'],
  second: ['секунда', 'секунды', 'секунд']
}
const declNum = (number, key) => {
  const words = DECLENSION_OF_TIMES[key]
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]]
}

Vue.component(VueCountdown.name, VueCountdown);
Vue.component('TimerCounter', {
  template: `
  <countdown :time="time" class="timer-container" :data-time="formattedDate" :data-timezone="timezone">
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>
  </countdown>
  `,
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      time: 0,
      timezone: 0,
      formattedDate: 0
    }
  },
  methods: {
    parseValue() {
      const { time, date, timezoneOffset } = this.value
      this.timezone = timezoneOffset
      const parts = date.split('.')
      this.formattedDate = new Date(`${parts[2]}, ${parts[1]}, ${parts[0]}, ${time}`)
      const timezoneDifference = parseInt(timezoneOffset) - parseInt(new Date().getTimezoneOffset())
      this.time = this.formattedDate.getTime() - (new Date().getTime() - timezoneDifference * 60000)
    }
  },
  watch: {
    value() {
      this.parseValue()
    }
  },
  mounted() {
    this.parseValue()
  },
  destroyed() {
    clearInterval(this.timeout)
  }
})


window.timer = (function () {
  const apps = document.querySelectorAll('[data-script="timer"]')

  apps.forEach(item => {

    const { time, timezone } = item.dataset

    const date = moment(new Date(time))

    const timeFormat = date.format('HH:mm')

    const dateFormat = date.format('YYYY-MM-DD')



    new Vue({
      el: item,
      template: `
      <TimerCounter :value="content">
        <template slot-scope="scope">

          <div class="cli-timer">
            <div class="cli-timer-col">
              <div class="cli-title-1 cli-bold">{{ scope.days }}</div>
              <div class="cli-body-1 cli-regular">{{ getTrueDecl(scope.days, 'day') }}</div>
            </div>
            <div class="cli-timer-col">
              <div class="cli-title-1 cli-bold">{{ scope.hours }}</div>
              <div class="cli-body-1 cli-regular">{{ getTrueDecl(scope.hours, 'hour') }}</div>
            </div>
            <div class="cli-timer-col">
              <div class="cli-title-1 cli-bold">{{ scope.minutes }}</div>
              <div class="cli-body-1 cli-regular">{{ getTrueDecl(scope.minutes, 'minute') }}</div>
            </div>
            <div class="cli-timer-col">
              <div class="cli-title-1 cli-bold">{{ scope.seconds }}</div>
              <div class="cli-body-1 cli-regular">{{ getTrueDecl(scope.seconds, 'second') }}</div>
            </div>
          </div>

        </template>
      </TimerCounter>`,
      data() {
        return {
          content: { time: timeFormat, date: dateFormat, timezoneOffset: timezone }
        }
      },

      methods: {
        getTrueDecl(num, key) {
          return declNum(num, key)
        }
      }
    });
  })
})()







