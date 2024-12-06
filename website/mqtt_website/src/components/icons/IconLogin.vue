
<template>
  <svg-icon type="mdi" :path="path"></svg-icon>
</template>

<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogin } from '@mdi/js';

export default {
  name: "my-component",
  components: {
    SvgIcon
  },
  data() {
    return {
       path: mdiLogin,
    }
  }
}
</script>
