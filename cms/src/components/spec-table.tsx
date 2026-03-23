"use client";

import { useState, useCallback } from "react";
import {
  getSpecTemplate,
  mergeSpecs,
  SpecField,
  ProductType,
  PRODUCT_TYPE_LABELS,
  detectProductType,
} from "@/lib/spec-templates";

interface SpecTableProps {
  categoryId: string;
  value: Record<string, any>;
  onChange: (specs: Record<string, any>) => void;
  productType?: ProductType;
  onProductTypeChange?: (type: ProductType) => void;
}

interface CustomField {
  key: string;
  value: string;
}

// Groups that are open by default
const DEFAULT_OPEN_GROUPS = new Set([
  "Kích thước & Quy cách",
  "Quy cách đóng gói",
  "Chất liệu",
  "Kích thước",
  "Thông số lắp đặt",
  "Thông số điện / Kỹ thuật",
  "Thông số điện",
  "Thông số",
  "Kho",
]);

// Fields that should span full width (textarea, long selects)
const FULL_WIDTH_TYPES = new Set(["textarea"]);

function SpecFieldInput({
  field,
  value,
  onChange,
}: {
  field: SpecField;
  value: any;
  onChange: (val: any) => void;
}) {
  const isFilled = value !== undefined && value !== null && value !== "";
  const base = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
    isFilled ? "border-blue-300 bg-blue-50/30" : "border-gray-200 bg-white"
  }`;

  if (field.type === "select" && field.options) {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={`${base} cursor-pointer`}
      >
        <option value="">— Chọn —</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "number") {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
          placeholder={field.placeholder}
          className={base}
        />
        {field.unit && (
          <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 border border-gray-200 rounded px-2 py-2">
            {field.unit}
          </span>
        )}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={field.placeholder}
        rows={2}
        className={`${base} resize-none`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      placeholder={field.placeholder}
      className={base}
    />
  );
}

function FieldItem({
  field,
  value,
  onChange,
}: {
  field: SpecField;
  value: any;
  onChange: (key: string, val: any) => void;
}) {
  const isFilled = value !== undefined && value !== null && value !== "";
  const isFullWidth = FULL_WIDTH_TYPES.has(field.type);

  return (
    <div className={isFullWidth ? "col-span-2" : ""}>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
        {field.label}
        {field.required && <span className="text-red-400">*</span>}
        {isFilled && !field.required && (
          <span className="text-blue-400 text-xs">✓</span>
        )}
      </label>
      <SpecFieldInput
        field={field}
        value={value}
        onChange={(val) => onChange(field.key, val)}
      />
    </div>
  );
}

function GroupAccordion({
  name,
  fields,
  value,
  defaultOpen,
  onFieldChange,
}: {
  name: string;
  fields: SpecField[];
  value: Record<string, any>;
  defaultOpen: boolean;
  onFieldChange: (key: string, val: any) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const filledCount = fields.filter(
    (f) =>
      value[f.key] !== undefined &&
      value[f.key] !== null &&
      value[f.key] !== "",
  ).length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">{name}</span>
          {filledCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-600 font-medium px-1.5 py-0.5 rounded-full">
              {filledCount}/{fields.length}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
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
      </button>

      {open && (
        <div className="px-4 py-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {fields.map((field) => (
            <FieldItem
              key={field.key}
              field={field}
              value={value[field.key]}
              onChange={onFieldChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SpecTable({
  categoryId,
  value,
  onChange,
  productType,
  onProductTypeChange,
}: SpecTableProps) {
  const effectiveType: ProductType =
    productType ?? detectProductType(categoryId);
  const template = getSpecTemplate(effectiveType);

  const templateKeys = new Set(template.map((f) => f.key));
  const initialCustomFields: CustomField[] = Object.entries(value)
    .filter(([k]) => !templateKeys.has(k) && k !== "product_type")
    .map(([k, v]) => ({ key: k, value: String(v ?? "") }));

  const [customFields, setCustomFields] =
    useState<CustomField[]>(initialCustomFields);
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  const groups = template.reduce<Record<string, SpecField[]>>((acc, f) => {
    const g = f.group ?? "Thông số";
    if (!acc[g]) acc[g] = [];
    acc[g].push(f);
    return acc;
  }, {});

  const buildSpecs = useCallback(
    (templateSpecs: Record<string, any>, custom: CustomField[]) => {
      const customSpecs: Record<string, any> = {};
      custom.forEach((cf) => {
        if (cf.key && cf.value !== "") customSpecs[cf.key] = cf.value;
      });
      onChange(mergeSpecs(templateSpecs, customSpecs));
    },
    [onChange],
  );

  const getTemplateSpecs = useCallback(() => {
    const s: Record<string, any> = {};
    template.forEach((f) => {
      if (value[f.key] !== undefined) s[f.key] = value[f.key];
    });
    return s;
  }, [template, value]);

  const handleTemplateChange = useCallback(
    (key: string, val: any) => {
      const s = getTemplateSpecs();
      if (val === undefined) delete s[key];
      else s[key] = val;
      buildSpecs(s, customFields);
    },
    [getTemplateSpecs, buildSpecs, customFields],
  );

  const handleCustomChange = useCallback(
    (index: number, field: "key" | "value", val: string) => {
      const updated = customFields.map((cf, i) =>
        i === index ? { ...cf, [field]: val } : cf,
      );
      setCustomFields(updated);
      buildSpecs(getTemplateSpecs(), updated);
    },
    [customFields, getTemplateSpecs, buildSpecs],
  );

  const handleRemoveCustom = useCallback(
    (index: number) => {
      const updated = customFields.filter((_, i) => i !== index);
      setCustomFields(updated);
      buildSpecs(getTemplateSpecs(), updated);
    },
    [customFields, getTemplateSpecs, buildSpecs],
  );

  const handleAddCustom = useCallback(() => {
    const k = newKey.trim(),
      v = newVal.trim();
    if (!k || !v) return;
    const updated = [...customFields, { key: k, value: v }];
    setCustomFields(updated);
    setNewKey("");
    setNewVal("");
    buildSpecs(getTemplateSpecs(), updated);
  }, [newKey, newVal, customFields, getTemplateSpecs, buildSpecs]);

  return (
    <div className="space-y-4">
      {/* ── Chọn loại sản phẩm ── */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Loại sản phẩm <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(PRODUCT_TYPE_LABELS) as [ProductType, string][]).map(
            ([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onProductTypeChange?.(type);
                  onChange({ ...value, product_type: type });
                }}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  effectiveType === type
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── Grouped accordion fields ── */}
      <div className="space-y-2">
        {Object.entries(groups).map(([groupName, fields]) => (
          <GroupAccordion
            key={groupName}
            name={groupName}
            fields={fields}
            value={value}
            defaultOpen={DEFAULT_OPEN_GROUPS.has(groupName)}
            onFieldChange={handleTemplateChange}
          />
        ))}
      </div>

      {/* ── Custom fields ── */}
      <div className="border border-dashed border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm thông số tùy chỉnh
          <span className="font-normal text-gray-400">(không cần Dev)</span>
        </p>

        {customFields.length > 0 && (
          <div className="space-y-2 mb-3">
            {customFields.map((cf, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={cf.key}
                  onChange={(e) =>
                    handleCustomChange(index, "key", e.target.value)
                  }
                  placeholder="Tên thông số"
                  className="w-2/5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={cf.value}
                  onChange={(e) =>
                    handleCustomChange(index, "value", e.target.value)
                  }
                  placeholder="Giá trị"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(index)}
                  className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                  aria-label="Xóa"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="VD: Điều khiển giọng nói"
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            className="w-2/5 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <input
            type="text"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            placeholder="VD: Có"
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!newKey.trim() || !newVal.trim()}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
