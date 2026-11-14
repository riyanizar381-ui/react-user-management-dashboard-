
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import UserList from '../components/UserList';
import { ThemeProvider } from '../context/ThemeContext';
import type { User } from '../types/User';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@example.com',
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998',
      geo: { lat: '-37.3159', lng: '81.1496' },
    },
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'ervin@example.com',
    phone: '010-692-6593',
    website: 'anastasia.net',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566',
      geo: { lat: '-43.9509', lng: '-34.4618' },
    },
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains',
    },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'clementine@example.com',
    phone: '1-463-123-4447',
    website: 'ramiro.info',
    address: {
      street: 'Douglas Extension',
      suite: 'Suite 847',
      city: 'McKenziehaven',
      zipcode: '59590',
      geo: { lat: '-68.6102', lng: '-47.0653' },
    },
    company: {
      name: 'Romaguera-Jacobson',
      catchPhrase: 'Face to face bifurcated interface',
      bs: 'e-enable strategic applications',
    },
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    username: 'Karianne',
    email: 'patricia@example.com',
    phone: '493-170-9623',
    website: 'kale.biz',
    address: {
      street: 'Hoeger Mall',
      suite: 'Apt. 692',
      city: 'South Elvis',
      zipcode: '53919',
      geo: { lat: '29.4572', lng: '-164.2990' },
    },
    company: {
      name: 'Robel-Corkery',
      catchPhrase: 'Multi-tiered zero tolerance productivity',
      bs: 'transition cutting-edge web services',
    },
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    username: 'Kamren',
    email: 'chelsey@example.com',
    phone: '1-463-123-9352',
    website: 'demarco.info',
    address: {
      street: 'Skiles Walks',
      suite: 'Suite 351',
      city: 'Roscoeview',
      zipcode: '33263',
      geo: { lat: '-31.8129', lng: '62.5342' },
    },
    company: {
      name: 'Keebler LLC',
      catchPhrase: 'User-centric fault-tolerant solution',
      bs: 'revolutionize end-to-end systems',
    },
  },
  {
    id: 6,
    name: 'Dennis Schulist',
    username: 'Leopoldo_Corkery',
    email: 'dennis@example.com',
    phone: '1-570-555-1234',
    website: 'demarco.info',
    address: {
      street: 'Norberto Crossing',
      suite: 'Apt. 950',
      city: 'South Christy',
      zipcode: '23505',
      geo: { lat: '24.8918', lng: '21.8984' },
    },
    company: {
      name: 'Considine-Lockman',
      catchPhrase: 'Synchronised bottom-line interface',
      bs: 'e-enable innovative applications',
    },
  },
];

const mockFetch = jest.fn();

function renderUserList() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    </ThemeProvider>
  );
}

async function waitForUsers() {
  expect(
    await screen.findByText('User Management')
  ).toBeInTheDocument();

  expect(await screen.findByText('Leanne Graham')).toBeInTheDocument();
}

