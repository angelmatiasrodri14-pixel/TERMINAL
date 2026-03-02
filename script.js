let currentVoltage = 0;
let activeNodes = new Set();

function check(level, correctAnswer) {
    const inputElement = document.getElementById(`ans${level}`);
    const userInput = inputElement.value.toUpperCase().trim();
    const feedback = document.getElementById('feedback-msg');

    if (userInput === correctAnswer) {
        // --- RETROALIMENTACIÓN DE ÉXITO ---
        feedback.innerText = ">>> ACCESO AUTORIZADO. CARGANDO DATOS...";
        feedback.style.color = "var(--neon-green)";
        
        // Limpiamos el estilo por si venía de un error previo
        inputElement.style.borderColor = "var(--neon-green)";

        setTimeout(() => {
            showNextPage(level);
            feedback.innerText = "";
        }, 1000);
    } else {
        // --- RETROALIMENTACIÓN DE ERROR (Mejorada) ---
        feedback.innerText = ">>> ERROR: CREDENCIALES INVÁLIDAS O ACCESO DENEGADO.";
        feedback.style.color = "var(--alert-red)";
        
        // Efecto visual: Borde rojo y vibración 
        inputElement.classList.add('error');
        inputElement.style.borderColor = "var(--alert-red)";

        // Quitamos el efecto después de 400ms para que pueda repetirse si vuelve a fallar [cite: 435]
        setTimeout(() => {
            inputElement.classList.remove('error');
            // Opcional: puedes dejar el borde rojo hasta que el usuario vuelva a escribir
        }, 400);
    }
}

function showNextPage(current) {
    document.getElementById(`page${current}`).classList.remove('active');
    const next = current + 1;
    const nextPage = document.getElementById(`page${next}`);
    
    if (nextPage) {
        nextPage.classList.add('active');
        // Actualizar el tracker solo si es un nivel
        if (next <= 5) {
            document.getElementById('p-tracker').innerText = `ESTADO: NIVEL ${next} / 5`;
        } else {
            document.getElementById('p-tracker').innerText = `ESTADO: COMPLETO`;
        }
    }
}

function toggleNode(id, value) {
    const btn = document.getElementById(`n${id}`);
    if (activeNodes.has(id)) {
        activeNodes.delete(id);
        currentVoltage -= value;
        btn.classList.remove('on');
    } else {
        activeNodes.add(id);
        currentVoltage += value;
        btn.classList.add('on');
    }
    document.getElementById('v-val').innerText = currentVoltage;
    document.getElementById('v-bar').style.width = Math.min((currentVoltage / 120) * 100, 100) + "%";
    document.getElementById('ans3').value = (currentVoltage === 120) ? "ESTABLE" : "SISTEMA BLOQUEADO";
}

function showHint(msg) {
    alert("Pista: " + msg);
}

let lives = 3; // Sistema de vidas

function updateLivesUI() {
    const icons = "█".repeat(lives) + "░".repeat(3 - lives);
    document.getElementById('heart-icons').innerText = icons;
    if (lives === 1) document.getElementById('lives-tracker').style.color = "var(--alert-red)";
}

function check(level, correctAnswer) {
    const inputElement = document.getElementById(`ans${level}`);
    const userInput = inputElement.value.toUpperCase().trim();
    const feedback = document.getElementById('feedback-msg');

    if (userInput === correctAnswer) {
        feedback.innerText = ">>> ACCESO AUTORIZADO.";
        feedback.style.color = "var(--neon-green)";
        
        setTimeout(() => {
            // En caso de que sea el ultimo nivel, enviar a la descarga.
            if (level === 5) {
                startDownloadSequence();
            } else {
                showNextPage(level);
            }
            feedback.innerText = "";
        }, 1000);
    } else {
        lives--;
        updateLivesUI();

        if (lives <= 0) {
            // Pantallazo
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-gameover').classList.add('active');
            document.getElementById('p-tracker').innerText = "ESTADO: Despidan al agente actual";
        } else {
            feedback.innerText = `>>> ERROR. INTENTOS RESTANTES: ${lives}`;
            feedback.style.color = "var(--alert-red)";
            inputElement.classList.add('error');
            setTimeout(() => inputElement.classList.remove('error'), 400);
        }
    }
}

function startDownloadSequence() {
    // Ocultar nivel 5 y mostrar pantalla de descarga
    document.getElementById('page5').classList.remove('active');
    document.getElementById('page-download').classList.add('active');
    document.getElementById('p-tracker').innerText = "ESTADO: DESCARGANDO...";

    let progress = 0;
    const bar = document.getElementById('download-bar');
    const status = document.getElementById('download-status');

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 2; // Progreso aleatorio
        if (progress > 100) progress = 100;
        
        bar.style.width = progress + "%";
        status.innerText = progress + "% COMPLETO";

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('page-download').classList.remove('active');
                document.getElementById('page6').classList.add('active'); // Mostrar expediente
                document.getElementById('p-tracker').innerText = "ESTADO: COMPLETO";
            }, 1000);
        }
    }, 150); // Velocidad de la descarga
}