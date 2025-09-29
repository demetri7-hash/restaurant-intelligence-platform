// Toast POS API Type Definitions
// Based on Toast API v1 documentation

export interface ToastAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface ToastError {
  field?: string
  message: string
}

export interface ToastApiResponse<T> {
  data?: T
  errors?: ToastError[]
  pagination?: {
    page: number
    pageSize: number
    totalResults: number
    totalPages: number
  }
}

// Restaurant/Location Types
export interface ToastRestaurant {
  guid: string
  entityType: string
  externalId?: string
  restaurantName: string
  locationName: string
  address?: {
    address1?: string
    address2?: string
    city?: string
    stateCode?: string
    zipCode?: string
    countryCode?: string
  }
  phoneNumber?: string
  timeZone: string
  closeoutHour: number
  managementGroupGuid: string
  isArchived: boolean
  createdDate: string
  modifiedDate: string
}

// Menu Types
export interface ToastMenuItem {
  guid: string
  entityType: string
  externalId?: string
  name: string
  description?: string
  sku?: string
  plu?: string
  type: 'ENTREE' | 'SIDE' | 'MODIFIER' | 'DISCOUNT' | 'SERVICE_CHARGE'
  inheritanceLevel: 'RESTAURANT' | 'MENU_GROUP' | 'MENU'
  visibility: 'POS' | 'ONLINE' | 'NONE'
  unitOfMeasure: 'NONE' | 'FLUID_OUNCES' | 'POUNDS' | 'EACH'
  pricingStrategy: 'FIXED' | 'OPEN' | 'VARIABLE'
  pricingRules?: {
    default?: number
    overrides?: Array<{
      contextType: string
      price: number
    }>
  }
  calories?: number
  isArchived: boolean
  createdDate: string
  modifiedDate: string
}

export interface ToastMenuGroup {
  guid: string
  entityType: string
  name: string
  items?: ToastMenuItem[]
  isArchived: boolean
  createdDate: string
  modifiedDate: string
}

// Order Types
export interface ToastOrder {
  guid: string
  entityType: string
  externalId?: string
  displayNumber: string
  source: 'POS' | 'ONLINE_ORDERING' | 'THIRD_PARTY'
  duration?: number
  businessDate: number
  openedDate: string
  closedDate?: string
  modifiedDate: string
  deleted: boolean
  deletedDate?: string
  numberOfGuests?: number
  voided: boolean
  voidDate?: string
  paidDate?: string
  restaurantService: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY' | 'CATERING' | 'OTHER'
  revenueCenter?: {
    guid: string
    entityType: string
    name: string
  }
  diningOption?: {
    guid: string
    entityType: string
    name: string
  }
  checks?: ToastCheck[]
  deliveryInfo?: {
    address?: {
      address1?: string
      address2?: string
      city?: string
      stateCode?: string
      zipCode?: string
    }
    deliveryFee?: number
    deliveryCharge?: number
  }
}

export interface ToastCheck {
  guid: string
  entityType: string
  displayNumber: string
  openedDate: string
  closedDate?: string
  modifiedDate: string
  deleted: boolean
  voided: boolean
  paidDate?: string
  tabName?: string
  customer?: {
    guid: string
    entityType: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  selections?: ToastSelection[]
  appliedDiscounts?: ToastDiscount[]
  payments?: ToastPayment[]
  taxes?: ToastTax[]
  amount: number
  taxAmount: number
  totalAmount: number
}

export interface ToastSelection {
  guid: string
  entityType: string
  item: {
    guid: string
    name: string
    plu?: string
  }
  quantity: number
  unitPrice: number
  basePrice: number
  price: number
  tax: number
  voided: boolean
  voidReason?: string
  seat?: number
  fulfillmentStatus?: 'NEW' | 'SENT' | 'READY' | 'COMPLETED'
  modifiers?: ToastModifier[]
  appliedDiscounts?: ToastDiscount[]
}

export interface ToastModifier {
  guid: string
  entityType: string
  item: {
    guid: string
    name: string
  }
  quantity: number
  price: number
}

export interface ToastDiscount {
  guid: string
  entityType: string
  discount: {
    guid: string
    name: string
  }
  discountAmount: number
  nonTaxDiscountAmount: number
  taxDiscountAmount: number
  triggers?: Array<{
    selection: {
      guid: string
    }
  }>
}

export interface ToastPayment {
  guid: string
  entityType: string
  paidDate: string
  type: 'CREDIT' | 'CASH' | 'GIFT_CARD' | 'OTHER'
  amount: number
  tipAmount?: number
  amountTendered?: number
  cardType?: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'OTHER'
  last4Digits?: string
  originalProcessingFee?: number
}

export interface ToastTax {
  guid: string
  entityType: string
  taxRate: {
    guid: string
    name: string
    rate: number
    type: 'PERCENT' | 'FIXED'
  }
  taxAmount: number
}

// Customer Types
export interface ToastCustomer {
  guid: string
  entityType: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  loyaltyAccountGuid?: string
  createdDate: string
  modifiedDate: string
}

// Time Entry Types (for labor data)
export interface ToastTimeEntry {
  guid: string
  entityType: string
  employee: {
    guid: string
    firstName: string
    lastName: string
    email?: string
  }
  jobReference: {
    guid: string
    name: string
  }
  inDate: string
  outDate?: string
  regularHours?: number
  overtimeHours?: number
  holidayHours?: number
  totalHours?: number
  breaks?: Array<{
    inDate: string
    outDate?: string
    paidBreak: boolean
  }>
  businessDate: number
  deleted: boolean
  modifiedDate: string
}

// Configuration Types for Service
export interface ToastConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
  baseUrl: string
  authUrl: string
  restaurantGuid: string
  managementGroupGuid?: string
}

export interface ToastSyncOptions {
  startDate?: string
  endDate?: string
  pageSize?: number
  includeModifiers?: boolean
  includeVoids?: boolean
  includeComps?: boolean
}

// Service Response Types
export interface ToastServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    currentPage: number
    totalPages: number
    totalResults: number
  }
}