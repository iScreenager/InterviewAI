import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";

import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import { Headings } from "@/components/headings";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  CircleCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LoaderPage } from "./loader-page";
import { AuthContext } from "@/context/auth-context";

const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeed, setActiveFeed] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Animated progress state
  const [percentage, setPercentage] = useState(0);

  if (!interviewId) {
    navigate("/generate");
  }

  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        setIsLoading(true);
        if (!user?.uid || !interviewId) {
          navigate("/generate", { replace: true });
          return;
        }
        try {
          const interviewDoc = await getDoc(
            doc(db, "users", user.uid, "interviews", interviewId)
          );
          if (interviewDoc.exists()) {
            setInterview({ ...interviewDoc.data() } as Interview);
          } else {
            navigate("/generate", { replace: true });
          }
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later..",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchInterview();
    }
  }, [interviewId, navigate, user?.uid]);

  useEffect(() => {
    if (!interview?.overallFeedback) {
      setPercentage(0);
      return;
    }

    const score = interview.overallFeedback.overallScore ?? 0;
    const target = Math.min(score, 100);

    let start = 0;
    const duration = 800;
    const stepTime = 10;
    const increment = target / (duration / stepTime);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setPercentage(target);
        clearInterval(interval);
      } else {
        setPercentage(start);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [interview]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h4 className="text-3xl sm:text-4xl font-bold mb-1">
          Your Interview Results
        </h4>
        <span className="text-sm sm:text-base text-gray-500">
          Detailed feedback and analysis of your performance
        </span>
      </div>

      {interview?.overallFeedback && (
        <div className="my-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Overall Score */}
          <Card className="bg-white border rounded-xl p-6 flex flex-col items-center shadow-md h-full">
            <h6 className="text-sm font-medium text-gray-600 mb-2">
              Overall Score
            </h6>
            <div className="w-[120px] h-[120px] mb-4">
              <CircularProgressbar
                value={percentage}
                text={`${interview.overallFeedback.overallScore} / 100`}
                styles={buildStyles({
                  pathColor: "#1BB4C9",
                  textColor: "#0E1729",
                  trailColor: "#EAEFF5",
                  textSize: "16px",
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold">Performance Summary</span>
              <p className="text-gray-700 text-sm mt-2 break-words">
                {interview.overallFeedback.summary}
              </p>
            </div>
          </Card>

          {/* Strengths */}
          <Card className="bg-white border rounded-xl shadow-md p-6 flex flex-col h-full">
            <CardTitle className="flex items-center font-semibold text-lg mb-2">
              <ThumbsUp className="mr-2 text-green-500" />
              Strengths
            </CardTitle>
            <CardDescription className="space-y-2 text-gray-700 text-sm flex-1">
              {interview.overallFeedback.strengths?.length ? (
                interview.overallFeedback.strengths.map((strength, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <CheckCircle className="text-green-500 mt-[2px]" />
                    <span>{strength}</span>
                  </div>
                ))
              ) : (
                <li>No strengths provided.</li>
              )}
            </CardDescription>
          </Card>

          {/* Improvements */}
          <Card className="bg-white border rounded-xl shadow-md p-6 flex flex-col h-full">
            <CardTitle className="flex items-center font-semibold text-lg mb-2">
              <ThumbsDown className="mr-2 text-orange-400" />
              Areas to Improve
            </CardTitle>
            <CardDescription className="space-y-2 text-gray-700 text-sm flex-1">
              {interview.overallFeedback.improvements?.length ? (
                interview.overallFeedback.improvements.map((improve, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <AlertTriangle className="text-orange-400 mt-[2px]" />
                    <span>{improve}</span>
                  </div>
                ))
              ) : (
                <li>No improvement areas provided.</li>
              )}
            </CardDescription>
          </Card>
        </div>
      )}

      <Headings title="Interview Feedback" isSubHeading />

      {/* Accordion Section */}
      {interview && (
        <Accordion type="multiple" className="space-y-6">
          {interview.questions.map((feed, index) => (
            <AccordionItem
              key={index}
              value={feed.question}
              className="border rounded-xl overflow-hidden shadow transition duration-300 ease-in-out">
              {/* AccordionTrigger */}
              <AccordionTrigger
                onClick={() => setActiveFeed(feed.question)}
                className={cn(
                  "flex flex-wrap sm:flex-nowrap items-center justify-between px-5 py-4 bg-gradient-to-r from-white to-gray-50",
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-100 transition-all",
                  activeFeed === feed.question
                    ? "bg-gradient-to-r from-purple-100 to-blue-100"
                    : ""
                )}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1 min-w-0">
                  <span className="text-gray-900 font-semibold text-sm sm:text-base whitespace-nowrap">
                    Question {index + 1}:
                  </span>
                  <span className="text-gray-600 break-words text-sm sm:text-base mt-1 sm:mt-0 min-w-0 flex-1">
                    {feed.question}
                  </span>
                </div>

                <span className="flex items-center gap-1 text-green-600 font-semibold min-w-[60px] justify-end mt-2 sm:mt-0">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  {feed.rating}%
                </span>
              </AccordionTrigger>

              {/* AccordionContent */}
              <AccordionContent className="bg-white px-5 py-6 space-y-6 transition-all duration-300 ease-in-out">
                {/* Expected Answer */}
                <Card className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow">
                  <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-sm leading-relaxed">
                    {feed.answer}
                  </CardDescription>
                </Card>

                {/* Your Answer */}
                <Card className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow">
                  <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                    <CircleCheck className="mr-2 text-blue-600" />
                    Your Answer
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-sm leading-relaxed">
                    {feed.userAnswer}
                  </CardDescription>
                </Card>

                {/* Feedback */}
                <Card className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow">
                  <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                    <CircleCheck className="mr-2 text-red-600" />
                    Feedback
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-sm leading-relaxed">
                    {feed.feedback}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Feedback;
