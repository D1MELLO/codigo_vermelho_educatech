export class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.timerQueda = null;
        this.ecgLoop = null;

        this.view.bindMenus(
            this.iniciarPlantao.bind(this),
            (duracao) => {
                this.model.setTamanhoPlantao(duracao);
            }
        );
        this.view.bindAcoes(
            this.handleAfericao.bind(this),
            this.handleClassificacao.bind(this),
            this.handleProximoTurno.bind(this)
        );
        this.view.bindFimDeJogo(this.voltarAoMenu.bind(this));
    }

    iniciarPlantao() {
        this.model.reset();
        this.view.mostrarTela('jogo');
        this.iniciarTurno();
        this.loopECG();
    }

    iniciarTurno() {
        if (this.model.isPlantaoConcluido()) {
            this.encerrarRotina("EXPEDIENTE CONCLUÍDO", "Bom trabalho! O plantão acabou. Os ficheiros foram submetidos com sucesso.", "var(--verde)", "📁");
            return;
        }

        const caso = this.model.getCasoAtual();
        this.model.estabilidade = 100;

        this.view.renderizarPaciente(caso);

        // Passa os 4 parâmetros: Erros, MaxErros, XP e Nível
        this.view.renderizarHUD(this.model.erros, this.model.maxErros, this.model.xp, this.model.getNivelAtual());

        clearInterval(this.timerQueda);
        let queda = 100 / caso.tempoBase;
        this.timerQueda = setInterval(() => {
            this.model.penalizarTempo(queda);
            if (this.model.estabilidade <= 0) {
                this.handleClassificacao("Timeout");
            }
        }, 1000);
    }

    loopECG() {
        this.view.desenharECG(this.model.estabilidade);
        this.ecgLoop = setTimeout(() => this.loopECG(), this.model.estabilidade < 30 ? 16 : 24);
    }

    handleAfericao(sinalKey, btnElement) {
        this.model.penalizarTempo(8);
        this.view.revelarSinal(btnElement, this.model.getCasoAtual().vitais[sinalKey]);
    }

    handleClassificacao(corEscolhida) {
        clearInterval(this.timerQueda);
        const resultado = this.model.avaliarDecisao(corEscolhida);
        const gameOver = this.model.isGameOver();

        if (gameOver) this.model.estabilidade = 0;

        // Passa os 4 parâmetros: Erros, MaxErros, XP e Nível
        this.view.renderizarHUD(this.model.erros, this.model.maxErros, this.model.xp, this.model.getNivelAtual());

        if (gameOver) {
            this.encerrarRotina("AUDITORIA MÉDICA", "Atingiu o limite de erros críticos. O departamento será fechado para investigação.", "var(--vermelho)", "🚨");
        } else {
            this.view.mostrarFeedback(resultado, false);
        }
    }

    handleProximoTurno() {
        this.model.casoAtualIndex++;
        this.view.mostrarTela('jogo');
        this.iniciarTurno();
    }

    encerrarRotina(titulo, msg, color, icon) {
        clearInterval(this.timerQueda);
        clearTimeout(this.ecgLoop);
        this.view.mostrarFimDeJogo(titulo, msg, this.model.xp, icon, color);
    }

    voltarAoMenu() {
        clearInterval(this.timerQueda);
        clearTimeout(this.ecgLoop);
        this.model.reset();
        this.view.mostrarTela('menu');
    }
}