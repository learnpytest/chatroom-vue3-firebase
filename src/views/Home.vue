<template>
  <div>
    <div class="login" v-if="!store.currentUser.email">
      <form action="" class="form login__form" @submit.stop.prevent="Login">
        <h2>Chatbox</h2>
        <div class="group">
          <label for="username" name="username" class="username"
            >Username</label
          >
          <input
            type="text"
            id="username"
            placeholder="Please enter your username"
            v-model="loginUserName"
          />
        </div>
        <div class="group">
          <label for="email" name="email" class="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Please enter your email"
            v-model="loginUserEmail"
          />
        </div>
        <div class="btn-group">
          <button class="btn" type="submit">Login</button>
        </div>
      </form>
    </div>
    <div class="view" v-else>
      <header>
        <h1>Welcom, {{ store.currentUser.name }}</h1>
        <button class="btn" type="submit" @click.stop.prevent="Logout">
          Logout
        </button>
      </header>
      <section class="view__chatbox dialogue">
        <div
          type="text"
          :class="[
            'window',
            'user',
            { remote: !message.isLocalUser },
            { local: message.isLocalUser },
          ]"
          v-for="message in store.messages"
          :key="message.key"
        >
          <div class="avatar">
            <div class="photo">
              <img
                src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt="avatar photo"
              />
            </div>
            <div class="username">
              {{ message.username }}
            </div>
          </div>
          <div class="message">
            {{ message.content }}
          </div>
        </div>
      </section>
      <footer class="view__footer">
        <form class="form view__form" @submit.stop.prevent="sendMessage">
          <input
            type="text"
            name="view__message"
            for="view__message"
            class="view__message"
            placeholder="Please enter your message"
            v-model="inputMessage"
          />
          <button type="submit" class="btn">Send</button>
        </form>
      </footer>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import '../config/database.js'
import {
  getDatabase,
  ref as dbRef,
  onValue,
  update,
  push,
  child
} from 'firebase/database'

const db = getDatabase()

export default {
  name: 'Login',
  setup () {
    const loginUserName = ref('')
    const loginUserEmail = ref('')
    const inputMessage = ref('')
    const store = reactive({
      currentUser: { name: '', email: '' },
      messages: []
    })

    onMounted(() => {
      onValue(dbRef(db, '/messages/'), (snapshot) => {
        const data = snapshot.val()
        const payloads = []
        Object.keys(data).forEach((key) => {
          payloads.push({
            id: key,
            username: data[key] ? data[key].username : '',
            email: data[key] ? data[key].email : '',
            content: data[key] ? data[key].message : ''
          })
        })
        store.messages = payloads
      })
    })

    // some functions
    const Login = () => {
      if (!loginUserName.value || !loginUserEmail.value) return
      store.currentUser.name = loginUserName.value
      store.currentUser.email = loginUserEmail.value
      loginUserName.value = ''
      loginUserEmail.value = ''
      store.messages = store.messages.map((msg) => {
        return { ...msg, isLocalUser: store.currentUser.email === msg.email }
      })
    }

    const Logout = () => {
      store.currentUser = {}
    }
    // const messageRef = app.database().ref("message");
    const sendMessage = () => {
      if (!inputMessage.value) return

      // todo user ID
      async function postNewMessage () {
        const payload = {
          username: store.currentUser.name,
          email: store.currentUser.email,
          message: inputMessage.value
        }
        // get key for new message
        const newMessageKey = await push(child(dbRef(db), '/messages/')).key
        // write data
        const updates = {}
        updates['/messages/' + newMessageKey] = payload
        return await update(dbRef(db), updates)
      }

      postNewMessage()
      inputMessage.value = ''
    }

    return {
      loginUserName,
      loginUserEmail,
      Login,
      store,
      Logout,
      inputMessage,
      sendMessage
    }
  }
}
</script>
