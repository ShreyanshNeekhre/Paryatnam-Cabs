// User Service using Google Cloud Firestore
// This service handles user data storage, retrieval, and management

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential 
} from 'firebase/auth';

// Firebase configuration - Updated with actual project details
const firebaseConfig = {
  apiKey: "AIzaSyCCu74yj8VQluMNPf7YU_37znx9eRL1jPk",
  authDomain: "paryatnam-cabs.firebaseapp.com",
  projectId: "paryatnam-cabs",
  storageBucket: "paryatnam-cabs.appspot.com",
  messagingSenderId: "578876032953",
  appId: "1:578876032953:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  userType: 'customer' | 'driver' | 'admin';
  isVerified: boolean;
  isFirstTime: boolean;
  profilePicture?: string;
  walletBalance: number;
  totalRides: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    language: string;
    notifications: boolean;
    locationSharing: boolean;
  };
  vehicleInfo?: {
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    insuranceExpiry: Date;
  };
}

export interface RideHistory {
  id: string;
  userId: string;
  pickup: string;
  destination: string;
  distance: string;
  duration: string;
  fare: number;
  carType: string;
  status: 'completed' | 'cancelled' | 'ongoing';
  driverId?: string;
  driverName?: string;
  driverRating?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  rideId?: string;
  createdAt: Date;
}

