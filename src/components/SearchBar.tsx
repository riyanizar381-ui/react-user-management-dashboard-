
import { memo } from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search by name, username or email..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}

export default memo(SearchBar);
