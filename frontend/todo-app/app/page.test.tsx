import { render, screen } from '@testing-library/react';
import Home from './page'; // Ensure this path is correct
import * as ToastHook from '@/hooks/use-toast';
import axios from 'axios';

jest.mock('axios');
jest.mock('@/hooks/use-toast');

describe('Home Component', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    // Use jest.MockedFunction to type the mock
    
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] }); // Mock fetchTodos
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] }); // Mock fetchUsers
  });

  test('renders todo list', () => {
    render(<Home />);
    expect(screen.getByText(/add new todo/i)).toBeTruthy(); // Check button existence
  });
});
