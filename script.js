const MISTRAL_API_KEY = 'zeMpLeRojAzTnSam8U5d6RRQt0sSNGx4';  // Замените на ваш реальный API ключ
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'; // URL API

// Хранение истории чата на клиенте (ограничим 5 последними сообщениями)
let chatHistory = [];

// Функция для отправки сообщений в Мистрал
async function sendMessage() {
  const userMessage = document.getElementById('userInput').value;
  if (!userMessage.trim()) return;

  // Добавляем сообщение пользователя в историю
  chatHistory.push({ role: 'user', content: userMessage });

  // Показываем сообщение пользователя в чате
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `
    <div class="chat-message user-message">
      ${userMessage}
    </div>
  `;

  // Отправляем запрос к API Мистрала
  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-tiny',  // Выберите модель, которую хотите использовать
        messages: buildMessages(),
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Извлекаем ответ от Мистрала
    const botReply = data.choices && data.choices[0] ? data.choices[0].message.content : 'Извините, я не понял ваш запрос.';
    
    // Показываем ответ бота в чате
    chatBox.innerHTML += `
      <div class="chat-message bot-message">
        ${botReply}
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;  // Прокручиваем вниз
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
    const botReply = 'Произошла ошибка. Попробуйте позже.';
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `
      <div class="chat-message bot-message">
        ${botReply}
      </div>
    `;
  }

  // Очистить поле ввода
  document.getElementById('userInput').value = '';
}

// Функция для сборки сообщений с учетом истории
function buildMessages() {
  // Берем последние 5 сообщений (ограничиваем историю)
  const history = chatHistory.slice(-5);
  
  // Формируем сообщения с контекстом
  let messages = [];
  history.forEach(msg => {
    messages.push({ role: msg.role, content: msg.content });
  });
  
  return messages;
}

// Обработчик нажатия Enter для отправки сообщения
document.getElementById('userInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
