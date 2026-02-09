// Database Types for SBGamers - Complete Gaming Categories

export type Category =
  // PC Components
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "cooler"
  // Gaming Systems
  | "gaming_laptop"
  | "gaming_pc"
  | "console"
  | "console_accessory"
  // Displays
  | "monitor"
  | "tv"
  // Peripherals
  | "keyboard"
  | "mouse"
  | "headset"
  | "mousepad"
  | "webcam"
  | "microphone"
  | "controller"
  // Furniture & VR
  | "gaming_chair"
  | "vr_headset";

export const CATEGORY_INFO: Record<Category, { name: string; nameAr: string; icon: string }> = {
  cpu: { name: "Processors", nameAr: "معالجات", icon: "⚡" },
  gpu: { name: "Graphics Cards", nameAr: "كروت شاشة", icon: "🎮" },
  motherboard: { name: "Motherboards", nameAr: "لوحات أم", icon: "🔌" },
  ram: { name: "Memory (RAM)", nameAr: "ذاكرة", icon: "💾" },
  storage: { name: "Storage", nameAr: "تخزين", icon: "💿" },
  psu: { name: "Power Supplies", nameAr: "مزودات طاقة", icon: "🔋" },
  case: { name: "PC Cases", nameAr: "صناديق", icon: "🖥️" },
  cooler: { name: "Cooling", nameAr: "تبريد", icon: "❄️" },
  gaming_laptop: { name: "Gaming Laptops", nameAr: "لابتوبات قيمنق", icon: "💻" },
  gaming_pc: { name: "Gaming PCs", nameAr: "كمبيوترات قيمنق", icon: "🖥️" },
  console: { name: "Consoles", nameAr: "أجهزة ألعاب", icon: "🎮" },
  console_accessory: { name: "Console Accessories", nameAr: "إكسسوارات", icon: "🎯" },
  monitor: { name: "Gaming Monitors", nameAr: "شاشات قيمنق", icon: "🖥️" },
  tv: { name: "TVs", nameAr: "تلفزيونات", icon: "📺" },
  keyboard: { name: "Keyboards", nameAr: "كيبوردات", icon: "⌨️" },
  mouse: { name: "Mice", nameAr: "ماوسات", icon: "🖱️" },
  headset: { name: "Headsets", nameAr: "سماعات", icon: "🎧" },
  mousepad: { name: "Mousepads", nameAr: "ماوس باد", icon: "🟫" },
  webcam: { name: "Webcams", nameAr: "كاميرات", icon: "📷" },
  microphone: { name: "Microphones", nameAr: "مايكروفونات", icon: "🎤" },
  controller: { name: "Controllers", nameAr: "أذرع تحكم", icon: "🎮" },
  gaming_chair: { name: "Gaming Chairs", nameAr: "كراسي قيمنق", icon: "🪑" },
  vr_headset: { name: "VR Headsets", nameAr: "نظارات VR", icon: "🥽" },
};

export type Retailer =
  | "amazon_sa"
  | "amazon_ae"
  | "newegg"
  | "jarir"
  | "extra"
  | "pcd"
  | "infiniarc";

