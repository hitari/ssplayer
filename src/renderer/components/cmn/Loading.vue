<template>
  <div v-bind:style="{ display: showa}">
    <div  class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
      showa: 'none'
    }
  },
  created () {
    this.$parent.$on('update', this.testaa);
  },
  methods: {
    show(){
      console.log('테스트가 성공적입니다.');
      
      return new Promise((resolve, reject) => {
        this.showa = 'block';
        resolve();
      })
    }
  }
}
</script>

<style scoped>

</style>
