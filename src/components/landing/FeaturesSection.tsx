import { motion } from 'framer-motion';
import { 
  Calculator, 
  Settings2, 
  FolderKanban, 
  Receipt, 
  ShoppingCart,
  Layers,
  Ruler,
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'حساب وحدات المطابخ',
    description: 'احسب جميع أنواع الوحدات (أرضية، حائطية، مزدوجة) بدقة متناهية مع كل القياسات',
  },
  {
    icon: Settings2,
    title: 'إعدادات التقطيع',
    description: 'تخصيص كامل لإعدادات التقطيع، سمك الألواح، طريقة التجميع، ونوع المقابض',
  },
  {
    icon: FolderKanban,
    title: 'إدارة المشاريع',
    description: 'نظّم مشاريعك بسهولة مع إمكانية إضافة عدة وحدات لكل مشروع وتتبع التقدم',
  },
  {
    icon: Receipt,
    title: 'تكلفة المواد',
    description: 'احسب تكلفة المواد تلقائياً بناءً على أسعار السوق الحالية وكميات الاستخدام',
  },
  {
    icon: Layers,
    title: 'توزيع الشرائط',
    description: 'تفاصيل دقيقة لتوزيع شريط الحافة على كل قطعة مع حساب الإجمالي',
  },
  {
    icon: Ruler,
    title: 'قياسات احترافية',
    description: 'قياسات دقيقة للخلوصات والتداخلات مع مراعاة جميع المعايير الصناعية',
  },
  {
    icon: ShoppingCart,
    title: 'متجر المنتجات',
    description: 'تصفح وشراء المواد والأدوات مباشرة من المتجر بأفضل الأسعار',
  },
  {
    icon: BarChart3,
    title: 'تقارير مفصلة',
    description: 'تقارير شاملة لكل مشروع تشمل القياسات والتكاليف وقوائم المواد',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium text-primary">
            الميزات
          </span>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            كل ما تحتاجه في مكان واحد
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            منصة متكاملة تجمع كل الأدوات التي يحتاجها النجار المحترف لإنجاز عمله بدقة وسرعة
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group glass-card p-6 transition-all duration-300 hover:border-primary/30"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
