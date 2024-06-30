import { describe, it, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import InputOption from '../../../components/genral/input_option';
import DeleteIcon from "@mui/icons-material/Delete";
import '@testing-library/jest-dom';

describe('InputOption Component', () => {
    const mockOnEnter = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should render delete option initially', () => {
        render(
            <InputOption
                icon={<DeleteIcon />}
                title="Delete File"
                tooltip="Click to delete file"
                onEnter={mockOnEnter}
                disableToolTip={false}
            />
        );

        const deleteMenuItem = screen.getByText('Delete File');
        expect(deleteMenuItem).toBeInTheDocument();
    });
    it('should render input field on click and handle create file', async () => {
        render(
            <InputOption
                icon={<DeleteIcon />}
                title="Delete File"
                tooltip="Click to delete file"
                onEnter={mockOnEnter}
                disableToolTip={false}
            />
        );

        const deleteSpan = screen.getByText('Delete File');
        fireEvent.click(deleteSpan);

        const input = await screen.findByRole('textbox');
        fireEvent.change(input, { target: { value: 'test-file.txt' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockOnEnter).toHaveBeenCalledWith('test-file.txt');
    });
});
