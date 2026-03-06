<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import confetti from 'canvas-confetti';
import { poems } from './data/poems';
import type { Poem, UserConfig } from './types';

// Состояние
const randomIndex = Math.floor(Math.random() * poems.length);
const currentPoem = ref<Poem | null>(poems[randomIndex] as Poem | null);
const userName = ref<string>('Прекрасная Дама');
const isButtonVisible = ref(true);
const isBouquetVisible = ref(false);
const isCelebrating = ref(false);

// Список файлов букетов (автоматически обновляется)
const bouquetFiles = [
  'bouquet-1.jpg', 'bouquet-2.jpg', 'bouquet-3.jpg', 'bouquet-4.jpg', 'bouquet-5.jpg',
  'bouquet-6.jpg', 'bouquet-7.jpg', 'bouquet-8.jpg', 'bouquet-9.jpg', 'bouquet-10.jpg',
  'bouquet-11.jpg', 'bouquet-12.jpg', 'bouquet-13.jpg', 'bouquet-14.jpg'
];

// 3. Случайный букет
const randomFile = bouquetFiles[Math.floor(Math.random() * bouquetFiles.length)];
const bouquetUrl = computed(() => `bouquets/${randomFile}`);

// Логика получения имени и выбора стиха
onMounted(async () => {
  // 1. Определение имени по токену из URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    try {
      const response = await fetch('users.json');
      const users: UserConfig = await response.json();
      if (users[token]) {
        userName.value = users[token];
      }
    } catch (error) {
      console.error('Ошибка загрузки конфигурации пользователей:', error);
    }
  }
});


// Функция запуска фейерверков
const launchConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

// Обработка клика
const handleCelebrate = async () => {
  isButtonVisible.value = false;
  isCelebrating.value = true;
  
  launchConfetti();

  // Ждем завершения фейерверков (3 секунды)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  isCelebrating.value = false;
  isBouquetVisible.value = true;
};
</script>

<template>
  <div class="landing-container">
    <header class="header">
      <transition name="fade-in" appear>
        <h1 v-if="currentPoem" class="title">С 8 Марта, {{ userName }}!</h1>
      </transition>
    </header>

    <main class="content">
      <transition name="fade-in" appear>
        <div v-if="currentPoem" class="poem-card">
          <p class="poem-text">{{ currentPoem.text }}</p>
          <p v-if="currentPoem.author" class="poem-author">— {{ currentPoem.author }}</p>
        </div>
      </transition>

      <div class="action-area">
        <transition name="fade-in">
          <button 
            v-if="isButtonVisible" 
            @click="handleCelebrate" 
            class="btn-primary"
          >
            Тут твой букет
          </button>
        </transition>

        <transition name="fade-in">
          <div v-if="isBouquetVisible" class="bouquet-container">
            <img :src="bouquetUrl" alt="Ваш букет" class="bouquet-img" />
            <p class="bouquet-caption">Этот весенний букет для Вас!</p>
          </div>
        </transition>
      </div>
    </main>

    <footer class="footer">
      <p>&copy; 2025 С любовью к весне</p>
    </footer>
  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--soft-white) 0%, #fff0f3 100%);
}

.header {
  margin-top: 40px;
}

.title {
  font-size: 2.2rem;
  color: var(--accent-pink);
  margin-bottom: 20px;
  line-height: 1.2;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
}

.poem-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  border: 1px solid var(--soft-green);
}

.poem-text {
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
  font-style: italic;
}

.poem-author {
  margin-top: 15px;
  font-weight: 600;
  color: var(--primary-pink);
}

.action-area {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.bouquet-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bouquet-img {
  width: 280px;
  height: 280px;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
}

.bouquet-caption {
  margin-top: 20px;
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--accent-pink);
}

.footer {
  margin-bottom: 20px;
  font-size: 0.8rem;
  color: #aaa;
}

@media (max-width: 380px) {
  .title {
    font-size: 1.8rem;
  }
  .poem-text {
    font-size: 1rem;
  }
  .bouquet-img {
    width: 220px;
    height: 220px;
  }
}
</style>
