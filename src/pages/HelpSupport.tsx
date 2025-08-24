import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import BottomNavigation from "../components/BottomNavigation";

interface FAQ {
  question: string;
  answer: string;
}

const HelpSupport: React.FC = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "How do I book a ride?",
      answer: "Simply open the app, select your service type (Airport, Rental, Intercity, or Delivery), enter your pickup and destination locations, and tap 'Book Ride'. Your driver will be assigned within minutes."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards, UPI, digital wallets (Paytm, PhonePe, Google Pay), and cash payments. You can also add money to your Paryatnam wallet for seamless payments."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 5 minutes after confirmation without any charges. Cancellations after this period may incur a small cancellation fee."
    },
    {
      question: "How do I track my driver?",
      answer: "Once your ride is confirmed, you'll see your driver's location in real-time on the map. You can also call or message your driver directly through the app."
    },
    {
      question: "What if I left something in the car?",
      answer: "Contact our support team immediately with your trip details. We'll help you get in touch with your driver to recover your lost items."
    },
    {
      question: "How do I report an issue?",
      answer: "You can report issues through the app's 'Help & Support' section, call our 24/7 support line, or email us. We typically respond within 2 hours."
    },
    {
      question: "Are your drivers verified?",
      answer: "Yes, all our drivers undergo thorough background checks, vehicle inspections, and training programs. They are also regularly monitored for quality and safety."
    },
    {
      question: "Do you operate 24/7?",
      answer: "Yes, Paryatnam Cabs operates 24/7 across all major cities. However, availability may vary during late night hours in some areas."
    }
  ];

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Support",
      subtitle: "24/7 Customer Care",
      value: "+91 1800 123 4567",
      action: () => window.open('tel:+9118001234567')
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      subtitle: "Instant Support",
      value: "Available 24/7",
      action: () => alert("Live chat feature coming soon!")
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      subtitle: "Detailed Queries",
      value: "support@paryatnamcabs.com",
      action: () => window.open('mailto:support@paryatnamcabs.com')
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office Address",
      subtitle: "Headquarters",
      value: "Delhi, India",
      action: () => alert("Office: Paryatnam Cabs HQ, Connaught Place, New Delhi")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-800 to-dark-900 text-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          <h1 className="text-xl font-bold">Help & Support</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-center"
          >
            <div className="text-4xl mb-4">❓</div>
            <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
            <p className="text-primary-100">
              Find answers to common questions or get in touch with our support team
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMethods.map((method, index) => (
                <motion.button
                  key={index}
                  onClick={method.action}
                  className="flex items-center space-x-3 p-4 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-primary-400">{method.icon}</div>
                  <div className="text-left">
                    <p className="font-medium">{method.title}</p>
                    <p className="text-sm text-gray-400">{method.subtitle}</p>
                    <p className="text-sm text-primary-400">{method.value}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="border border-dark-600 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-600 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-gray-300 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/my-rides")}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="mr-3">📋</span>
                View My Trip History
              </Button>
              <Button
                onClick={() => navigate("/refer-earn")}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="mr-3">🎁</span>
                Refer & Earn Program
              </Button>
              <Button
                onClick={() => alert("Safety features coming soon!")}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="mr-3">🛡️</span>
                Safety Features
              </Button>
            </div>
          </motion.div>

          {/* Support Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Support Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer Support</span>
                <span>24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Technical Support</span>
                <span>6 AM - 12 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email Response</span>
                <span>Within 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Live Chat</span>
                <span>24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HelpSupport; 