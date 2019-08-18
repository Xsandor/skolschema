<template>
  <v-app>
    <v-app-bar app clipped-right>
      <v-toolbar-title class="headline text-uppercase">
        <span>Skolschema</span>
        <span class="font-weight-light">online</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-autocomplete
        :items="classes.concat(['Alla'])"
        v-model="selectedClass"
        @change="handleFilterChanged('class')"
        hide-details
        required
        prefix="Klass:"
        style="max-width: 150px; margin-right: 1em;"
      ></v-autocomplete>
      <v-autocomplete
        :items="teachers.concat(['Alla'])"
        v-model="selectedTeacher"
        @change="handleFilterChanged('teacher')"
        hide-details
        required
        prefix="Lärare:"
        style="max-width: 150px;"
      ></v-autocomplete>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </template>
        <v-list>
           <v-subheader>Schema</v-subheader>
          <v-list-item @click="clearEvents">
            <v-list-item-icon>
              <v-icon>mdi-delete-sweep</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Rensa allt</v-list-item-title>
          </v-list-item>
          <label for="config-upload" class="v-list-item v-list-item--link theme--light">
            <v-list-item-icon>
              <v-icon>mdi-cloud-upload</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Öppna fil</v-list-item-title>
          </label>
          <input id="config-upload" type="file" style="display: none" @change="handleConfigUpload"/>
          <v-list-item @click="downloadConfig">
            <v-list-item-icon>
              <v-icon>mdi-cloud-download</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Spara fil</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <app-calendar
              :items="filteredEvents"
              @selectItem="showEventDetails"
              @newItem="insertNewEvent"
              @updateItem="updateEvent"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-navigation-drawer
      app
      clipped
      v-model="sidebarOpen"
      right
      class="sidebar-container"
    >
      <div v-for="subject in subjects" :key="subject.name" class='fc-event' :style="subjectStyle(subject)"><span class="subject-name">{{ subject.name }}</span><span class="subject-remaining">{{ remainingSubjectTime[subject.name] }} min</span></div>
      <p>Utlagd tid: {{ totalTime }} minuter</p>
    </v-navigation-drawer>

    <app-event-modal
      :show="showEventModal"
      :event="selectedEvent"
      :teachers="teachers"
      :classes="classes"
      :subjects="subjects"
      @close="showEventModal = false"
      @deleteEvent="deleteEvent"
    />
    <v-snackbar
      v-model="showDeleteConfirmation"
      :timeout="2000"
    >
      Raderad
      <v-btn
        color="yellow"
        text
        @click="undoDeletion"
      >
        Ångra
      </v-btn>
    </v-snackbar>
    <a id="downloadAnchorElem" style="display:none"></a>
  </v-app>
</template>

<script>
import appCalendar from './components/appCalendar'
import appEventModal from './components/appEventModal'
import { Draggable } from '@fullcalendar/interaction'

import { calcEventTime } from './utilities'

const LOCALSTORAGE_PREFIX = 'skolschema.'

function saveJSONinLocalStorage (key, value) {
  return localStorage.setItem(LOCALSTORAGE_PREFIX + key, JSON.stringify(value))
}

function getJSONfromLocalStorage (key) {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_PREFIX + key))
}

function clearJSONinLocalStorage (key) {
  localStorage.removeItem(LOCALSTORAGE_PREFIX + key)
}

function readFile (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }

    reader.readAsText(file)
  })
}

