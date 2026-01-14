
import { Unit } from "@/lib/api";
import { getEdgeMarks, partNameMap, unitTypeLabels } from "@/lib/translations";

interface UnitPrintViewProps {
  unit: Unit;
  showTitle?: boolean;
}

export const UnitPrintView = ({ unit, showTitle = true }: UnitPrintViewProps) => {
  // Group parts
  const mainParts: any[] = [];
  const backParts: any[] = [];
  const doorParts: any[] = [];

  unit.parts?.forEach((part) => {
    const nameLower = part.name.toLowerCase();
    if (nameLower.includes("door") || nameLower.includes("front")) {
      doorParts.push(part);
    } else if (nameLower.includes("back_panel")) {
      backParts.push(part);
    } else {
      mainParts.push(part);
    }
  });

  const renderTable = (title: string, parts: any[]) => {
    if (parts.length === 0) return null;

    return (
      <div className="mb-6 break-inside-avoid">
        <h3 className="font-bold text-lg mb-2 border-b border-black pb-1">{title}</h3>
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-black">
              <th className="border border-black p-1">القطعة</th>
              <th className="border border-black p-1">العرض</th>
              <th className="border border-black p-1">الارتفاع</th>
              <th className="border border-black p-1">الكمية</th>
              <th className="border border-black p-1 bg-gray-200">الرمز</th>
              <th className="border border-black p-1">أعلى</th>
              <th className="border border-black p-1">شمال</th>
              <th className="border border-black p-1">أسفل</th>
              <th className="border border-black p-1">يمين</th>
              <th className="border border-black p-1">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, i) => {
              const marks = getEdgeMarks((part as any).edge_code || "-");
              const displayName = partNameMap[part.name] || partNameMap[part.name.toLowerCase()] || part.name;
              return (
                <tr key={i} className="border-b border-black">
                  <td className="border border-black p-1 font-bold">{displayName}</td>
                  <td className="border border-black p-1">{part.width_cm}</td>
                  <td className="border border-black p-1">{part.height_cm}</td>
                  <td className="border border-black p-1 font-bold">{part.qty || (part as any).quantity || 1}</td>
                  <td className="border border-black p-1 font-bold bg-gray-50">{(part as any).edge_code || "-"}</td>
                  <td className="border border-black p-1 text-xs font-mono">{marks.top}</td>
                  <td className="border border-black p-1 text-xs font-mono">{marks.left}</td>
                  <td className="border border-black p-1 text-xs font-mono">{marks.bottom}</td>
                  <td className="border border-black p-1 text-xs font-mono">{marks.right}</td>
                  <td className="border border-black p-1 text-xs">{(part as any).description || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mb-8 p-4 print-section break-inside-avoid" dir="rtl">
        {showTitle && (
            <div className="mb-4 border-b-2 border-black pb-2 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold">{unitTypeLabels[unit.type] || unit.type}</h2>
                    <p className="text-sm">أبعاد: {unit.width_cm} × {unit.height_cm} × {unit.depth_cm}</p>
                </div>
                <div className="text-left text-sm">
                    <p>المساحة: {unit.total_area_m2.toFixed(2)} م²</p>
                    <p>الشريط: {unit.total_edge_band_m ? unit.total_edge_band_m.toFixed(2) : '0.00'} م</p>
                </div>
            </div>
        )}

        {renderTable("القطع الأساسية", mainParts)}
        {renderTable("الضهر", backParts)}
        {renderTable("الضلف", doorParts)}
    </div>
  );
};
