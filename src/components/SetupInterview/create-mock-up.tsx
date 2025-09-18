import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  experienceCategories,
  roleCategories,
  techCategories,
} from "@/constants/categoryData";
import { AllselectedItemsState, Category } from "@/types";
import { CategoryPickerGroup } from "./categoryPickerGroup";
import { DetailsTabContent } from "./detailsTabContent";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <span className="text-sm text-gray-600">
            Step {tabOrder.indexOf(activeTab) + 1} of {tabOrder.length}
          </span>
        </div>

        <Card className="border">
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-lg">
                {activeTab === "TechStack" && "Choose Technologies"}
                {activeTab === "Role" && "Select Role & Experience"}
                {activeTab === "Details" && "Review & Create Interview"}
              </CardTitle>
              <CardDescription className="text-sm">
                {activeTab === "TechStack" &&
                  "Pick the technologies you want to be interviewed on"}
                {activeTab === "Role" &&
                  "Define your position and experience level"}
                {activeTab === "Details" &&
                  "Review your selections and create the interview"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "TechStack" && (
              <CategoryPickerGroup
                categories={techStack}
                setCategories={setTechStack}
                allselectedItems={allselectedItems}
                setAllSelectedItems={setAllSelectedItems}
                goToBackTab={goToBackTab}
                goToNextTab={goToNextTab}
                currentTab={activeTab}
              />
            )}
            {activeTab === "Role" && (
              <div className="space-y-6">
                <CategoryPickerGroup
                  categories={roles}
                  setCategories={setRoles}
                  allselectedItems={allselectedItems}
                  setAllSelectedItems={setAllSelectedItems}
                  goToBackTab={goToBackTab}
                  goToNextTab={goToNextTab}
                  currentTab={activeTab}
                />
                <div className="border-t pt-6">
                  <CategoryPickerGroup
                    categories={experience}
                    setCategories={setExperience}
                    allselectedItems={allselectedItems}
                    setAllSelectedItems={setAllSelectedItems}
                    goToBackTab={goToBackTab}
                    goToNextTab={goToNextTab}
                    currentTab={activeTab}
                  />
                </div>
              </div>
            )}
            {activeTab === "Details" && (
              <DetailsTabContent
                allselectedItems={allselectedItems}
                goToBackTab={goToBackTab}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
