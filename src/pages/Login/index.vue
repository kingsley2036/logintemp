<template>
  <div class="dialog-container">
    <div class="mask"></div>
    <div class="login-dialog">
      <div class="login-title">
        <h3>登录</h3>
      </div>
      <div class="message" v-if="errorMessage" v-text="errorMessage"></div>
      <div class="row">
        <span class="field-title"><v-icon name="user" /> 账号</span>
        <input ref="accountInput" v-model="login.account" @keyup.enter="handleEnter" placeholder="请输入账号">
      </div>
      <div class="row">
        <span class="field-title"><v-icon name="key" /> 密码</span>
        <input ref="passwordInput" type="password" v-model="login.password" @keyup.enter="handleEnter" placeholder="请输入密码">
      </div>
      <div class="row">
        <button @click="handleLogin">登录</button>
      </div>
    </div>
  </div>
</template>
<script>
import { saveContext } from '@/api/context'
import { login } from '@/api/sys/login'

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      login: {
        account: null,
        password: null
      },
      errorMessage: null
    }
  },
  methods: {
    handleEnter() {
      const accountInput = document.activeElement
      switch (document.activeElement) {
        case this.$refs.accountInput:
          this.$refs.passwordInput.focus()
          break
        case this.$refs.passwordInput:
          this.handleLogin()
          break
        default:
          this.$refs.accountInput.focus()
      }
    },
    handleLogin() {
      login(this.login).then(loginInfo => {
        window.context.login = loginInfo
        saveContext(window.context)
        this.$router.push('/')
      }).catch(reason => {
        console.log("login failed", reason)
        this.errorMessage = reason.message || '登录失败'
      })
    }
  }
}
</script>
<style scoped>
.dialog-container {
  display: block;
  position: absolute;
  width:  0;
  height: 0;
  left: 50%;
  top: 35%;
  overflow: visible;
  z-index: 2000;
}
.login-dialog {
  display: block;
  position: relative;
  top: 30%;
  width: 4rem;
  height: auto;
  left: -2rem;
  top: -1rem;
  font-size: 0.13rem;
  border: solid 1pt #CCC;
  background-color: lightgray;
}
.message {
  color: red;
}
.field-title {
  display: inline-block;
  width: 0.5rem;
  font-size: 12pt;
  padding-right: 8pt;
}
.row {
  display: block;
  margin: 8pt auto;
}
.row input, .row button {
  font-size: 12pt;
  padding: 4pt;
}
</style>