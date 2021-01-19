<template>
  <v-dialog v-model="show" max-width="300px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Klasser</span>
      </v-card-title>
      <v-card-text>
        <app-crud-list :items="classes" placeholder="Ny klass" @add="addClass" @delete="deleteClass" />
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
  name: 'app-classes-modal',
  props: ['show', 'classes'],
  components: { appCrudList },
  methods: {
    addClass(newClass) {
      this.$emit('add', newClass)
    },
    deleteClass(index) {
      this.$emit('delete', index)
    }
  }
}
</script>

<style>

</style>
