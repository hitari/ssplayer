<template>
<div style="-webkit-user-select: none;-webkit-app-region: drag;">
<!-- <div> -->
    <b-navbar type="dark" variant="dark" class="navbar-custom">

        <b-navbar-nav>
            <b-nav-item-dropdown class="electron-no-drage navbar-title-custom">
                <!-- Using 'button-content' slot -->
                <template slot="button-content">SSPlayer</template>
                <b-dropdown-item v-b-modal.modal-1>About...</b-dropdown-item>
                <b-dropdown-item @click="close()">Exit...</b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- Modal -->
            <b-modal id="modal-1" title="About">
              <h3>SSPlayer</h3>
              <small>Version 0.1.0</small><br/>
              <p class="my-4">hitari@naver.com</p>
            </b-modal>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-item class="navbar-icon-custom electron-no-drage" @click="minimize()">
                <font-awesome-icon icon="window-minimize" />
            </b-nav-item>

            <!-- <b-nav-item class="navbar-icon-custom electron-no-drage" @click="minOrMaximize()">
                <font-awesome-icon icon="window-maximize" />
            </b-nav-item> -->

            <b-nav-item class="navbar-icon-custom electron-no-drage" @click="close()">
                <font-awesome-icon icon="times" />
            </b-nav-item>
        </b-navbar-nav>
        
    </b-navbar>
</div>
</template>

<script>
const { remote, ipcRenderer } = require('electron');

export default {
  data () {
    return {}
  },
  methods: {
    minimize() {
        remote.getCurrentWindow().minimize();
    },
    minOrMaximize() {
      const currentWindow = remote.getCurrentWindow();
      if(currentWindow.isMaximized()){
        currentWindow.unmaximize();
      }else{
        currentWindow.maximize();
      }
    },
    close() {
      remote.app.quit();
    }
  }
}
</script>

<style scoped>
    .electron-no-drage{
        -webkit-app-region: no-drag;
    }

    .navbar-custom{
      height: 30px;
      padding: 0.2rem 0.7rem;
      background-color: #1e1e1e !important;
    }

    .navbar-title-custom{
      padding: 0.2rem 0;
      font-size: 0.9rem;
    }

    .navbar-icon-custom {
      font-size: 0.8rem;
    }
</style>