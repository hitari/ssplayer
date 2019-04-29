<template>
  <div>
    <b-list-group class="list-group-custom">
      <b-list-group-item @click="onClickList(item)" class="search-list-custom flex-column align-items-start list-group-item-action" v-bind:class="[item.active ? 'active' : 'aaaa']" v-for="(item, index) in playlist.list" style="width: 100%;">
        <small class="text-muted" style="word-break: break-all;" v-bind:title="item.movie_path">{{index+1}}.&nbsp;{{ item.name }}</small>
      </b-list-group-item>
    </b-list-group>
    <div class="toolbar-bottom-custom">
      <b-button-toolbar aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <div class="upload-btn-wrapper">
            <b-button size="sm" class="toolbar-button-custom"><font-awesome-icon icon="plus" /></b-button>
            <input type="file" name="myfile" @change="onAddPlayList($event)" multiple/>
          </div>
            <b-button size="sm" class="toolbar-button-custom" @click="onRemovePlayList($event)"><font-awesome-icon icon="minus" /></b-button>
        </b-button-group>
        <span class="toolbar-total-custom">
          Total {{playlist.list.length}}
        </span>
      </b-button-toolbar>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { eventBus } from '@/main'

export default {
  created(){
    this.onSearchPlayList();
  },
  computed: {
    ...mapState([
      'search',
      'playlist'
    ])
  },
  methods: {
    onSearchPlayList(){
      this.$store.dispatch('playlist/searchList', '');
    },
    onClickList(target){
      target.active = target.active?false:true;
      this.$store.dispatch('playlist/changeActive', {id: target.id, active: target.active});
    },
    onAddPlayList(event) {
      if(event.target.files.length <= 0)return false;

      //비디오, 자막 확장자 타입
      const videoType = ['avi', 'mp4', 'mkv', 'ogg', 'webm'];
      const subtitleType = ['smi', 'srt', 'vtt'];

      let movieArr = [];
      let subtitleArr = [];
      let resultArr = [];

      for(let i = 0; i < event.target.files.length; i++){
        let target = event.target.files[i].name.split(".");
        let obj = {
          type: target.pop(),
          name: target.join("."),
          data: event.target.files[i]
        };

        if(videoType.indexOf(obj.type) > -1){
          movieArr.push(obj);
        }else if(subtitleType.indexOf(obj.type) > -1){
          subtitleArr.push(obj);
        }else{
          console.error('해당되지 않은 타입의 파일 입니다.');
        }
      }

      for(let i = 0; i < movieArr.length; i++){
        for(let j = 0; j < subtitleArr.length; j++){
          if(movieArr[i].name === subtitleArr[j].name){
            resultArr.push({
              name: movieArr[i].name,
              movie: {path: movieArr[i].data.path, type: movieArr[i].type},
              subtitle: {path: subtitleArr[j].data.path, type: subtitleArr[j].type}
            });
          }
        }
      }

      this.$store.dispatch('playlist/addPlaylist', resultArr);
    },
    onRemovePlayList() {
      this.$store.dispatch('playlist/removePlaylist', null);
    }
  }
}
</script>

<style>
  /* CSS */
  .list-group-custom{
    position: absolute !important;
    right: 0;
    width: 100%;
    height: calc(100% - 30px);
    padding: 0 !important;
    overflow-y: auto;
  }

  .toolbar-bottom-custom{
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #2a2731;
    border-top: 1px solid #000;
  }

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

  .search-list-custom.list-group-item.active{
    background-color: #23242b !important;
    border-color: #1b1b1e !important;
  }

  .toolbar-button-custom{
    color: #8c8d9b !important;
    background-color: #2a2731 !important;
    border-color: #2a2731 !important;
  }

  .toolbar-button-custom:hover{
    color: #fff !important;
  }

  .toolbar-total-custom{
    font-size: 80%;
    color: #6c757d;
    margin-right: 8px;
    margin-left: auto;
    line-height: 30px;
  }

  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    cursor: pointer;
  }

  .upload-btn-wrapper input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
</style>
