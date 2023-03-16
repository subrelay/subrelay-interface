<template>
  <div>
    <textarea @input="onInput"></textarea>
    <div>
      <h4>Preview:</h4>
      <div>{{ previewText }}</div>
    </div>
    <div v-if="showMenu" style="position: absolute; top: 0; left: 0">
      <ul>
        <li v-for="value in values" @click="insertValue(value)" :key="value">{{ value }}</li>
      </ul>
    </div>

    <div>TEST</div>
    <div>TEST 2</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      previewText: '',
      showMenu: false,
      values: ['value1', 'value2', 'value3'],
    };
  },
  methods: {
    onInput(event) {
      this.text = event.target.value;
      this.previewText = this.parseText(this.text);
    },
    parseText(text) {
      let previewText = text.replace(/\$/g, "<span style='color:red'>$</span>");
      previewText = previewText.replace(/\{([^}]+)\}/g, "<span style='color:blue'>$1</span>");
      return previewText;
    },
    insertValue(value) {
      const textarea = this.$el.querySelector('textarea');
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const before = this.text.substr(0, startPos);
      const after = this.text.substr(endPos, this.text.length);
      this.text = `${before}${value}${after}`;
      this.previewText = this.parseText(this.text);
      this.showMenu = false;
    },
  },
  watch: {
    text(text) {
      if (text.includes('$')) {
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }
    },
  },
};
</script>
