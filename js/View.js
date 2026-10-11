export class GameView {
    constructor() {
        this.telaMenu = document.getElementById('tela-menu');
        this.telaJogo = document.getElementById('tela-jogo');
        this.telaOverlay = document.getElementById('tela-overlay');
        this.telaFim = document.getElementById('tela-fim');
        this.modalOpcoes = document.getElementById('modal-opcoes');
        this.canvas = document.getElementById('ecg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ecgPos = 0;
        this.audioCtx = null;
        this.audioVoz = null;
        this.synth = window.speechSynthesis;
    }

    bindMenus(handlerIniciar, handlerOpcoes) {
        document.getElementById('btn-iniciar').addEventListener('click', () => { this._initAudio(); handlerIniciar(); });
        document.getElementById('btn-opcoes').addEventListener('click', () => this.modalOpcoes.classList.remove('hidden'));

        document.getElementById('btn-fechar-opcoes').addEventListener('click', () => {
            const key = document.getElementById('input-apikey').value;
            const duracao = document.getElementById('input-duracao').value; // Capta a nova duração
            handlerOpcoes(key, duracao);
            this.modalOpcoes.classList.add('hidden');
        });

        document.getElementById('input-fontsize').addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--font-scale', e.target.value);
        });
        document.getElementById('btn-creditos').addEventListener('click', () => alert("Desenvolvido para Ensino Técnico."));
    }

    bindAcoes(handlerAferir, handlerClassificar, handlerProximo) {
        document.querySelectorAll('.btn-aferir').forEach(btn => {
            btn.addEventListener('click', () => { if (!btn.classList.contains('revelado')) handlerAferir(btn.dataset.sinal, btn); });
        });
        document.querySelectorAll('.btn-carimbo').forEach(btn => {
            btn.addEventListener('click', () => handlerClassificar(btn.dataset.cor));
        });
        document.getElementById('btn-continuar').addEventListener('click', handlerProximo);
    }

    bindFimDeJogo(handlerVoltarMenu) {
        document.getElementById('btn-voltar-menu').addEventListener('click', handlerVoltarMenu);
        document.getElementById('btn-sair').addEventListener('click', handlerVoltarMenu);
    }

    mostrarTela(nome) {
        this.telaMenu.classList.add('hidden');
        this.telaJogo.classList.add('hidden');
        this.telaOverlay.classList.add('hidden');
        this.telaFim.classList.add('hidden');

        if (nome === 'jogo') { this.telaJogo.classList.remove('hidden'); this.resizeCanvas(); }
        else if (nome === 'overlay') { this.telaOverlay.classList.remove('hidden'); }
        else if (nome === 'fim') { this.telaFim.classList.remove('hidden'); }
        else if (nome === 'menu') { this.telaMenu.classList.remove('hidden'); }
    }

    mostrarFimDeJogo(titulo, mensagem, xpFinal, icon, color) {
        this.synth.cancel();
        if (this.audioVoz) this.audioVoz.pause();
        this.mostrarTela('fim');
        const tit = document.getElementById('fim-titulo');
        tit.innerText = titulo;
        tit.style.color = color;
        document.getElementById('fim-texto').innerText = mensagem;
        document.getElementById('fim-xp').innerText = xpFinal !== null ? `XP Final: ${xpFinal}` : '';
        document.getElementById('fim-icon').innerText = icon || "📋";
    }

    // AQUI: Força a atualização dos erros, XP e nível na tela
    renderizarHUD(erros, xp, nivel) {
        document.getElementById('hud-erros').innerText = `Auditorias: ${erros}/3`;
        document.getElementById('hud-xp').innerText = `${xp} XP`;
        document.getElementById('hud-nivel').innerText = nivel;
    }

    renderizarPaciente(caso, apiKey) {
        document.getElementById('pac-foto').src = caso.foto;
        document.getElementById('pac-nome').innerText = caso.perfil;
        document.getElementById('pac-fala').innerText = `"${caso.fala}"`;
        document.querySelectorAll('.btn-aferir').forEach(b => { b.classList.remove('revelado'); b.querySelector('span').innerText = '?'; });
        this.falarPacienteIA(caso.fala, caso.vozId, apiKey);
    }

    revelarSinal(btn, valor) {
        this.playTone(800, 'sine', 0.1); btn.classList.add('revelado'); btn.querySelector('span').innerText = valor;
    }

    mostrarFeedback(resultado, gameOver) {
        this.synth.cancel(); if (this.audioVoz) this.audioVoz.pause();
        this.mostrarTela('overlay');
        document.getElementById('fb-texto').innerText = resultado.mensagem;
        const titulo = document.getElementById('fb-titulo');
        const icone = document.getElementById('fb-icon');

        if (resultado.acertou) {
            this.playTone(523, 'sine', 0.1); setTimeout(() => this.playTone(659, 'sine', 0.2), 100);
            icone.innerText = "✅";
            titulo.innerText = "FICHEIRO APROVADO"; titulo.style.color = "var(--verde)";
            document.getElementById('fb-xp').innerText = `+${resultado.ganhoXP} XP`;
        } else {
            this.playTone(150, 'sawtooth', 0.4, 0.1);
            document.getElementById('game-app').classList.remove('shake'); void document.getElementById('game-app').offsetWidth; document.getElementById('game-app').classList.add('shake');
            icone.innerText = gameOver ? "🚨" : "❌";
            titulo.innerText = gameOver ? "AUDITORIA MÉDICA ACIONADA" : "FALHA DE PROTOCOLO";
            titulo.style.color = "var(--vermelho)";
            document.getElementById('fb-xp').innerText = "";
            document.getElementById('btn-continuar').innerText = gameOver ? "Reiniciar Turno" : "Próximo Ficheiro";
        }
    }

    async falarPacienteIA(texto, vozId, apiKey) {
        this.synth.cancel(); if (this.audioVoz) this.audioVoz.pause();
        if (apiKey && apiKey.trim() !== "") {
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vozId}`, {
                    method: 'POST', headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: texto, model_id: "eleven_multilingual_v2" })
                });
                if (response.ok) {
                    const blob = await response.blob(); this.audioVoz = new Audio(URL.createObjectURL(blob));
                    this.audioVoz.play(); return;
                }
            } catch (e) { console.warn("API falhou, usando offline."); }
        }
        let ut = new SpeechSynthesisUtterance(texto); ut.lang = 'pt-PT'; ut.rate = 0.9; this.synth.speak(ut);
    }

    _initAudio() { if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (this.audioCtx.state === 'suspended') this.audioCtx.resume(); }
    playTone(f, t, d) {
        if (!this.audioCtx) return; let o = this.audioCtx.createOscillator(), g = this.audioCtx.createGain();
        o.type = t; o.frequency.value = f; g.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + d); o.connect(g); g.connect(this.audioCtx.destination); o.start(); o.stop(this.audioCtx.currentTime + d);
    }

    resizeCanvas() { if (!this.canvas.parentElement) return; this.canvas.width = this.canvas.parentElement.clientWidth; this.canvas.height = this.canvas.parentElement.clientHeight; }
    desenharECG(estabilidade) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000'; this.ctx.fillRect(this.ecgPos, 0, 10, this.canvas.height);
        let cor = estabilidade > 60 ? '#27ae60' : (estabilidade > 30 ? '#f39c12' : '#c0392b');
        document.getElementById('monitor-txt').style.color = cor; document.getElementById('monitor-txt').innerText = Math.max(0, Math.floor(estabilidade));
        this.ctx.beginPath(); this.ctx.strokeStyle = cor; this.ctx.lineWidth = 2;
        let yBase = this.canvas.height / 2, x = this.ecgPos; this.ctx.moveTo(x - 2, yBase);
        if (x % (estabilidade < 30 ? 60 : 120) === 0 && estabilidade > 0) {
            this.playTone(estabilidade < 30 ? 600 : 400, 'sine', 0.1);
            this.ctx.lineTo(x + 5, yBase - 10); this.ctx.lineTo(x + 10, yBase + 30); this.ctx.lineTo(x + 15, yBase - 40); this.ctx.lineTo(x + 20, yBase + 10); this.ctx.lineTo(x + 25, yBase); this.ecgPos += 25;
        } else { this.ctx.lineTo(x, yBase + (estabilidade <= 0 ? 0 : Math.random() * 4 - 2)); this.ecgPos += 2; }
        this.ctx.stroke(); if (this.ecgPos > this.canvas.width) this.ecgPos = 0;
    }
}