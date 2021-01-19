<template>
  <div>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-avatar v-if="icon">
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item" />
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="$emit('delete', index)">
            <v-icon color="grey lighten-1">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-text-field v-model="newItem" outlined hide-details dense :placeholder="placeholder" append-outer-icon="mdi-plus" @click:append-outer="addItem" />
  </div>
</template>

<script>
export default {
  name: 'app-crud-list',
  props: ['items', 'placeholder', 'icon'],
  data() {
    return {
      newItem: ''
    }
  },
  methods: {
    addItem() {
      if (!this.newItem) {
        return
      }

      this.$emit('add', this.newItem)
      this.newItem = ''
    }
  }
}
</script>
