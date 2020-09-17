<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Klasser</span>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="c in classes" :key="c">
            {{ c }}
          </v-list-item>
        </v-list>
        <v-text-field v-model="newClass" outlined hide-details dense placeholder="Ny klass" append-outer-icon="mdi-plus" @click:append-outer="addClass" />
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
  props: ['show', 'classes'],
  data() {
    return {
      newClass: ''
    }
  },
  methods: {
    addClass() {
      this.$emit('add', this.newClass)
      this.newClass = ''
    }
  }
}
</script>

<style>

</style>
