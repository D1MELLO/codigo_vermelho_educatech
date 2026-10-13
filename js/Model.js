export class GameModel {
    constructor() {
        this.casosBase = [
            { foto: "https://i.pravatar.cc/150?img=11", perfil: "João da Silva, 58 anos", fala: "A dor é um aperto no peito, desce para o braço esquerdo e falta-me o ar. Não passa...", vitais: { pa: "168x96", fc: "108", fr: "26", sat: "91%" }, correta: "Vermelho", feedbackOk: "Correto. EAM com hipóxia (Saturação 91%) exige sala de emergência imediata.", feedbackErro: "Erro Crítico. Dor torácica com irradiação e dispneia (IAM) ignorada.", tempoBase: 100, grave: true },
            { foto: "https://i.pravatar.cc/150?img=32", perfil: "Maria (Filha relatando), 64 anos", fala: "A dor da minha mãe piorou muito! Foi para as costas, ela tem calafrios e está a vomitar de novo.", vitais: { pa: "104x68", fc: "124", fr: "28", sat: "93%" }, correta: "Laranja", feedbackOk: "Reclassificação correta. Piora da dor (9/10) com taquicardia e risco de abdome agudo/sépsis.", feedbackErro: "Atraso no atendimento. Sinais de alarme no abdome agudo agravados na espera.", tempoBase: 90, grave: true },
            { foto: "https://i.pravatar.cc/150?img=5", perfil: "Ana Sousa, 28 anos", fala: "Estou com dor de garganta há dois dias e um pouco de coriza. Não tive falta de ar.", vitais: { pa: "118x76", fc: "82", fr: "16", sat: "98%" }, correta: "Verde", feedbackOk: "Alocação eficiente. O quadro infeccioso leve sem dispneia é Pouco Urgente.", feedbackErro: "Desperdício de recursos de emergência para um quadro de IVAS leve.", tempoBase: 100, grave: false },
            { foto: "https://i.pravatar.cc/150?img=47", perfil: "Beatriz Silva, 16 anos", fala: "Não... consigo... puxar... o ar... ajudem...", vitais: { pa: "135x85", fc: "132", fr: "34", sat: "86%" }, correta: "Vermelho", feedbackOk: "Broncoespasmo severo reconhecido. Emergência vital.", feedbackErro: "Erro grave. Paciente em hipóxia severa.", tempoBase: 65, grave: true },
            { foto: "https://i.pravatar.cc/150?img=41", perfil: "Lúcia Fernandes, 68 anos", fala: "O meu rosto está estranho hoje de manhã e a minha perna direita não tem força...", vitais: { pa: "195x115", fc: "85", fr: "16", sat: "96%" }, correta: "Laranja", feedbackOk: "Via verde AVC ativada! Défice neurológico agudo.", feedbackErro: "Falha crítica. Tempo é cérebro.", tempoBase: 80, grave: true },
            { foto: "https://i.pravatar.cc/150?img=53", perfil: "Carlos Almeida, 45 anos", fala: "Uma dor terrível nas costas que vem para a frente.", vitais: { pa: "150x95", fc: "110", fr: "20", sat: "99%" }, correta: "Amarelo", feedbackOk: "Dor intensa mas sem risco de vida imediato.", feedbackErro: "Erro de prioridade.", tempoBase: 85, grave: false },
            { foto: "https://i.pravatar.cc/150?img=5", perfil: "Joana Matos, 25 anos", fala: "Virei o pé no passeio. Está muito inchado, mas consigo coxear.", vitais: { pa: "115x75", fc: "80", fr: "14", sat: "99%" }, correta: "Verde", feedbackOk: "Alocação eficiente. Pode aguardar.", feedbackErro: "Desperdício de recursos de emergência.", tempoBase: 90, grave: false },
            { foto: "https://i.pravatar.cc/150?img=68", perfil: "António Vieira, 72 anos", fala: "Tenho tido calafrios, febre... e estou meio confuso...", vitais: { pa: "90x55", fc: "125", fr: "26", sat: "91%" }, correta: "Laranja", feedbackOk: "Suspeita de Sépsis reconhecida.", feedbackErro: "O paciente entrou em choque sético na espera.", tempoBase: 70, grave: true },
            { foto: "https://i.pravatar.cc/150?img=49", perfil: "Marta Gomes, 30 anos", fala: "O meu coração está a disparar, formigueiro nas mãos... vou morrer!", vitais: { pa: "140x90", fc: "115", fr: "24", sat: "100%" }, correta: "Amarelo", feedbackOk: "Ansiedade bem classificada (Amarelo).", feedbackErro: "Ansiedade severa não pode ser menosprezada totalmente.", tempoBase: 85, grave: false },
            { foto: "https://i.pravatar.cc/150?img=15", perfil: "Tiago Mendes, 19 anos", fala: "Estou com a garganta a arranhar e tosse há três dias.", vitais: { pa: "120x80", fc: "75", fr: "16", sat: "98%" }, correta: "Verde", feedbackOk: "Quadro leve. Mantém o fluxo limpo.", feedbackErro: "Quadros leves sem febre são Verdes.", tempoBase: 100, grave: false }
        ];

        this.niveis = [
            { limite: 0, titulo: "Nvl 1: Estagiário" },
            { limite: 1000, titulo: "Nvl 2: Técnico de Emergência" },
            { limite: 2500, titulo: "Nvl 3: Mestre da Triagem" }
        ];

        this.tamanhoPlantao = 3;
        this.maxErros = 3; // Variável restaurada!
        this.casos = [];
        this.reset();
    }

    setTamanhoPlantao(tamanho) {
        this.tamanhoPlantao = parseInt(tamanho);
    }

    reset() {
        this.casoAtualIndex = 0;
        this.erros = 0;
        this.xp = 0;
        this.estabilidade = 100;

        let embaralhado = [...this.casosBase].sort(() => 0.5 - Math.random());
        this.casos = embaralhado.slice(0, this.tamanhoPlantao);
    }

    getNivelAtual() {
        let titulo = this.niveis[0].titulo;
        for (let i = this.niveis.length - 1; i >= 0; i--) {
            if (this.xp >= this.niveis[i].limite) return this.niveis[i].titulo;
        }
        return titulo;
    }

    getCasoAtual() { return this.casos[this.casoAtualIndex]; }

    isGameOver() { return this.erros >= this.maxErros; } // Usa a variável em vez de um número fixo

    isPlantaoConcluido() { return this.casoAtualIndex >= this.casos.length; }

    penalizarTempo(valor) { this.estabilidade = Math.max(0, this.estabilidade - valor); }

    avaliarDecisao(corEscolhida) {
        const caso = this.getCasoAtual();
        const acertou = (corEscolhida === caso.correta) || (caso.correta === "Laranja" && corEscolhida === "Vermelho");
        let ganhoXP = 0;

        if (acertou) {
            ganhoXP = Math.floor(this.estabilidade * 15);
            this.xp += ganhoXP;
        } else {
            this.erros++;
        }

        return { acertou, mensagem: acertou ? caso.feedbackOk : caso.feedbackErro, ganhoXP };
    }
}