import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../../components/Tooltip';

describe('Tooltip', () => {
  it('should show tooltip on hover', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button', { name: /hover me/i });
    const wrapper = button.closest('.tooltip-wrapper');
    
    fireEvent.mouseEnter(wrapper);
    
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });

  it('should hide tooltip on mouse leave', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button', { name: /hover me/i });
    const wrapper = button.closest('.tooltip-wrapper');
    
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    
    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('should handle non-string content', () => {
    render(
      <Tooltip content={<span>Custom content</span>}>
        <button>Hover</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    const wrapper = button.closest('.tooltip-wrapper');
    
    fireEvent.mouseEnter(wrapper);
    
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
