import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../../components/Tooltip';

describe('Tooltip', () => {
  it('should render children when no content provided', () => {
    render(
      <Tooltip>
        <button>Click me</button>
      </Tooltip>
    );
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

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

  it('should format content with line breaks after periods', () => {
    render(
      <Tooltip content="First sentence. Second sentence.">
        <button>Hover</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    const wrapper = button.closest('.tooltip-wrapper');
    
    fireEvent.mouseEnter(wrapper);
    
    const tooltip = screen.getByText(/first sentence/i);
    expect(tooltip.textContent).toContain('First sentence.\nSecond sentence.');
  });

  it('should apply correct position class', () => {
    render(
      <Tooltip content="Tooltip" position="bottom">
        <button>Hover</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    const wrapper = button.closest('.tooltip-wrapper');
    
    fireEvent.mouseEnter(wrapper);
    
    const tooltip = screen.getByText('Tooltip');
    expect(tooltip).toHaveClass('tooltip-bottom');
  });

  it('should handle all position variants', () => {
    const positions = ['top', 'bottom', 'left', 'right'];
    
    positions.forEach(position => {
      const { unmount } = render(
        <Tooltip content="Tooltip" position={position}>
          <button>Hover</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button');
      const wrapper = button.closest('.tooltip-wrapper');
      
      fireEvent.mouseEnter(wrapper);
      
      const tooltip = screen.getByText('Tooltip');
      expect(tooltip).toHaveClass(`tooltip-${position}`);
      
      unmount();
    });
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
