// Toast POS API Type Definitions
// Based on Toast API v1 documentation

export interface ToastAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface ToastError {
  field?: string;
  message: string;
}

export interface ToastApiResponse<T> {
  data?: T;
  errors?: ToastError[];
  pagination?: {
    page: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;
  };
}

// Restaurant/Location Types
export interface ToastRestaurant {
  guid: string;
  entityType: string;
  externalId?: string;
  restaurantName: string;
  locationName: string;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    stateCode?: string;
    zipCode?: string;
    countryCode?: string;
  };
  phoneNumber?: string;
  timeZone: string;
  closeoutHour: number;
  managementGroupGuid: string;
  isArchived: boolean;
  createdDate: string;
  modifiedDate: string;
}

// Menu Types
export interface ToastMenuItem {
  guid: string;
  entityType: string;
  externalId?: string;
  name: string;
  description?: string;
  sku?: string;
  plu?: string;
  price: number;
  isDiscountable: boolean;
  visibility: 'VISIBLE' | 'HIDDEN';
  taxInfo?: {
    taxRate?: number;
    taxType?: string;
  };
  menuGroup?: {
    guid: string;
    name: string;
  };
  modifierGroups?: ToastModifierGroup[];
  nutritionInfo?: ToastNutritionInfo;
  tags?: string[];
  isArchived: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface ToastModifierGroup {
  guid: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  modifiers: ToastModifier[];
}

export interface ToastModifier {
  guid: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface ToastNutritionInfo {
  calories?: number;
  caloriesFromFat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbs?: number;
  fiber?: number;
  sugar?: number;
  protein?: number;
}

// Order Types
export interface ToastOrder {
  guid: string;
  entityType: string;
  externalId?: string;
  restaurantGuid: string;
  source: string;
  orderOpenedDate: string;
  orderClosedDate?: string;
  lastModifiedDate: string;
  promisedDate?: string;
  channelGuid?: string;
  numberOfGuests?: number;
  voided: boolean;
  voidDate?: string;
  voidReason?: string;
  paidDate?: string;
  closedDate?: string;
  deletedDate?: string;
  deleted: boolean;
  businessDate: number;
  server?: ToastEmployee;
  checks?: ToastCheck[];
  table?: ToastTable;
  dining?: ToastDiningOption;
  customer?: ToastCustomer;
  duration?: number;
  estimatedFulfillmentDate?: string;
  deliveryInfo?: ToastDeliveryInfo;
  approvalStatus: 'PENDING' | 'APPROVED' | 'NEEDS_APPROVAL';
}

export interface ToastCheck {
  guid: string;
  entityType: string;
  externalId?: string;
  displayNumber: string;
  openedDate: string;
  closedDate?: string;
  lastModifiedDate: string;
  voided: boolean;
  voidDate?: string;
  voidReason?: string;
  paidDate?: string;
  tabName?: string;
  customer?: ToastCustomer;
  selections?: ToastSelection[];
  appliedDiscounts?: ToastDiscount[];
  appliedServiceCharges?: ToastServiceCharge[];
  payments?: ToastPayment[];
  taxes?: ToastTax[];
  totalAmount: number;
  taxAmount: number;
  tipAmount: number;
  discountAmount: number;
  serviceChargeAmount: number;
}

export interface ToastSelection {
  guid: string;
  entityType: string;
  externalId?: string;
  item?: ToastMenuItem;
  itemGroup?: {
    guid: string;
    name: string;
  };
  quantity: number;
  unitPrice: number;
  basePrice: number;
  preDiscountPrice: number;
  price: number;
  tax: number;
  voided: boolean;
  voidReason?: string;
  modifiers?: ToastAppliedModifier[];
  appliedDiscounts?: ToastDiscount[];
  salesCategory?: {
    guid: string;
    name: string;
  };
  fulfillmentStatus?: 'NEW' | 'SENT' | 'HOLD' | 'WORKING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdDate: string;
  modifiedDate: string;
}

export interface ToastAppliedModifier {
  guid: string;
  entityType: string;
  modifier?: ToastModifier;
  quantity: number;
  price: number;
  modifierGroup?: ToastModifierGroup;
}

export interface ToastDiscount {
  guid: string;
  entityType: string;
  externalId?: string;
  name: string;
  type: 'PERCENT' | 'FIXED' | 'OPEN_PERCENT' | 'OPEN_FIXED';
  percentage?: number;
  fixedAmount?: number;
  selectionGuid?: string;
  checkGuid?: string;
  nonTaxDiscountAmount?: number;
  loyaltyIdentifier?: string;
  comboItems?: string[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'NEEDS_APPROVAL';
}

export interface ToastServiceCharge {
  guid: string;
  entityType: string;
  externalId?: string;
  name: string;
  type: 'PERCENT' | 'FIXED';
  percentage?: number;
  fixedAmount?: number;
  amount: number;
  gratuity: boolean;
  taxable: boolean;
  checkGuid: string;
  appliedDate: string;
}

export interface ToastPayment {
  guid: string;
  entityType: string;
  externalId?: string;
  checkGuid: string;
  type: 'CASH' | 'CREDIT_CARD' | 'GIFT_CARD' | 'OTHER';
  amount: number;
  tipAmount: number;
  amountTendered: number;
  cardEntryMode?: 'SWIPED' | 'KEYED' | 'CONTACTLESS';
  last4Digits?: string;
  paidDate: string;
  voidDate?: string;
  refundStatus?: 'NONE' | 'PARTIAL' | 'FULL';
  originalProcessingFee?: number;
  server?: ToastEmployee;
  cashDrawer?: {
    guid: string;
    name: string;
  };
}

export interface ToastTax {
  guid: string;
  entityType: string;
  name: string;
  rate: number;
  amount: number;
  type: 'PERCENT' | 'FIXED';
  facilitatorCollectsTax: boolean;
  taxableAmount: number;
}

// Employee Types
export interface ToastEmployee {
  guid: string;
  entityType: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  jobTitle?: string;
  isArchived: boolean;
  createdDate: string;
  modifiedDate: string;
}

// Table Types
export interface ToastTable {
  guid: string;
  entityType: string;
  externalId?: string;
  name: string;
  seatingCapacity: number;
  revenueCenter?: {
    guid: string;
    name: string;
  };
  isArchived: boolean;
}

// Dining Types
export interface ToastDiningOption {
  guid: string;
  entityType: string;
  externalId?: string;
  name: string;
  curbsidePickup: boolean;
  deliveryService: boolean;
  takeOut: boolean;
  dineIn: boolean;
  isArchived: boolean;
  behavior: 'FAST_CASUAL' | 'TABLE_SERVICE';
}

// Customer Types
export interface ToastCustomer {
  guid: string;
  entityType: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addresses?: ToastCustomerAddress[];
  isArchived: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface ToastCustomerAddress {
  guid: string;
  address1?: string;
  address2?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
}

// Delivery Types
export interface ToastDeliveryInfo {
  guid: string;
  entityType: string;
  deliveryEmployee?: ToastEmployee;
  address?: ToastCustomerAddress;
  deliveryCharge?: number;
  deliveryRadius?: number;
  scheduledDeliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryInstructions?: string;
  contactPhone?: string;
}

// Service Response Types
export interface ToastServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Configuration Types
export interface ToastConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
  restaurantGuid: string;
  managementGroupGuid?: string;
}

// Analytics Types
export interface ToastAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  topSellingItems: Array<{
    item: ToastMenuItem;
    quantity: number;
    revenue: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  paymentMethods: Record<string, {
    count: number;
    amount: number;
  }>;
}