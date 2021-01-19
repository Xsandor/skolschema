<template>
  <v-dialog v-model="show" max-width="300px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Lärare</span>
      </v-card-title>
      <v-card-text>
        <app-crud-list :items="teachers" placeholder="Ny lärare" @add="addTeacher" @delete="deleteTeacher" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close')">Stäng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import appCrudList from './appCrudList'

export default {
  name: 'app-teachers-modal',
  props: ['show', 'teachers'],
  components: { appCrudList },
  methods: {
    addTeacher(newTeacher) {
      this.$emit('add', newTeacher)
    },
    deleteTeacher(index) {
      this.$emit('delete', index)
    }
  }
}
</script>

<style>

</style>
