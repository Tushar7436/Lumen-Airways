// app/(components)/ui/airport-dropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Label } from "./label";

interface AirportDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export default function AirportDropdown({ label, options, value, onChange }: AirportDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div ref={containerRef} className="relative p-4 border-r border-gray-300">
      <Label className="text-sm text-gray-600 mb-1">{label}</Label>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full border-0 p-0 text-gray-900 font-medium focus-visible:ring-0 bg-transparent outline-none"
        placeholder={label.toLowerCase()}
      />
      {open && (
        <ul className="absolute left-0 right-0 mt-2 max-h-64 overflow-auto bg-white text-gray-900 rounded-lg shadow-xl z-20 border border-gray-200">
          {filteredOptions.length ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${value === opt ? "bg-blue-100 font-semibold" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setQuery(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
}
