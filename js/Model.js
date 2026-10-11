export class GameModel {
    constructor() {
        // Banco de dados mestre com todos os casos
        this.casosBase = [
            { foto: "https://i.pravatar.cc/150?img=11", perfil: "José Ribeiro, 55 anos", fala: "A dor no peito é insuportável, está a descer para o braço esquerdo...", vozId: "pNInz6obbf5AWCGq2HKx", vitais: { pa: "160x100", fc: "115", fr: "24", sat: "93%" }, correta: "Vermelho", feedbackOk: "Processo carimbado. Suspeita de EAM detetada a tempo.", feedbackErro: "Falha na triagem. Sinais de EAM ignorados.", tempoBase: 100, grave: true },
            { foto: "https://i.pravatar.cc/150?img=32", perfil: "Ana Sofia, 22 anos", fala: "Dói-me muito a cabeça... e não consigo dobrar o pescoço...", vozId: "EXAVITQu4vr4xnSDxMaL", vitais: { pa: "110x70", fc: "105", fr: "18", sat: "98%" }, correta: "Laranja", feedbackOk: "Isolamento aprovado. Possível meningite identificada.", feedbackErro: "Atraso no atendimento. Sinais neurológicos agravados na espera.", tempoBase: 90, grave: true },
            { foto: "https://i.pravatar.cc/150?img=12", perfil: "Mário Costa, Acidente", fala: "Está tudo escuro... que frio... ajudem-me...", vozId: "pNInz6obbf5AWCGq2HKx", vitais: { pa: "80x50", fc: "135", fr: "28", sat: "88%" }, correta: "Vermelho", feedbackOk: "Choque hipovolémico estabilizado. Boa gestão do trauma.", feedbackErro: "Mortalidade evitável registada. O paciente entrou em colapso.", tempoBase: 60, grave: true },
            { foto: "https://i.pravatar.cc/150?img=47", perfil: "Beatriz Silva, 16 anos", fala: "Não... consigo... respirar... falta... ar...", vozId: "EXAVITQu4vr4xnSDxMaL", vitais: { pa: "125x85", fc: "130", fr: "32", sat: "88%" }, correta: "Vermelho", feedbackOk: "Broncoespasmo severo reconhecido. Emergência vital.", feedbackErro: "Erro grave. Paciente em hipóxia severa.", tempoBase: 65, grave: true },
            { foto: "https://i.pravatar.cc/150?img=41", perfil: "Lúcia Fernandes, 68 anos", fala: "O meu rosto está dormente e o meu braço direito não tem força...", vozId: "EXAVITQu4vr4xnSDxMaL", vitais: { pa: "180x110", fc: "85", fr: "16", sat: "96%" }, correta: "Laranja", feedbackOk: "Via verde AVC ativada! Défice neurológico agudo.", feedbackErro: "Falha crítica. Tempo é cérebro.", tempoBase: 80, grave: true },
            { foto: "https://i.pravatar.cc/150?img=53", perfil: "Carlos Almeida, 45 anos", fala: "Uma dor terrível nas costas que vem para a frente.", vozId: "pNInz6obbf5AWCGq2HKx", vitais: { pa: "150x95", fc: "110", fr: "20", sat: "99%" }, correta: "Amarelo", feedbackOk: "Dor intensa mas sem risco de vida imediato.", feedbackErro: "Erro de prioridade.", tempoBase: 85, grave: false },
            { foto: "https://i.pravatar.cc/150?img=5", perfil: "Joana Matos, 25 anos", fala: "Virei o pé no passeio. Está muito inchado, mas consigo coxear.", vozId: "EXAVITQu4vr4xnSDxMaL", vitais: { pa: "115x75", fc: "80", fr: "14", sat: "99%" }, correta: "Verde", feedbackOk: "Alocação eficiente. Pode aguardar.", feedbackErro: "Desperdício de recursos de emergência.", tempoBase: 90, grave: false },
            { foto: "https://i.pravatar.cc/150?img=68", perfil: "António Vieira, 72 anos", fala: "Tenho tido calafrios, febre... e estou meio confuso...", vozId: "pNInz6obbf5AWCGq2HKx", vitais: { pa: "90x55", fc: "125", fr: "26", sat: "91%" }, correta: "Laranja", feedbackOk: "Suspeita de Sépsis reconhecida.", feedbackErro: "O paciente entrou em choque sético na espera.", tempoBase: 70, grave: true },
            { foto: "https://i.pravatar.cc/150?img=49", perfil: "Marta Gomes, 30 anos", fala: "O meu coração está a disparar, formigueiro nas mãos... vou morrer!", vozId: "EXAVITQu4vr4xnSDxMaL", vitais: { pa: "140x90", fc: "115", fr: "24", sat: "100%" }, correta: "Amarelo", feedbackOk: "Ansiedade bem classificada (Amarelo).", feedbackErro: "Ansiedade severa não pode ser menosprezada totalmente.", tempoBase: 85, grave: false },
            { foto: "https://i.pravatar.cc/150?img=15", perfil: "Tiago Mendes, 19 anos", fala: "Estou com a garganta a arranhar e tosse há três dias.", vozId: "pNInz6obbf5AWCGq2HKx", vitais: { pa: "120x80", fc: "75", fr: "16", sat: "98%" }, correta: "Verde", feedbackOk: "Quadro leve. Mantém o fluxo limpo.", feedbackErro: "Quadros leves sem febre são Verdes.", tempoBase: 100, grave: false }
        ];

        this.niveis = [
            { limite: 0, titulo: "Nvl 1: Estagiário" },
            { limite: 1000, titulo: "Nvl 2: Técnico de Emergência" },
            { limite: 2500, titulo: "Nvl 3: Mestre da Triagem" }
        ];

        this.apiKey = "";
        this.tamanhoPlantao = 3; // Padrão: 3 casos
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

        // Baralha os casos e escolhe a quantidade definida no menu
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

    setApiKey(key) { this.apiKey = key; }
    getCasoAtual() { return this.casos[this.casoAtualIndex]; }
    isGameOver() { return this.erros >= 3; }
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