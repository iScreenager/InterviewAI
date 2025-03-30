import { Container } from "@/components/container";
import { Mail, Phone, MapPin } from "lucide-react";

export const ContactPage = () => {
  return (
    <div id="contact" className="bg-gray-50 pt-5 pb-14">
      <Container className="flex flex-col items-center">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">
          Get In Touch
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Have questions or feedback? We'd love to hear from you.
        </p>

        <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl flex flex-col md:flex-row gap-8">
          <div className="space-y-6 flex-1">
            <div className="flex items-center space-x-4">
              <Mail className="text-violet-700 w-6 h-6" />
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  InterviewAI@interviewAI.com
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="text-violet-700 w-6 h-6" />
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  +91 9876543210
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin className="text-violet-700 w-6 h-6" />
              <div>
                <h3 className="font-semibold">Our Address</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Delhi, India
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="font-semibold text-center text-lg mb-4">
              Send Us a Message
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <textarea
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"></textarea>
              <button
                type="submit"
                className="w-full bg-violet-700 text-white py-2 rounded-md hover:bg-violet-800 transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};
