
import { useState } from 'react';
import {
    Settings2,
    ChevronDown,
    ChevronUp,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { type SettingsModel } from '@/lib/api';
import {
    assemblyMethods,
    handleTypes,
    edgeBandingOptions,
    PART_LABELS
} from '@/lib/settings_constants';

interface UnitSettingsOverrideProps {
    settings: Partial<SettingsModel>;
    onSettingsChange: (settings: Partial<SettingsModel>) => void;
    defaultSettings?: SettingsModel; // To show placeholders or reset
    className?: string;
}

export function UnitSettingsOverride({
    settings,
    onSettingsChange,
    defaultSettings,
    className
}: UnitSettingsOverrideProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (key: keyof SettingsModel, value: any) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handleNumericChange = (key: keyof SettingsModel, value: string) => {
        let numValue = value === '' ? undefined : parseFloat(value);
        if (numValue !== undefined && isNaN(numValue)) numValue = 0;

        onSettingsChange({ ...settings, [key]: numValue });
    };

    const handlePartEdgeChange = (partKey: string, value: string) => {
        onSettingsChange({
            ...settings,
            part_edge_settings: {
                ...(settings.part_edge_settings || (defaultSettings?.part_edge_settings || {})),
                [partKey]: value
            } as any
        });
    };

    const getValue = (key: keyof SettingsModel): string | number | undefined => {
        const val = settings[key] !== undefined ? settings[key] : (defaultSettings ? defaultSettings[key] : undefined);
        if (typeof val === 'object') return ''; // Handle PartEdgeSettings or Materials
        return val as string | number | undefined;
    };

    const getPartEdgeValue = (key: string) => {
        if (settings.part_edge_settings && (settings.part_edge_settings as any)[key]) {
            return (settings.part_edge_settings as any)[key];
        }
        if (defaultSettings?.part_edge_settings && (defaultSettings.part_edge_settings as any)[key]) {
            return (defaultSettings.part_edge_settings as any)[key];
        }
        return '-';
    };

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={`border rounded-lg bg-card text-card-foreground shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between p-4 px-6">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent font-semibold flex items-center gap-2 w-full justify-start">
                        <Settings2 className="h-4 w-4 text-primary" />
                        إعدادات مخصصة لهذه الوحدة
                        {isOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                    </Button>
                </CollapsibleTrigger>
                {Object.keys(settings).length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        title="إعادة تعيين"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSettingsChange({});
                        }}
                    >
                        <RotateCcw className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <CollapsibleContent className="space-y-6 p-6 pt-0 animate-in slide-in-from-top-2">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Assembly */}
                    <div className="space-y-4 border rounded-md p-4">
                        <h3 className="font-semibold text-sm text-foreground/80 mb-2">طريقة التجميع</h3>
                        <div className="space-y-2">
                            <Label className="text-xs">نظام التجميع</Label>
                            <Select
                                value={getValue('assembly_method') as string}
                                onValueChange={(value) => handleInputChange('assembly_method', value)}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="الافتراضي" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(assemblyMethods).map(([key, label]) => (
                                        <SelectItem key={key} value={key} className="text-right text-xs">
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">نوع المقبض</Label>
                            <Select
                                value={getValue('handle_type') as string}
                                onValueChange={(value) => handleInputChange('handle_type', value)}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="الافتراضي" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(handleTypes).map(([key, label]) => (
                                        <SelectItem key={key} value={key} className="text-right text-xs">
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Edge Banding */}
                    <div className="space-y-4 border rounded-md p-4 md:col-span-2">
                        <h3 className="font-semibold text-sm text-foreground/80 mb-2">إعدادات الشريط (Front/Back)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(PART_LABELS).map(([key, label]) => (
                                <div key={key} className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">{label}</Label>
                                    <Select
                                        value={getPartEdgeValue(key)}
                                        onValueChange={(value) => handlePartEdgeChange(key, value)}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {Object.entries(edgeBandingOptions).map(([optKey, optLabel]) => (
                                                <SelectItem key={optKey} value={optKey} className="text-right text-xs">
                                                    <span className="flex items-center gap-2">
                                                        <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-[10px] min-w-[24px] text-center">{optKey}</span>
                                                        <span className="truncate max-w-[150px]">{optLabel.split(' : ')[1] || optLabel}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-4 border rounded-md p-4 md:col-span-2">
                        <h3 className="font-semibold text-sm text-foreground/80 mb-2">تعديل أبعاد خاصة</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'سمك الكونتر', key: 'counter_thickness' },
                                { label: 'خصم الظهر', key: 'back_deduction' },
                                { label: 'خصم عرض الضلفة', key: 'door_width_deduction_no_edge' },
                                { label: 'عمق المفحار', key: 'router_depth' },
                            ].map((item) => (
                                <div key={item.key} className="space-y-1">
                                    <Label className="text-xs">{item.label}</Label>
                                    <Input
                                        type="number"
                                        className="h-8 text-xs"
                                        value={getValue(item.key as keyof SettingsModel)}
                                        onChange={(e) => handleNumericChange(item.key as keyof SettingsModel, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
