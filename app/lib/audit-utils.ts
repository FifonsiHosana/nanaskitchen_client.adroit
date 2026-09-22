// src/lib/audit-action-config.ts
import {
  UserPlus,
  UserPen,
  UserX,
  PackagePlus,
  Package,
  PackageX,
  ShoppingCart,
  Truck,
  MessageSquareText,
  Star,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export interface AuditActionConfig {
  label: string;
  color: string; // Tailwind-friendly base color name
  icon: LucideIcon;
}

export const AUDIT_ACTION_CONFIG: Record<string, AuditActionConfig> = {
  // Admin / User Management
  "admin.create": { label: "Admin Created", color: "emerald", icon: UserPlus },
  "admin.update": { label: "Admin Updated", color: "blue", icon: UserPen },
  "admin.delete": { label: "Admin Deleted", color: "red", icon: UserX },
  "admin.read": { label: "Admin Viewed", color: "slate", icon: Eye },
  "permissions.update": {
    label: "Permissions Updated",
    color: "purple",
    icon: ShieldCheck,
  },

  // Products
  "product.create": {
    label: "Product Added",
    color: "emerald",
    icon: PackagePlus,
  },
  "product.update": { label: "Product Updated", color: "amber", icon: Package },
  "products.update": {
    label: "Products Bulk Updated",
    color: "amber",
    icon: Package,
  },
  "product.delete": { label: "Product Removed", color: "red", icon: PackageX },

  // Orders & Shipping
  "order.update": { label: "Order Updated", color: "blue", icon: ShoppingCart },
  "orders.updateStatus": {
    label: "Order Status Changed",
    color: "indigo",
    icon: Truck,
  },
  "order.delete": { label: "Order Cancelled", color: "red", icon: Trash2 },
  "shipping.update": { label: "Shipping Updated", color: "sky", icon: Truck },

  // Feedback & Reviews
  "feedback.create": {
    label: "Feedback Submitted",
    color: "emerald",
    icon: MessageSquareText,
  },
  "feedback.update": {
    label: "Feedback Updated",
    color: "blue",
    icon: MessageSquareText,
  },
  "feedback.delete": { label: "Feedback Removed", color: "red", icon: Trash2 },
  "review.delete": { label: "Review Removed", color: "red", icon: Star },
};

export const DEFAULT_ACTION_CONFIG: AuditActionConfig = {
  label: "Unknown Action",
  color: "gray",
  icon: ShieldAlert,
};

export function getAuditActionConfig(action: string): AuditActionConfig {
  return (
    AUDIT_ACTION_CONFIG[action] ?? { ...DEFAULT_ACTION_CONFIG, label: action }
  );
}