export const RETAILER_INFO: Record<Retailer, { name: string; url: string; logo?: string; color: string }> = {
  amazon_sa: { name: "Amazon SA", url: "https://amazon.sa", color: "#FF9900" },
  amazon_ae: { name: "Amazon AE", url: "https://amazon.ae", color: "#FF9900" },
  newegg: { name: "Newegg", url: "https://newegg.com/global/sa-en", color: "#F7A500" },
  jarir: { name: "Jarir", url: "https://jarir.com", color: "#D32F2F" },
  extra: { name: "Extra", url: "https://extra.com", color: "#1976D2" },
  pcd: { name: "PCD", url: "https://pcd.com.sa", color: "#4CAF50" },
  infiniarc: { name: "Infiniarc", url: "https://infiniarc.com", color: "#9C27B0" },
};

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: Category;
  image_url: string | null;
  specs: ProductSpecs;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductSpecs {
  // CPU specs
  socket?: string;
  cores?: number;
  threads?: number;
  base_clock?: number;
  boost_clock?: number;
  tdp?: number;

  // GPU specs
  vram?: number;
  vram_type?: string;
  gpu_clock?: number;
  cuda_cores?: number;
  length_mm?: number;

  // Motherboard specs
  chipset?: string;
  form_factor?: string;
  memory_slots?: number;
  max_memory?: number;
  memory_type?: string;

  // RAM specs
  capacity?: number;
  speed?: number;
  latency?: string;
  modules?: number;
  height_mm?: number;

  // Storage specs
  storage_capacity?: number;
  storage_type?: string;
  interface?: string;
  read_speed?: number;
  write_speed?: number;

  // PSU specs
  wattage?: number;
  efficiency?: string;
  modular?: string;

  // Case specs
  max_gpu_length?: number;
  max_cooler_height?: number;
  case_form_factor?: string;

  // Cooler specs
  cooler_height?: number;
  cooler_type?: string;
  supported_sockets?: string[];

  // Monitor/TV specs
  screen_size?: number;
  resolution?: string;
  refresh_rate?: number;
  panel_type?: string;
  response_time?: number;
  hdr?: boolean;
  curved?: boolean;
  aspect_ratio?: string;
  ports?: string[];
  speakers?: boolean;
  vesa_mount?: boolean;
  smart_tv?: boolean;

  // Keyboard specs
  switch_type?: string;
  layout?: string;
  backlight?: string;
  wireless?: boolean;
  hot_swappable?: boolean;
  numpad?: boolean;

  // Mouse specs
  dpi?: number;
  sensor?: string;
  buttons?: number;
  weight?: number;
  polling_rate?: number;
  grip_style?: string;

  // Headset specs
  driver_size?: number;
  frequency_response?: string;
  impedance?: number;
  microphone?: boolean;
  noise_cancelling?: boolean;
  surround_sound?: string;
  connection_type?: string;
  battery_life?: number;

  // Controller specs
  platform_compatibility?: string[];
  vibration?: boolean;
  gyroscope?: boolean;
  trigger_type?: string;

  // Console specs
  console_generation?: string;
  console_storage?: number;
  console_edition?: string;
  digital_only?: boolean;
  max_resolution?: string;
  max_fps?: number;

  // Gaming Laptop/PC specs
  processor?: string;
  graphics?: string;
  display?: string;
  ram_size?: number;
  storage_size?: number;
  battery?: string;
  os?: string;

  // Gaming Chair specs
  max_weight?: number;
  material?: string;
  armrests?: string;
  recline_angle?: number;

  // VR Headset specs
  display_type?: string;
  field_of_view?: number;
  tracking?: string;
  controllers_included?: boolean;
}

export interface Price {
  id: string;
  product_id: string;
  retailer: Retailer;
  price: number;
  original_price?: number;
  currency: "SAR" | "AED" | "USD";
  url: string;
  in_stock: boolean;
  last_checked: string;
}

export interface PriceHistory {
  id: string;
  price_id?: string;
  product_id: string;
  retailer: Retailer;
  price: number;
  currency?: "SAR" | "AED" | "USD";
  in_stock?: boolean;
  recorded_at: string;
}

export interface Deal {
  id: string;
  product: Product;
  prices: Price[];
  lowest_price: Price & { original_price?: number };
  original_price: number;
  sale_price: number;
  discount_percent: number;
  savings: number;
}

// Build Item for PC Builder
export interface BuildItem {
  category?: Category;
  product: Product | null;
  price: Price | null;
}

// Compatibility Issue for PC Builder
export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  category?: Category;
  message: string;
  affected_parts?: string[];
}

// Category Groups for filtering
export const CATEGORY_GROUPS = {
  'PC Components': ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler'] as Category[],
  'Gaming Systems': ['gaming_laptop', 'gaming_pc', 'console', 'console_accessory'] as Category[],
  'Displays': ['monitor', 'tv'] as Category[],
  'Peripherals': ['keyboard', 'mouse', 'headset', 'mousepad', 'webcam', 'microphone', 'controller'] as Category[],
  'Furniture & VR': ['gaming_chair', 'vr_headset'] as Category[],
};

// PC Build Categories (subset of all categories for PC building)
export const PC_BUILD_CATEGORIES: Category[] = [
  'cpu',
  'gpu',
  'motherboard',
  'ram',
  'storage',
  'psu',
  'case',
  'cooler',
];

// Useful for filtering
export const ALL_CATEGORIES = Object.keys(CATEGORY_INFO) as Category[];
export const ALL_RETAILERS = Object.keys(RETAILER_INFO) as Retailer[];

