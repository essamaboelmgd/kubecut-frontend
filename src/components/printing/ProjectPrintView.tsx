
import { Project } from "@/lib/api";
import { UnitPrintView } from "./UnitPrintView";

interface ProjectPrintViewProps {
  project: Project;
}

export const ProjectPrintView = ({ project }: ProjectPrintViewProps) => {
  return (
    <div dir="rtl" className="p-4 print-content">
        {/* Project Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <div className="flex justify-center gap-8 text-lg">
                <p>العميل: {project.client_name}</p>
                <p>عدد الوحدات: {project.units.length}</p>
                <p>التاريخ: {new Date(project.updated_at || project.created_at).toLocaleDateString('ar-EG')}</p>
            </div>
        </div>

        <div className="space-y-8">
            {project.units.map((unit) => (
                <div key={unit.id || (unit as any).unit_id} className="break-inside-avoid shadow-sm border border-gray-200 p-2 mb-4 rounded-lg">
                    <UnitPrintView unit={unit} />
                </div>
            ))}
        </div>
    </div>
  );
};
