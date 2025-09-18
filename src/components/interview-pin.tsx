import { Interview } from "@/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  CircleArrowRight,
  Newspaper,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";

interface InterviewPinProps {
  interview: Interview;
  onMockPage: boolean;
  showModal: (val: boolean) => void;
  interviewId: (data: string) => void;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
  showModal,
  interviewId,
}: InterviewPinProps) => {
  const createdAtDate = new Date(
    interview.createdAt.toDate()
  ).toLocaleDateString("en-Us", { dateStyle: "long" });

  const createdTime = new Date(interview.createdAt.toDate()).toLocaleTimeString(
    "en-US",
    { timeStyle: "short" }
  );
  const navigate = useNavigate();
  return (
    <Card className="bg-white border rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="mb-4 flex-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {interview?.position}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
          {interview?.description}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {interview.techStack.split(",").map((word, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border">
              {word.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{createdAtDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>{createdTime}</span>
        </div>
      </div>

      {!onMockPage && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/feedback/${interview.id}`)}
                disabled={!interview.interviewSubmitted}
                className="px-3 py-1.5 text-xs border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-700 flex-1">
                <Newspaper className="w-3 h-3 mr-1" />
                Feedback
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  showModal(true);
                  interviewId(interview.id);
                }}
                className="px-3 py-1.5 text-xs border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors flex-1">
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>

            <Button
              onClick={() => navigate(`/interview/${interview.id}`)}
              disabled={interview.interviewSubmitted}
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
              <CircleArrowRight className="w-3 h-3 mr-1" />
              {interview.interviewSubmitted ? "Completed" : "Start"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
