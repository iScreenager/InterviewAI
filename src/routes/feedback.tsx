import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";

import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";


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
  Home,
} from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderPage } from "./loader-page";
import { AuthContext } from "@/context/auth-context";

const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeed, setActiveFeed] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  if (isLoading) return <LoaderPage className="w-full h-[70vh]" />;

  return (
    <div className="flex flex-col w-full gap-8 py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Results
          </h1>
          <p className="text-gray-600">
            Detailed feedback and analysis of your performance
          </p>
        </div>

        <div className="flex justify-center sm:justify-end">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="px-4 py-2 border border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      {interview?.overallFeedback && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white border rounded-xl p-6 flex flex-col items-center shadow-md h-full">
            <h6 className="text-sm font-medium text-gray-600 mb-2">
              Overall Score
            </h6>
            <div className="w-[120px] h-[120px] mb-4">
              <CircularProgressbar
                value={percentage}
                text={`${interview.overallFeedback.overallScore}`}
                styles={buildStyles({
                  pathColor:
                    percentage >= 80
                      ? "#10B981"
                      : percentage >= 60
                      ? "#F59E0B"
                      : "#EF4444",
                  textColor: "#0E1729",
                  trailColor: "#EAEFF5",
                  textSize: "20px",
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                  percentage >= 80
                    ? "bg-green-100 text-green-800"
                    : percentage >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {percentage >= 80
                  ? "Excellent"
                  : percentage >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </div>
              <p className="text-gray-700 text-sm break-words">
                {interview.overallFeedback.summary}
              </p>
            </div>
          </Card>

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


      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Question Analysis
          </h2>
          <p className="text-gray-600">
            Detailed feedback for each question you answered
          </p>
        </div>

        {interview && (
          <Accordion type="multiple" className="space-y-4">
            {interview.questions.map((feed, index) => (
              <AccordionItem
                key={index}
                value={feed.question}
                className="border rounded-xl overflow-hidden shadow transition duration-300 ease-in-out"
              >
                <AccordionTrigger
                  onClick={() => setActiveFeed(feed.question)}
                  className={cn(
                    "no-underline hover:no-underline",
                    "flex flex-wrap sm:flex-nowrap items-center justify-between px-5 py-4 bg-gradient-to-r from-white to-gray-50",
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-100 transition-all",
                    activeFeed === feed.question
                      ? "bg-gradient-to-r from-purple-100 to-blue-100"
                      : ""
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-gray-900 font-semibold text-sm sm:text-base whitespace-nowrap">
                        Question {index + 1}
                      </span>

                      <span className="text-green-600 font-semibold sm:hidden flex items-center gap-1 text-sm no-underline">
                        <Award className="w-4 h-4" />
                        {feed.rating}%
                      </span>
                    </div>
                    <span className="hidden sm:inline text-gray-600 text-sm sm:text-base break-words flex-1 md:block">
                      {feed.question}
                    </span>
                  </div>

                  <span className="hidden sm:flex items-center gap-1 text-green-600 font-semibold min-w-[60px] justify-end mt-2 sm:mt-0">
                    <Award className="w-4 h-4 flex-shrink-0" />
                    {feed.rating}%
                  </span>
                </AccordionTrigger>

                <AccordionContent className="bg-white px-5 py-6 space-y-4 transition-all duration-300 ease-in-out">
                  <Card className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-lg shadow mb-4 block md:hidden">
                    <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                      <CircleCheck className="mr-2 text-gray-600" />
                      Question
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-sm leading-relaxed">
                      {feed.question}
                    </CardDescription>
                  </Card>


                  <Card className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-lg shadow">
                    <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                      <CircleCheck className="mr-2 text-gray-600" />
                      Question
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-sm leading-relaxed">
                      {feed.question}
                    </CardDescription>
                  </Card>

                  <Card className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow">
                    <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                      <CircleCheck className="mr-2 text-green-600" />
                      Expected Answer
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-sm leading-relaxed">
                      {feed.answer}
                    </CardDescription>
                  </Card>


                  <Card className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow">
                    <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                      <CircleCheck className="mr-2 text-blue-600" />
                      Your Answer
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-sm leading-relaxed">
                      {feed.userAnswer || "No answer provided"}
                    </CardDescription>
                  </Card>

           
                  <Card className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg shadow">
                    <CardTitle className="flex items-center text-sm sm:text-base mb-1">
                      <CircleCheck className="mr-2 text-orange-600" />
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
    </div>
  );
};

export default Feedback;
