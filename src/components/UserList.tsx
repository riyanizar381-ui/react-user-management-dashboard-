
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import type { User } from '../types/User';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/useTheme';

type SortField = 'name' | 'username' | 'email';
type SortOrder = 'asc' | 'desc';

function UserList() {
  const { isDark, toggleTheme } = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const usersPerPage = 5;

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      const parsed: unknown = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      if (
        Array.isArray(parsed) &&
        parsed.every(
          (id): id is number =>
            typeof id === 'number' && Number.isInteger(id)
        )
      ) {
        return parsed;
      }

      return [];
    } catch {
      return [];
    }
  });

  // Fetch users
  // State updates happen only after the API responds.
  const fetchUsers = useCallback(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        return response.json();
      })
      .then((data: User[]) => {
        setUsers(data);
        setError('');
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load users. Please try again.');
        setLoading(false);
      });
  }, []);

  // Initial API call
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Retry API call
  const retryFetch = useCallback(() => {
    setLoading(true);
    setError('');
    fetchUsers();
  }, [fetchUsers]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Debounced search (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Toggle favorite
  const toggleFavorite = useCallback((userId: number) => {
    setFavorites((previousFavorites) =>
      previousFavorites.includes(userId)
        ? previousFavorites.filter((id) => id !== userId)
        : [...previousFavorites, userId]
    );
  }, []);

  // Get unique cities
  const cities = useMemo(() => {
    return [...new Set(users.map((user) => user.address.city))];
  }, [users]);

  // Get unique companies
  const companies = useMemo(() => {
    return [...new Set(users.map((user) => user.company.name))];
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const search = debouncedSearch.toLowerCase();

    return users
      .filter((user) => {
        return (
          user.name.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      })
      .filter(
        (user) =>
          selectedCity === '' ||
          user.address.city === selectedCity
      )
      .filter(
        (user) =>
          selectedCompany === '' ||
          user.company.name === selectedCompany
      )
      .filter(
        (user) =>
          !favoriteOnly || favorites.includes(user.id)
      )
      .sort((a, b) => {
        const firstValue = a[sortBy].toLowerCase();
        const secondValue = b[sortBy].toLowerCase();

        return sortOrder === 'asc'
          ? firstValue.localeCompare(secondValue)
          : secondValue.localeCompare(firstValue);
      });
  }, [
    users,
    debouncedSearch,
    selectedCity,
    selectedCompany,
    favoriteOnly,
    favorites,
    sortBy,
    sortOrder,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;

    return filteredUsers.slice(
      startIndex,
      startIndex + usersPerPage
    );
  }, [filteredUsers, currentPage]);

  // Export users to CSV
  const exportToCSV = useCallback(() => {
    const headers = [
      'Name',
      'Username',
      'Email',
      'Phone',
      'Website',
      'Company',
      'City',
    ];

    const rows = filteredUsers.map((user) => [
      user.name,
      user.username,
      user.email,
      user.phone,
      user.website,
      user.company.name,
      user.address.city,
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'users.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [filteredUsers]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCity('');
    setSelectedCompany('');
    setSortBy('name');
    setSortOrder('asc');
    setFavoriteOnly(false);
    setCurrentPage(1);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          isDark
            ? 'bg-gray-900 text-white'
            : 'bg-purple-50 text-purple-700'
        }`}
      >
        <p className="text-lg font-semibold">
          Loading users...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center gap-4 ${
          isDark ? 'bg-gray-900' : 'bg-purple-50'
        }`}
      >
        <p className="text-lg text-red-500">{error}</p>

        <button
          onClick={retryFetch}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 md:p-8 transition-colors duration-300 ${
        isDark
          ? 'bg-gray-900 text-white'
          : 'bg-purple-50 text-gray-800'
      }`}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1
          className={`text-3xl font-bold ${
            isDark ? 'text-purple-300' : 'text-purple-700'
          }`}
        >
          User Management
        </h1>

        <button
          onClick={toggleTheme}
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            isDark
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Sort By */}
      <div className="max-w-xl mx-auto mb-4">
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as SortField);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
        >
          <option value="name">Sort by Name</option>
          <option value="username">Sort by Username</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="max-w-xl mx-auto mb-4">
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as SortOrder);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
        >
          <option value="asc">Ascending (A to Z)</option>
          <option value="desc">Descending (Z to A)</option>
        </select>
      </div>

      {/* City Filter */}
      <div className="max-w-xl mx-auto mb-4">
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
        >
          <option value="">All Cities</option>

          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Company Filter */}
      <div className="max-w-xl mx-auto mb-4">
        <select
          value={selectedCompany}
          onChange={(e) => {
            setSelectedCompany(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
        >
          <option value="">All Companies</option>

          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* Favorites Filter */}
      <div className="max-w-xl mx-auto mb-4">
        <select
          value={favoriteOnly ? 'favorites' : 'all'}
          onChange={(e) => {
            setFavoriteOnly(e.target.value === 'favorites');
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
        >
          <option value="all">Show All Users</option>
          <option value="favorites">Show Favorites ❤️</option>
        </select>
      </div>

      {/* Reset Filters */}
      <div className="max-w-xl mx-auto mb-8">
        <button
          onClick={resetFilters}
          className="w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Favorite Count */}
      <p
        className={`text-center font-semibold mb-5 ${
          isDark ? 'text-purple-300' : 'text-purple-700'
        }`}
      >
        ❤️ Favorite Users: {favorites.length}
      </p>

      {/* CSV Export */}
      <div className="max-w-xl mx-auto mb-8">
        <button
          onClick={exportToCSV}
          disabled={filteredUsers.length === 0}
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
        >
          📥 Export Users to CSV
        </button>
      </div>

      {/* User Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentUsers.map((user) => {
          const isFavorite = favorites.includes(user.id);

          return (
            <div
              key={user.id}
              className={`shadow-md rounded-lg p-5 border transition hover:shadow-xl ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-purple-400'
                  : 'bg-white border-gray-200 hover:border-purple-400'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFavorite(user.id)}
                aria-label={
                  isFavorite
                    ? `Remove ${user.name} from favorites`
                    : `Add ${user.name} to favorites`
                }
                aria-pressed={isFavorite}
                className="text-2xl mb-3"
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>

              <h2
                className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                {user.name}
              </h2>

              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Username: {user.username}
              </p>

              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Email: {user.email}
              </p>

              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Phone: {user.phone}
              </p>

              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Website: {user.website}
              </p>

              <p className={isDark ? 'text-purple-300' : 'text-purple-600'}>
                Company: {user.company.name}
              </p>

              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                City: {user.address.city}
              </p>

              <Link
                to={`/user/${user.id}`}
                className={`block text-sm font-semibold mt-3 hover:underline ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}
              >
                View Details →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <p
          className={`text-center mt-8 ${
            isDark ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          No users found.
        </p>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserList;
