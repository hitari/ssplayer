<template>
  <div id="app">
    <TitleBar></TitleBar>
    <router-view></router-view>
  </div>
</template>

<script>
  import TitleBar from './components/main/TitleBar'

  export default {
    name: 'sub-video-player',
    components: {
      TitleBar
    }
  }
</script>

<style>
  /* CSS */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px #202126; 
    /* border-radius: 10px; */
  }
  
  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px #3d3f47; 
    /* border-radius: 10px; */
  }

  html{
    width: 100%;
    height: 100%;
  }

  body{
    width: 100%;
    height: 100%;
  }

  #app{
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
