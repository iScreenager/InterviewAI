import { Interview } from "@/types";
import { Card, CardDescription, CardFooter, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { useNavigate } from "react-router-dom";
import { Eye, Newspaper, Pencil, Sparkles } from "lucide-react";

interface InterviewPinProps {
  interview: Interview;
  onMockPage: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
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
    <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4">
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
              content="Edit"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/edit/${interview.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-red-500"
              icon={<Pencil />}
              loading={false}
            />

            <TooltipButton
              content="View"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/edit/${interview.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-red-500"
              icon={<Eye />}
              loading={false}
            />

            <TooltipButton
              content="Feedback"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/feedback/${interview.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-red-500"
              icon={<Newspaper />}
              loading={false}
            />

            <TooltipButton
              content="Start"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/interview/${interview.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-red-500"
              icon={<Sparkles />}
              loading={false}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