describe('UserList Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    global.fetch = mockFetch;

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('displays loading message while users are being fetched', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    renderUserList();

    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  test('displays users after successful API request', async () => {
    renderUserList();

    await waitForUsers();

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
  });

  test('displays user information correctly', async () => {
    renderUserList();

    await waitForUsers();

    expect(screen.getByText('Username: Bret')).toBeInTheDocument();
    expect(screen.getByText('Email: leanne@example.com')).toBeInTheDocument();
    expect(screen.getByText('Company: Romaguera-Crona')).toBeInTheDocument();
    expect(screen.getByText('City: Gwenborough')).toBeInTheDocument();
  });

  test('searches users by name', async () => {
    renderUserList();

    await waitForUsers();

    const searchInput = screen.getByPlaceholderText(
      'Search by name, username or email...'
    );

    jest.useFakeTimers();

    fireEvent.change(searchInput, {
      target: { value: 'Ervin' },
    });

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  test('searches users by username', async () => {
    renderUserList();

    await waitForUsers();

    const searchInput = screen.getByPlaceholderText(
      'Search by name, username or email...'
    );

    jest.useFakeTimers();

    fireEvent.change(searchInput, {
      target: { value: 'Antonette' },
    });

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  test('searches users by email', async () => {
    renderUserList();

    await waitForUsers();

    const searchInput = screen.getByPlaceholderText(
      'Search by name, username or email...'
    );

    jest.useFakeTimers();

    fireEvent.change(searchInput, {
      target: { value: 'clementine@example.com' },
    });

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  test('adds a user to favorites and saves it to localStorage', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add Leanne Graham to favorites',
      })
    );

    expect(
      screen.getByRole('button', {
        name: 'Remove Leanne Graham from favorites',
      })
    ).toHaveAttribute('aria-pressed', 'true');

    await waitFor(() => {
      expect(localStorage.getItem('favorites')).toBe('[1]');
    });
  });

  test('removes a user from favorites', async () => {
    localStorage.setItem('favorites', '[1]');

    renderUserList();

    await waitForUsers();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remove Leanne Graham from favorites',
      })
    );

    expect(
      screen.getByRole('button', {
        name: 'Add Leanne Graham to favorites',
      })
    ).toHaveAttribute('aria-pressed', 'false');

    await waitFor(() => {
      expect(localStorage.getItem('favorites')).toBe('[]');
    });
  });

  test('loads saved favorites from localStorage', async () => {
    localStorage.setItem('favorites', '[1,2]');

    renderUserList();

    await waitForUsers();

    expect(screen.getByText('❤️ Favorite Users: 2')).toBeInTheDocument();
  });

  test('handles invalid favorites stored in localStorage', async () => {
    localStorage.setItem('favorites', '{"invalid":true}');

    renderUserList();

    await waitForUsers();

    expect(screen.getByText('❤️ Favorite Users: 0')).toBeInTheDocument();
  });

  test('handles malformed favorites JSON', async () => {
    localStorage.setItem('favorites', 'invalid-json');

    renderUserList();

    await waitForUsers();

    expect(screen.getByText('❤️ Favorite Users: 0')).toBeInTheDocument();
  });

  test('filters users by favorites', async () => {
    localStorage.setItem('favorites', '[1]');

    renderUserList();

    await waitForUsers();

    fireEvent.change(screen.getAllByRole('combobox')[4], {
      target: { value: 'favorites' },
    });

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
  });

  test('filters users by city', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.change(screen.getAllByRole('combobox')[2], {
      target: { value: 'Wisokyburgh' },
    });

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  test('filters users by company', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.change(screen.getAllByRole('combobox')[3], {
      target: { value: 'Keebler LLC' },
    });

    expect(screen.getByText('Chelsey Dietrich')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  test('sorts users by username', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'username' },
    });

    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent(
      'Ervin Howell'
    );
  });

  test('sorts users by email in descending order', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'email' },
    });

    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'desc' },
    });

    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent(
      'Patricia Lebsack'
    );
  });

  test('displays the next page when Next is clicked', async () => {
    renderUserList();

    await waitForUsers();

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Patricia Lebsack')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  test('returns to the previous page', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
  });

  test('disables Previous button on the first page', async () => {
    renderUserList();

    await waitForUsers();

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  test('disables Next button on the last page', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  test('displays empty state when search has no matching users', async () => {
    renderUserList();

    await waitForUsers();

    const searchInput = screen.getByPlaceholderText(
      'Search by name, username or email...'
    );

    jest.useFakeTimers();

    fireEvent.change(searchInput, {
      target: { value: 'NoMatchingUser' },
    });

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  test('resets filters and sorting', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.change(screen.getAllByRole('combobox')[2], {
      target: { value: 'Wisokyburgh' },
    });

    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset Filters' }));

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('toggles dark mode', async () => {
    renderUserList();

    await waitForUsers();

    fireEvent.click(screen.getByRole('button', { name: '🌙 Dark Mode' }));

    expect(
      screen.getByRole('button', { name: '☀️ Light Mode' })
    ).toBeInTheDocument();
  });

  test('displays an error message when API request fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderUserList();

    expect(
      await screen.findByText(
        'Unable to load users. Please try again.'
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  test('displays an error when API responds with a non-success status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => [],
    });

    renderUserList();

    expect(
      await screen.findByText(
        'Unable to load users. Please try again.'
      )
    ).toBeInTheDocument();
  });

  test('retries the API request when Retry is clicked', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

    renderUserList();

    expect(
      await screen.findByText(
        'Unable to load users. Please try again.'
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test('exports filtered users to CSV', async () => {
    const createObjectURL = jest.fn(() => 'blob:test-url');
    const revokeObjectURL = jest.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });

    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    renderUserList();

    await waitForUsers();

    fireEvent.click(
      screen.getByRole('button', { name: '📥 Export Users to CSV' })
    );

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  test('disables CSV export when no users match', async () => {
    renderUserList();

    await waitForUsers();

    const searchInput = screen.getByPlaceholderText(
      'Search by name, username or email...'
    );

    jest.useFakeTimers();

    fireEvent.change(searchInput, {
      target: { value: 'NoMatchingUser' },
    });

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(
      screen.getByRole('button', { name: '📥 Export Users to CSV' })
    ).toBeDisabled();
  });
});
