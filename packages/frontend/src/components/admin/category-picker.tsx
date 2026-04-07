"use client";

import { useState } from "react";
import { Category } from "@/lib/category-service";

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const parents = categories.filter((c) => !c.parent_id);

  const buildChildren = (parentId: string): CategoryNode[] => {
    return categories
      .filter((c) => c.parent_id === parentId)
      .map((c) => ({
        ...c,
        children: buildChildren(c.id),
      }));
  };

  return parents.map((p) => ({
    ...p,
    children: buildChildren(p.id),
  }));
}

export function getBreadcrumb(
  tree: CategoryNode[],
  categoryId: string,
  path: string[] = [],
): string {
  for (const node of tree) {
    if (node.id === categoryId) {
      return [...path, node.name].join(" > ");
    }
    const result = getBreadcrumb(node.children, categoryId, [
      ...path,
      node.name,
    ]);
    if (result) return result;
  }
  return "";
}

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}

function CategoryItem({
  node,
  value,
  onChange,
  expandedIds,
  toggleExpand,
  level = 0,
}: {
  node: CategoryNode;
  value: string;
  onChange: (id: string) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  level?: number;
}) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = value === node.id;
  const hasChildren = node.children.length > 0;
  const paddingLeft = level * 24 + 12;

  return (
    <div>
      <div
        className={`flex items-center justify-between py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${
          isSelected ? "bg-blue-50" : ""
        }`}
        style={{ paddingLeft: `${paddingLeft}px`, paddingRight: "12px" }}
        onClick={() => {
          if (hasChildren) {
            toggleExpand(node.id);
          } else {
            onChange(node.id);
          }
        }}
      >
        <span
          className={`text-sm ${level === 0 ? "font-semibold" : level === 1 ? "font-medium" : "font-normal"} ${
            isSelected
              ? "text-blue-700"
              : level === 0
                ? "text-gray-800"
                : "text-gray-600"
          }`}
        >
          {node.name}
        </span>
        <div className="flex items-center gap-2">
          {isSelected && (
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {hasChildren && (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={level === 0 ? "bg-gray-50/50" : ""}>
          {node.children.map((child) => (
            <CategoryItem
              key={child.id}
              node={child}
              value={value}
              onChange={onChange}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryPicker({
  categories,
  value,
  onChange,
}: CategoryPickerProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const tree = buildCategoryTree(categories);

  const selectedBreadcrumb = value ? getBreadcrumb(tree, value) : "";

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {selectedBreadcrumb && (
        <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 font-medium">
          {selectedBreadcrumb}
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {tree.map((node) => (
          <CategoryItem
            key={node.id}
            node={node}
            value={value}
            onChange={onChange}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
          />
        ))}

        {tree.length === 0 && (
          <div className="px-3 py-4 text-sm text-gray-400 text-center">
            Không có danh mục
          </div>
        )}
      </div>
    </div>
  );
}
