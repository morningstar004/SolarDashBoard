export type ProductCategory = 'Panels' | 'Inverters' | 'Batteries' | 'Racking' | 'Cabling';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  sku: string;
  inStock: number;
  lowStockThreshold: number;
  orderedThisMonth: number;
  specs: {
    wattageOrCapacity?: string;
    efficiency?: string;
    voltage?: string;
    weight?: string;
    warranty?: string;
    dimensions?: string;
  };
  unitCost: number; // in INR
  sellingPrice: number; // in INR
  marketPriceChangePercent: number; // e.g. -4.2 or +5.1
  warehouseLocation: {
    zone: string;
    aisle: string;
    bay: string;
    palletId: string;
  };
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export type OrderStatus =
  | 'Confirmed'
  | 'Processing'
  | 'Ready for Inspection'
  | 'Pre-Dispatch Approved'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  category: ProductCategory;
  requiredQty: number;
  packedQty: number;
  unitPrice: number;
  serialNumbers?: string[];
  conditionCheck?: {
    factorySeal: boolean;
    visualPassed: boolean;
    qcTested: boolean;
    palletStrapped: boolean;
  };
}

export interface CustomerInfo {
  name: string;
  company: string;
  tier: 'Tier-1 EPC' | 'Rooftop Installer' | 'Commercial Developer';
  contact: string;
  phone: string;
  destinationCity: string;
  state: string;
  fullAddress: string;
  gstin: string;
}

export interface LogisticsDetails {
  partner: 'V-Trans India' | 'TCI Express' | 'Safexpress' | 'Delhivery Freight' | 'Gati-KWE';
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  trailerType: string;
  lrNumber: string; // Lorry Receipt / Waybill
  gpsCoordinates?: {
    currentLat: number;
    currentLng: number;
    destinationLat: number;
    destinationLng: number;
    progressPercent: number;
  };
  estimatedDeliveryDate: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface OrderTimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  operator: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. SO-9102
  customer: CustomerInfo;
  items: OrderItem[];
  logistics: LogisticsDetails;
  orderDate: string;
  totalAmount: number; // INR
  status: OrderStatus;
  urgency: 'Standard' | 'High Priority' | 'Critical Project';
  assignedTrader: string;
  assignedInspector: string;
  timeline: OrderTimelineEvent[];
  checklistSignoff?: {
    packerName: string;
    packerVerifiedAt: string;
    supervisorName: string;
    supervisorRemarks: string;
    supervisorSignedAt: string;
    digitalSignatureToken: string;
    sealNumber: string;
  };
  discrepancies?: DiscrepancyReport[];
  photos?: ChecklistPhoto[];
}

export interface ChecklistPhoto {
  id: string;
  url: string;
  caption: string;
  stage: 'Pallet Strapping' | 'Serial Label' | 'High-Voltage Crate' | 'Truck Loading' | 'Damage Evidence';
  timestamp: string;
  uploadedBy: string;
}

export interface DiscrepancyReport {
  id: string;
  productId: string;
  productName: string;
  type: 'Missing Item' | 'Cracked Glass / Cell Defect' | 'Dented Inverter Casing' | 'Torn Pallet Packaging' | 'Faulty Connector';
  severity: 'Blocker' | 'Minor';
  quantityAffected: number;
  reportedBy: string;
  reportedAt: string;
  notes: string;
  photoUrl?: string;
  status: 'Open' | 'Resolved - Replaced from Stock' | 'Waived by Client';
}

export type POStatus = 'Draft' | 'Sent to Supplier' | 'Partially Received' | 'Received & Stocked' | 'Closed';

export interface POLineItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  brand: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string; // e.g. PO-IN-4801
  supplierName: string;
  supplierCity: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: POStatus;
  items: POLineItem[];
  paymentTerms: string;
  gstNumber: string;
  notes: string;
}

export type WorkloadStatus = 'Active on Dock' | 'Reviewing POs' | 'On Break' | 'Offline';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'Warehouse Operations' | 'Quality Control' | 'Solar Trading & Sales' | 'Logistics & Dispatch' | 'Procurement';
  reportsTo?: string;
  shift: 'Morning (06:00 - 14:30)' | 'General (09:00 - 18:00)' | 'Evening (14:00 - 22:30)';
  checkInTime: string;
  phone: string;
  email: string;
  avatarUrl: string;
  status: WorkloadStatus;
  certifications: string[];
  activeOrdersCount: number;
  monthlyPayoutINR: number;
  leavesBalance: number;
  rating: number;
  tenureMonths: number;
}

export interface NonPermanentContractor {
  id: string;
  name: string;
  type: 'Contract Heavy Freight Driver' | 'Certified Solar Rooftop Installer' | 'Crane & Rigging Specialist' | 'High-Voltage Commissioning Tech';
  phone: string;
  agencyOrFleet: string;
  rating: number;
  completedJobsCount: number;
  ratePerDayINR: number;
  vehicleNumber?: string;
  status: 'Available' | 'On Assignment' | 'Resting';
  recentProject: string;
  verifiedBadges: string[];
}

export interface ActivityStreamItem {
  id: string;
  orderId: string;
  customerName: string;
  merchandiseSummary: string;
  logisticsPartner: string;
  date: string;
  amount: number;
  status: OrderStatus;
  category: ProductCategory;
}

