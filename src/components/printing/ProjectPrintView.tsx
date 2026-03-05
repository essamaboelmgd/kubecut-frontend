
import { Project } from "@/lib/api";
import { UnitPrintView } from "./UnitPrintView";

interface ProjectPrintViewProps {
  project: Project;
}

export const ProjectPrintView = ({ project }: ProjectPrintViewProps) => {
  return (
    <div dir="rtl" className="p-4 print-content">
      {/* Project Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4" style={{ textAlign: 'center', borderBottom: '2px solid black', marginBottom: '30px', paddingBottom: '15px' }}>
        <h1 className="text-4xl font-bold mb-4" style={{ fontSize: '28px', fontWeight: 'bold' }}>{project.name}</h1>
        <table style={{ width: '100%', border: 'none', textAlign: 'center', fontSize: '18px' }}>
          <tbody>
            <tr>
              <td style={{ border: 'none' }}>العميل: {project.client_name}</td>
              <td style={{ border: 'none' }}>عدد الوحدات: {project.units.length}</td>
              <td style={{ border: 'none' }}>التاريخ: {new Date(project.updated_at || project.created_at).toLocaleDateString('ar-EG')}</td>
            </tr>
          </tbody>
        </table>
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
