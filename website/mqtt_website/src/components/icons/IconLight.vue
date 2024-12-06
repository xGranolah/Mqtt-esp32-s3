
<template>
  <svg-icon type="mdi" :path="path"></svg-icon>
</template>

<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLightbulbOn10 } from '@mdi/js';

export default {
  name: "my-component",
  components: {
    SvgIcon
  },
  data() {
    return {
       path: mdiLightbulbOn10,
    }
  }
}
</script>
