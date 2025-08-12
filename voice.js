// voice.js
// Reconocimiento de voz para navegar la Biblia

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('voiceBtn');
  const status = document.getElementById('voiceStatus');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btn.style.display = 'none';
    status.textContent = 'No soportado';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let listening = false;

  btn.addEventListener('click', () => {
    if (listening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        // Ignorar errores por llamadas consecutivas a start()
      }
    }
  });

  recognition.addEventListener('start', () => {
    listening = true;
    btn.classList.add('listening');
    status.textContent = 'Escuchando...';
  });

  recognition.addEventListener('result', e => {
    status.textContent = 'Procesando...';
    const text = e.results[0][0].transcript.toLowerCase();
    handleCommand(text);
  });

  recognition.addEventListener('end', () => {
    btn.classList.remove('listening');
    listening = false;
    if (status.textContent === 'Procesando...') {
      status.textContent = 'Listo';
    } else {
      status.textContent = 'Detenido';
    }
    setTimeout(() => {
      if (!listening) status.textContent = '';
    }, 2000);
  });

  recognition.addEventListener('error', () => {
    btn.classList.remove('listening');
    listening = false;
    status.textContent = 'Error';
    setTimeout(() => {
      if (!listening) status.textContent = '';
    }, 2000);
  });

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
