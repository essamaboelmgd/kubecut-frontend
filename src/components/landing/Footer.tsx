import { Link } from 'react-router-dom';
import { ChefHat, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'الميزات', href: '#features' },
    { label: 'التسعير', href: '#pricing' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
  ],
  company: [
    { label: 'عن الشركة', href: '#about' },
    { label: 'تواصل معنا', href: '#contact' },
    { label: 'المدونة', href: '#blog' },
  ],
  legal: [
    { label: 'سياسة الخصوصية', href: '#privacy' },
    { label: 'الشروط والأحكام', href: '#terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ChefHat className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">قطّع</span>
            </Link>
            <p className="mb-6 text-sm text-muted-foreground">
              منصة متكاملة لحساب وتقطيع وحدات المطابخ للنجارين والصنايعية
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@qattaa.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span dir="ltr">+20 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>القاهرة، مصر</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">المنتج</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">الشركة</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">قانوني</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} قطّع. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
