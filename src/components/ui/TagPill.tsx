interface TagPillProps {
  name: string;
  color: string;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export function TagPill({ name, color, onRemove, size = "sm" }: TagPillProps) {
  // Generate a readable text color (white or dark) based on background
  const textColor = isLightColor(color) ? "#1a202c" : "#ffffff";

  return (
    <span
      className={`tag-pill tag-pill-${size}`}
      style={{ backgroundColor: color, color: textColor }}
    >
      {name}
      {onRemove && (
        <button
          className="tag-pill-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`${name} etiketini kaldır`}
        >
          ×
        </button>
      )}
    </span>
  );
}

/** Luminance check: returns true if the hex color is "light" */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
