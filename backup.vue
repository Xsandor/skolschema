<template>
  <div id="app" class="demo-app">
    <div class="calendar-container">
      <FullCalendar
        class="demo-app-calendar"
        ref="fullCalendar"
        :height="1000"
        :header="header"
        themeSystem="standard"
        defaultView="timeGridWeek"
        :plugins="calendarPlugins"
        :columnHeaderFormat="columnHeaderFormat"
        :eventTimeFormat="eventTimeFormat"
        :slotLabelFormat="slotLabelFormat"
        :slotEventOverlap="false"
        minTime="07:00"
        maxTime="17:00"
        snapDuration="00:05:00"
        slotDuration="00:15:00"
        locale="sv"
        now="2013-12-01T00:00:00"
        :nowIndicator="false"
        :allDaySlot="false"
        :weekends="false"
        :events="calendarEvents"
        :editable="true"
        :droppable="true"
        :selectable="true"
        :selectMirror="true"
        @eventClick="handleEventClick"
        @select="handleSelect"
        @eventDrop="handleEventDrop"
        @drop="handleDrop"
        @eventResize="handleEventResize"
        @eventLeave="handleEventLeave"
        :eventRender="handleEventRender"
        :displayEventTime="false"
      />
    </div>
    <div class="sidebar-container">
      <h4>Ämnen</h4>
      <div v-for="subject in subjects" :key="subject.name" class='fc-event' :style="subjectStyle(subject)"><span class="subject-name">{{ subject.name }}</span><span class="subject-remaining">{{ remainingSubjectTime[subject.name] }} min</span></div>
      <p>Utlagd tid: {{ totalTime }} minuter</p>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'

import { calcEventTime } from './utilities'

function formattedTime (date) {
  if (!date) return
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export default {
  name: 'app',
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data () {
    return {
      calendarPlugins: [ timeGridPlugin, interactionPlugin ],
      header: {
        left: '',
        center: '',
        right: ''
      },
      columnHeaderFormat: {
        weekday: 'long'
      },
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: 'short'
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
      },
      subjects: [
        { name: 'Matte', color: 'purple', target: 180 },
        { name: 'Svenska', color: 'red', target: 240 },
        { name: 'Engelska', color: 'green', target: 360 }
      ],
      calendarEvents: []
    }
  },
  computed: {
    totalTime () {
      return this.calendarEvents.reduce((acc, event) => {
        const eventDuration = calcEventTime(event)
        acc += eventDuration
        return acc
      }, 0)
    },
    remainingSubjectTime () {
      const subjectTime = {}
      this.subjects.forEach((subject) => {
        const events = this.calendarEvents.filter(event => event.title === subject.name)
        subjectTime[subject.name] = 0 - subject.target + events.reduce((acc, event) => {
          console.log('One')
          acc += calcEventTime(event)
          return acc
        }, 0)
      })

      return subjectTime
    }
  },
  methods: {
    subjectStyle (subject) {
      return {
        'background-color': subject.color,
        'border-color': subject.color
      }
    },
    handleDateClick (arg) {
      if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
        this.calendarEvents.push({ // add new event data
          title: prompt('Titel'),
          start: arg.date,
          allDay: false
        })
      }
    },
    handleEventClick (arg) {
      console.log('Event click')
      const event = this.findEventById(arg.event.id)

      const newTitle = prompt('Titel', event.title)
      if (newTitle && newTitle.length) {
        event.title = newTitle
      }
    },
    handleEventLeave (arg) {
      console.log('Event leave')
    },
    insertNewEvent (title, start, end, color = null) {
      const newEvent = { // add new event data
        title,
        start,
        end,
        allDay: false
      }

      if (color) {
        newEvent.color = color
      }

      newEvent.id = this.calendarEvents.length ? this.calendarEvents[this.calendarEvents.length - 1].id + 1 || 1 : 1

      this.calendarEvents.push(newEvent)
    },
    handleSelect (arg) {
      const newTitle = prompt('Titel', event.title)
      if (newTitle && newTitle.length) {
        this.insertNewEvent(newTitle, arg.start, arg.end)
      }

      let calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.unselect()
    },
    handleEventDrop (arg) {
      console.log('Event dropped!')
      // console.log(arg)
      const event = this.findEventById(arg.event.id)
      event.start = arg.event.start
      event.end = arg.event.end
    },
    handleDrop (arg) {
      console.log('Dropped')
      const title = arg.draggedEl.querySelector('.subject-name').innerHTML
      const color = arg.draggedEl.style['background-color']
      const start = new Date(arg.date)

      const end = new Date(start.getTime())
      end.setHours(end.getHours() + 1)

      this.insertNewEvent(title, start, end, color)
      // if (!arg.isMirror && !arg.event.id) {
      //   console.log('New event!')
      //   console.log(arg)
      //   setTimeout(() => {
      //     this.insertNewEvent(arg.event.title, arg.start, arg.end)
      //   }, 100)
      // }
    },
    handleEventResize (arg) {
      console.log('Event resized')
      const event = this.findEventById(arg.event.id)
      event.end = arg.event.end
    },
    handleEventRender (arg) {
      const { el } = arg
      el.insertAdjacentHTML('beforeend', `<div class="time-start">${formattedTime(arg.event.start)}</div>`)
      el.insertAdjacentHTML('beforeend', `<div class="time-end">${formattedTime(arg.event.end)}</div>`)
    },
    findEventById (id) {
      return this.calendarEvents.find(e => e.id === parseInt(id))
    }
  },
  mounted () {
    // eslint-disable-next-line
    new Draggable(
      document.querySelector('.sidebar-container'), {
        itemSelector: '.fc-event',
        eventData (eventEl) {
          return {
            title: eventEl.querySelector('.subject-name').innerText,
            duration: '01:00',
            create: false
          }
        }
      }
    )
  }
}
</script>

<style lang='scss'>

@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';

* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #f3f3f3;
}

.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  display: flex;
  height: 100%;
  width: 1400px;
  margin: 0 auto;
}

.fc-highlight {
  background-color: grey;
  opacity: 0.6;
}

.calendar-container {
  width: 1100px;
}

.sidebar-container {
  margin-top: 3px;
  padding-left: 21px;
  flex: 1;
}

.sidebar-container .fc-event {
  margin-bottom: 0.5em;
  padding: 0.4em;
  font-size: 1.1em;
}

.fc-view-container {
  background: #fff;
}

.fc-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fc-title {
  text-align: center;
  font-size: 1.4em;
}

.time-start, .time-end {
  position: absolute;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0px 3px;
  background: rgba(255,255,255,0.9);
  color: #333;
  z-index: 550;
}

.time-start {
  top: -1px;
  left: -1px;
}

.time-end {
  bottom: -1px;
  right: -1px;
}

.subject-remaining {
  float: right;
}

</style>
