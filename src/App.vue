<template>
  <div class="app-container">
    <AuthForm 
      v-if="!currentUser" 
      @auth-success="handleAuthSuccess"
    />

    <div v-else class="chat-container">
      <div class="sidebar">
        <div class="user-profile">
          <div class="avatar">{{ currentUser.avatar }}</div>
          <div class="username">{{ currentUser.username }}</div>
        </div>
        
        <div class="online-users">
          <h3>Online Users</h3>
          <ul>
            <li v-for="user in users" :key="user.username">
              <span class="user-avatar">{{ user.avatar }}</span>
              {{ user.username }}
            </li>
          </ul>
        </div>
      </div>

      <div class="main">
        <div class="messages" ref="messagesContainer">
          <ChatMessage
            v-for="(msg, index) in messages"
            :key="index"
            :username="msg.username"
            :message="msg.message"
            :timestamp="msg.timestamp"
            :avatar="msg.avatar"
            :is-own="msg.username === currentUser.username"
          />
        </div>

        <div class="input-area">
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
          >
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import { ref, onMounted, nextTick } from 'vue';
import AuthForm from './components/AuthForm.vue';
import ChatMessage from './components/ChatMessage.vue';

export default {
  components: {
    AuthForm,
    ChatMessage
  },

  setup() {
    const socket = io('http://localhost:3000');
    const currentUser = ref(null);
    const users = ref([]);
    const messages = ref([]);
    const newMessage = ref('');
    const messagesContainer = ref(null);

    const scrollToBottom = async () => {
      await nextTick();
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };

    const handleAuthSuccess = (user) => {
      currentUser.value = user;
      socket.emit('join', { username: user.username, avatar: user.avatar });
    };

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        socket.emit('message', {
          message: newMessage.value,
          avatar: currentUser.value.avatar
        });
        newMessage.value = '';
      }
    };

    onMounted(() => {
      socket.on('userJoined', ({ users: userList }) => {
        users.value = userList;
      });

      socket.on('userLeft', ({ users: userList }) => {
        users.value = userList;
      });

      socket.on('message', (msg) => {
        messages.value.push({
          ...msg,
          timestamp: new Date()
        });
        scrollToBottom();
      });
    });

    return {
      currentUser,
      users,
      messages,
      newMessage,
      messagesContainer,
      handleAuthSuccess,
      sendMessage
    };
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  height: 100vh;
}

.chat-container {
  height: 100vh;
  display: flex;
  background: #f7fafc;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.user-profile {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.username {
  font-weight: 600;
  color: #2d3748;
}

.online-users {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.online-users h3 {
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.online-users ul {
  list-style: none;
}

.online-users li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #4a5568;
}

.user-avatar {
  font-size: 1.2rem;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-area {
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-area input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.input-area input:focus {
  outline: none;
  border-color: #667eea;
}

.input-area button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.input-area button:hover {
  background: #5a67d8;
}
</style>