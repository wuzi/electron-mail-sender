<template>
  <div class="home bg-contact100">
    <div class="container-contact100">
      <div class="wrap-contact100">
        <div class="contact100-pic">
          <img src="~@/assets/images/img-01.png" alt="IMG">
        </div>

        <form @submit.prevent="send" class="contact100-form validate-form">
          <span class="contact100-form-title">
            Send email
          </span>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="name" placeholder="Name" v-model="name" required>
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-user" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="email" name="email" placeholder="Email" v-model="email" required>
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-envelope" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="subject" placeholder="Subject" v-model="subject" required>
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <textarea class="input100" name="message" placeholder="Message" v-model="message" required></textarea>
            <span class="focus-input100"></span>
          </div>

          <div class="container-contact100-form-btn">
            <button class="contact100-form-btn">
              Send
            </button>
          </div>

          <div class="container-contact100-form-btn">
            <button class="contact100-form-btn" type="button" @click="showConfig = true">
              Config SMTP
            </button>
          </div>
        </form>
      </div>
    </div>
    <ConfigModal :visible="showConfig" @close="showConfig = false" />
  </div>
</template>

<script lang="ts">
import swal from 'sweetalert'
import { Options, Vue } from 'vue-class-component'
import ConfigModal from '@/components/ConfigModal.vue'
const { ipcRenderer } = window.require('electron')

@Options({
  components: {
    ConfigModal
  }
})
export default class Home extends Vue {
  name = '';
  email = '';
  subject = '';
  message = '';
  showConfig = false

  send () {
    swal({
      title: 'Sending...',
      text: 'Please wait',
      buttons: {
        cancel: false,
        confirm: false
      },
      closeOnClickOutside: false,
      closeOnEsc: false
    })

    const response = ipcRenderer.sendSync('sendEmail', {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    })

    if (response === 'missing_transport') {
      swal('Oops!', 'The SMTP configs were not inserted.', 'error')
    } else if (response === 'success') {
      swal('Success!', 'Email sent.', 'success')
    } else {
      swal('Oops!', 'It was not possible to send the email.', 'error')
    }
  }
}
</script>
