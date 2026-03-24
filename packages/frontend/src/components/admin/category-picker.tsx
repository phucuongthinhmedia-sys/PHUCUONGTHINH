"use client";

import { useState } from "react";
import { Category } from "@/lib/category-service";

export interface CategoryNode extends Category {
  children: Category[];
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const parents = categories.filter((c) => !c.parent_id);
  return parents.map((p) => ({
    ...p,
    children: categories.filter((c) => c.parent_id === p.id),
  }));
}

export function getBreadcrumb(
  tree: CategoryNode[],
  categoryId: string,
): string {
  for (const parent of tree) {
    if (parent.id === categoryId) return parent.name;
    const child = parent.children.find((c) => c.id === categoryId);
    if (child) return `${parent.name} > ${child.name}`;
  }
  return "";
}

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
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

  const handleSelect = (id: string, parentId?: string) => {
    onChange(id);
    if (parentId) {
      setExpandedIds((prev) => new Set(prev).add(parentId));
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {selectedBreadcrumb && (
        <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 font-medium">
          {selectedBreadcrumb}
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {tree.map((parent) => {
          const isExpanded = expandedIds.has(parent.id);
          const isParentSelected = value === parent.id;
          const hasChildren = parent.children.length > 0;

          return (
            <div key={parent.id}>
              <div
                className={`flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isParentSelected ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(parent.id);
                  } else {
                    handleSelect(parent.id);
                  }
                }}
              >
                <span
                  className={`text-sm font-medium ${
                    isParentSelected ? "text-blue-700" : "text-gray-800"
                  }`}
                >
                  {parent.name}
                </span>
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

              {hasChildren && isExpanded && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {parent.children.map((child) => {
                    const isChildSelected = value === child.id;
                    return (
                      <div
                        key={child.id}
                        className={`flex items-center px-6 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                          isChildSelected ? "bg-blue-100" : ""
                        }`}
                        onClick={() => handleSelect(child.id, parent.id)}
                      >
                        <span
                          className={`text-sm ${
                            isChildSelected
                              ? "text-blue-700 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {child.name}
                        </span>
                        {isChildSelected && (
                          <svg
                            className="ml-auto w-4 h-4 text-blue-600"
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {tree.length === 0 && (
          <div className="px-3 py-4 text-sm text-gray-400 text-center">
            Không có danh mục
          </div>
        )}
      </div>
    </div>
  );
}
