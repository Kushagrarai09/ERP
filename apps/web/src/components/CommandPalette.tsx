import React, { useState, useEffect } from 'react';

interface Command {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  commands: Command[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  isOpen = false,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(commands);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!query) {
      setFilteredCommands(commands);
    } else {
      setFilteredCommands(
        commands.filter(
          (cmd) =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description?.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    setSelectedIndex(0);
  }, [query, commands]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Toggle command palette
      }
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          filteredCommands[selectedIndex]?.action();
          onClose?.();
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay">
      <div className="command-palette">
        <input
          type="text"
          className="command-palette-input"
          placeholder="Type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="command-palette-results">
          {filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              className={`command-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => {
                cmd.action();
                onClose?.();
              }}
            >
              <div className="command-item-label">{cmd.label}</div>
              {cmd.description && (
                <div className="command-item-description">{cmd.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
