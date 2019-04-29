<template>
  <div class="container-fluid">
    <div class="row">
      <VideoBox class="video-custom col-md-9"></VideoBox>
      <div class="col-md-3 sidebar" style="background-color: #2b2c34;">
        <b-tabs content-class="" fill>
          <b-tab title="subtitle" active class="sidebar-custom">
            <SearchBox class="aaa"></SearchBox>
          </b-tab>
          <b-tab title="playlist" class="sidebar-custom">
            <Playlist class="" style="position: relative;height: 100%;"></Playlist>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import VideoBox from './main/VideoBox'
  import SearchBox from './main/SearchBox'
  import Playlist from './main/Playlist'

  export default {
    name: 'landing-page',
    components: { 
      SystemInformation,
      VideoBox,
      SearchBox,
      Playlist
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body { font-family: 'Source Sans Pro', sans-serif; }
  .row{
    position: relative;
  }

  .video-custom {
    padding: 0 !important;
  }

  .sidebar{
    padding: 0 !important;
  }

  .sidebar-custom {
    position: absolute !important;
    right: 0;
    /* top: 0; */
    width: 100%;
    height: calc(100% - 30px);
    padding: 0 !important;
    overflow-y: auto;
  }

  .sidebar .nav-tabs .nav-link.active{
    padding: 0.2rem 1rem;
    font-size: 0.9rem;
    color: rgb(252, 252, 252);
    height: 30px;
    background-color: #2b2c34;
    border-color: transparent;
    border-radius: 0;
  }

  .sidebar .nav-link{ 
    padding: 0.2rem 1rem;
    font-size: 0.9rem;
    color: #777777;
    background-color: #2a2731;
    border-color: #000 #000 #000;
    height: 30px;
    border-radius: 0 !important;
  }

  .sidebar .nav-tabs .nav-link:hover{
    /* background-color: #2b2c34;
    border-color: transparent; */
    border-color: #000 #000 #000;
  }

  .sidebar .nav-tabs .nav-link:focus{
    border-color: transparent;
  }
    
</style>
