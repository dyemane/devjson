interface KeyboardHelpProps {
  onClose: () => void;
}

const shortcuts = [
  { keys: "j / ↓", desc: "Next request" },
  { keys: "k / ↑", desc: "Previous request" },
  { keys: "Enter", desc: "Open selected request" },
  { keys: "Escape", desc: "Close detail / clear search" },
  { keys: "/ or Ctrl+F", desc: "Focus search" },
  { keys: "n / Shift+n", desc: "Next / previous search match" },
  { keys: "b", desc: "Pin / unpin selected request" },
  { keys: "p", desc: "Toggle JSONPath query" },
  { keys: "?", desc: "Toggle this help" },
];

export function KeyboardHelp({ onClose }: KeyboardHelpProps) {
  return (
    <div class="keyboard-help__overlay" onClick={onClose}>
      <div class="keyboard-help" onClick={(e) => e.stopPropagation()}>
        <div class="keyboard-help__header">
          <span class="keyboard-help__title">Keyboard Shortcuts</span>
          <button class="keyboard-help__close" onClick={onClose}>✕</button>
        </div>
        <div class="keyboard-help__body">
          {shortcuts.map((s) => (
            <div class="keyboard-help__row" key={s.keys}>
              <span class="keyboard-help__keys">{s.keys}</span>
              <span class="keyboard-help__desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
