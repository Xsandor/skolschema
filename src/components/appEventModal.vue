<template>
  <v-dialog v-model="show" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Redigera</span>
      </v-card-title>
      <v-card-text>
        <v-combobox
          :items="subjectNames"
          v-model="event.title"
          @change="handleEventSubjectChange"
          required
          label="Ämne"
        ></v-combobox>
        <v-autocomplete
          :items="classes"
          v-model="event.class"
          required
          label="Klass"
        ></v-autocomplete>
        <v-autocomplete
          :items="teachers"
          v-model="event.teachers"
          label="Lärare"
          multiple
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="$emit('deleteEvent', event.id)">Radera</v-btn>
        <v-btn color="blue darken-1" text @click="$emit('close')">Stäng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'app-event-modal',
  props: ['show', 'event', 'subjects', 'teachers', 'classes'],
  computed: {
    subjectNames () {
      return this.subjects.map(subject => subject.name)
    }
  },
  methods: {
    handleEventSubjectChange () {
      console.log('Subject change!')
      const subject = this.subjects.find(subject => subject.name === this.event.title)

      if (!subject) {
        console.log(`Unknown subject: ${subject}`)
        return
      }

      this.event.color = subject.color
    }
  }
}
</script>

<style>

</style>
