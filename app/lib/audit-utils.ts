// src/lib/audit-action-config.ts
import {
  UserPlus,
  UserPen,
  UserX,
  Eye,
  Package,
  PackagePlus,
  PackageX,
  ShoppingCart,
  Trash2,
  RefreshCcw,
  Truck,
  MessageSquareText,
  MessageSquarePlus,
  MessageSquareX,
  Star,
  StarOff,
  ShieldCheck,
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
  "order.delete": { label: "Order Deleted", color: "red", icon: Trash2 },

  "products.update": {
    label: "Product Updated",
    color: "blue",
    icon: Package,
  },
  "permissions.update": {
    label: "Permission Update",
    color: "blue",
    icon: ShieldCheck,
  },
  "orders.updateStatus": {
    label: "Orders Status Update",
    color: "blue",
    icon: RefreshCcw,
  },
  "feedback.update": {
    label: "Feedback Update",
    color: "blue",
    icon: MessageSquareText,
  },
  "admin.read": { label: "Feedback Update", color: "gray", icon: Eye },
  "product.create": {
    label: "Product Added",
    color: "emerald",
    icon: PackagePlus,
  },
  "feedback.create": {
    label: "Feedback Create",
    color: "emerald",
    icon: MessageSquarePlus,
  },
  "product.update": { label: "Product Updated", color: "blue", icon: Package },
  "product.delete": { label: "Product Removed", color: "red", icon: PackageX },

  "shipping.update": { label: "Shipping Updated", color: "blue", icon: Truck },

  "feedback.delete": {
    label: "Feedback Removed",
    color: "red",
    icon: MessageSquareX,
  },
  "review.delete": { label: "Review Removed", color: "red", icon: StarOff },
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
