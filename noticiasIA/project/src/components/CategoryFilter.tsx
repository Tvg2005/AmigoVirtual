import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'general', name: 'Geral', color: 'bg-blue-50 text-blue-600' },
  { id: 'technology', name: 'Tecnologia', color: 'bg-green-50 text-green-600' },
  { id: 'business', name: 'Negócios', color: 'bg-yellow-50 text-yellow-600' },
  { id: 'sports', name: 'Esportes', color: 'bg-orange-50 text-orange-600' },
  { id: 'health', name: 'Saúde', color: 'bg-pink-50 text-pink-600' },
  { id: 'entertainment', name: 'Entretenimento', color: 'bg-cyan-50 text-cyan-600' },
  { id: 'science', name: 'Ciência', color: 'bg-teal-50 text-teal-600' },
  { id: 'politics', name: 'Política', color: 'bg-rose-50 text-rose-600' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex justify-center space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
                           transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200
                           ${selectedCategory === category.id
                             ? 'bg-blue-400 text-white shadow-lg'
                             : `${category.color} hover:shadow-md`
                           }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}