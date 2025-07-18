import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { CreateMockup } from "@/components/create-mock-up";

const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInterview = useCallback(async () => {
    if (interviewId && interview) {
      try {
        setIsLoading(true);
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        if (interviewDoc.exists()) {
          setInterview({
            id: interviewDoc.id,
            ...interviewDoc.data(),
          } as Interview);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  }, [interviewId]);

  useEffect(() => {
    fetchInterview();
  }, [fetchInterview, interviewId]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex justify-center w-full ">
      <CreateMockup />
    </div>
  );
};
export default CreateEditPage;