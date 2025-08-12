// voice.js
// Reconocimiento de voz para navegar la Biblia

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('voiceBtn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btn.style.display = 'none';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  const status = document.getElementById('voiceStatus');


  btn.addEventListener('click', () => {
    recognition.start();
  });

  recognition.addEventListener('start', () => {
    btn.classList.add('listening');
    status.textContent = 'Escuchando...';
  });

  recognition.addEventListener('end', () => {
    btn.classList.remove('listening');
    if (status.textContent === 'Escuchando...') {
      status.textContent = '';
    }
  });

  recognition.addEventListener('result', (e) => {
    status.textContent = 'Procesando...';
    const text = e.results[0][0].transcript.toLowerCase();
    handleCommand(text);
    status.textContent = '';
  });

  recognition.addEventListener('error', () => {
    btn.classList.remove('listening');
    status.textContent = '';

  function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function handleCommand(text) {
    const normText = normalize(text);
    const numbers = normText.match(/\d+/g) || [];
    const bookNames = getBooks().map(b => normalize(b.getAttribute('n').toLowerCase()));
    const bookIdx = bookNames.findIndex(name => normText.includes(name));
    if (bookIdx === -1) return;
    const chapter = numbers[0] ? Math.max(0, parseInt(numbers[0], 10) - 1) : 0;
    const verse = numbers[1] ? parseInt(numbers[1], 10) : null;

    bs.value = bookIdx;
    fillChapters();
    cs.value = chapter;
    initBuffer(bookIdx, chapter);
    fillVerses(bookIdx, chapter);
    if (verse) {
      vs.value = verse;
      const el = document.querySelector(`[data-verse="${verse}"]`);
      if (el) {
        const hdrH = document.getElementById('controls').offsetHeight;
        contentDiv.scrollTop = el.offsetTop - hdrH - 10;
      }
      updateURL(bookIdx, chapter, verse);
    } else {
      updateURL(bookIdx, chapter, vs.value);
    }
  }
});
