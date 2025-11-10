export interface WordData {
  word: string;
  clue: string;
  category: string;
}

export const crosswordWords: WordData[] = [
  // Animais
  { word: 'GATO', clue: 'Animal doméstico que faz miau', category: 'animais' },
  { word: 'CACHORRO', clue: 'Melhor amigo do homem', category: 'animais' },
  { word: 'PEIXE', clue: 'Animal que vive na água', category: 'animais' },
  { word: 'PASSARO', clue: 'Animal que voa', category: 'animais' },
  { word: 'CAVALO', clue: 'Animal usado para montaria', category: 'animais' },
  { word: 'VACA', clue: 'Animal que dá leite', category: 'animais' },
  { word: 'GALINHA', clue: 'Ave que põe ovos', category: 'animais' },
  { word: 'PORCO', clue: 'Animal da fazenda que gosta de lama', category: 'animais' },
  { word: 'OVELHA', clue: 'Animal que dá lã', category: 'animais' },
  { word: 'COELHO', clue: 'Animal que pula e come cenoura', category: 'animais' },

  // Cores
  { word: 'AZUL', clue: 'Cor do céu em dia claro', category: 'cores' },
  { word: 'VERDE', clue: 'Cor da grama', category: 'cores' },
  { word: 'VERMELHO', clue: 'Cor do sangue', category: 'cores' },
  { word: 'AMARELO', clue: 'Cor do sol', category: 'cores' },
  { word: 'ROXO', clue: 'Cor da uva', category: 'cores' },
  { word: 'ROSA', clue: 'Cor delicada e suave', category: 'cores' },
  { word: 'BRANCO', clue: 'Cor da neve', category: 'cores' },
  { word: 'PRETO', clue: 'Cor da noite', category: 'cores' },
  { word: 'LARANJA', clue: 'Cor da fruta cítrica', category: 'cores' },

  // Frutas
  { word: 'BANANA', clue: 'Fruta amarela alongada', category: 'frutas' },
  { word: 'MACA', clue: 'Fruta vermelha ou verde', category: 'frutas' },
  { word: 'LARANJA', clue: 'Fruta cítrica alaranjada', category: 'frutas' },
  { word: 'UVA', clue: 'Fruta pequena em cacho', category: 'frutas' },
  { word: 'PERA', clue: 'Fruta doce em formato de gota', category: 'frutas' },
  { word: 'MANGA', clue: 'Fruta tropical doce', category: 'frutas' },
  { word: 'ABACAXI', clue: 'Fruta tropical com coroa', category: 'frutas' },
  { word: 'MELANCIA', clue: 'Fruta grande e vermelha por dentro', category: 'frutas' },
  { word: 'MORANGO', clue: 'Fruta pequena e vermelha', category: 'frutas' },

  // Natureza
  { word: 'SOL', clue: 'Astro que ilumina o dia', category: 'natureza' },
  { word: 'LUA', clue: 'Astro que ilumina a noite', category: 'natureza' },
  { word: 'ESTRELA', clue: 'Ponto brilhante no céu noturno', category: 'natureza' },
  { word: 'CHUVA', clue: 'Água que cai do céu', category: 'natureza' },
  { word: 'VENTO', clue: 'Ar em movimento', category: 'natureza' },
  { word: 'FLOR', clue: 'Parte colorida da planta', category: 'natureza' },
  { word: 'ARVORE', clue: 'Planta grande com tronco', category: 'natureza' },
  { word: 'FOLHA', clue: 'Parte verde da planta', category: 'natureza' },
  { word: 'TERRA', clue: 'Solo onde plantamos', category: 'natureza' },
  { word: 'AGUA', clue: 'Líquido essencial para a vida', category: 'natureza' },

  // Casa
  { word: 'CASA', clue: 'Lugar onde moramos', category: 'casa' },
  { word: 'PORTA', clue: 'Entrada da casa', category: 'casa' },
  { word: 'JANELA', clue: 'Abertura para ver o exterior', category: 'casa' },
  { word: 'CAMA', clue: 'Móvel para dormir', category: 'casa' },
  { word: 'MESA', clue: 'Móvel para comer', category: 'casa' },
  { word: 'CADEIRA', clue: 'Móvel para sentar', category: 'casa' },
  { word: 'FOGAO', clue: 'Aparelho para cozinhar', category: 'casa' },
  { word: 'GELADEIRA', clue: 'Aparelho que conserva alimentos', category: 'casa' },
  { word: 'TELEVISAO', clue: 'Aparelho para assistir programas', category: 'casa' },

  // Comida
  { word: 'PAO', clue: 'Alimento básico feito de farinha', category: 'comida' },
  { word: 'LEITE', clue: 'Bebida branca nutritiva', category: 'comida' },
  { word: 'QUEIJO', clue: 'Alimento feito do leite', category: 'comida' },
  { word: 'ARROZ', clue: 'Grão básico da alimentação', category: 'comida' },
  { word: 'FEIJAO', clue: 'Grão que acompanha o arroz', category: 'comida' },
  { word: 'CARNE', clue: 'Alimento de origem animal', category: 'comida' },
  { word: 'SALADA', clue: 'Prato feito com verduras', category: 'comida' },
  { word: 'SOPA', clue: 'Prato líquido quente', category: 'comida' },
  { word: 'BOLO', clue: 'Doce para festas', category: 'comida' },
  { word: 'CAFE', clue: 'Bebida quente feita com grãos', category: 'comida' },

  // Transporte
  { word: 'CARRO', clue: 'Veículo de quatro rodas', category: 'transporte' },
  { word: 'ONIBUS', clue: 'Transporte público grande', category: 'transporte' },
  { word: 'BICICLETA', clue: 'Veículo de duas rodas sem motor', category: 'transporte' },
  { word: 'AVIAO', clue: 'Veículo que voa', category: 'transporte' },
  { word: 'BARCO', clue: 'Meio de transporte aquático', category: 'transporte' },
  { word: 'TREM', clue: 'Transporte sobre trilhos', category: 'transporte' },
  { word: 'MOTO', clue: 'Veículo de duas rodas com motor', category: 'transporte' },

  // Corpo
  { word: 'CABECA', clue: 'Parte superior do corpo', category: 'corpo' },
  { word: 'OLHO', clue: 'Órgão da visão', category: 'corpo' },
  { word: 'NARIZ', clue: 'Órgão do olfato', category: 'corpo' },
  { word: 'BOCA', clue: 'Órgão da fala', category: 'corpo' },
  { word: 'ORELHA', clue: 'Órgão da audição', category: 'corpo' },
  { word: 'MAO', clue: 'Extremidade do braço', category: 'corpo' },
  { word: 'PE', clue: 'Extremidade da perna', category: 'corpo' },
  { word: 'BRACO', clue: 'Membro superior', category: 'corpo' },
  { word: 'PERNA', clue: 'Membro inferior', category: 'corpo' },

  // Tempo
  { word: 'DIA', clue: 'Período de luz solar', category: 'tempo' },
  { word: 'NOITE', clue: 'Período de escuridão', category: 'tempo' },
  { word: 'MANHA', clue: 'Início do dia', category: 'tempo' },
  { word: 'TARDE', clue: 'Meio do dia', category: 'tempo' },
  { word: 'SEMANA', clue: 'Período de sete dias', category: 'tempo' },
  { word: 'MES', clue: 'Período de trinta dias', category: 'tempo' },
  { word: 'ANO', clue: 'Período de doze meses', category: 'tempo' },
  { word: 'HORA', clue: 'Sessenta minutos', category: 'tempo' },
  { word: 'MINUTO', clue: 'Sessenta segundos', category: 'tempo' },

  // Estações
  { word: 'VERAO', clue: 'Estação do ano mais quente', category: 'estacoes' },
  { word: 'INVERNO', clue: 'Estação do ano mais fria', category: 'estacoes' },
  { word: 'OUTONO', clue: 'Estação das folhas amarelas', category: 'estacoes' },
  { word: 'PRIMAVERA', clue: 'Estação das flores', category: 'estacoes' },

  // Profissões
  { word: 'MEDICO', clue: 'Profissional da saúde', category: 'profissoes' },
  { word: 'PROFESSOR', clue: 'Profissional que ensina', category: 'profissoes' },
  { word: 'BOMBEIRO', clue: 'Profissional que apaga incêndios', category: 'profissoes' },
  { word: 'POLICIAL', clue: 'Profissional da segurança', category: 'profissoes' },
  { word: 'PADEIRO', clue: 'Profissional que faz pães', category: 'profissoes' },
  { word: 'JARDINEIRO', clue: 'Profissional que cuida de plantas', category: 'profissoes' }
];