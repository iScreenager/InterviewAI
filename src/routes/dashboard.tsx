/* eslint-disable react-hooks/exhaustive-deps */
import { ConfirmActionModal } from "@/components/confirmActionModal";
import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/interview-pin";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { AuthContext } from "@/context/auth-context";
import { Interview } from "@/types";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteInterviewId, setDeleteInterviewId] = useState<string | null>(
    null
  );
  

  const { user } = useContext(AuthContext);

  const getInterviews = async () => {
    if (!user?.uid) {
      toast.error("User not logged in. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const interviewCollections = await getDocs(
        collection(db, "users", user.uid, "interviews")
      );

      const interviewList = interviewCollections.docs.map((doc) => ({
        ...(doc.data() as Interview),
        id: doc.id,
      }));

      setInterviews(interviewList);
    } catch (error) {
      console.error("Error on fetching:", error);
      toast.error("Something went wrong", {
        description: "Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteInterviewId || !user?.uid) return;

    try {
      setIsLoading(true);
      await deleteDoc(
        doc(db, "users", user.uid, "interviews", deleteInterviewId)
      );
      toast("Deleted!", {
        description: "Mock Interview removed successfully.",
      });
      await getInterviews();
      setShowDeleteModal(false);
      setDeleteInterviewId(null);
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
    if (user?.uid) {
      getInterviews();
    }
  }, [user?.uid]);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Headings
          title="Dashboard"
          description="Create and start you AI Mock Interview"
        />
        <Link to={"/generate/create"}>
          <Button size={"sm"} className="text-xs">
            <Plus /> Add New
          </Button>
        </Link>
      </div>
      <Separator className="my-8" />
      <div className="md:grid md:grid-cols-3 gap-3 py-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 md:h-32 rounded-md" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <InterviewPin
              key={interview.id}
              interview={interview}
              onMockPage={false}
              showModal={setShowDeleteModal}
              interviewId={setDeleteInterviewId}
            />
          ))
        ) : (
          <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
            <img
              src="/assets/svg/not-found.svg"
              className="w-44 h-44 object-contain"
              alt=""
            />

            <h2 className="text-lg font-semibold text-muted-foreground">
              No Data Found
            </h2>

            <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
              There is no available data to show. Please add some new mock
              interviews
            </p>

            <Link to={"/generate/create"} className="mt-4">
              <Button size={"sm"}>
                <Plus className="min-w-5 min-h-5 mr-1" />
                Add New
              </Button>
            </Link>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <ConfirmActionModal
          title="Delete this mock interview?"
          description="This action is permanent and cannot be undone."
          btnName="Delete"
          isOpen={showDeleteModal}
          isLoading={isLoading}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteInterviewId(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
export default Dashboard;
