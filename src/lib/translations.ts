
export const partNameMap: Record<string, string> = {
  'base': 'قاعدة',
  'top': 'سقف',
  'unit_top': 'سقف الوحدة',
  'left_side': 'جانب أيسر',
  'right_side': 'جانب أيمن',
  'side_panel': 'جانب',
  'back_panel': 'ظهر',
  'shelf': 'رف',
  'door': 'ضلفة',
  'front_mirror': 'مراية أمامية',
  'back_mirror': 'مراية خلفية',
  'drawer_bottom': 'قاع درج',
  'drawer_side': 'جانب درج',
  'drawer_back': 'ظهر درج',
  'drawer_front': 'وش درج',
  'drawer_width': 'عرض الدرج',
  'drawer_depth': 'عمق الدرج',
  'drawer_width_part': 'جزء عرض الدرج',
  'drawer_depth_part': 'جزء عمق الدرج',
  'drawer_face': 'وجه الدرج',
  'intermediate_shelf': 'رف اضافي',
  'appliance_shelf': 'ارفف اجهزه',
  'vent_panel': 'هوايه',
  'vent': 'هوايه',
  'side_1': 'الجنب 1',
  'side_2': 'الجنب 2',
  'internal_base': 'قاعدة داخلية',
  'internal_shelf': 'رف داخلي',
};

export const unitTypeLabels: Record<string, string> = {
  ground: 'خزانة سفلية',
  ground_unit: 'خزانة سفلية',
  sink: 'وحدة حوض',
  sink_unit: 'وحدة حوض',
  ground_fixed: 'ارضي ثابت',
  ground_fixed_unit: 'ارضي ثابت',
  sink_fixed: 'حوض ثابت',
  sink_fixed_unit: 'حوض ثابت',
  drawers: 'ادراج',
  drawers_unit: 'ادراج',
  drawers_bottom_rail: 'ادراج م سفلية',
  drawers_bottom_rail_unit: 'ادراج م سفلية',
  tall_doors: 'دولاب ضلف',
  tall_doors_appliances: 'دولاب ضلف + اجهزة',
  tall_drawers_side_doors_top: 'دولاب ادراج م جانبية + ضلف علوية',
  tall_drawers_bottom_rail_top_doors: 'دولاب ادراج م سفلية + ضلف علوية',
  tall_drawers_side_appliances_doors: 'دولاب ادراج جانبية + اجهزة + ضلف علوية',
  tall_drawers_bottom_appliances_doors_top: 'دولاب ادراج م سفلية + اجهزة + ضلف علوية',
  tall_wooden_base: 'دولاب ضلف',
  wall: 'علوي ضلف',
  wall_fixed: 'علوي ثابت',
  wall_flip_top_doors_bottom: 'علوي قلاب + ضلف',
  wall_microwave: 'علوي ميكرويف',
  corner_l_wall: 'ركنة L علوي',
  three_turbo: 'وحدة 3 تربو',
  drawer_built_in_oven: 'درج + فرن بيلت إن',
  drawer_bottom_rail_built_in_oven: 'درج سفلي + فرن بيلت إن',
  two_small_20_one_large_side: '2 صغير 20 + 1 كبير (جنب)',
  two_small_20_one_large_bottom: '2 صغير 20 + 1 كبير (سفلي)',
  one_small_16_two_large_side: '1 صغير 16 + 2 كبير (جنب)',
  one_small_16_two_large_bottom: '1 صغير 16 + 2 كبير (سفلي)',
};

export const getEdgeMarks = (code: string | undefined) => {
    const marks = { top: "", bottom: "", left: "", right: "" };
    if (!code || code === "-") return marks;
    
    const tape_mark = "-------"; 
    const groove_mark = "م"; 
    
    if (code.includes("OM")) {
        marks.top = tape_mark; marks.bottom = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("O")) {
        marks.top = tape_mark; marks.bottom = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("UM-يمين")) {
        marks.top = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("UM-شمال")) {
        marks.top = tape_mark; marks.right = tape_mark; marks.left = tape_mark;
    } else if (code.includes("UM")) {
        marks.top = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("CM")) {
        marks.left = tape_mark; marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("C")) {
         marks.left = tape_mark; marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("LM-يمين")) {
        marks.left = tape_mark; marks.top = tape_mark; marks.right = groove_mark;
    } else if (code.includes("LM-شمال")) {
         marks.right = tape_mark; marks.top = tape_mark; marks.left = groove_mark;
    } else if (code.includes("LM")) {
         marks.left = tape_mark; marks.top = tape_mark;
    } else if (code.includes("L") && !code.includes("LL")) {
         marks.left = tape_mark; marks.top = tape_mark;
    } else if (code.includes("IIM")) {
         marks.left = tape_mark; marks.right = groove_mark;
    } else if (code.includes("II")) {
         marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("IM")) {
         marks.left = tape_mark; marks.right = groove_mark;
    } else if (code.includes("I")) {
        marks.left = tape_mark;
    } else if (code.includes("\\\\M")) {
         marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("\\\\")) {
         marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("\\M")) {
         marks.top = tape_mark; marks.bottom = groove_mark;
    } else if (code.includes("\\")) {
         marks.top = tape_mark;
    }
    
    return marks;
};
