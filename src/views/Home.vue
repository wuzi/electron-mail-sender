<template>
  <div class="home bg-contact100">
    <div class="container-contact100">
      <div class="wrap-contact100">
        <div class="contact100-pic">
          <img src="~@/assets/images/img-01.png" alt="IMG">
        </div>

        <form class="contact100-form validate-form">
          <span class="contact100-form-title">
            Enviar email
          </span>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="name" placeholder="Nome">
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-user" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="email" placeholder="Email">
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="fa fa-envelope" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <textarea class="input100" name="message" placeholder="Message"></textarea>
            <span class="focus-input100"></span>
          </div>

          <div class="container-contact100-form-btn">
            <button class="contact100-form-btn">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({})
export default class Home extends Vue {}
</script>
