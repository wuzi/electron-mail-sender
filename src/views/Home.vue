<template>
  <div class="home bg-contact100">
    <div class="container-contact100">
      <div class="wrap-contact100">
        <div class="contact100-pic">
          <img src="~@/assets/images/img-01.png" alt="IMG">
        </div>

        <form @submit.prevent="send" class="contact100-form validate-form">
          <span class="contact100-form-title">
            Enviar email
          </span>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="name" placeholder="Nome" v-model="name" required>
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
            <input class="input100" type="text" name="subject" placeholder="Assunto" v-model="subject" required>
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <textarea class="input100" name="message" placeholder="Mensagem" v-model="message" required></textarea>
            <span class="focus-input100"></span>
          </div>

          <div class="container-contact100-form-btn">
            <button class="contact100-form-btn">
              Enviar
            </button>
          </div>

          <div class="container-contact100-form-btn">
            <button class="contact100-form-btn" type="button" @click="showConfig = true">
              Configurar SMTP
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
      title: 'Enviado...',
      text: 'Por favor, aguarde',
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
      swal('Ops!', 'As configurações de SMTP não foram inseridas.', 'error')
    } else if (response === 'success') {
      swal('Sucesso!', 'O email foi enviado.', 'success')
    } else {
      swal('Ops!', 'Não foi possível enviar o email.', 'error')
    }
  }
}
</script>
