import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Interview } from "@/types";
import { useContext, useEffect, useState } from "react";

import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";


interface FormMockInterviewProps {
  inititalData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ inititalData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: inititalData || {},
  });
  const navigate = useNavigate();
  const { isValid, isSubmitting } = form.formState;
  const [isLoading, setIsLoading] = useState(false);
  

  const { user } = useContext(AuthContext);
  const userId = user?.uid || null;

  const title = inititalData
    ? inititalData.position
    : "Create a new mock interview";

  

  const actions = inititalData ? "Save Changes" : "Create";

  const toastMessage = inititalData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/json|```|`/g, "");
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);

    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0];
    } else {
      throw new Error("No JSON array found in response");
    }

    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `
            As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

            [
              { "question": "<Question text>", "answer": "<Answer text>" },
              ...
            ]

            Job Information:
            - Job Position: ${data?.position}
            - Job Description: ${data?.description}
            - Years of Experience Required: ${data?.experience}
            - Tech Stacks: ${data?.techStack}

            The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
            `;

    const aiResult = await chatSession.sendMessage(prompt);
    const cleanedResponse = cleanAiResponse(aiResult.response.text());

    return cleanedResponse;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      if (inititalData && isValid) {
        const aiResult = await generateAiResponse(data);

        await updateDoc(doc(db, "interviews", inititalData?.id), {
          questions: aiResult,
          ...data,
          updatedAt: serverTimestamp(),
        });

        toast(toastMessage.title, { description: toastMessage.description });
        navigate("/generate", { replace: true });
      } else {
        if (isValid) {
          const aiResult = await generateAiResponse(data);
          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
          });

          toast(toastMessage.title, {
            description: toastMessage.description,
          });
          navigate("/generate", { replace: true });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error....", {
        description: `Something went wrong. Please try again later`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = () => {
    form.reset({
      position: "",
      description: "",
      experience: 0,
      techStack: "",
    });
  };

  const handleDelete = async () => {
    if (!inititalData?.id) return;

    try {
      setIsLoading(true);
      await deleteDoc(doc(db, "interviews", inititalData.id));
      toast("Deleted!", {
        description: "Mock Interview removed successfully.",
      });
      navigate("/generate", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Error!", {
        description: "Failed to delete. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (inititalData) {
      form.reset({
        position: inititalData?.position,
        description: inititalData?.description,
        experience: inititalData?.experience,
        techStack: inititalData?.techStack,
      });
    }
  }, [inititalData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <div className="mt-4 flex items-center justify-between w-full ">
        <Headings title={title} isSubHeading />
        {inititalData && (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={handleDelete}
            disabled={isLoading}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-10 shadow-md  ">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                  <FormDescription>Min 10 Words</FormDescription>
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- describle your job role"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- 5 Years"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={isLoading}
                    placeholder="Type tech stack here"
                    {...field}
                    value={field.value || ""}
                    
                  />
                </FormControl>
                <div className="flex gap-3">
                  {(field.value || "").split(",").map((stack,indx) => (
                    <div key={indx} className="border p-2 rounded-md">{stack}
                      <span> X</span>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || isLoading}
              onClick={onReset}>
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || isLoading}>
              {isLoading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
