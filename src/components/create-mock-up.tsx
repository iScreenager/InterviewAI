import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
 
  experienceCategories,
  roleCategories,
  techCategories,
} from "@/constants/categoryData";
import { AllselectedItemsState, Category } from "@/types";
import { CategoryPickerGroup } from "./categoryPickerGroup";
import { DetailsTabContent } from "./detailsTabContent";

export const CreateMockup = () => {
  const tabOrder = ["TechStack", "Role", "Details"];
  const [activeTab, setActiveTab] = useState<string>("TechStack");

  const [techStack, setTechStack] = useState<Category[]>(techCategories);
  const [roles, setRoles] = useState<Category[]>(roleCategories);
  const [experience, setExperience] =
    useState<Category[]>(experienceCategories);
  

  const [allselectedItems, setAllSelectedItems] =
    useState<AllselectedItemsState>({
      techStacks: [],
      role: "",
      experience: "",
    });

  function goToNextTab() {
    const currentTabIndex = tabOrder.indexOf(activeTab);
    if (currentTabIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentTabIndex + 1]);
    }
  }

  function goToBackTab() {
    const currentTabIndex = tabOrder.indexOf(activeTab);

    if (currentTabIndex > 0) {
      setActiveTab(tabOrder[currentTabIndex - 1]);
    }
  }
  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Setup your interview
        </h1>
        <p className="text-sm text-gray-500 hidden sm:block">
          Customize your interview experience based on your skills and goals
        </p>
      </div>

      <Tabs aria-disabled value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger
            className="pointer-events-none cursor-not-allowed"
            value="TechStack">
            <span className="block lg:hidden">1</span>
            <span className="hidden lg:block">1. Tech Stack</span>
          </TabsTrigger>
          <TabsTrigger
            className="pointer-events-none cursor-not-allowed"
            value="Role">
            <span className="block lg:hidden">2</span>
            <span className="hidden lg:block">2. Role</span>
          </TabsTrigger>
          <TabsTrigger
            className="pointer-events-none cursor-not-allowed"
            value="Details">
            <span className="block lg:hidden">3</span>
            <span className="hidden lg:block">3. Details</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="TechStack">
          <CategoryPickerGroup
            categories={techStack}
            setCategories={setTechStack}
            allselectedItems={allselectedItems}
            setAllSelectedItems={setAllSelectedItems}
            goToBackTab={goToBackTab}
            goToNextTab={goToNextTab}
            currentTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="Role">
          <CategoryPickerGroup
            categories={roles}
            setCategories={setRoles}
            allselectedItems={allselectedItems}
            setAllSelectedItems={setAllSelectedItems}
            goToBackTab={goToBackTab}
            goToNextTab={goToNextTab}
            currentTab={activeTab}
          />
          <hr className="my-5"></hr>
          <CategoryPickerGroup
            categories={experience}
            setCategories={setExperience}
            allselectedItems={allselectedItems}
            setAllSelectedItems={setAllSelectedItems}
            goToBackTab={goToBackTab}
            goToNextTab={goToNextTab}
            currentTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="Details">
          <DetailsTabContent
            allselectedItems={allselectedItems}
            goToBackTab={goToBackTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
