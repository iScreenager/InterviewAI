import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface MultiTagPickerProps {
  title: string;
  icon?: React.ElementType;
  defaultTags?: { stack: string; select: boolean }[];
  addNewTags: (tags: string) => void;
  onToggleTag: (tag: string) => void;
}
export const MultiTagPicker = ({
  title,
  icon: Icon,
  defaultTags = [],
  addNewTags,
  onToggleTag,
}: MultiTagPickerProps) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="space-y-3">
      <h4 className="flex gap-2 text-sm font-medium items-center text-gray-600">
        {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        {title}
      </h4>
      <div className="flex w-full flex-wrap items-center gap-2">
        {defaultTags.map((tech, idx) => (
          <span
            key={idx}
            className={`px-3 py-1.5 rounded-full text-sm font-normal cursor-pointer transition-all duration-200 ${
              tech.select
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => onToggleTag(tech.stack)}
          >
            {tech.stack}
          </span>
        ))}

        <div className="flex gap-2 items-center">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                addNewTags(inputValue.trim());
                setInputValue("");
              }
            }}
            placeholder="Add other..."
            className="rounded-full px-3 py-1.5 text-sm w-32 border-gray-200 focus:border-blue-500"
          />
          <Button
            onClick={() => {
              if (inputValue.trim()) {
                addNewTags(inputValue.trim());
                setInputValue("");
              }
            }}
            variant="outline"
            size="sm"
            className="rounded-full w-8 h-8 p-0"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
