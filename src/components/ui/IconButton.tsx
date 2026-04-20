interface IconButtonProps {
  onClick:  () => void;
  title?:   string;
  danger?:  boolean;
  children: React.ReactNode;
}

export default function IconButton({ onClick, title, danger, children }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`icon-btn${danger ? ' icon-btn--danger' : ''}`}
    >
      {children}
    </button>
  );
}
