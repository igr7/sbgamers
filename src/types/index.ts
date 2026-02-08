// Database Types for SBGamers

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
  // Gaming Consoles
  | "console"
  | "console_accessory";

export type Retailer =
  | "amazon_sa"
  | "amazon_ae"
  | "newegg"
  | "jarir"
  | "softland";

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: Category;
  image_url: string | null;
  specs: ProductSpecs;
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
}

export interface Price {
  id: string;
  product_id: string;
  retailer: Retailer;
  price: number;
  currency: "SAR" | "AED" | "USD";
  url: string;
  in_stock: boolean;
  last_checked: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  retailer: Retailer;
  price: number;
  currency: "SAR" | "AED" | "USD";
  recorded_at: string;
}

export interface AlertSubscription {
  id: string;
  email: string;
  product_id: string;
  target_price: number | null;
  alert_type: "price_drop" | "stock" | "target_price";
  is_active: boolean;
  created_at: string;
}

export interface CompatibilityRule {
  id: string;
  rule_type: string;
  source_category: Category;
  target_category: Category;
  source_field: string;
  target_field: string;
  comparison: "equals" | "gte" | "lte" | "contains";
  error_message: string;
}

// Build types
export interface BuildItem {
  category: Category;
  product: Product | null;
  price: Price | null;
}

export interface Build {
  id?: string;
  name: string;
  items: Partial<Record<Category, BuildItem>>;
  total_price: number;
  compatibility_issues: CompatibilityIssue[];
  created_at?: string;
}

export interface CompatibilityIssue {
  type: "error" | "warning";
  message: string;
  affected_parts: Category[];
}

// API Response types
export interface ProductWithPrices extends Product {
  prices: Price[];
  lowest_price: Price | null;
  price_history?: PriceHistory[];
}

export interface ProductFilters {
  category?: Category;
  brand?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  retailer?: Retailer;
  search?: string;
  sort_by?: "price_asc" | "price_desc" | "name" | "newest";
}

// Category groupings for UI
export const CATEGORY_GROUPS = {
  "PC Components": ["cpu", "gpu", "motherboard", "ram", "storage", "psu", "case", "cooler"],
  "Displays": ["monitor", "tv"],
  "Peripherals": ["keyboard", "mouse", "headset", "mousepad", "webcam", "microphone", "controller"],
  "Gaming Consoles": ["console", "console_accessory"],
} as const;

export const PC_BUILD_CATEGORIES: Category[] = [
  "cpu", "gpu", "motherboard", "ram", "storage", "psu", "case", "cooler"
];
