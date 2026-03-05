
import { Unit } from "@/lib/api";
import { partNameMap, unitTypeLabels } from "@/lib/translations";

interface UnitPrintViewProps {
  unit: Unit;
  showTitle?: boolean;
}

export const UnitPrintView = ({ unit, showTitle = true }: UnitPrintViewProps) => {
  // Use all parts directly without grouping
  const parts = unit.parts || [];

  return (
    <div className="mb-8 p-4 print-section break-inside-avoid" dir="rtl">
      {showTitle && (
        <div className="mb-4">
          <table className="unit-header-table">
            <tbody>
              <tr>
                <td style={{ textAlign: 'right', width: '50%' }}>
                  <h2>{unitTypeLabels[unit.type] || unit.type}</h2>
                  <p>أبعاد: {unit.width_cm} × {unit.height_cm} × {unit.depth_cm}</p>
                </td>
                <td style={{ textAlign: 'left', width: '50%', verticalAlign: 'bottom' }}>
                  <p>المساحة: {unit.total_area_m2.toFixed(2)} م²</p>
                  <p>الشريط: {unit.total_edge_band_m ? unit.total_edge_band_m.toFixed(2) : '0.00'} م</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-6 break-inside-avoid">
        <table className="w-full text-center border-collapse text-sm parts-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>م</th>
              <th>القطعة</th>
              <th>العرض</th>
              <th>الارتفاع</th>
              <th>الكمية</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, i) => {
              const displayName = partNameMap[part.name] || partNameMap[part.name.toLowerCase()] || part.name;

              // Clean up long decimals for display
              const formatDim = (val: number) => {
                if (val === undefined || val === null) return "-";
                return Number.isInteger(val) ? val : Number(val).toFixed(1);
              };

              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 'bold' }}>{displayName}</td>
                  <td>{formatDim(part.width_cm)}</td>
                  <td>{formatDim(part.height_cm)}</td>
                  <td style={{ fontWeight: 'bold' }}>{part.qty || (part as any).quantity || 1}</td>
                  <td style={{ fontSize: '12px' }}>{(part as any).description || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
