<template>
  <div>
    <b-input-group>
      <b-form-input v-model="search.searchText" @keyup.enter="onSearchEvent()" size="sm" class="navbar-input-custom" placeholder="Search"></b-form-input>
      <b-button size="sm" @click="onSearchEvent()" class="navbar-button-custom my-2 my-sm-0" type="submit">Search</b-button>
    </b-input-group>
    <b-list-group>
      <b-list-group-item @click="onListPlay(item)" class="search-list-custom flex-column align-items-start list-group-item-action" v-for="(item, index) in search.searchResult">
        <div class="d-flex w-100 justify-content-between">
          <small class="mb-1">{{ msToTime(item.start) }}</small>
        </div>

        <small class="mb-1" style="display: block;">
          {{ item.text }}
        </small>

        <small class="text-muted" style="word-break: break-all;">{{ item.name }}</small>
        <!-- <small class="text-muted">Donec id elit non mi porta.</small> -->
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Loading from '../cmn/Loading'
import { eventBus } from '@/main'
const { ipcRenderer } = require('electron');

export default {
  components: { 
    Loading
  },
  computed: {
    ...mapState([
      'search'
    ])
  },
  methods: {
    msToTime(s) {
      // Pad to 2 or 3 digits, default is 2
      function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
      }

      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
    },
    onSearchEvent() {
        // this.$refs.loading.show().then(()=>{})
        this.$store.dispatch('search/searchList', null);
    },
    onListPlay(target){
      let data = ipcRenderer.sendSync('listPlayEvent', target);      

      fetch('file:///./output.mp4')
      .then(response => response.blob())
      .then(blob => {
        let url = window.URL.createObjectURL(blob);

        fetch('file:///./output.vtt')
        .then(response => response.blob())
        .then(blob => {
          let suburl = window.URL.createObjectURL(blob);

          eventBus.$emit('videoChangePlay', {m:{type:'video/mp4', src: url},s:suburl});
        });
      });
    }
  }
}

</script>

<style>
  /* CSS */
  .navbar-input-custom{
    background-color: #2b2c34!important;
    border: 1px solid #2b2c34!important;
    border-radius: 0!important;
    margin: 0 !important;
    color: #a9aabe!important;
  }

  .navbar-button-custom{
    border-radius: 0 !important;
    background-color: #2b2c34!important;
    border: 1px solid #2b2c34!important;
  }

  .search-list-custom{
    background-color: #2b2c34 !important;
    color: #a9aabe !important;
    border-radius: 0 !important;
    cursor: pointer;
  }
  .search-list-custom:focus,
  .search-list-custom:hover{
    background-color: #31333c !important;
  }
  
</style>
