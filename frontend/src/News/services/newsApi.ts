const API_KEY = import.meta.env.VITE_GNEWS_API_KEY || 'eee2a17c8a9c28385a98e09b5448f34e';
const BASE_URL = 'https://gnews.io/api/v4';

// Cache para evitar muitas requisições
interface CacheEntry {
  data: NewsResponse;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalArticles: number;
}

export const fetchNews = async (
  category: string = 'general',
  query: string = '',
  page: number = 1,
  maxResults: number = 50
): Promise<NewsResponse> => {
  try {
    // Criar chave do cache
    const cacheKey = `${category}-${query}-${page}-${maxResults}`;
    const cached = cache.get(cacheKey);
    
    // Verificar se temos dados em cache válidos
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Usando dados do cache para:', cacheKey);
      return cached.data;
    }

    // Calcular data de 7 dias atrás para buscar notícias recentes
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fromDate = sevenDaysAgo.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    let apiUrl = '';
    
    if (query) {
      // Para buscas específicas
      apiUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=pt&country=br&max=${maxResults}&from=${fromDate}&token=${API_KEY}`;
    } else {
      // Para categorias - usar top headlines
      let categoryParam = category;
      
      // Mapear categorias para as disponíveis na GNews
      switch (category) {
        case 'general':
          categoryParam = 'general';
          break;
        case 'technology':
          categoryParam = 'technology';
          break;
        case 'business':
          categoryParam = 'business';
          break;
        case 'sports':
          categoryParam = 'sports';
          break;
        case 'health':
          categoryParam = 'health';
          break;
        case 'entertainment':
          categoryParam = 'entertainment';
          break;
        case 'science':
          categoryParam = 'science';
          break;
        case 'politics':
          // GNews não tem categoria política, usar busca por termos
          apiUrl = `${BASE_URL}/search?q=política OR governo OR eleições OR Lula OR Bolsonaro&lang=pt&country=br&max=${maxResults}&from=${fromDate}&token=${API_KEY}`;
          break;
        default:
          categoryParam = 'general';
      }
      
      // Se não é política, usar top headlines
      if (category !== 'politics') {
        // Para top headlines, vamos usar search com termos gerais da categoria para incluir parâmetro de data
        const categoryTerms = {
          general: 'Brasil OR notícias OR atualidades',
          technology: 'tecnologia OR inovação OR digital OR internet OR IA',
          business: 'economia OR negócios OR empresas OR mercado OR bolsa',
          sports: 'esportes OR futebol OR olimpíadas OR copa OR atletas',
          health: 'saúde OR medicina OR hospital OR vacina OR covid',
          entertainment: 'entretenimento OR cinema OR música OR famosos OR TV',
          science: 'ciência OR pesquisa OR descoberta OR estudo OR universidade'
        };
        
        const searchTerm = categoryTerms[categoryParam as keyof typeof categoryTerms] || categoryTerms.general;
        apiUrl = `${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&lang=pt&country=br&max=${maxResults}&from=${fromDate}&token=${API_KEY}`;
      }
    }

    console.log('URL da GNews API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Chave da API inválida. Verifique sua API key da GNews.');
      } else if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
      } else if (response.status === 403) {
        throw new Error('Acesso negado. Verifique sua API key da GNews.');
      } else {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('Resposta da GNews API:', data);
    
    if (data.errors) {
      throw new Error(data.errors[0] || 'Erro desconhecido da API');
    }

    // Filtrar artigos válidos e mapear para o formato esperado
    const filteredArticles = (data.articles || []).filter((article: any) => 
      article.title && 
      article.description && 
      article.url &&
      article.source?.name
    ).map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image, // Mapear 'image' da GNews para 'urlToImage' esperado pelo componente
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name
      }
    }))
    // Ordenar por data de publicação (mais recentes primeiro)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    console.log('Artigos filtrados:', filteredArticles.length);

    const result = {
      articles: filteredArticles,
      totalArticles: data.totalArticles || filteredArticles.length
    };

    // Salvar no cache
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

// Função para limpar cache antigo
export const clearOldCache = () => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
};

// Função para buscar múltiplas páginas de notícias
export const fetchMultiplePages = async (
  category: string = 'general',
  query: string = '',
  totalDesired: number = 100
): Promise<NewsResponse> => {
  try {
    const maxPerPage = 50; // Máximo por requisição da GNews
    const pages = Math.ceil(totalDesired / maxPerPage);
    const allArticles: NewsArticle[] = [];
    
    // Buscar múltiplas páginas em paralelo (limitado para não sobrecarregar a API)
    const promises = [];
    for (let page = 1; page <= Math.min(pages, 3); page++) { // Máximo 3 páginas para não exceder limites
      promises.push(fetchNews(category, query, page, maxPerPage));
    }
    
    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value.articles);
      }
    });
    
    // Remover duplicatas baseado na URL
    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex(a => a.url === article.url)
    );
    
    return {
      articles: uniqueArticles.slice(0, totalDesired),
      totalArticles: uniqueArticles.length
    };
  } catch (error) {
    console.error('Erro ao buscar múltiplas páginas:', error);
    // Fallback para busca simples
    return fetchNews(category, query, 1, 50);
  }
};