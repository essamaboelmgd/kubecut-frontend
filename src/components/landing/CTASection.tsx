import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'تجربة مجانية بدون التزام',
  'دعم فني متواصل',
  'تحديثات مستمرة',
  'واجهة عربية بالكامل',
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            ابدأ رحلتك الاحترافية اليوم
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            انضم إلى آلاف النجارين الذين يستخدمون قطّع لتحسين إنتاجيتهم ودقة عملهم
          </p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-4"
          >
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {benefit}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/register">
                سجّل الآن مجاناً
                <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
