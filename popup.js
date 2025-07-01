document.getElementById("start").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: executarValidacoesScript,
    });
});

function executarValidacoesScript() {
    // TIPOS
    const INCIDENTE = document.querySelector("#div_occurrenceType147118");
    const ABERTO_EMAIL = document.querySelector("#div_occurrenceType147120");
    const ADMISSIONAL = document.querySelector("#div_occurrenceType198986");
    const ATENDIMENTO = document.querySelector("#div_occurrenceType188222");
    const CFTV = document.querySelector("#div_occurrenceType460847");
    const CRIACAO_ACESSOS = document.querySelector("#div_occurrenceType458928");
    const DEMISSIONAL = document.querySelector("#div_occurrenceType198987");
    const DOCUMENTACAO = document.querySelector("#div_occurrenceType460010");
    const EVENTOS = document.querySelector("#div_occurrenceType427537");
    const INFRA = document.querySelector("#div_occurrenceType458827");
    const INSTALA_SOFTWARE = document.querySelector("#div_occurrenceType458826");
    const MANUTENCAO = document.querySelector("#div_occurrenceType458920");
    const SOLICITACAO_COMPRA = document.querySelector("#div_occurrenceType458921");
    const SOLICITACAO_EQUIPAMENTO = document.querySelector(
        "#div_occurrenceType427536"
    );
    const TERCEIROS = document.querySelector("#div_occurrenceType458919");

    // RESPONSÁVEIS
    const EQUIPE = 1201736;
    const DANIELLA = 164646;
    const RAUL = 1203006;
    const GUILHERME = 148565;
    const JAQUELINE = 153591;
    const LUIZ = 1202824;
    const MARCOS = 136355;
    const MATHEUS = 1199171;
    const NICOLAS = 1202894;
    const VINICIUS = 151422;

    // Validação de laboratórios
    const VALIDADORES = [LUIZ, RAUL, MATHEUS, NICOLAS];
    const LABS = [
        [1, 2, 10],
        [3, 4],
        [5, 6],
        [7, 8, 9],
    ];

    // Esperar Nuubes carregar
    function waitForConsoleLog(targetMessage) {
        return new Promise((resolve) => {
            const originalLog = console.log;

            console.log = function (...args) {
                originalLog.apply(console, args);

                if (args.includes(targetMessage)) {
                    console.log = originalLog; // restaura o original
                    resolve(); // continua o código
                }
            };
        });
    }

    async function waitForInput(selector, timeout = 30000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const input = document.querySelector(selector);
            if (input) return input;
            await new Promise((resolve) => setTimeout(resolve, 100)); // espera 100ms
        }

        throw new Error(`Input ${selector} não encontrado após ${timeout}ms`);
    }

    async function executarValidacoes() {
        for (let i = 0; i < VALIDADORES.length; i++) {
            for (let j = 0; j < LABS[i].length; j++) {
                // Abrir Nova Ocorrência de algum TIPO acima
                MANUTENCAO.click();

                console.log(`${VALIDADORES[i]} - Lab ${LABS[i][j]}`);

                try {
                    // Espera por console.log() específico de novo chamado
                    waitForConsoleLog("Inicio script");
                    // Espera os inputs estarem prontos
                    const inputAssunto = await waitForInput("#occurrenceSummary");
                    const inputDescricao = await waitForInput("#description");
                    const selectResponsavel = await waitForInput(
                        "#selectResponsable"
                    );

                    // Define os valores
                    selectResponsavel.value = VALIDADORES[i]; // cada um com seu responsável
                    inputAssunto.value = `Validação de laboratório - Lab ${LABS[i][j]}`;
                    inputDescricao.value = inputAssunto.value;

                    // Clica em salvar
                    document.querySelector("#btnSaveOccurrence").click();

                    // Aguarda um tempo para o Nuubes processar antes de seguir pro próximo
                    await new Promise((resolve) => setTimeout(resolve, 2000)); // ajuste esse tempo se precisar
                } catch (e) {
                    console.error(e.message);
                }
            }
        }
    }

    // Iniciar o processo
    executarValidacoes();
}