export default {
  name: 'app',
  components: {
    appCalendar,
    appEventModal
  },
  data () {
    return {
      events: [],
      subjects: [
        { name: 'Matte', color: 'purple', target: 180 },
        { name: 'Svenska', color: 'red', target: 240 },
        { name: 'Engelska', color: 'green', target: 360 },
        { name: 'NO', color: 'blue', target: 360 },
        { name: 'SO', color: 'orange', target: 360 },
        { name: 'Idrott', color: 'brown', target: 100 },
        { name: 'Lunch', color: 'grey', target: 0 }
      ],
      classes: ['1A', '1B', '1C', '1D'],
      teachers: ['JW', 'AS', 'PD', 'LA', 'CR'],
      sidebarOpen: true,
      showEventModal: false,
      showDeleteConfirmation: false,
      lastDeletedEventId: '',
      selectedEvent: {},
      selectedClass: '1A',
      selectedTeacher: 'Alla'
    }
  },
  computed: {
    filteredEvents () {
      const events = this.events.filter(event => !event.deleted)

      if (this.selectedTeacher !== 'Alla') {
        return events.filter(event => event.teachers.includes(this.selectedTeacher))
      }

      return events.filter(event => event.class === this.selectedClass)
    },
    totalTime () {
      return this.filteredEvents.reduce((acc, event) => {
        const eventDuration = calcEventTime(event)
        acc += eventDuration
        return acc
      }, 0)
    },
    remainingSubjectTime () {
      const subjectTime = {}

      this.subjects.forEach((subject) => {
        const events = this.filteredEvents.filter(event => event.title === subject.name)
        subjectTime[subject.name] = 0 - subject.target + events.reduce((acc, event) => {
          acc += calcEventTime(event)
          return acc
        }, 0)
      })

      return subjectTime
    }
  },
  methods: {
    async handleConfigUpload (event) {
      const files = event.target.files
      if (!files.length) {
        console.log('No file choosen, ignore')
        return
      }

      let config = await readFile(files[0])

      config = JSON.parse(config)

      this.restoreConfig(config)
    },
    restoreConfig (config) {
      config.events.forEach((event) => {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
      })

      this.classes = config.classes
      this.teachers = config.teachers
      this.subjects = config.subjects
      this.events = config.events
    },
    getConfig () {
      return {
        classes: this.classes,
        teachers: this.teachers,
        subjects: this.subjects,
        events: this.events
      }
    },
    downloadConfig () {
      const config = this.getConfig()

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2))
      const dlAnchorElem = document.getElementById('downloadAnchorElem')

      dlAnchorElem.setAttribute('href', dataStr)
      dlAnchorElem.setAttribute('download', 'schema.json')
      dlAnchorElem.click()
    },
    clearEvents () {
      this.events = []
      this.clearConfigInLocalStorage()
    },
    findEventById (id) {
      return this.events.find(e => e.id === parseInt(id))
    },
    findEventIndexById (id) {
      return this.events.findIndex(e => e.id === parseInt(id))
    },
    handleFilterChanged (inputName) {
      if (inputName === 'class' && this.selectedTeacher !== 'Alla') {
        this.selectedTeacher = 'Alla'
        return
      }

      if (inputName === 'teacher' && this.selectedClass !== 'Alla') {
        this.selectedClass = 'Alla'
      }
    },
    showEventDetails (eventId) {
      console.log('Show event details!')
      console.log(eventId)
      const event = this.findEventById(eventId)

      this.selectedEvent = event
      this.showEventModal = true
    },
    insertNewEvent ({ title, start, end, color }) {
      const newEvent = { // add new event data
        title,
        class: this.selectedClass,
        teachers: [],
        start,
        end,
        allDay: false
      }

      if (color) {
        newEvent.color = color
      }

      newEvent.id = this.events.length ? this.events[this.events.length - 1].id + 1 || 1 : 1

      this.events.push(newEvent)

      const createdEvent = this.findEventById(newEvent.id)

      if (createdEvent.title === 'Ny') {
        this.selectedEvent = createdEvent
        setTimeout(() => {
          this.showEventModal = true
        }, 0)
      }

      return createdEvent
    },
    deleteEvent (eventId) {
      // const eventIndex = this.findEventIndexById(eventId)
      // this.events.splice(eventIndex, 1)

      const event = this.findEventById(eventId)
      this.$set(event, 'deleted', true)
      this.lastDeletedEventId = event.id

      this.showEventModal = false
      this.showDeleteConfirmation = true
    },
    undoDeletion () {
      const event = this.findEventById(this.lastDeletedEventId)
      event.deleted = false
      this.showDeleteConfirmation = false
    },
    updateEvent (eventId, newValues) {
      console.log('Update event with new data!')
      const event = this.findEventById(eventId)
      Object.assign(event, newValues)
      this.showEventModal = false
      this.saveConfigToLocalStorage()
    },
    subjectStyle (subject) {
      return {
        'background-color': subject.color,
        'border-color': subject.color
      }
    },
    saveConfigToLocalStorage () {
      saveJSONinLocalStorage('classes', this.classes)
      saveJSONinLocalStorage('teachers', this.teachers)
      saveJSONinLocalStorage('subjects', this.subjects)
      saveJSONinLocalStorage('events', this.events)
    },
    clearConfigInLocalStorage () {
      clearJSONinLocalStorage('classes')
      clearJSONinLocalStorage('teachers')
      clearJSONinLocalStorage('subjects')
      clearJSONinLocalStorage('events')
    },
    getConfigFromLocalStorage () {
      const config = {
        classes: getJSONfromLocalStorage('classes'),
        teachers: getJSONfromLocalStorage('teachers'),
        subjects: getJSONfromLocalStorage('subjects'),
        events: getJSONfromLocalStorage('events')
      }

      if (!config.classes) {
        return null
      }

      return config
    }
  },
  mounted () {
    console.log('Checking localstorage!')
    const config = this.getConfigFromLocalStorage()
    if (!config) {
      console.log('Nothing there!')
    } else {
      console.log('Found config!')
      this.restoreConfig(config)
    }
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

body .container {
  max-width: 1264px;
}

body {
  background: #f3f3f3;
}

.sidebar-container {
  padding: 1em;

  .fc-event {
    margin-bottom: 0.5em;
    padding: 0.4em;
    font-size: 1em;
  }
}

.subject-remaining {
  float: right;
}

</style>
