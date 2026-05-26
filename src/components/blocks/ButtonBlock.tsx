interface ButtonBlockProps {
  ButtonText?: string;
  ButtonUrl?: { default?: string };
  ButtonClass?: string;
  ButtonType?: string;
  ButtonVariant?: string;
  displaySettings?: Record<string, string>;
}

export default function ButtonBlock({
  ButtonText,
  ButtonUrl,
  ButtonVariant,
}: ButtonBlockProps) {
  if (!ButtonText) return null;

  const href = ButtonUrl?.default || "#";
  const isPrimary = ButtonVariant === "primary" || !ButtonVariant;

  return (
    <a
      href={href}
      className={`inline-flex items-center rounded-md px-6 py-3 text-base font-semibold shadow-sm transition-colors ${
        isPrimary
          ? "bg-indigo-600 text-white hover:bg-indigo-500"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {ButtonText}
    </a>
  );
}