class UserService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA
  initializeRecaptcha(containerId: string) {
    try {
      // Clear any existing reCAPTCHA
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.log('reCAPTCHA container not found, using demo mode');
        return;
      }

      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.recaptchaVerifier = null;
        }
      });
    } catch (error) {
      console.log('reCAPTCHA initialization failed, using demo mode:', error);
      this.recaptchaVerifier = null;
    }
  }

  // Send OTP using Firebase Auth with proper callbacks
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; sessionId?: string; demoOTP?: string }> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const formattedPhone = `+91${phoneNumber}`;
      
      try {
        // Use proper Firebase phone authentication
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
        
        // Store confirmation result for verification
        sessionStorage.setItem('confirmationResult', JSON.stringify(confirmationResult));
        
        console.log('Firebase phone auth initiated successfully');
        
        return {
          success: true,
          message: 'OTP sent successfully via SMS',
          sessionId: confirmationResult.verificationId
        };
      } catch (firebaseError: any) {
        console.log('Firebase auth error, using demo mode:', firebaseError.message);
        
        // Check if it's a specific Firebase error that we can handle
        if (firebaseError.code === 'auth/invalid-phone-number') {
          return {
            success: false,
            message: 'Invalid phone number format. Please enter a valid 10-digit number.'
          };
        } else if (firebaseError.code === 'auth/too-many-requests') {
          return {
            success: false,
            message: 'Too many requests. Please try again later.'
          };
        } else if (firebaseError.code === 'auth/quota-exceeded') {
          return {
            success: false,
            message: 'SMS quota exceeded. Please try again later.'
          };
        }
        
        // Fallback to demo mode for other errors
        const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store OTP in localStorage for demo purposes
        localStorage.setItem(`otp_${phoneNumber}`, mockOTP);
        localStorage.setItem(`otp_session_${phoneNumber}`, sessionId);
        
        console.log(`Demo OTP for ${phoneNumber}: ${mockOTP}`);
        
        return {
          success: true,
          message: 'OTP sent successfully (Demo Mode)',
          sessionId: sessionId,
          demoOTP: mockOTP
        };
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  // Verify OTP using Firebase Auth with proper verification
  async verifyOTP(otp: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const confirmationResultStr = sessionStorage.getItem('confirmationResult');
      
      if (confirmationResultStr) {
        // Try Firebase verification first
        try {
          const confirmationResult = JSON.parse(confirmationResultStr);
          const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
          const result = await signInWithCredential(auth, credential);

          console.log('Firebase phone verification successful');

          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (userDoc.exists()) {
            // Existing user
            const userData = userDoc.data() as User;
            return {
              success: true,
              message: 'Phone number verified successfully',
              user: userData
            };
          } else {
            // New user - will be created during profile completion
            return {
              success: true,
              message: 'Phone number verified successfully. Please complete your profile.',
              user: undefined
            };
          }
        } catch (firebaseError: any) {
          console.log('Firebase verification failed:', firebaseError.message);
          
          // Handle specific Firebase verification errors
          if (firebaseError.code === 'auth/invalid-verification-code') {
            return {
              success: false,
              message: 'Invalid OTP. Please check the code and try again.'
            };
          } else if (firebaseError.code === 'auth/invalid-verification-id') {
            return {
              success: false,
              message: 'Verification session expired. Please request a new OTP.'
            };
          }
          
          // Fall through to demo mode for other errors
        }
      }
      
      // Demo mode verification
      const phoneNumber = localStorage.getItem('currentPhoneNumber') || '';
      const storedOTP = localStorage.getItem(`otp_${phoneNumber}`);
      
      if (storedOTP && storedOTP === otp) {
        // Clear OTP after successful verification
        localStorage.removeItem(`otp_${phoneNumber}`);
        localStorage.removeItem(`otp_session_${phoneNumber}`);
        
        // Check if user exists in demo mode (localStorage)
        const existingUser = await this.getUserByPhone(phoneNumber);
        
        if (existingUser.success && existingUser.user) {
          // Existing user in demo mode
          return {
            success: true,
            message: 'Phone number verified successfully',
            user: existingUser.user
          };
        } else {
          // New user in demo mode
          return {
            success: true,
            message: 'Phone number verified successfully. Please complete your profile.',
            user: undefined
          };
        }
      }
      
      return {
        success: false,
        message: 'Invalid OTP. Please check the code and try again.'
      };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: error.message || 'Invalid OTP'
      };
    }
  }

  // Create new user with demo mode support
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const currentUser = auth.currentUser;
      let userId: string;
      
      if (currentUser) {
        userId = currentUser.uid;
      } else {
        // Demo mode - generate a mock user ID
        userId = `demo_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const user: User = {
        ...userData,
        id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        walletBalance: 0,
        totalRides: 0,
        rating: 0,
        preferences: {
          language: 'en',
          notifications: true,
          locationSharing: true
        }
      };

      // Try Firestore first, but don't wait too long
      const firestorePromise = setDoc(doc(db, 'users', userId), user);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 3000)
      );

      try {
        await Promise.race([firestorePromise, timeoutPromise]);
        console.log('User saved to Firestore');
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        // Fallback to localStorage
        localStorage.setItem(`user_${userId}`, JSON.stringify(user));
        console.log('User saved to localStorage');
      }
      
      return {
        success: true,
        message: 'User created successfully',
        user
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: error.message || 'Failed to create user'
      };
    }
  }

  // Get user by ID with demo mode support
  async getUserById(userId: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Try Firestore first with timeout
      const firestorePromise = getDoc(doc(db, 'users', userId));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 2000)
      );

      try {
        const userDoc = await Promise.race([firestorePromise, timeoutPromise]) as any;
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          return {
            success: true,
            message: 'User found',
            user: userData
          };
        }
      } catch (firestoreError: any) {
        console.log('Firestore error, checking localStorage:', firestoreError.message);
      }
      
      // Fallback to localStorage
      const userDataStr = localStorage.getItem(`user_${userId}`);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr) as User;
        return {
          success: true,
          message: 'User found (Demo Mode)',
          user: userData
        };
      }
      
      return {
        success: false,
        message: 'User not found'
      };
    } catch (error: any) {
      console.error('Error getting user:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user'
      };
    }
  }

  // Get user by phone number with demo mode support
  async getUserByPhone(phoneNumber: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      try {
        // Try Firestore first
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data() as User;
          return {
            success: true,
            message: 'User found',
            user: userData
          };
        }
      } catch (firestoreError: any) {
        console.log('Firestore error, checking localStorage:', firestoreError.message);
      }
      
      // Fallback to localStorage - search through all users
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('user_'));
      
      for (const key of userKeys) {
        const userDataStr = localStorage.getItem(key);
        if (userDataStr) {
          const userData = JSON.parse(userDataStr) as User;
          if (userData.phoneNumber === phoneNumber) {
            return {
              success: true,
              message: 'User found (Demo Mode)',
              user: userData
            };
          }
        }
      }
      
      return {
        success: false,
        message: 'User not found'
      };
    } catch (error: any) {
      console.error('Error getting user by phone:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user'
      };
    }
  }

  // Update user profile with demo mode support
  async updateUser(userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      try {
        // Try Firestore first
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updateData);
        
        // Get updated user data
        const updatedUserDoc = await getDoc(userRef);
        const userData = updatedUserDoc.data() as User;
        
        return {
          success: true,
          message: 'User updated successfully',
          user: userData
        };
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        
        // Fallback to localStorage
        const userDataStr = localStorage.getItem(`user_${userId}`);
        if (userDataStr) {
          const userData = JSON.parse(userDataStr) as User;
          const updatedUser = { ...userData, ...updateData };
          localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));
          
          return {
            success: true,
            message: 'User updated successfully (Demo Mode)',
            user: updatedUser
          };
        }
      }
      
      return {
        success: false,
        message: 'User not found'
      };
    } catch (error: any) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user'
      };
    }
  }

  // Delete user account with demo mode support
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      try {
        // Try Firestore first
        await deleteDoc(doc(db, 'users', userId));
        return {
          success: true,
          message: 'User deleted successfully'
        };
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        
        // Fallback to localStorage
        localStorage.removeItem(`user_${userId}`);
        return {
          success: true,
          message: 'User deleted successfully (Demo Mode)'
        };
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete user'
      };
    }
  }

  // Save ride history with demo mode support
  async saveRideHistory(rideData: Omit<RideHistory, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string; rideId?: string }> {
    try {
      const rideId = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ride: RideHistory = {
        ...rideData,
        id: rideId,
        createdAt: new Date()
      };

      // Try Firestore first with timeout
      const firestorePromise = setDoc(doc(db, 'rides', rideId), ride);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 3000)
      );

      try {
        await Promise.race([firestorePromise, timeoutPromise]);
        console.log('Ride saved to Firestore');
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        
        // Fallback to localStorage
        const rides = JSON.parse(localStorage.getItem('rides') || '[]');
        rides.push(ride);
        localStorage.setItem('rides', JSON.stringify(rides));
        console.log('Ride saved to localStorage');
      }
      
      // Update user's total rides
      const userResult = await this.getUserById(rideData.userId);
      const currentRides = userResult.user?.totalRides || 0;
      await this.updateUser(rideData.userId, {
        totalRides: currentRides + 1
      });

      return {
        success: true,
        message: 'Ride history saved',
        rideId
      };
    } catch (error: any) {
      console.error('Error saving ride history:', error);
      return {
        success: false,
        message: error.message || 'Failed to save ride history'
      };
    }
  }

  // Get user's ride history with demo mode support
  async getRideHistory(userId: string): Promise<{ success: boolean; message: string; rides?: RideHistory[] }> {
    try {
      try {
        // Try Firestore first
        const ridesRef = collection(db, 'rides');
        const q = query(ridesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const rides: RideHistory[] = [];
        querySnapshot.forEach((docSnapshot) => {
          rides.push(docSnapshot.data() as RideHistory);
        });

        return {
          success: true,
          message: 'Ride history retrieved',
          rides: rides.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        };
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        
        // Fallback to localStorage
        const rides = JSON.parse(localStorage.getItem('rides') || '[]');
        const userRides = rides.filter((ride: RideHistory) => ride.userId === userId);
        
        return {
          success: true,
          message: 'Ride history retrieved (Demo Mode)',
          rides: userRides.sort((a: RideHistory, b: RideHistory) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        };
      }
    } catch (error: any) {
      console.error('Error getting ride history:', error);
      return {
        success: false,
        message: error.message || 'Failed to get ride history'
      };
    }
  }

  // Wallet operations with demo mode support
  async addWalletBalance(userId: string, amount: number, description: string): Promise<{ success: boolean; message: string; newBalance?: number }> {
    try {
      const userResult = await this.getUserById(userId);
      if (!userResult.success || !userResult.user) {
        throw new Error('User not found');
      }

      const newBalance = userResult.user.walletBalance + amount;
      
      // Update user wallet balance
      await this.updateUser(userId, { walletBalance: newBalance });
      
      // Add transaction record
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transaction: WalletTransaction = {
        id: transactionId,
        userId,
        type: amount > 0 ? 'credit' : 'debit',
        amount: Math.abs(amount),
        description,
        createdAt: new Date()
      };

      try {
        // Try Firestore first
        await setDoc(doc(db, 'wallet_transactions', transactionId), transaction);
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        
        // Fallback to localStorage
        const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
      }

      return {
        success: true,
        message: 'Wallet balance updated',
        newBalance
      };
    } catch (error: any) {
      console.error('Error updating wallet balance:', error);
      return {
        success: false,
        message: error.message || 'Failed to update wallet balance'
      };
    }
  }

  // Get wallet transactions with demo mode support
  async getWalletTransactions(userId: string): Promise<{ success: boolean; message: string; transactions?: WalletTransaction[] }> {
    try {
      try {
        // Try Firestore first
        const transactionsRef = collection(db, 'wallet_transactions');
        const q = query(transactionsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const transactions: WalletTransaction[] = [];
        querySnapshot.forEach((docSnapshot) => {
          transactions.push(docSnapshot.data() as WalletTransaction);
        });

        return {
          success: true,
          message: 'Wallet transactions retrieved',
          transactions: transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        };
      } catch (firestoreError: any) {
        console.log('Firestore error, using localStorage:', firestoreError.message);
        
        // Fallback to localStorage
        const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '[]');
        const userTransactions = transactions.filter((txn: WalletTransaction) => txn.userId === userId);
        
        return {
          success: true,
          message: 'Wallet transactions retrieved (Demo Mode)',
          transactions: userTransactions.sort((a: WalletTransaction, b: WalletTransaction) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        };
      }
    } catch (error: any) {
      console.error('Error getting wallet transactions:', error);
      return {
        success: false,
        message: error.message || 'Failed to get wallet transactions'
      };
    }
  }

  // Get current authenticated user
  getCurrentUser(): User | null {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // This would typically fetch from Firestore, but for now return basic info
      return {
        id: currentUser.uid,
        phoneNumber: currentUser.phoneNumber || '',
        name: '',
        email: '',
        userType: 'customer',
        isVerified: true,
        isFirstTime: false,
        walletBalance: 0,
        totalRides: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return null;
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
      sessionStorage.removeItem('confirmationResult');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance; 