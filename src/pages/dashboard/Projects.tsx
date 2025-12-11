import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FolderKanban, Calendar, User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Project } from '@/lib/api';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'مطبخ فيلا المعادي',
    client: 'أحمد محمد',
    description: 'مطبخ فاخر على شكل حرف U مع جزيرة',
    units_count: 8,
    created_at: '2024-01-15',
    updated_at: '2024-01-20',
  },
  {
    id: '2',
    name: 'مطبخ شقة مدينة نصر',
    client: 'سارة أحمد',
    description: 'مطبخ عصري مستطيل الشكل',
    units_count: 5,
    created_at: '2024-01-10',
    updated_at: '2024-01-18',
  },
  {
    id: '3',
    name: 'مطبخ عمارة الشروق',
    client: 'محمد علي',
    description: 'مطبخ كبير للمطعم',
    units_count: 12,
    created_at: '2024-01-05',
    updated_at: '2024-01-17',
  },
];

export default function Projects() {
  const [search, setSearch] = useState('');
  const [projects] = useState<Project[]>(mockProjects);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.includes(search) ||
      p.client.includes(search) ||
      p.description.includes(search)
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">المشاريع</h1>
          <p className="mt-1 text-muted-foreground">
            إدارة جميع مشاريع المطابخ الخاصة بك
          </p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/dashboard/projects/new">
            <Plus className="h-5 w-5" />
            مشروع جديد
          </Link>
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-md"
      >
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث في المشاريع..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pr-10"
        />
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
          >
            <Link
              to={`/dashboard/projects/${project.id}`}
              className="glass-card group block p-5 transition-all hover:border-primary/30 hover-lift"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                </div>
              </div>

              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5" />
                  {project.client}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(project.updated_at).toLocaleDateString('ar-EG')}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium">{project.units_count} وحدة</span>
                <span className="text-xs text-primary group-hover:underline">
                  عرض التفاصيل ←
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card flex flex-col items-center justify-center py-16 text-center"
        >
          <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">لا توجد مشاريع</h3>
          <p className="mb-6 text-muted-foreground">
            {search ? 'لا توجد نتائج مطابقة للبحث' : 'ابدأ بإنشاء مشروعك الأول'}
          </p>
          {!search && (
            <Button variant="hero" asChild>
              <Link to="/dashboard/projects/new">
                <Plus className="h-5 w-5" />
                إنشاء مشروع
              </Link>
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
