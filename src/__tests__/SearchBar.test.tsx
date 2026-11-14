
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  test('renders the search input', () => {
    render(
      <SearchBar searchTerm="" setSearchTerm={() => {}} />
    );

    expect(
      screen.getByPlaceholderText(
        'Search by name, username or email...'
      )
    ).toBeInTheDocument();
  });

  test('displays the entered search term', () => {
    render(
      <SearchBar searchTerm="Riya" setSearchTerm={() => {}} />
    );

    expect(
      screen.getByDisplayValue('Riya')
    ).toBeInTheDocument();
  });

  test('calls setSearchTerm when the user types', () => {
    const mockSetSearchTerm = jest.fn();

    render(
      <SearchBar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
      />
    );

    const input = screen.getByPlaceholderText(
      'Search by name, username or email...'
    );

    fireEvent.change(input, {
      target: { value: 'John' },
    });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('John');
  });
});
