
import { ConfirmActionModal } from "@/components/confirmActionModal";
import { InterviewPin } from "@/components/interview-pin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { AuthContext } from "@/context/auth-context";
import { Interview } from "@/types";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Plus, Home } from "lucide-react";
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

  const completedInterviews = interviews.filter(
    (i) => i.interviewSubmitted
  ).length;
  const thisMonthInterviews = interviews.filter((i) => {
    const date = new Date(i.createdAt.seconds * 1000); 
    const now = new Date();
    const isThisMonth =
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    return isThisMonth;
  }).length;

  const completedWithScores = interviews.filter(
    (i) => i.interviewSubmitted && i.overallFeedback?.overallScore
  );
  const averageScore =
    completedWithScores.length > 0
      ? Math.round(
          completedWithScores.reduce(
            (sum, i) => sum + (i.overallFeedback?.overallScore || 0),
            0
          ) / completedWithScores.length
        )
      : 0;

  const stats = [
    {
      title: "Total Interviews",
      value: interviews.length,
    },
    {
      title: "Completed",
      value: completedInterviews,
    },
    {
      title: "This Month",
      value: thisMonthInterviews,
    },
    {
      title: "Avg Performance",
      value: `${averageScore}%`,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-8 py-6 px-4 sm:px-8 max-w-8xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your interview progress.
          </p>
        </div>

        <div className="flex justify-center sm:justify-end gap-3">
          <Link to="/">
            <Button
              variant="outline"
              className="px-4 py-2 border border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/create">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              New Interview
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 group overflow-hidden"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">
                  {stat.title}
                </div>
               
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  {stat.value}
                </div>
              </div>

  
              {stat.title === "Avg Performance" && averageScore > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        averageScore >= 80
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : averageScore >= 60
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Interviews
        </h2>
        <p className="text-gray-600">
          Manage and track your mock interview sessions
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((interview) => (
            <InterviewPin
              key={interview.id}
              interview={interview}
              onMockPage={false}
              showModal={setShowDeleteModal}
              interviewId={setDeleteInterviewId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No interviews yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start your first mock interview to track your progress and improve
            your skills.
          </p>
          <Link to="/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Interview
            </Button>
          </Link>
        </div>
      )}

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
    </div>
  );
};
export default Dashboard;
