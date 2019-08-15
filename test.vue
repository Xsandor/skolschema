<template>
  <FullCalendar
    defaultView="timeGridWeek"
    :plugins="calendarPlugins" 
    :slotEventOverlap="false"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import timeGridPlugin from '@fullcalendar/timegrid';

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarPlugins: [ timeGridPlugin ]
    }
  }
}

</script>