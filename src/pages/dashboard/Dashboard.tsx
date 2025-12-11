import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  Layers, 
  TrendingUp, 
  Calculator,
  ArrowUpLeft,
  ArrowDownLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { 
    label: 'المشاريع النشطة', 
    value: '12', 
    icon: FolderKanban, 
    change: '+2', 
    trend: 'up',
    color: 'text-primary'
  },
  { 
    label: 'الوحدات المحسوبة', 
    value: '48', 
    icon: Layers, 
    change: '+8', 
    trend: 'up',
    color: 'text-accent'
  },
  { 
    label: 'التكلفة الإجمالية', 
    value: '15,420 ج.م', 
    icon: Calculator, 
    change: '-5%', 
    trend: 'down',
    color: 'text-primary'
  },
  { 
    label: 'المواد المستخدمة', 
    value: '24 لوح', 
    icon: TrendingUp, 
    change: '+12%', 
    trend: 'up',
    color: 'text-accent'
  },
];

const recentProjects = [
  { id: '1', name: 'مطبخ فيلا المعادي', client: 'أحمد محمد', units: 8, updatedAt: 'منذ ساعتين' },
  { id: '2', name: 'مطبخ شقة مدينة نصر', client: 'سارة أحمد', units: 5, updatedAt: 'منذ يوم' },
  { id: '3', name: 'مطبخ عمارة الشروق', client: 'محمد علي', units: 12, updatedAt: 'منذ 3 أيام' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">
          مرحباً، {user?.name || 'مستخدم'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          إليك نظرة عامة على نشاطك اليوم
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            className="glass-card p-5 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg bg-primary/10 p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpLeft className="h-3 w-3" />
                ) : (
                  <ArrowDownLeft className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold">أحدث المشاريع</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/projects">عرض الكل</Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              to={`/dashboard/projects/${project.id}`}
              className="flex items-center justify-between p-5 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.client}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{project.units} وحدة</p>
                <p className="text-xs text-muted-foreground">{project.updatedAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Link
          to="/dashboard/projects/new"
          className="glass-card flex items-center gap-4 p-5 transition-all hover:border-primary/30 hover-lift"
        >
          <div className="rounded-xl bg-primary/10 p-3">
            <FolderKanban className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">مشروع جديد</p>
            <p className="text-sm text-muted-foreground">ابدأ مشروع مطبخ جديد</p>
          </div>
        </Link>

        <Link
          to="/dashboard/cutting-settings"
          className="glass-card flex items-center gap-4 p-5 transition-all hover:border-primary/30 hover-lift"
        >
          <div className="rounded-xl bg-accent/10 p-3">
            <Calculator className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="font-medium">إعدادات التقطيع</p>
            <p className="text-sm text-muted-foreground">خصص معايير التقطيع</p>
          </div>
        </Link>

        <Link
          to="/dashboard/store"
          className="glass-card flex items-center gap-4 p-5 transition-all hover:border-primary/30 hover-lift"
        >
          <div className="rounded-xl bg-primary/10 p-3">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">المتجر</p>
            <p className="text-sm text-muted-foreground">تصفح المنتجات والمواد</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
