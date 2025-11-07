// Este é um exemplo simplificado para WDC 3.0
(function () {
    // 1. Crie a classe do seu conector
    class SupabaseConnector extends tableau.Connector {
        
        // Construtor do conector
        constructor() {
            super();
            this.registerMethod("init", this.init);
            this.registerMethod("getSchema", this.getSchema);
            this.registerMethod("getData", this.getData);
        }

        // Chamado quando o conector é carregado
        init(initCallback) {
            console.log("Conector Supabase (Avaliações) iniciado!");
            initCallback();
        }

        // --- 2. DEFINA O ESQUEMA ---
        // Esta função define as colunas, com base no seu arquivo gem.txt
        getSchema(schemaCallback) {
            
            [cite_start]// Colunas baseadas no seu arquivo gem.txt [cite: 2, 3, 4]
            const cols = [
                [cite_start]{ id: "id_produto", alias: "ID Produto", dataType: "int" }, // [cite: 2]
                [cite_start]{ id: "id_avaliacoes", alias: "ID Avaliação", dataType: "int" }, // [cite: 2]
                [cite_start]{ id: "id_comentario", alias: "ID Comentário", dataType: "string" }, // [cite: 2]
                [cite_start]{ id: "rating_do_comentario", alias: "Rating", dataType: "int" }, // [cite: 3]
                [cite_start]{ id: "comentario_about_produto", alias: "Comentário", dataType: "string" }, // [cite: 3]
                [cite_start]{ id: "sentimento", alias: "Sentimento", dataType: "string" }, // [cite: 3]
                [cite_start]{ id: "topicos", alias: "Tópicos", dataType: "string" }, // [cite: 4]
                [cite_start]// Converti data_coleta de VARCHAR [cite: 4] para datetime para facilitar a análise no Tableau
                { id: "data_coleta", alias: "Data da Coleta", dataType: "datetime" } 
            ];

            const tableSchema = {
                id: "supabase_avaliacoes", // ID único da sua tabela
                alias: "Avaliações de Produtos (Supabase)",
                columns: cols
            };
            
            // Retorna o esquema para o Tableau
            schemaCallback([tableSchema]);
        }

        // --- 3. BUSQUE OS DADOS (A PARTE MAIS IMPORTANTE) ---
        async getData(table, dataCallback) {
            
            // --- ATENÇÃO AQUI ---
            // Substitua pelas suas credenciais do Supabase
            const SUPABASE_URL = "https://aqawtumwlzcipsgfokyr.supabase.co";
            const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYXd0dW13bHpjaXBzZ2Zva3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjUzMDIsImV4cCI6MjA3ODA0MTMwMn0.XC9p-M9yt2xrdqD_QcJQ6PFTojOvSBLXNBfcsV2M0QM"; 
            
            // !!! IMPORTANTE: Substitua pelo nome real da sua tabela no Supabase
            const NOME_DA_TABELA = "[NOME_DA_SUA_TABELA_AQUI]"; 
            // --- FIM DA ATENÇÃO ---


            // Monta a URL da API (seleciona todas as colunas)
            const api_url = `${SUPABASE_URL}/rest/v1/${NOME_DA_TABELA}?select=*`;

            // Faz a chamada 'fetch' para a API
            const response = await fetch(api_url, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            const jsonData = await response.json();

            // Formata os dados para o Tableau
            const tableData = [];
            if (jsonData) {
                jsonData.forEach(item => {
                    // Mapeia as colunas do Supabase para o WDC
                    // Os nomes aqui (ex: "id_produto") devem ser iguais aos IDs do getSchema
                    tableData.push({
                        "id_produto": item.id_produto,
                        "id_avaliacoes": item.id_avaliacoes,
                        "id_comentario": item.id_comentario,
                        "rating_do_comentario": item.rating_do_comentario,
                        "comentario_about_produto": item.comentario_about_produto,
                        "sentimento": item.sentimento,
                        "topicos": item.topicos,
                        "data_coleta": item.data_coleta
                    });
                });
            }

            // Envia os dados formatados para o Tableau
            table.appendRows(tableData);
            // Avisa que terminou
            dataCallback();
        }
    }

    // --- 4. REGISTRE O CONECTOR ---
    const myConnector = new SupabaseConnector();
    tableau.registry.register(myConnector);

})();