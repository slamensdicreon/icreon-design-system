import Link from "next/link";

const footerLinks = {
  Solutions: [
    { name: "Enterprise", href: "/solutions/enterprise" },
    { name: "Consulting", href: "/solutions/consulting" },
    { name: "Digital Transformation", href: "/solutions/digital-transformation" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Documentation", href: "/docs" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-slate-900">Icreon</p>
            <p className="mt-2 text-sm text-slate-600">
              Enterprise solutions for the modern web.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-900">
                {category}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Icreon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
