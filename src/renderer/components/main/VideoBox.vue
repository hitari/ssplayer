<template>
  <div class="video-box-custom">
    <!-- 비디오 영역 -->
    <video-player  class="video-js vjs-default-skin"
                    style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;"
                    ref="videoPlayer"
                    :options="playerOptions"
                    :playsinline="true"
                    customEventName="customstatechangedeventname"
                    

                    @play="onPlayerPlay($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @ready="playerReadied">
    </video-player>
  </div>
</template>

/**
  Video js Option
  @pause="onPlayerPause($event)"
  @ended="onPlayerEnded($event)"
  @waiting="onPlayerWaiting($event)"
  @playing="onPlayerPlaying($event)"
  @loadeddata="onPlayerLoadeddata($event)"
  @timeupdate="onPlayerTimeupdate($event)"
  @canplay="onPlayerCanplay($event)"
  @canplaythrough="onPlayerCanplaythrough($event)"

  @statechanged="playerStateChanged($event)"
 */
<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { eventBus } from '@/main'

export default {
  name: 'VideoBox',
  components: {
    videoPlayer
  },
  data() {
    return {
      playerOptions: {
        // videojs options
        fluid: true,
        muted: false,
        // width:'800',
        // height: '450',
        language: 'en',
        playbackRates: [0.5, 0.7, 1.0, 1.5, 2.0],
        sources: [],
        tracks: [],
        poster: "/static/images/author.jpg",
      }
    }
  },
  created(){
    eventBus.$on('videoChangePlay', this.videoChangePlay);
  },
  mounted() {
    console.log('this is current player instance object', this.player)
  },
  computed: {
    player() {
        return this.$refs.videoPlayer.player
    }
  },
  methods: {
    videoChangePlay(obj){
      let oldTracks = this.$refs.videoPlayer.player.remoteTextTracks();
      let i = oldTracks.length;
      while (i--) {
        this.$refs.videoPlayer.player.removeRemoteTextTrack(oldTracks[i]);
      }

      this.$refs.videoPlayer.player.addRemoteTextTrack({
                kind: 'captions', 
                label:'subtitle',
                src: obj.s }, true);
      this.$refs.videoPlayer.player.textTracks()[0].mode='showing';
      this.$refs.videoPlayer.player.src(obj.m);
      this.$refs.videoPlayer.player.play();
      
    },
    // listen event
    onPlayerPlay(player) {
      console.log('player play!', player)
    },
    onPlayerPause(player) {
      console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    },

    onPlayerLoadeddata(player){
      console.log('the onPlayerLoadeddata', player);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .video-box-custom{
    position:relative;
    height:100%;
  }
</style>
