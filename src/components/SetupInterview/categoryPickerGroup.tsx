import { AllselectedItemsState, Category } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MultiTagPicker } from "./multiTagPicker";
import { Button } from "../ui/button";

interface CategoryPickerGroupProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  allselectedItems: AllselectedItemsState;
  setAllSelectedItems: React.Dispatch<
    React.SetStateAction<AllselectedItemsState>
  >;
  goToBackTab: () => void;
  goToNextTab: () => void;
  currentTab: string;
}

export const CategoryPickerGroup = ({
  categories,
  setCategories,
  allselectedItems,
  setAllSelectedItems,
  goToBackTab,
  goToNextTab,
  currentTab,
}: CategoryPickerGroupProps) => {
  const handleAddNewTag = (key: string, tag: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.key !== key) return category;

        const exists = category.default.find(
          (tech) => tech.stack.toLowerCase() === tag.toLowerCase()
        );
        if (exists) return category;

        if (category.key === "role" || category.key === "experience") {
          const updatedDefaults = category.default.map((val) => ({
            ...val,
            select: false,
          }));

          return {
            ...category,
            default: [...updatedDefaults, { stack: tag, select: true }],
          };
        }

        return {
          ...category,
          default: [...category.default, { stack: tag, select: true }],
        };
      })
    );

    setAllSelectedItems((prev) => {
      if (key === "role") {
        return { ...prev, role: tag };
      } else if (key === "experience") {
        return { ...prev, experience: tag };
      } else {
        return { ...prev, techStacks: [...prev.techStacks, tag] };
      }
    });
  };

  const handleSelectAndUnselectTag = (key: string, tag: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.key !== key) return category;

        let updatedDefaults;

        if (key === "role" || key === "experience") {
          const isSelected = category.default.find(
            (val) =>
              val.stack.toLowerCase() === tag.toLowerCase() &&
              val.select === true
          );

       
          updatedDefaults = category.default.map((val) => ({
            ...val,
            select: isSelected
              ? false
              : val.stack.toLowerCase() === tag.toLowerCase(),
          }));
        } else {
          updatedDefaults = category.default.map((val) =>
            val.stack.toLowerCase() === tag.toLowerCase()
              ? { ...val, select: !val.select }
              : val
          );
        }

        return {
          ...category,
          default: updatedDefaults,
        };
      })
    );

    setAllSelectedItems((prev) => {
      if (key === "role") {
        return {
          ...prev,
          role: prev.role.toLowerCase() === tag.toLowerCase() ? "" : tag,
        };
      } else if (key === "experience") {
        return {
          ...prev,
          experience:
            prev.experience.toLowerCase() === tag.toLowerCase() ? "" : tag,
        };
      } else {
        const exists = prev.techStacks.some(
          (item) => item.toLowerCase() === tag.toLowerCase()
        );
        return {
          ...prev,
          techStacks: exists
            ? prev.techStacks.filter(
                (item) => item.toLowerCase() !== tag.toLowerCase()
              )
            : [...prev.techStacks, tag],
        };
      }
    });
  };

  return (
    <div className="space-y-4">
      {categories.map((categoryItem) => (
        <MultiTagPicker
          key={categoryItem.key}
          title={categoryItem.title}
          icon={categoryItem.icon}
          defaultTags={categoryItem.default}
          addNewTags={(tag) => handleAddNewTag(categoryItem.key, tag)}
          onToggleTag={(tag) =>
            handleSelectAndUnselectTag(categoryItem.key, tag)
          }
        />
      ))}

      {categories[0]?.key === "frontend" &&
        allselectedItems.techStacks.length > 0 && (
          <div className="mt-4 border rounded-lg p-3 bg-gray-50">
            <h6 className="font-medium text-sm text-gray-700">
              Selected Technologies
            </h6>
            <div className="flex flex-wrap gap-2 mt-2">
              {allselectedItems.techStacks.map((stack, index) => (
                <span
                  key={index}
                  className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded-full"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>
        )}

      {categories[0]?.key !== "role" && (
        <div className="flex justify-between mt-4 gap-3">
          <Button
            disabled={currentTab === "TechStack"}
            variant="outline"
            className="flex items-center gap-2 text-sm"
            onClick={goToBackTab}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 text-sm"
            onClick={goToNextTab}
            disabled={
              (currentTab === "TechStack" &&
                allselectedItems.techStacks.length === 0) ||
              (currentTab === "Role" &&
                (allselectedItems.role === "" ||
                  allselectedItems.experience === ""))
            }
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
