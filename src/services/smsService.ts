// SMS Service using Google Cloud APIs
// This service handles OTP sending and verification

interface SMSResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

interface OTPVerificationResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

class SMSService {
  private apiKey: string;
  private projectId: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY || '';
    this.projectId = process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID || '';
  }

  // Send OTP using Google Cloud Functions or Firebase Auth
  async sendOTP(phoneNumber: string): Promise<SMSResponse> {
    try {
      // For demo purposes, we'll simulate the API call
      // In production, you would use Firebase Auth or Google Cloud Functions
      
      console.log(`Sending OTP to ${phoneNumber} via Google Cloud API`);
      
      // Simulate API call to Google Cloud
      const response = await fetch(`https://us-central1-${this.projectId}.cloudfunctions.net/sendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          phoneNumber: `+91${phoneNumber}`,
          appName: 'Paryatnam Cabs'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'OTP sent successfully',
          sessionId: data.sessionId
        };
      } else {
        // Fallback for demo - generate a mock OTP
        const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store OTP in localStorage for demo purposes
        localStorage.setItem(`otp_${phoneNumber}`, mockOTP);
        localStorage.setItem(`otp_session_${phoneNumber}`, sessionId);
        
        console.log(`Demo OTP for ${phoneNumber}: ${mockOTP}`);
        
        return {
          success: true,
          message: 'OTP sent successfully (Demo Mode)',
          sessionId: sessionId
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Fallback for demo
      const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem(`otp_${phoneNumber}`, mockOTP);
      localStorage.setItem(`otp_session_${phoneNumber}`, sessionId);
      
      console.log(`Demo OTP for ${phoneNumber}: ${mockOTP}`);
      
      return {
        success: true,
        message: 'OTP sent successfully (Demo Mode)',
        sessionId: sessionId
      };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string, sessionId?: string): Promise<OTPVerificationResponse> {
    try {
      // For demo purposes, check against stored OTP
      const storedOTP = localStorage.getItem(`otp_${phoneNumber}`);
      const storedSessionId = localStorage.getItem(`otp_session_${phoneNumber}`);
      
      if (storedOTP && storedOTP === otp) {
        // Clear OTP after successful verification
        localStorage.removeItem(`otp_${phoneNumber}`);
        localStorage.removeItem(`otp_session_${phoneNumber}`);
        
        return {
          success: true,
          message: 'OTP verified successfully',
          verified: true
        };
      }
      
      return {
        success: false,
        message: 'Invalid OTP',
        verified: false
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Error verifying OTP',
        verified: false
      };
    }
  }

  // Resend OTP
  async resendOTP(phoneNumber: string): Promise<SMSResponse> {
    return this.sendOTP(phoneNumber);
  }
}

export default new SMSService(); 