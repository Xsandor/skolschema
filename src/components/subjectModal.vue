<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Redigera</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="subject.name"
          @change="handleSubjectNameChange"
          required
          label="Namn"
        />
        <v-text-field
          v-model="subject.target"
          type="number"
          min="0"
          step="1"
          required
          label="Tidplan"
          suffix="minuter"
        />
        <v-select
          v-model="subject.color"
          :items="colors"
          @change="$emit('subject-color-changed', subject)"
          item-value="hex"
          item-text="label"
          label="Färg"
        >
          <template v-slot:item="{ item, on }">
            <v-list-item
              ripple
              v-on="on"
            >
              <v-list-item-action>
                <v-icon :color="item.color">mdi-square</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red darken-1" text @click="$emit('delete-subject', subject.name)">Radera</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close')">Spara</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'app-subject-modal',
  props: ['show', 'subject'],
  data () {
    return {
      colors: [
        { label: 'Brun', color: 'brown', hex: '#795548' },
        { label: 'Röd', color: 'red', hex: '#F44336' },
        { label: 'Mörkorange', color: 'deep-orange', hex: '#FF5722' },
        { label: 'Orange', color: 'orange', hex: '#FF9800' },
        { label: 'Gul', color: 'amber', hex: '#FFC107' },
        { label: 'Turkos', color: 'cyan', hex: '#00BCD4' },
        { label: 'Grönblå', color: 'teal', hex: '#009688' },
        { label: 'Grön', color: 'green', hex: '#4CAF50' },
        { label: 'Blå', color: 'blue', hex: '#2196F3' },
        { label: 'Indigo', color: 'indigo', hex: '#3F51B5' },
        { label: 'Lila', color: 'purple', hex: '#9C27B0' },
        { label: 'Rosa', color: 'pink', hex: '#E91E63' },
        { label: 'Blå-Grå', color: 'blue-grey', hex: '#607D8B' },
        { label: 'Grå', color: 'grey', hex: '#9E9E9E' },
        { label: 'Vit', color: 'white', hex: '#FFFFFF' }
      ]
    }
  },
  methods: {
    handleSubjectNameChange () {
      console.log('Subject name change!')
    }
  }
}
</script>

<style>

</style>
