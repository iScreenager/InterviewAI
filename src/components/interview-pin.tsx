import { Interview } from "@/types";
import { Card, CardDescription, CardFooter, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { useNavigate } from "react-router-dom";
import { CircleArrowRight, Newspaper, Trash2 } from "lucide-react";

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

  const footerData = `${createdAtDate} - ${createdTime}`;
  const navigate = useNavigate();
  return (
    <Card className="p-4 rounded-md shadow-ld hover:shadow-ld shadow-gray-400 hover:shadow-gray-400 cursor-pointer transition-all space-y-4">
      <CardTitle className="text-lg">{interview?.position}</CardTitle>
      <CardDescription>{interview?.description}</CardDescription>
      <div className="w-full flex items-center gap-2 flex-wrap">
        {interview.techStack.split(",").map((word, index) => (
          <p
            key={index}
            className="text-xs text-muted-foreground hover:border-gray-600 hover:text-gray-600 border rounded-xl px-2.5 py-0.5 ">
            {word}
          </p>
        ))}
      </div>
      <CardFooter
        className={cn(
          "w-full flex items-center p-0",
          onMockPage ? "justify-end" : "justify-between"
        )}>
        <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
          {footerData}
        </p>
        {!onMockPage && (
          <div className="flex items-center justify-center">
            <TooltipButton
              content="Feedback"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/feedback/${interview.id}`);
              }}
              disabled={false}
              buttonClassName="hover:text-red-500"
              icon={<Newspaper />}
              loading={false}
            />
            <TooltipButton
              content="Delete"
              buttonVariant={"ghost"}
              onClick={() => {
                showModal(true);
                interviewId(interview.id);
              }}
              disabled={false}
              buttonClassName="hover:text-red-500"
              icon={<Trash2 />}
              loading={false}
            />

            <TooltipButton
              content="Start"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/interview/${interview.id}`);
              }}
              disabled={interview.interviewSubmitted}
              buttonClassName="hover:text-red-500"
              icon={<CircleArrowRight />}
              loading={false}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
