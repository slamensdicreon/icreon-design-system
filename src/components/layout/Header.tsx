import Link from "next/link";

const navigation = [
  { name: "Solutions", href: "/solutions" },
  { name: "Products", href: "/products" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Icreon
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="hidden rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 md:block"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
