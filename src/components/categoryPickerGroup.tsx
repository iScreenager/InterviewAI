import { MultiTagPicker } from "./multiTagPicker";
import { Button } from "./ui/button";
import { AllselectedItemsState, Category } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

         // Toggle off if already selected, else select only the clicked one
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
    <>
      <div>
        <h4 className="text-lg font-semibold text-gray-700">
          {categories[0].heading}
        </h4>
        <span className="text-sm text-gray-500">
          {categories[0].description}
        </span>
      </div>

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
          <div className="mt-8 border rounded-md p-3 bg-gray-100 w-full   ">
            <h6 className="font-medium">Selected Technologies</h6>
            <div className="flex flex-wrap gap-2 mt-3">
              {allselectedItems.techStacks.map((stack, index) => (
                <span
                  key={index}
                  className="text-xs border px-3 p-1 rounded-2xl bg-[#e2d6f8]">
                  {stack}
                </span>
              ))}
            </div>
          </div>
        )}
      {categories[0]?.key !== "role" && (
        <div className="flex justify-between mt-5 gap-2">
          <Button
            disabled={currentTab === "TechStack"}
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
            onClick={goToBackTab}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
            onClick={goToNextTab}
            disabled={
              (currentTab === "TechStack" &&
                allselectedItems.techStacks.length === 0) ||
              (currentTab === "Role" &&
                (allselectedItems.role === "" ||
                  allselectedItems.experience === ""))
            }>
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
};
