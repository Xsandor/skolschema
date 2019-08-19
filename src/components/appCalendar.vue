<template>
  <FullCalendar
    class="app-calendar"
    ref="fullCalendar"
    :height="950"
    :header="header"
    themeSystem="standard"
    defaultView="timeGridWeek"
    :plugins="calendarPlugins"
    :columnHeaderFormat="columnHeaderFormat"
    :eventTimeFormat="eventTimeFormat"
    :slotLabelFormat="slotLabelFormat"
    :slotEventOverlap="false"
    minTime="07:00"
    maxTime="16:00"
    snapDuration="00:05:00"
    slotDuration="00:15:00"
    locale="sv"
    now="2013-12-01T00:00:00"
    :nowIndicator="false"
    :allDaySlot="false"
    :weekends="false"
    :events="items"
    :editable="true"
    :droppable="true"
    :selectable="true"
    :selectMirror="true"
    @eventClick="handleEventClick"
    @select="handleSelect"
    @eventDrop="handleEventDrop"
    @drop="handleDrop"
    @eventResize="handleEventResize"
    :eventRender="handleEventRender"
    :displayEventTime="false"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import { formattedTime } from '../utilities'

const occuranceValues = {
  oddWeek: 'O',
  evenWeek: 'J'
}

export default {
  name: 'app-calendar',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    FullCalendar
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
        { name: 'Engelska', color: 'green', target: 360 },
        { name: 'NO', color: 'blue', target: 360 },
        { name: 'SO', color: 'orange', target: 360 },
        { name: 'Idrott', color: 'brown', target: 100 },
        { name: 'Lunch', color: 'grey', target: 0 }
      ],
      calendarEvents: [],
      eventModal: false,
      classes: ['1A', '1B', '1C', '1D'],
      teachers: ['JW', 'AS', 'PD', 'LA', 'CR'],
      selectedClass: '1A',
      selectedTeacher: 'Alla',
      selectedEvent: {}
    }
  },
  methods: {
    handleEventClick (arg) {
      console.log('Event click')
      this.$emit('selectItem', arg.event.id)
    },
    handleSelect (arg) {
      console.log('Selected!')
      const newEvent = { title: 'Ny', start: arg.start, end: arg.end }
      this.$emit('newItem', newEvent)

      const calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.unselect()
    },
    handleEventDrop (arg) {
      console.log('Event dropped!')
      // console.log(arg)
      const eventId = arg.event.id
      const newValues = {
        start: arg.event.start,
        end: arg.event.end
      }
      this.$emit('updateItem', eventId, newValues)
    },
    handleDrop (arg) {
      console.log('Dropped')

      const start = new Date(arg.date)
      const end = new Date(start.getTime())
      end.setHours(end.getHours() + 1)

      const newEvent = {
        title: arg.draggedEl.querySelector('.subject-name').innerHTML,
        start,
        end,
        color: arg.draggedEl.style['background-color']
      }
      this.$emit('newItem', newEvent)

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
      const eventId = arg.event.id
      const newValues = {
        end: arg.event.end
      }
      this.$emit('updateItem', eventId, newValues)
    },
    handleEventRender (arg) {
      const { el, event } = arg
      // console.log(event)
      el.insertAdjacentHTML('beforeend', `<div class="time-start">${formattedTime(event.start)}</div>`)
      el.insertAdjacentHTML('beforeend', `<div class="time-end">${formattedTime(event.end)}</div>`)
      const contentEl = el.querySelector('.fc-content')
      // if (event.backgroundColor === '#FFFFFF') {
      //   console.log('COLOR IT BLACK')
      //   contentEl.style.color="#111"
      // }
      contentEl.insertAdjacentHTML('beforeend', `<div class="teachers">${event.extendedProps.teachers ? event.extendedProps.teachers.join(', ') : ''}</div>`)
      if (event.extendedProps.occurance !== 'always') {
        contentEl.insertAdjacentHTML('beforeend', `<div class="occurance">${occuranceValues[event.extendedProps.occurance]}</div>`)
      }
    }
  }
}
</script>

<style lang='scss'>
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';
  @import '~@fullcalendar/timegrid/main.css';

  .fc-view-container {
    background: #fff;
  }

  .fc-highlight {
    background-color: grey;
    opacity: 0.6;
  }

  .v-application .fc a {
    color: #fff
  }

  .fc-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .fc-title {
        text-align: center;
        font-size: 1.3em;
      }

      .teachers {
        font-size: 0.8em;
      }

      .occurance {
        position: absolute;
        top: -2px;
        right: 2px;
      }
  }

  .fc-short .teachers, .fc-short .occurance {
    display: none;
  }

  .time-start, .time-end {
    position: absolute;
    font-size: 0.8em;
    border-radius: 2px 0 2px 0;
    padding: 0px 3px;
    background: rgba(255,255,255,0.9);
    color: #333;
    z-index: 550;
  }

  .time-start {
    top: -0px;
    left: -0px;
  }

  .time-end {
    bottom: -0px;
    right: -0px;
  }
</style>
