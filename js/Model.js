export class GameModel {
    constructor() {
        // Banco de dados mestre baseado no documento "CASOS CLINICOS" (Adaptado para pt-BR)
        this.casosBase = [
            // Caso 1 (Documento original: João da Silva)
            {
                foto: "https://i.pravatar.cc/150?img=11",
                perfil: "João da Silva, 58 anos",
                fala: "A dor é um aperto no peito, desce pro braço esquerdo e estou com falta de ar. Não passa...",
                anotacoes: "Início há 40 min. Dor 9/10. Náusea e sudorese fria. Hipertenso e diabético irregular, fumante há 30 anos. Histórico familiar de IAM. Apresenta-se ansioso e pálido, com fala entrecortada.",
                vitais: { pa: "168x96", fc: "108", fr: "26", sat: "91%" },
                correta: "Vermelho",
                feedbackOk: "Conduta Correta. Dor torácica típica com irradiação e hipóxia indica IAM. Necessita de ECG imediato.",
                feedbackErro: "Erro Crítico. Dor torácica com irradiação e dispneia (IAM iminente) ignorada.",
                tempoBase: 100, grave: true
            },

            // Caso 2 (Documento original: Mulher, 64 anos - Cenário de Piora)
            {
                foto: "https://i.pravatar.cc/150?img=32",
                perfil: "Maria de Lourdes, 64 anos",
                fala: "A dor da minha mãe piorou muito! Foi para as costas, ela tem calafrios e está vomitando de novo.",
                anotacoes: "Reavaliação após 35 min. Dor abdominal evoluiu de 6 para 9/10. Agitação motora. Exame: Defesa involuntária e sinais de irritação peritoneal no hipocôndrio direito.",
                vitais: { pa: "104x68", fc: "124", fr: "28", sat: "93%" },
                correta: "Laranja",
                feedbackOk: "Reclassificação correta. Piora da dor com taquicardia e risco de abdômen agudo ou sepse.",
                feedbackErro: "Atraso no atendimento. Sinais de alarme no abdômen agudo agravados na espera.",
                tempoBase: 90, grave: true
            },

            // Caso 3 (Documento original: Paciente, 28 anos)
            {
                foto: "https://i.pravatar.cc/150?img=5",
                perfil: "Ana Sousa, 28 anos",
                fala: "Estou com dor de garganta há dois dias e um pouco de coriza. Não tive falta de ar.",
                anotacoes: "Temperatura máxima referida: 37,5°C. Nega dor torácica ou comorbidades. Consciente, eupneica e sem sinais aparentes de desconforto respiratório.",
                vitais: { pa: "118x76", fc: "82", fr: "16", sat: "98%" },
                correta: "Verde",
                feedbackOk: "Alocação eficiente. O quadro infeccioso leve sem dispneia é Pouco Urgente.",
                feedbackErro: "Desperdício de recursos de emergência para um quadro de IVAS leve.",
                tempoBase: 100, grave: false
            },

            // Caso 4 (Desenvolvido na mesma linha: Asma descompensada)
            {
                foto: "https://i.pravatar.cc/150?img=47",
                perfil: "Beatriz Silva, 16 anos",
                fala: "Não... consigo... puxar... o ar... ajudem...",
                anotacoes: "Crise de asma refratária ao salbutamol em casa há 2 horas. Apresenta tiragem intercostal acentuada, cianose perioral e sudorese profusa. Incapacidade de formar frases.",
                vitais: { pa: "135x85", fc: "132", fr: "34", sat: "86%" },
                correta: "Vermelho",
                feedbackOk: "Broncoespasmo severo. Saturação abaixo de 90% e taquipneia exigem intervenção imediata.",
                feedbackErro: "Erro grave. Paciente em falência respiratória iminente deixada na espera.",
                tempoBase: 65, grave: true
            },

            // Caso 5 (Desenvolvido na mesma linha: Suspeita de AVC)
            {
                foto: "https://i.pravatar.cc/150?img=41",
                perfil: "Lúcia Fernandes, 68 anos",
                fala: "Minha mãe acordou com o rosto torto e não tem força na perna direita...",
                anotacoes: "Desvio de rima labial, disartria e hemiparesia à direita. Início há aprox. 1h30min. Histórico de fibrilação atrial e dislipidemia.",
                vitais: { pa: "195x115", fc: "85", fr: "16", sat: "96%" },
                correta: "Laranja",
                feedbackOk: "Via verde AVC ativada! Déficit neurológico focal agudo é Muito Urgente.",
                feedbackErro: "Falha na janela terapêutica. Tempo é cérebro. Sinais de AVC agudo não podem aguardar.",
                tempoBase: 80, grave: true
            },

            // Caso 6 (Desenvolvido na mesma linha: Cólica Renal)
            {
                foto: "https://i.pravatar.cc/150?img=53",
                perfil: "Carlos Almeida, 45 anos",
                fala: "Uma dor terrível nas costas que vem para a virilha. Já vomitei duas vezes, não aguento de dor!",
                anotacoes: "Dor lombar direita súbita há 3 horas (10/10). Muito inquieto, sem posição de alívio. Nega disúria ou febre prévia.",
                vitais: { pa: "155x95", fc: "112", fr: "22", sat: "99%" },
                correta: "Amarelo",
                feedbackOk: "Dor intensa (Amarelo). Bem classificado para analgesia rápida sem comprometer a sala de emergência.",
                feedbackErro: "Erro de prioridade. A dor é intensa e provoca taquicardia, requer analgesia rápida (Amarelo).",
                tempoBase: 85, grave: false
            },

            // Caso 7 (Desenvolvido na mesma linha: Hemorragia Digestiva)
            {
                foto: "https://i.pravatar.cc/150?img=68",
                perfil: "Antônio Vieira, 72 anos",
                fala: "Vomitei muito sangue escuro em casa e sinto a cabeça rodando quando me levanto...",
                anotacoes: "Trazido pelo SAMU após hematêmese volumosa e síncope. Histórico de cirrose hepática. Letárgico, palidez cutâneo-mucosa extrema e extremidades frias.",
                vitais: { pa: "85x50", fc: "135", fr: "26", sat: "94%" },
                correta: "Vermelho",
                feedbackOk: "Excelente! Choque hemorrágico identificado. Reposição volêmica imediata.",
                feedbackErro: "O paciente entrou em choque hipovolêmico grave na sala de espera.",
                tempoBase: 60, grave: true
            },

            // Caso 8 (Desenvolvido na mesma linha: Cefaleia em Trovoada)
            {
                foto: "https://i.pravatar.cc/150?img=49",
                perfil: "Marta Gomes, 35 anos",
                fala: "Foi de repente, a pior dor de cabeça da minha vida. A luz incomoda muito os meus olhos.",
                anotacoes: "Cefaleia de início súbito e explosivo há 1 hora. Fotofobia intensa, náuseas e leve rigidez na nuca. Tabagista e usuária de contraceptivos orais.",
                vitais: { pa: "140x90", fc: "95", fr: "18", sat: "99%" },
                correta: "Laranja",
                feedbackOk: "Sinal de alerta vermelho neurológico. Suspeita de Hemorragia Subaracnóidea (Laranja).",
                feedbackErro: "Erro de triagem. A pior cefaleia da vida com sinais meníngeos exige tomografia urgente.",
                tempoBase: 85, grave: true
            },

            // Caso 9 (Desenvolvido na mesma linha: Crise de Ansiedade)
            {
                foto: "https://i.pravatar.cc/150?img=12",
                perfil: "Felipe Matos, 30 anos",
                fala: "Meu coração não para de bater rápido, tenho formigamento nas mãos e sinto que vou desmaiar.",
                anotacoes: "Dor torácica atípica (pontadas). Início após discussão familiar grave. Sem antecedentes cardiovasculares. Agitado e hiperventilando.",
                vitais: { pa: "145x90", fc: "115", fr: "24", sat: "100%" },
                correta: "Amarelo",
                feedbackOk: "Crise de ansiedade classificada com segurança (Amarelo) para realizar ECG e descartar outras causas.",
                feedbackErro: "Sintomas simpáticos não devem ser menosprezados. A hiperventilação requer observação (Amarelo).",
                tempoBase: 90, grave: false
            },

            // Caso 10 (Desenvolvido na mesma linha: Entorse Tornozelo)
            {
                foto: "https://i.pravatar.cc/150?img=15",
                perfil: "Tiago Mendes, 19 anos",
                fala: "Virei o pé jogando futebol. Está um pouco inchado, mas consigo pisar no chão com dor.",
                anotacoes: "Trauma há 2 horas. Edema moderado no maléolo externo, sem deformidade óssea visível. Suporta carga parcial e caminha mancando (dor 4/10).",
                vitais: { pa: "120x80", fc: "75", fr: "14", sat: "98%" },
                correta: "Verde",
                feedbackOk: "Trauma leve sem deformidade óbvia (Verde). Mantém o fluxo da triagem rápido.",
                feedbackErro: "Classificação excessiva. Este trauma menor deve aguardar radiografia na triagem Verde.",
                tempoBase: 100, grave: false
            }
        ];

        this.niveis = [
            { limite: 0, titulo: "Nvl 1: Estagiário" },
            { limite: 1000, titulo: "Nvl 2: Técnico de Emergência" },
            { limite: 2500, titulo: "Nvl 3: Mestre da Triagem" }
        ];

        this.tamanhoPlantao = 3;
        this.maxErros = 3;
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
    isGameOver() { return this.erros >= this.maxErros; }
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