import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
    <div className="flex flex-col gap-3 mt-5">
      <h4 className="flex gap-2 text-lg font-medium items-center text-gray-700">
        {Icon && <Icon className=" w-5 h-5 text-[#1BB4C9] " />}
        {title}
      </h4>
      <div className="flex w-full flex-wrap items-center gap-2">
        {defaultTags.map((tech, idx) => (
          <span
            key={idx}
            className={`px-4 py-2 rounded-full text-sm font-normal shadow-md hover:shadow-gray-500   cursor-pointer transition ${
              tech.select
                ? "bg-[#1BB4C9] "
                : "bg-[#EAEFF5] hover:bg-gray-200   "
            }`}
            onClick={() => onToggleTag(tech.stack)}>
            {tech.stack}
          </span>
        ))}

        <div className="flex gap-2 items-center mt-2">
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
            className="rounded-full px-4 py-2 text-sm w-40 shadow-md border bg-[#EAEFF5] "
          />
          <Button
            onClick={() => {
              if (inputValue.trim()) {
                addNewTags(inputValue.trim());
                setInputValue("");
              }
            }}
            className="rounded-full text-sm  bg-[#EAEFF5] hover:bg-gray-200  text-gray-700 shadow-md hover:shadow-gray-500 ">
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
