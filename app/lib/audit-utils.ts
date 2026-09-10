// src/lib/audit-action-config.ts
import {
  UserPlus,
  UserPen,
  UserX,
  Package,
  PackagePlus,
  PackageX,
  ShoppingCart,
  Truck,
  MessageSquareText,
  Star,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export interface AuditActionConfig {
  label: string;
  color: string; // tailwind-friendly base color name
  icon: LucideIcon;
}

export const AUDIT_ACTION_CONFIG: Record<string, AuditActionConfig> = {
  "admin.create": { label: "Admin Created", color: "emerald", icon: UserPlus },
  "admin.update": { label: "Admin Updated", color: "blue", icon: UserPen },
  "admin.delete": { label: "Admin Deleted", color: "red", icon: UserX },

  "order.update": { label: "Order Updated", color: "blue", icon: ShoppingCart },
  "order.delete": { label: "Order Deleted", color: "red", icon: ShoppingCart },

  "product.create": {
    label: "Product Added",
    color: "emerald",
    icon: PackagePlus,
  },
  "product.update": { label: "Product Updated", color: "blue", icon: Package },
  "product.delete": { label: "Product Removed", color: "red", icon: PackageX },

  "shipping.update": { label: "Shipping Updated", color: "blue", icon: Truck },

  "feedback.delete": {
    label: "Feedback Removed",
    color: "red",
    icon: MessageSquareText,
  },
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
