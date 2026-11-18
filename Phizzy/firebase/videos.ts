import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { app } from '../firebaseConfig';
import { StoragePaths } from '../constants/Config';

const storage = getStorage(app);

/** Turns an exercise name into a file-name-safe slug, e.g. "Calf Raises" -> "calf-raises". */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Builds the storage file name for a new recording of an exercise. */
export const buildVideoFileName = (exerciseName: string, uri: string): string => {
  const ext = uri.split('?')[0].split('.').pop() || 'mp4';
  return `${slugify(exerciseName)}-exercise-${Date.now()}.${ext}`;
};

export const uploadVideo = async (
  uri: string,
  fileName: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  try {
    // Create a reference to the file location in Firebase Storage
    const videoRef = ref(storage, `${StoragePaths.videos}/${fileName}`);

    // Fetch the video file
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload the video with progress tracking
    const uploadTask = uploadBytesResumable(videoRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error('Error uploading video:', error);
          reject(error);
        },
        async () => {
          // Get the download URL after successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadVideo:', error);
    throw error;
  }
};

export interface VideoMetadata {
  name: string;
  url: string;
  createdAt: Date;
}

export const fetchExerciseVideos = async (exerciseName: string): Promise<VideoMetadata[]> => {
  try {
    const slug = slugify(exerciseName);

    // Create a reference to the videos folder
    const videosRef = ref(storage, StoragePaths.videos);
    
    // List all videos
    const result = await listAll(videosRef);
    
    // Filter videos by exercise name and get their metadata
    const videoPromises = result.items
      .filter(item => item.name.startsWith(`${slug}-`))
      .map(async (item) => {
        const [url, metadata] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
        return {
          name: item.name,
          url,
          createdAt: new Date(metadata.timeCreated),
        };
      });

    const videos = await Promise.all(videoPromises);
    // Newest first
    return videos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching exercise videos:', error);
    return [];
  }
}; 