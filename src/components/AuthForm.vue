<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>LAN Chat</h1>
        <div class="auth-tabs">
          <button 
            :class="['tab-btn', isLogin ? 'active' : '']" 
            @click="isLogin = true"
          >
            Login
          </button>
          <button 
            :class="['tab-btn', !isLogin ? 'active' : '']" 
            @click="isLogin = false"
          >
            Register
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label>Username</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Enter your username"
            required
          >
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Enter your password"
            required
          >
        </div>

        <div v-if="!isLogin" class="form-group">
          <label>Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            required
          >
        </div>

        <div v-if="!isLogin" class="form-group">
          <label>Avatar</label>
          <select v-model="selectedAvatar" class="avatar-select">
            <option value="👤">👤 Default</option>
            <option value="🦊">🦊 Fox</option>
            <option value="🐱">🐱 Cat</option>
            <option value="🐶">🐶 Dog</option>
            <option value="🐼">🐼 Panda</option>
          </select>
        </div>

        <div class="error-message" v-if="error">{{ error }}</div>

        <button type="submit" class="submit-btn">
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AuthForm',
  emits: ['auth-success'],
  
  setup(props, { emit }) {
    const isLogin = ref(true);
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const selectedAvatar = ref('👤');
    const error = ref('');

    const handleSubmit = () => {
      error.value = '';

      if (!isLogin.value && password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        return;
      }

      if (password.value.length < 6) {
        error.value = 'Password must be at least 6 characters long';
        return;
      }

      // In a real app, you would make API calls here
      // For this demo, we'll simulate successful auth
      emit('auth-success', {
        username: username.value,
        avatar: selectedAvatar.value
      });
    };

    return {
      isLogin,
      username,
      password,
      confirmPassword,
      selectedAvatar,
      error,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.auth-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f7fafc;
  color: #4a5568;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #667eea;
  color: white;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

input, .avatar-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus, .avatar-select:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #5a67d8;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
  text-align: center;
}

.avatar-select {
  font-size: 1.2rem;
}
</style>