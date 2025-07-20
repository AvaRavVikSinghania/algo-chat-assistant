document.addEventListener('DOMContentLoaded', () => {
  const chatbotMessages = document.getElementById('chatbot-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  const sendMessage = async () => {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user-message');
    userInput.value = '';

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      appendMessage(data.reply, 'bot-message');
    } catch (err) {
      console.error(err);
      appendMessage('Something went wrong. Please try again.', 'bot-message');
    }
  };

  const appendMessage = (msg, className) => {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.innerText = msg;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});
