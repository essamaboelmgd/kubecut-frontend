
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
        if (typeof val === 'object') return '';
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

    const renderSectionHeader = (title: string, icon?: React.ReactNode) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
            {icon}
            <h3 className="font-semibold text-sm text-foreground/90">{title}</h3>
        </div>
    );

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={`border rounded-lg bg-card text-card-foreground shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between p-4 px-6 bg-muted/20">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent font-semibold flex items-center gap-2 w-full justify-start text-primary">
                        <Settings2 className="h-5 w-5" />
                        <span className="text-base">إعدادات مخصصة لهذه الوحدة</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 ml-auto text-muted-foreground" /> : <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />}
                    </Button>
                </CollapsibleTrigger>
                {Object.keys(settings).length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="إعادة تعيين الكل"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSettingsChange({});
                        }}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <CollapsibleContent className="p-6 pt-4 animate-in slide-in-from-top-2 space-y-8">

                {/* Section 1: Assembly */}
                <div>
                    {renderSectionHeader("طريقة التجميع")}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">نظام التجميع</Label>
                            <Select
                                value={getValue('assembly_method') as string}
                                onValueChange={(value) => handleInputChange('assembly_method', value)}
                            >
                                <SelectTrigger className="h-9 text-xs dir-rtl">
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
                            <Label className="text-xs font-medium">نوع المقبض</Label>
                            <Select
                                value={getValue('handle_type') as string}
                                onValueChange={(value) => handleInputChange('handle_type', value)}
                            >
                                <SelectTrigger className="h-9 text-xs dir-rtl">
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
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">ارتفاع قطاع المقبض</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    className="h-9 text-xs pr-2"
                                    value={getValue('handle_profile_height')}
                                    onChange={(e) => handleNumericChange('handle_profile_height', e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">سم</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">سقوط الضلفة</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    className="h-9 text-xs pr-2"
                                    value={getValue('chassis_handle_drop')}
                                    onChange={(e) => handleNumericChange('chassis_handle_drop', e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">سم</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Dimensions */}
                <div>
                    {renderSectionHeader("الأبعاد والخصومات")}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'سمك الكونتر', key: 'counter_thickness' },
                            { label: 'عرض المرآة', key: 'mirror_width' },
                            { label: 'خصم الظهر', key: 'back_deduction' },
                            { label: 'خصم الرف', key: 'shelf_depth_deduction' },
                            { label: 'خصم عرض الضلفة', key: 'door_width_deduction_no_edge' },
                            { label: 'خصم ارتفاع أرضي', key: 'ground_door_height_deduction_no_edge' },
                        ].map((item) => (
                            <div key={item.key} className="space-y-2">
                                <Label className="text-xs font-medium">{item.label}</Label>
                                <div className="relative group">
                                    <Input
                                        type="number"
                                        className="h-9 text-xs pr-2"
                                        value={getValue(item.key as keyof SettingsModel)}
                                        onChange={(e) => handleNumericChange(item.key as keyof SettingsModel, e.target.value)}
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground group-hover:text-primary transition-colors">سم</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Door Codes */}
                <div>
                    {renderSectionHeader("أكواد الضلف")}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">كود الضلف الأساسي</Label>
                            <Input
                                className="h-9 text-xs"
                                value={getValue('basic_door_code')}
                                onChange={(e) => handleInputChange('basic_door_code', e.target.value)}
                                placeholder="مثل: Basic"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">كود الضلف الإضافي</Label>
                            <Input
                                className="h-9 text-xs"
                                value={getValue('additional_door_code')}
                                onChange={(e) => handleInputChange('additional_door_code', e.target.value)}
                                placeholder="مثل: Additional"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 4: Router Settings */}
                <div>
                    {renderSectionHeader("إعدادات المفحار")}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'عمق المفحار', key: 'router_depth' },
                            { label: 'بعد المفحار', key: 'router_distance' },
                            { label: 'سمك المفحار', key: 'router_thickness' },
                        ].map((item) => (
                            <div key={item.key} className="space-y-2">
                                <Label className="text-xs font-medium">{item.label}</Label>
                                <div className="relative group">
                                    <Input
                                        type="number"
                                        className="h-9 text-xs pr-2"
                                        value={getValue(item.key as keyof SettingsModel)}
                                        onChange={(e) => handleNumericChange(item.key as keyof SettingsModel, e.target.value)}
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground group-hover:text-primary transition-colors">سم</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5: Edges */}
                <div>
                    {renderSectionHeader("لصق الشريط والمفحار")}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {Object.entries(PART_LABELS).map(([key, label]) => (
                            <div key={key} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40">
                                <Label className="w-1/3 text-xs font-medium text-muted-foreground line-clamp-2">{label}</Label>
                                <Select
                                    value={getPartEdgeValue(key)}
                                    onValueChange={(value) => handlePartEdgeChange(key, value)}
                                >
                                    <SelectTrigger className="flex-1 h-9 text-xs bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[250px]">
                                        {Object.entries(edgeBandingOptions).map(([optKey, optLabel]) => (
                                            <SelectItem key={optKey} value={optKey} className="text-right text-xs py-2">
                                                <div className="flex items-center gap-3 w-full">
                                                    <span className="font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded text-[10px] min-w-[30px] text-center shadow-sm border border-primary/10">{optKey}</span>
                                                    <span className="truncate text-foreground/80">{optLabel.split(' : ')[1] || optLabel}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>

            </CollapsibleContent>
        </Collapsible>
    );
}
