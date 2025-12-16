import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  Layers, 
  TrendingUp, 
  Calculator,
  ArrowUpLeft,
  ArrowDownLeft,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi, type DashboardStats, type RecentProject, type TipOfTheDay, adsApi, Ad } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { AdCarousel } from '@/components/ads/AdCarousel';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [tip, setTip] = useState<TipOfTheDay | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, projectsData, tipData, adsData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentProjects(),
          dashboardApi.getTipOfTheDay(),
          adsApi.getAds('dashboard_banner')
        ]);
        
        setStats(statsData);
        setRecentProjects(projectsData);
        setTip(tipData);
        setAds(adsData);
      } catch (error) {
        console.error(error);
        toast({
          title: 'خطأ',
          description: 'فشل تحميل بيانات لوحة التحكم',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const statItems = [
    { 
      label: 'المشاريع النشطة', 
      value: stats?.projects.toString() || '0', 
      icon: FolderKanban, 
      change: '+2', // Demo value for change
      trend: 'up',
      color: 'text-primary'
    },
    { 
      label: 'الوحدات المحسوبة', 
      value: stats?.units.toString() || '0', 
      icon: Layers, 
      change: '+8', // Demo value
      trend: 'up',
      color: 'text-accent'
    },
    { 
      label: 'حسابات التقطيع', 
      value: stats?.cutting_calculations.toString() || '0', 
      icon: Calculator, 
      change: 'جديد', 
      trend: 'up',
      color: 'text-primary'
    },
    { 
      label: 'نسبة التوفير', 
      value: `${stats?.savings_percentage || 0}%`, 
      icon: TrendingUp, 
      change: '+12%', // Demo value
      trend: 'up',
      color: 'text-accent'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">
          مرحباً، {user?.full_name || 'مستخدم'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          إليك نظرة عامة على نشاطك اليوم
        </p>
      </motion.div>

      {/* Ads Banner */}
      {ads.length > 0 && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.05, duration: 0.5 }}
        >
            <AdCarousel ads={ads} />
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statItems.map((stat, index) => (
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

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card h-full"
        >
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-lg font-semibold">أحدث المشاريع</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/projects">عرض الكل</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between p-5 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FolderKanban className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{project.units} وحدة</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{project.date}</span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد مشاريع حديثة
              </div>
            )}
          </div>
        </motion.div>

        {/* Tip of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="glass-card h-full flex flex-col"
        >
          <div className="flex items-center gap-2 border-b border-border p-5">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold">{tip?.title || 'نصيحة اليوم'}</h2>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {tip?.content || 'جاري تحميل النصيحة...'}
            </p>
          </div>
        </motion.div>
      </div>

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
