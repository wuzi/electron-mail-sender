<template>
  <div class="config-modal" v-show="visible">
    <div class="config-modal-content">
      <span class="close" @click="close">&times;</span>
      <form @submit.prevent="save" class="validate-form">
        <span class="contact100-form-title">SMTP Config</span>

        <div class="wrap-input100 validate-input">
          <input
            class="input100"
            type="text"
            name="host"
            placeholder="Host"
            v-model="host"
            required
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-server" aria-hidden="true"></i>
          </span>
        </div>

        <div class="wrap-input100 validate-input">
          <input
            class="input100"
            type="text"
            name="port"
            placeholder="Port"
            v-model="port"
            required
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-lock" aria-hidden="true"></i>
          </span>
        </div>

        <div class="wrap-input100 validate-input">
          <input
            class="input100"
            type="text"
            name="user"
            placeholder="User"
            v-model="user"
            required
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-user" aria-hidden="true"></i>
          </span>
        </div>

        <div class="wrap-input100 validate-input">
          <input
            class="input100"
            type="password"
            name="password"
            placeholder="Password"
            v-model="pass"
            required
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-key" aria-hidden="true"></i>
          </span>
        </div>

        <div class="container-contact100-form-btn">
          <button class="contact100-form-btn">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import swal from 'sweetalert'
import { Options, Vue } from 'vue-class-component'
const { ipcRenderer } = window.require('electron')

@Options({
  props: {
    visible: Boolean
  },
  emits: ['close']
})
export default class ConfigModal extends Vue {
  host = '';
  port = '';
  user = '';
  pass = '';
  visible!: boolean;

  close () {
    this.$emit('close')
  }

  save () {
    const port = parseInt(this.port)
    if (Number.isNaN(port)) {
      swal('Oops!', 'Invalid port.', 'error')
      return
    }

    ipcRenderer.sendSync('saveSMTP', {
      host: this.host,
      port,
      auth: {
        user: this.user,
        pass: this.pass
      }
    })

    this.close()
  }

  mounted () {
    const transportSettings = ipcRenderer.sendSync('getSMTP')
    this.host = transportSettings.host
    this.port = transportSettings.port
    this.user = transportSettings.auth.user
    this.pass = transportSettings.auth.pass
  }
}
</script>

<style scoped>
.config-modal {
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.config-modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
