
export const assemblyMethods = {
    full_sides_back_routed: 'جانبين كاملين (ظهر مفحار)',
    full_base_back_routed: 'أرضية كاملة (ظهر مفحار)',
    base_full_top_sides_back_routed: 'قاعدة كاملة + علوي جانبين (ظهر مفحار)',
    full_sides_back_flush: 'جانبين كاملين (ظهر لطش)',
    full_base_back_flush: 'أرضية كاملة (ظهر لطش)',
    base_full_top_sides_back_flush: 'قاعدة كاملة + علوي جانبين (ظهر لطش)',
};

export const handleTypes = {
    built_in: 'مقبض بيلت ان',
    regular: 'مقبض عادي',
    hidden_cl_chassis: 'مقبض ارضي (C/L) علوي شاسية',
    hidden_cl_drop: 'مقبض ارضي (C/L) علوي ساقط',
};

export const edgeBandingOptions = {
    "-": "بدون",
    "I": "I : شريط طول",
    "L": "L : شريط ( طول + عرض )",
    "LM-يمين": "L-M : شريط ( طول + عرض ) مفحار يمين",
    "C": "C : شريط ( طول + 2 عرض )",
    "U": "U : شريط ( 2 طول + عرض )",
    "O": "O : شريط داير",
    "\\": "\\ : شريط عرض",
    "II": "II : شريط 2 طول",
    "\\\\": "\\\\ : شريط 2 عرض",
    "IM": "IM : شريط طول + مفحار عكس",
    "CM": "CM : شريط ( طول + 2 عرض ) + مفحار عكس",
    "UM-يمين": "UM-R : شريط ( 2 طول + عرض ) + مفحار شمال",
    "UM-شمال": "UM-L : شريط ( 2 طول + عرض ) + مفحار شمال",
    "IIM": "IIM : شريط 2 طول + مفحار مع الطول",
    "\\M": "\\M : شريط عرض + مفحار عكس",
    "\\\\M": "\\\\M : شريط 2 عرض + مفحار مع العرض",
    "OM": "OM : شريط داير + مفحار مع الطول",
    "DR": "DR : شريط طول + مفحار درج بلوم",
    "LL": "LL : وحدة زاوية حرف L",
    "LS": "LS : وحدة ركنة مشطوفة",
    "LLM": "LLM : وحدة زاوية حرف L + مفحار",
    "LSM": "LSM : وحدة ركنة مشطوفة + مفحار",
};

export const PART_LABELS: Record<string, string> = {
    base_lower: "قاعدة الوحدة السفلية",
    base_upper: "قاعدة و برنيطة العلوية",
    front_mirror: "مرايه امامية",
    back_mirror: "مرايه خلفية",
    sides_ground: "جانبين ارضي",
    sides_upper: "جانبين علوي",
    doors: "ضلف",
    exposed_panel: "الجنب العيرة",
    shelf: "رف",
    drawer_width: "عرض الدرج",
    drawer_depth: "عمق الدرج",
};
