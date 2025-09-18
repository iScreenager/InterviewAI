import { BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export const TrackProgress = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: BarChart3,
      title: "Performance Scores",
      description: "See your interview scores and feedback for each question.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "See your interview history and track your improvement over time.",
    },
    {
      icon: Target,
      title: "Interview History",
      description: "View all your past interviews and their results.",
    },
    {
      icon: Award,
      title: "Statistics",
      description: "Check your completion rate and average performance.",
    },
  ];

  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-bold">
            See how you're doing with detailed analytics and progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-2">
                <img
                  src="/assets/img/dashboard.png"
                  alt="InterviewAI Dashboard"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/sign-up"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
