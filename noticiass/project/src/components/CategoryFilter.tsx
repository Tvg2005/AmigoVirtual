import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'general', name: 'Geral', color: 'bg-blue-100 text-blue-800' },
  { id: 'technology', name: 'Tecnologia', color: 'bg-purple-100 text-purple-800' },
  { id: 'business', name: 'Negócios', color: 'bg-green-100 text-green-800' },
  { id: 'sports', name: 'Esportes', color: 'bg-orange-100 text-orange-800' },
  { id: 'health', name: 'Saúde', color: 'bg-pink-100 text-pink-800' },
  { id: 'entertainment', name: 'Entretenimento', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'science', name: 'Ciência', color: 'bg-teal-100 text-teal-800' },
  { id: 'politics', name: 'Política', color: 'bg-red-100 text-red-800' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
                           transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300
                           ${selectedCategory === category.id
                             ? 'bg-blue-600 text-white shadow-lg'
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