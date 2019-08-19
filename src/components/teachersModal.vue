<template>
  <v-dialog v-model="show" max-width="200px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Lärare</span>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item
            v-for="teacher in teachers"
            :key="teacher"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="teacher"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close')">Stäng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'app-teachers-modal',
  props: ['show', 'teachers']
}
</script>

<style>

</style>
