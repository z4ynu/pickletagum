const form = document.querySelector('#assistant-form');
const input = document.querySelector('#assistant-input');
const messages = document.querySelector('#assistant-messages');
const submit = document.querySelector('#assistant-submit');
const history = [];

function addMessage(text, role) {
  const item = document.createElement('div');
  item.className = `assistant__message assistant__message--${role}`;
  item.textContent = text;
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
  return item;
}

async function askAssistant(question) {
  addMessage(question, 'user');
  history.push({ role: 'user', content: question });
  const pending = addMessage('Checking public court information…', 'bot');
  submit.disabled = true;
  input.disabled = true;

  try {
    const response = await fetch('/api/availability-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, history: history.slice(0, -1).slice(-6) }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The assistant is unavailable right now.');
    pending.textContent = data.answer;
    history.push({ role: 'assistant', content: data.answer });
  } catch (error) {
    pending.textContent = error.message || 'The assistant is unavailable right now. Please use a court’s official booking page instead.';
  } finally {
    submit.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  askAssistant(question);
});

document.querySelectorAll('[data-assistant-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.dataset.assistantPrompt;
    if (question) askAssistant(question);
  });
});
