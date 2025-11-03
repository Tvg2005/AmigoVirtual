import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import NewsCard from './components/NewsCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { fetchNews, fetchMultiplePages, clearOldCache, NewsArticle } from './services/newsApi';
import { RefreshCw } from 'lucide-react';

function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async (
    category: string = selectedCategory, 
    query: string = searchQuery,
    showLoading: boolean = true,
    useMultiplePages: boolean = true
  ) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      
      // Usar busca em múltiplas páginas para mais resultados
      const response = useMultiplePages 
        ? await fetchMultiplePages(category, query, 100)
        : await fetchNews(category, query, 1, 50);
        
      setArticles(response.articles);
      setLastUpdate(new Date());
      
      // Limpar cache antigo periodicamente
      clearOldCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar notícias');
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  // Auto-refresh das notícias a cada 3 minutos
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      console.log('Auto-atualizando notícias...');
      loadNews(selectedCategory, searchQuery, false, true);
    }, 3 * 60 * 1000); // 3 minutos

    return () => clearInterval(interval);
  }, [selectedCategory, searchQuery, autoRefresh]);
  useEffect(() => {
    loadNews();
  }, []);

  const handleSearch = () => {
    loadNews(selectedCategory, searchQuery, true, true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadNews(category, searchQuery, true, true);
  };

  const handleRetry = () => {
    loadNews(selectedCategory, searchQuery, true, true);
  };

  const handleManualRefresh = () => {
    loadNews(selectedCategory, searchQuery, false, true);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-blue-400 text-white font-medium
                       rounded-lg hover:bg-blue-500 transition-colors duration-200 transform
                       hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300
                       focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
            
            <button
              onClick={toggleAutoRefresh}
              className={`inline-flex items-center px-4 py-2 font-medium rounded-lg
                       transition-colors duration-200 focus:outline-none focus:ring-2
                       focus:ring-offset-2 ${
                autoRefresh
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-300'
                  : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                autoRefresh ? 'bg-blue-500 animate-pulse' : 'bg-blue-300'
              }`} />
              Auto-atualização {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
        </div>

        {/* Stats */}
        {!loading && !error && articles.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Últimas Notícias {refreshing && <span className="text-blue-600">(Atualizando...)</span>}
                  </h2>
                  <p className="text-gray-600">
                    {articles.length} notícias dos últimos 7 dias
                    {searchQuery && ` para "${searchQuery}"`}
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    {articles.length}
                  </div>
                  <div className="text-sm text-blue-400">
                    Últimos 7 dias
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              Nenhuma notícia encontrada
            </div>
            <p className="text-gray-400">
              {searchQuery ? 
                `Não encontramos resultados para "${searchQuery}". Tente outros termos.` :
                'Não há notícias disponíveis no momento.'
              }
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-100 text-blue-800 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              eliz<span className="text-blue-400">IA</span>
            </h3>
            <p className="text-blue-600 mb-4">
              Seu portal de notícias em tempo real
            </p>
            <div className="border-t border-blue-200 pt-4 mt-4">
              <p className="text-sm text-blue-500">
                © 2025 elizIA.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default News;