import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Share2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import BottomNavigation from "../components/BottomNavigation";

const ReferEarn: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState("SHREYANSH50");
  const [referrals] = useState([
    { name: "Rahul Kumar", date: "2 days ago", status: "completed", reward: 100 },
    { name: "Priya Singh", date: "1 week ago", status: "completed", reward: 100 },
    { name: "Amit Patel", date: "2 weeks ago", status: "pending", reward: 100 }
  ]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Paryatnam Cabs - Refer & Earn',
        text: `Use my referral code ${referralCode} to get ₹100 off your first ride on Paryatnam Cabs!`,
        url: 'https://paryatnamcabs.com'
      });
    } else {
      handleCopyCode();
    }
  };

  const totalEarned = referrals.reduce((sum, ref) => 
    ref.status === 'completed' ? sum + ref.reward : sum, 0
  );

  const pendingRewards = referrals.reduce((sum, ref) => 
    ref.status === 'pending' ? sum + ref.reward : sum, 0
  );

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
          <h1 className="text-xl font-bold">Refer & Earn</h1>
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
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold mb-2">Earn ₹100 for every friend!</h2>
            <p className="text-primary-100">
              Share your referral code and both you and your friend get ₹100 off
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-400">₹{totalEarned}</div>
              <p className="text-sm text-gray-400">Total Earned</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">₹{pendingRewards}</div>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </motion.div>

          {/* Referral Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 bg-dark-600 rounded-lg p-4 text-center">
                <span className="text-2xl font-mono font-bold text-primary-400">{referralCode}</span>
              </div>
              <motion.button
                onClick={handleCopyCode}
                className="bg-primary-600 hover:bg-primary-700 p-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-5 h-5" />
              </motion.button>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-center text-sm"
              >
                Code copied to clipboard!
              </motion.p>
            )}
            <Button
              onClick={handleShare}
              className="w-full bg-primary-600 hover:bg-primary-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Referral Code
            </Button>
          </motion.div>

          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">How it Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Share your referral code</p>
                  <p className="text-sm text-gray-400">Send it to friends via message, social media, or email</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Friend books their first ride</p>
                  <p className="text-sm text-gray-400">They use your code when signing up</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Both get ₹100 off</p>
                  <p className="text-sm text-gray-400">Reward credited after their first completed trip</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Referral History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Your Referrals</h3>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-dark-600 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{referral.name}</p>
                        <p className="text-sm text-gray-400">{referral.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${
                        referral.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {referral.status === 'completed' ? 'Completed' : 'Pending'}
                      </p>
                      <p className="text-primary-400 font-medium">₹{referral.reward}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👥</div>
                <h4 className="text-lg font-medium mb-2">No referrals yet</h4>
                <p className="text-gray-400">Share your code to start earning rewards!</p>
              </div>
            )}
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Referral rewards are valid for 30 days</p>
              <p>• Both referrer and referee must complete their first trip</p>
              <p>• Rewards can be used on any Paryatnam Cabs service</p>
              <p>• Maximum 10 referrals per month</p>
              <p>• Company reserves the right to modify terms</p>
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ReferEarn; 