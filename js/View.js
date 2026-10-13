export class GameView {
    constructor() {
        this.telaMenu = document.getElementById('tela-menu');
        this.telaJogo = document.getElementById('tela-jogo');
        this.telaOverlay = document.getElementById('tela-overlay');
        this.telaFim = document.getElementById('tela-fim');
        this.telaCreditos = document.getElementById('tela-creditos');
        this.modalOpcoes = document.getElementById('modal-opcoes');
        this.canvas = document.getElementById('ecg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ecgPos = 0;
        this.audioCtx = null;
        this.synth = window.speechSynthesis;
    }

    bindMenus(handlerIniciar, handlerOpcoes) {
        document.getElementById('btn-iniciar').addEventListener('click', () => { this._initAudio(); handlerIniciar(); });
        document.getElementById('btn-opcoes').addEventListener('click', () => this.modalOpcoes.classList.remove('hidden'));

        document.getElementById('btn-fechar-opcoes').addEventListener('click', () => {
            const duracao = document.getElementById('input-duracao').value;
            handlerOpcoes(duracao);
            this.modalOpcoes.classList.add('hidden');
        });

        document.getElementById('input-fontsize').addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--font-scale', e.target.value);
        });

        if (document.getElementById('btn-creditos')) {
            document.getElementById('btn-creditos').addEventListener('click', () => this.mostrarTela('creditos'));
        }
        if (document.getElementById('btn-voltar-creditos')) {
            document.getElementById('btn-voltar-creditos').addEventListener('click', () => this.mostrarTela('menu'));
        }
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
        if (this.telaCreditos) this.telaCreditos.classList.add('hidden');

        if (nome === 'jogo') { this.telaJogo.classList.remove('hidden'); this.resizeCanvas(); }
        else if (nome === 'overlay') { this.telaOverlay.classList.remove('hidden'); }
        else if (nome === 'fim') { this.telaFim.classList.remove('hidden'); }
        else if (nome === 'menu') { this.telaMenu.classList.remove('hidden'); }
        else if (nome === 'creditos') { this.telaCreditos.classList.remove('hidden'); }
    }

    mostrarFimDeJogo(titulo, mensagem, xpFinal, icon, color) {
        this.synth.cancel();
        this.mostrarTela('fim');
        const tit = document.getElementById('fim-titulo');
        tit.innerText = titulo;
        tit.style.color = color;
        document.getElementById('fim-texto').innerText = mensagem;
        document.getElementById('fim-xp').innerText = xpFinal !== null ? `XP Final: ${xpFinal}` : '';
        document.getElementById('fim-icon').innerText = icon || "📋";
    }

    renderizarHUD(erros, maxErros, xp, nivel) {
        document.getElementById('hud-erros').innerText = `Erros: ${erros}/${maxErros}`;
        document.getElementById('hud-xp').innerText = `${xp} XP`;
        document.getElementById('hud-nivel').innerText = nivel;
    }

    renderizarPaciente(caso) {
        document.getElementById('pac-foto').src = caso.foto;
        document.getElementById('pac-nome').innerText = caso.perfil;
        document.getElementById('pac-fala').innerText = `"${caso.fala}"`;

        // AQUI: Insere as anotações visuais sem as ler em voz alta
        document.getElementById('pac-anotacoes').innerText = caso.anotacoes;

        document.querySelectorAll('.btn-aferir').forEach(b => { b.classList.remove('revelado'); b.querySelector('span').innerText = '?'; });

        // TTS narra estritamente a citação do paciente
        this.falarPaciente(caso.fala, caso.grave);
    }

    revelarSinal(btn, valor) {
        this.playTone(800, 'sine', 0.1); btn.classList.add('revelado'); btn.querySelector('span').innerText = valor;
    }

    mostrarFeedback(resultado, gameOver) {
        this.synth.cancel();
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

    falarPaciente(texto, grave) {
        this.synth.cancel();
        let ut = new SpeechSynthesisUtterance(texto);
        ut.lang = 'pt-PT';
        ut.rate = grave ? 0.85 : 0.95;
        ut.pitch = grave ? 0.8 : 1.0;
        this.synth.speak(ut);
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