import { Product, ProductSpecs, CompatibilityIssue, Category, BuildItem } from "@/types";

type BuildItems = Record<Category, BuildItem>;

export function checkCompatibility(items: BuildItems): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  const cpu = items.cpu?.product;
  const motherboard = items.motherboard?.product;
  const ram = items.ram?.product;
  const gpu = items.gpu?.product;
  const cooler = items.cooler?.product;
  const pcCase = items.case?.product;
  const psu = items.psu?.product;

  // CPU + Motherboard socket compatibility
  if (cpu && motherboard) {
    const cpuSocket = cpu.specs.socket;
    const mbSocket = motherboard.specs.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: "error",
        message: `CPU socket (${cpuSocket}) does not match motherboard socket (${mbSocket})`,
        affected_parts: ["cpu", "motherboard"],
      });
    }
  }

  // CPU + Cooler socket compatibility
  if (cpu && cooler) {
    const cpuSocket = cpu.specs.socket;
    const supportedSockets = cooler.specs.supported_sockets;
    if (cpuSocket && supportedSockets && !supportedSockets.includes(cpuSocket)) {
      issues.push({
        type: "error",
        message: `CPU cooler does not support ${cpuSocket} socket`,
        affected_parts: ["cpu", "cooler"],
      });
    }
  }

  // RAM + Motherboard type compatibility
  if (ram && motherboard) {
    const ramType = ram.specs.memory_type;
    const mbMemoryType = motherboard.specs.memory_type;
    if (ramType && mbMemoryType && ramType !== mbMemoryType) {
      issues.push({
        type: "error",
        message: `RAM type (${ramType}) is not compatible with motherboard (${mbMemoryType})`,
        affected_parts: ["ram", "motherboard"],
      });
    }
  }

  // RAM capacity vs Motherboard max memory
  if (ram && motherboard) {
    const ramCapacity = ram.specs.capacity;
    const maxMemory = motherboard.specs.max_memory;
    if (ramCapacity && maxMemory && ramCapacity > maxMemory) {
      issues.push({
        type: "error",
        message: `RAM capacity (${ramCapacity}GB) exceeds motherboard maximum (${maxMemory}GB)`,
        affected_parts: ["ram", "motherboard"],
      });
    }
  }

  // GPU length vs Case clearance
  if (gpu && pcCase) {
    const gpuLength = gpu.specs.length_mm;
    const maxGpuLength = pcCase.specs.max_gpu_length;
    if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
      issues.push({
        type: "error",
        message: `GPU length (${gpuLength}mm) exceeds case clearance (${maxGpuLength}mm)`,
        affected_parts: ["gpu", "case"],
      });
    }
  }

  // Cooler height vs Case clearance
  if (cooler && pcCase) {
    const coolerHeight = cooler.specs.cooler_height;
    const maxCoolerHeight = pcCase.specs.max_cooler_height;
    if (coolerHeight && maxCoolerHeight && coolerHeight > maxCoolerHeight) {
      issues.push({
        type: "error",
        message: `CPU cooler height (${coolerHeight}mm) exceeds case clearance (${maxCoolerHeight}mm)`,
        affected_parts: ["cooler", "case"],
      });
    }
  }

  // RAM height vs Cooler clearance (warning)
  if (ram && cooler) {
    const ramHeight = ram.specs.height_mm;
    const coolerType = cooler.specs.cooler_type;
    if (ramHeight && ramHeight > 40 && coolerType === "tower") {
      issues.push({
        type: "warning",
        message: `Tall RAM (${ramHeight}mm) may interfere with tower cooler`,
        affected_parts: ["ram", "cooler"],
      });
    }
  }

  // PSU wattage check
  if (psu && (cpu || gpu)) {
    const cpuTdp = cpu?.specs.tdp || 0;
    const gpuTdp = gpu?.specs.tdp || 0;
    const basePower = 100;
    const totalPower = basePower + cpuTdp + gpuTdp;
    const psuWattage = psu.specs.wattage || 0;
    const recommendedPsu = Math.ceil(totalPower * 1.2);

    if (psuWattage < totalPower) {
      issues.push({
        type: "error",
        message: `PSU wattage (${psuWattage}W) is insufficient for system (${totalPower}W required)`,
        affected_parts: ["psu"],
      });
    } else if (psuWattage < recommendedPsu) {
      issues.push({
        type: "warning",
        message: `PSU wattage (${psuWattage}W) is below recommended (${recommendedPsu}W) for headroom`,
        affected_parts: ["psu"],
      });
    }
  }

  // Motherboard form factor vs Case
  if (motherboard && pcCase) {
    const mbFormFactor = motherboard.specs.form_factor;
    const caseFormFactor = pcCase.specs.case_form_factor;

    const formFactorCompatibility: Record<string, string[]> = {
      "Full Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
      "Mid Tower": ["ATX", "Micro-ATX", "Mini-ITX"],
      "Mini Tower": ["Micro-ATX", "Mini-ITX"],
      "SFF": ["Mini-ITX"],
    };

    if (mbFormFactor && caseFormFactor) {
      const compatible = formFactorCompatibility[caseFormFactor];
      if (compatible && !compatible.includes(mbFormFactor)) {
        issues.push({
          type: "error",
          message: `${mbFormFactor} motherboard does not fit in ${caseFormFactor} case`,
          affected_parts: ["motherboard", "case"],
        });
      }
    }
  }

  return issues;
}

export function calculateBottleneck(cpu: Product | null, gpu: Product | null): {
  bottleneck: "cpu" | "gpu" | "balanced" | null;
  percentage: number;
  message: string;
} {
  if (!cpu || !gpu) {
    return { bottleneck: null, percentage: 0, message: "Add CPU and GPU to check bottleneck" };
  }

  // Simplified bottleneck calculation based on relative performance tiers
  // In a real app, this would use benchmark data
  const cpuScore = (cpu.specs.cores || 4) * (cpu.specs.boost_clock || 3000) / 1000;
  const gpuScore = (gpu.specs.cuda_cores || 1000) * (gpu.specs.gpu_clock || 1500) / 10000;

  const ratio = cpuScore / gpuScore;

  if (ratio < 0.8) {
    const percentage = Math.round((1 - ratio) * 50);
    return {
      bottleneck: "cpu",
      percentage: Math.min(percentage, 40),
      message: `CPU may bottleneck GPU by ~${Math.min(percentage, 40)}% in CPU-intensive games`,
    };
  } else if (ratio > 1.2) {
    const percentage = Math.round((ratio - 1) * 50);
    return {
      bottleneck: "gpu",
      percentage: Math.min(percentage, 40),
      message: `GPU may bottleneck CPU by ~${Math.min(percentage, 40)}% at higher resolutions`,
    };
  }

  return {
    bottleneck: "balanced",
    percentage: 0,
    message: "CPU and GPU are well balanced for most workloads",
  };
}

export function getEstimatedWattage(items: BuildItems): number {
  let total = 50; // Base (motherboard, fans, etc.)

  if (items.cpu?.product?.specs.tdp) {
    total += items.cpu.product.specs.tdp;
  }
  if (items.gpu?.product?.specs.tdp) {
    total += items.gpu.product.specs.tdp;
  }
  if (items.ram?.product) {
    total += 10; // RAM typically uses ~5-10W
  }
  if (items.storage?.product) {
    total += 10; // SSD/HDD typically uses ~5-15W
  }

  return total;
}
