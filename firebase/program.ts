import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../firebaseConfig';
import { Collections, DEFAULT_USER_ID, StorageKeys, USE_DEMO_PROGRAM } from '../constants/Config';

const db = getFirestore(app);

export interface Exercise {
  name: string;
  sets: string;
  description?: string;
}

export interface DayPlan {
  exercises: Exercise[];
}

export interface WeekPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: {
    [day: string]: DayPlan;
  };
  progress: number;
}

export interface Program {
  id: string;
  patientId: string;
  therapistId: string;
  therapistName: string;
  patientName: string;
  totalWeeks: number;
  weeks: WeekPlan[];
  createdAt: Date;
  updatedAt: Date;
}

export const fetchUserProgram = async (userId: string): Promise<Program | null> => {
  try {
    // Get the user's program document
    const programRef = doc(db, Collections.programs, userId);
    const programDoc = await getDoc(programRef);
    
    if (!programDoc.exists()) {
      console.log('No program found for user');
      return null;
    }
    
    const programData = programDoc.data();
    
    // Convert Firestore timestamps to JavaScript Date objects
    return {
      ...programData,
      id: programDoc.id,
      createdAt: programData.createdAt?.toDate(),
      updatedAt: programData.updatedAt?.toDate(),
    } as Program;
  } catch (error) {
    console.error('Error fetching program:', error);
    return null;
  }
};

export const fetchAllPrograms = async (): Promise<Program[]> => {
  try {
    const programsRef = collection(db, Collections.programs);
    const programsSnapshot = await getDocs(programsRef);
    
    return programsSnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Program;
    });
  } catch (error) {
    console.error('Error fetching all programs:', error);
    return [];
  }
};

/** Returns the signed-in user's ID (saved at login), or the default user ID. */
export const getCurrentUserId = async (): Promise<string> => {
  try {
    return (await AsyncStorage.getItem(StorageKeys.userId)) || DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
};

/** Generates a placeholder program so the app is usable before real data exists. */
export const createDemoProgram = (userId: string, totalWeeks = 4): Program => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const toDate = (ms: number) => new Date(ms).toISOString().split('T')[0];
  const start = Date.now();
  return {
    id: 'demo-program',
    patientId: userId,
    therapistId: 'demo-therapist',
    therapistName: 'Your Therapist',
    patientName: 'Hero',
    totalWeeks,
    weeks: Array.from({ length: totalWeeks }, (_, i) => ({
      weekNumber: i + 1,
      startDate: toDate(start + i * 7 * DAY_MS),
      endDate: toDate(start + ((i + 1) * 7 - 1) * DAY_MS),
      days: {
        Monday: { exercises: [{ name: 'Squats', sets: '3 sets of 8' }] },
        Tuesday: { exercises: [{ name: 'Bridges', sets: '3 sets of 8' }] },
        Wednesday: { exercises: [{ name: 'Knee-to-Chest', sets: '3 sets of 8' }] },
        Thursday: { exercises: [{ name: 'Supermans', sets: '3 sets of 8' }] },
        Friday: { exercises: [{ name: 'Calf Raises', sets: '3 sets of 8' }] },
      },
      progress: 0,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Loads the current user's program. Falls back to a demo program when none
 * exists in Firestore and USE_DEMO_PROGRAM is enabled.
 */
export const loadCurrentUserProgram = async (): Promise<Program | null> => {
  const userId = await getCurrentUserId();
  const program = await fetchUserProgram(userId);
  if (program) return program;
  return USE_DEMO_PROGRAM ? createDemoProgram(userId) : null;
};
