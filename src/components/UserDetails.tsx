
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { User } from '../types/User';
import { useTheme } from '../context/useTheme';

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const { isDark, toggleTheme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const validId = Boolean(id && /^\d+$/.test(id));

  useEffect(() => {
    if (!validId || !id) return;

    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data: User = await response.json();

        if (!controller.signal.aborted) {
          setUser(data);
          setError('');
          setLoading(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load user details.');
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => controller.abort();
  }, [id, validId]);

  const pageStyle = isDark
    ? 'bg-gray-900 text-white'
    : 'bg-purple-50 text-gray-800';

  const cardStyle = isDark
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-700';

  const headingStyle = isDark
    ? 'text-purple-300'
    : 'text-purple-700';

  if (!validId) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center gap-4 ${pageStyle}`}>
        <p className="text-red-500">Invalid user ID.</p>
        <Link to="/" className="px-5 py-2 bg-purple-600 text-white rounded-lg">
          Back to Users
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${pageStyle}`}>
        <p className={`text-lg font-semibold ${headingStyle}`}>
          Loading user details...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center gap-4 ${pageStyle}`}>
        <p className="text-red-500">{error || 'User not found.'}</p>
        <Link to="/" className="px-5 py-2 bg-purple-600 text-white rounded-lg">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-10 transition-colors duration-300 ${pageStyle}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <Link
            to="/"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            ← Back to Users
          </Link>

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

        <h1 className={`text-3xl font-bold mb-8 ${headingStyle}`}>
          User Details
        </h1>

        <section className={`rounded-xl shadow-md border p-6 mb-6 ${cardStyle}`}>
          <h2 className={`text-xl font-bold mb-4 ${headingStyle}`}>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p>
              <strong>Website:</strong>{' '}
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${headingStyle} hover:underline`}
              >
                {user.website}
              </a>
            </p>
          </div>
        </section>

        <section className={`rounded-xl shadow-md border p-6 mb-6 ${cardStyle}`}>
          <h2 className={`text-xl font-bold mb-4 ${headingStyle}`}>
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Street:</strong> {user.address.street}</p>
            <p><strong>Suite:</strong> {user.address.suite}</p>
            <p><strong>City:</strong> {user.address.city}</p>
            <p><strong>Zipcode:</strong> {user.address.zipcode}</p>
            <p><strong>Latitude:</strong> {user.address.geo.lat}</p>
            <p><strong>Longitude:</strong> {user.address.geo.lng}</p>
          </div>
        </section>

        <section className={`rounded-xl shadow-md border p-6 mb-6 ${cardStyle}`}>
          <h2 className={`text-xl font-bold mb-4 ${headingStyle}`}>
            Company Information
          </h2>
          <div className="space-y-4">
            <p><strong>Company Name:</strong> {user.company.name}</p>
            <p><strong>Catch Phrase:</strong> {user.company.catchPhrase}</p>
            <p><strong>Business Description:</strong> {user.company.bs}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDetails;
