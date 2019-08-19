<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Klasser</span>
      </v-card-title>
      <v-card-text>
        Klasser
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
  name: 'app-classes-modal',
  props: ['show', 'classes']
}
</script>

<style>

</style>
