<template>
  <div :class="['message', isOwn ? 'own' : '']">
    <div class="message-avatar">{{ avatar }}</div>
    <div class="message-content">
      <div class="message-header">
        <span class="username">{{ username }}</span>
        <span class="time">{{ formattedTime }}</span>
      </div>
      <div class="message-text">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    username: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: () => new Date()
    },
    avatar: {
      type: String,
      default: '👤'
    },
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedTime() {
      return this.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }
};
</script>

<style scoped>
.message {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.message.own {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.message-content {
  background: white;
  padding: 0.75rem;
  border-radius: 12px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.own .message-content {
  background: #e3f2fd;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.username {
  font-weight: 600;
  color: #2d3748;
}

.time {
  color: #718096;
}

.message-text {
  color: #4a5568;
  line-height: 1.4;
}
</style>