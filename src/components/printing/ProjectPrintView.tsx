
import { Project } from "@/lib/api";
import { getEdgeMarks, partNameMap, unitTypeLabels } from "@/lib/translations";

interface ProjectPrintViewProps {
  project: Project;
}

export const ProjectPrintView = ({ project }: ProjectPrintViewProps) => {
  // 1. Process all units and categorize parts
  const allMainParts: any[] = [];
  const allBackParts: any[] = [];
  const allDoorParts: any[] = [];

  project.units.forEach((unit) => {
    // Determine Unit Name/Label
    const unitLabel = unitTypeLabels[unit.type] || unit.type;
    const unitDisplayName = `${unitLabel} (${unit.width_cm}cm)`;

    const unitMain: any[] = [];
    const unitBack: any[] = [];
    const unitDoor: any[] = [];

    unit.parts?.forEach((part) => {
      const nameLower = part.name.toLowerCase();
      // Enrich part with unit info for display
      const enrichedPart = { ...part, unitName: unitDisplayName }; // unitName will be used for grouping

      if (nameLower.includes("door") || nameLower.includes("front")) {
        unitDoor.push(enrichedPart);
      } else if (nameLower.includes("back_panel")) {
        unitBack.push(enrichedPart);
      } else {
        unitMain.push(enrichedPart);
      }
    });

    // Add to global lists (structured as blocks of parts belonging to a unit)
    if (unitMain.length > 0) allMainParts.push({ unitName: unitDisplayName, parts: unitMain });
    if (unitBack.length > 0) allBackParts.push({ unitName: unitDisplayName, parts: unitBack });
    if (unitDoor.length > 0) allDoorParts.push({ unitName: unitDisplayName, parts: unitDoor });
  });

  const sectionStyle = "mb-8 break-inside-avoid";
  const tableStyle = "w-full text-center border-collapse text-sm mb-4";
  const thStyle = "border border-black p-1 bg-gray-100 font-bold whitespace-nowrap";
  const tdStyle = "border border-black p-1";

  const renderConsolidatedTable = (title: string, unitGroups: any[]) => {
    if (unitGroups.length === 0) return null;

    return (
      <div className={sectionStyle}>
        <h3 className="font-bold text-xl mb-3 border-b-2 border-black pb-1">{title}</h3>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th className={thStyle}>اسم الوحدة</th>
              <th className={thStyle}>اسم القطعة</th>
              <th className={thStyle}>العرض</th>
              <th className={thStyle}>الارتفاع</th>
              <th className={thStyle}>الكمية</th>
              <th className={`${thStyle} bg-gray-200`}>الرمز</th>
              <th className={thStyle}>أعلى</th>
              <th className={thStyle}>شمال</th>
              <th className={thStyle}>أسفل</th>
              <th className={thStyle}>يمين</th>
              <th className={thStyle}>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {unitGroups.map((group, groupIndex) => {
              const bgClass = groupIndex % 2 === 0 ? "bg-white" : "bg-gray-50";
              return group.parts.map((part: any, partIndex: number) => {
                const marks = getEdgeMarks(part.edge_code || "-");
                const displayName = partNameMap[part.name] || partNameMap[part.name.toLowerCase()] || part.name;
                const isFirst = partIndex === 0;

                return (
                  <tr key={`${groupIndex}-${partIndex}`} className={bgClass}>
                    {/* Unit Name Cell - Spanning Rows */}
                    {isFirst && (
                      <td 
                        className={`${tdStyle} font-bold align-middle bg-white`} 
                        rowSpan={group.parts.length}
                        style={{ verticalAlign: 'middle' }}
                      >
                        {group.unitName}
                      </td>
                    )}
                    
                    <td className={tdStyle}>{displayName}</td>
                    <td className={tdStyle}>{part.width_cm}</td>
                    <td className={tdStyle}>{part.height_cm}</td>
                    <td className={`${tdStyle} font-bold`}>{part.qty || part.quantity || 1}</td>
                    
                    {/* Edge Code Highlight */}
                    <td className={`${tdStyle} font-bold ${part.edge_code ? 'bg-yellow-50 text-orange-600' : ''}`}>
                         {part.edge_code || "-"}
                    </td>
                    
                    <td className={`${tdStyle} text-xs font-mono`}>{marks.top}</td>
                    <td className={`${tdStyle} text-xs font-mono`}>{marks.left}</td>
                    <td className={`${tdStyle} text-xs font-mono`}>{marks.bottom}</td>
                    <td className={`${tdStyle} text-xs font-mono`}>{marks.right}</td>
                    <td className={`${tdStyle} text-xs`}>{part.description || ""}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    );
  };

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

        {renderConsolidatedTable("القطع الأساسية", allMainParts)}
        <div className="break-before-page" /> {/* Page break between sections if needed, or removing it keeps it continuous */}
        {renderConsolidatedTable("الضهر", allBackParts)}
        <div className="break-before-page" />
        {renderConsolidatedTable("الضلف", allDoorParts)}
    </div>
  );
};
