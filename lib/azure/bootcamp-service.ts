// Bootcamp enrollment and management service for Cosmos DB
import { cosmosService, Bootcamp, Activity } from './cosmos-service';
import { addActivity } from './learning-service';

/**
 * Enroll user in a bootcamp
 */
export async function enrollInBootcamp(userId: string, bootcamp: Bootcamp): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const bootcamps = user.learningData?.bootcamps || [];
    
    // Check if already enrolled
    if (bootcamps.some(b => b.id === bootcamp.id)) {
      return true; // Already enrolled
    }

    const updatedBootcamp = {
      ...bootcamp,
      enrolledAt: new Date().toISOString(),
      status: bootcamp.status || 'enrolled' as const,
      progress: bootcamp.progress || 0,
    };

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        bootcamps: [...bootcamps, updatedBootcamp],
      },
    });

    // Add activity
    await addActivity(userId, {
      id: crypto.randomUUID(),
      type: 'course',
      action: 'Enrolled in bootcamp',
      title: bootcamp.title,
      time: new Date().toISOString(),
      metadata: {
        bootcampId: bootcamp.id,
        cohort: bootcamp.cohort,
        startDate: bootcamp.startDate,
      },
    });

    return true;
  } catch (error) {
    console.error('Error enrolling in bootcamp:', error);
    return false;
  }
}

/**
 * Update bootcamp progress
 */
export async function updateBootcampProgress(
  userId: string, 
  bootcampId: string, 
  progress: number,
  updateStatus?: boolean
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const bootcamps = user.learningData?.bootcamps || [];
    const bootcampIndex = bootcamps.findIndex(b => b.id === bootcampId);
    
    if (bootcampIndex === -1) return false;

    const updatedBootcamp = { ...bootcamps[bootcampIndex] };
    updatedBootcamp.progress = Math.min(100, Math.max(0, progress));
    
    // Auto-update status based on progress if requested
    if (updateStatus) {
      if (progress === 0) {
        updatedBootcamp.status = 'enrolled';
      } else if (progress > 0 && progress < 100) {
        updatedBootcamp.status = 'in-progress';
      } else if (progress === 100) {
        updatedBootcamp.status = 'completed';
      }
    }

    bootcamps[bootcampIndex] = updatedBootcamp;

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        bootcamps: bootcamps,
      },
    });

    // Add activity for milestones
    if (progress === 25 || progress === 50 || progress === 75) {
      await addActivity(userId, {
        id: crypto.randomUUID(),
        type: 'course',
        action: `Reached ${progress}% in bootcamp`,
        title: updatedBootcamp.title,
        time: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating bootcamp progress:', error);
    return false;
  }
}

/**
 * Complete a bootcamp
 */
export async function completeBootcamp(
  userId: string, 
  bootcampId: string,
  issueCertificate: boolean = true
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const bootcamps = user.learningData?.bootcamps || [];
    const bootcampIndex = bootcamps.findIndex(b => b.id === bootcampId);
    
    if (bootcampIndex === -1) return false;

    const completedBootcamp = {
      ...bootcamps[bootcampIndex],
      status: 'completed' as const,
      progress: 100,
      completionCertificate: issueCertificate,
    };

    bootcamps[bootcampIndex] = completedBootcamp;

    // Update bootcamp stats
    const stats = user.learningData?.stats || {
      coursesCompleted: 0,
      hoursLearned: 0,
      certificationsCount: 0,
      streakDays: 0,
    };

    // Count bootcamp completion as courses (bootcamps are intensive programs)
    stats.coursesCompleted = (stats.coursesCompleted || 0) + 1;
    
    // If certificate issued, increment certifications count
    if (issueCertificate) {
      stats.certificationsCount = (stats.certificationsCount || 0) + 1;
    }

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        bootcamps: bootcamps,
        stats: stats,
      },
    });

    // Add activity
    await addActivity(userId, {
      id: crypto.randomUUID(),
      type: 'achievement',
      action: 'Completed bootcamp',
      title: completedBootcamp.title,
      time: new Date().toISOString(),
      metadata: {
        bootcampId: bootcampId,
        certificate: issueCertificate,
      },
    });

    // Check for achievements
    await checkBootcampAchievements(userId);

    return true;
  } catch (error) {
    console.error('Error completing bootcamp:', error);
    return false;
  }
}

/**
 * Update bootcamp status
 */
export async function updateBootcampStatus(
  userId: string,
  bootcampId: string,
  status: 'enrolled' | 'in-progress' | 'completed' | 'upcoming'
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const bootcamps = user.learningData?.bootcamps || [];
    const bootcampIndex = bootcamps.findIndex(b => b.id === bootcampId);
    
    if (bootcampIndex === -1) return false;

    bootcamps[bootcampIndex] = {
      ...bootcamps[bootcampIndex],
      status: status,
    };

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        bootcamps: bootcamps,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating bootcamp status:', error);
    return false;
  }
}

/**
 * Remove user from bootcamp (unenroll)
 */
export async function unenrollFromBootcamp(userId: string, bootcampId: string): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const bootcamps = user.learningData?.bootcamps || [];
    const updatedBootcamps = bootcamps.filter(b => b.id !== bootcampId);

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        bootcamps: updatedBootcamps,
      },
    });

    return true;
  } catch (error) {
    console.error('Error unenrolling from bootcamp:', error);
    return false;
  }
}

/**
 * Get all bootcamps for a user
 */
export async function getUserBootcamps(userId: string): Promise<Bootcamp[]> {
  try {
    const user = await cosmosService.getUserById(userId);
    return user?.learningData?.bootcamps || [];
  } catch (error) {
    console.error('Error fetching user bootcamps:', error);
    return [];
  }
}

/**
 * Get bootcamp by ID for a user
 */
export async function getUserBootcamp(userId: string, bootcampId: string): Promise<Bootcamp | null> {
  try {
    const bootcamps = await getUserBootcamps(userId);
    return bootcamps.find(b => b.id === bootcampId) || null;
  } catch (error) {
    console.error('Error fetching bootcamp:', error);
    return null;
  }
}

/**
 * Get bootcamps by status
 */
export async function getBootcampsByStatus(
  userId: string,
  status: 'enrolled' | 'in-progress' | 'completed' | 'upcoming'
): Promise<Bootcamp[]> {
  try {
    const bootcamps = await getUserBootcamps(userId);
    return bootcamps.filter(b => b.status === status);
  } catch (error) {
    console.error('Error fetching bootcamps by status:', error);
    return [];
  }
}

/**
 * Update bootcamp details (cohort, schedule, instructors, etc.)
 */
export async function updateBootcampDetails(
  userId: string,
  bootcampId: string,
  updates: Partial<Omit<Bootcamp, 'id'>>
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const bootcamps = user.learningData?.bootcamps || [];
    const bootcampIndex = bootcamps.findIndex(b => b.id === bootcampId);
    
    if (bootcampIndex === -1) return false;

    bootcamps[bootcampIndex] = {
      ...bootcamps[bootcampIndex],
      ...updates,
    };

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        bootcamps: bootcamps,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating bootcamp details:', error);
    return false;
  }
}

/**
 * Check and award bootcamp-related achievements
 */
async function checkBootcampAchievements(userId: string): Promise<void> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return;

    const bootcamps = user.learningData?.bootcamps || [];
    const completedBootcamps = bootcamps.filter(b => b.status === 'completed');
    const achievements = user.learningData?.achievements || [];

    // First bootcamp completion
    if (completedBootcamps.length === 1 && !achievements.some(a => a.id === 'first-bootcamp')) {
      const newAchievement = {
        id: 'first-bootcamp',
        icon: '🎓',
        title: 'Bootcamp Graduate',
        description: 'Completed your first bootcamp',
        date: new Date().toISOString(),
        rarity: 'rare' as const,
      };

      await cosmosService.updateUser(userId, {
        learningData: {
          ...user.learningData,
          achievements: [...achievements, newAchievement],
        },
      });

      await addActivity(userId, {
        id: crypto.randomUUID(),
        type: 'achievement',
        action: 'Unlocked achievement',
        title: 'Bootcamp Graduate',
        time: new Date().toISOString(),
      });
    }

    // Multiple bootcamp completion
    if (completedBootcamps.length === 3 && !achievements.some(a => a.id === 'bootcamp-champion')) {
      const newAchievement = {
        id: 'bootcamp-champion',
        icon: '🏆',
        title: 'Bootcamp Champion',
        description: 'Completed 3 bootcamps',
        date: new Date().toISOString(),
        rarity: 'epic' as const,
      };

      await cosmosService.updateUser(userId, {
        learningData: {
          ...user.learningData,
          achievements: [...achievements, newAchievement],
        },
      });

      await addActivity(userId, {
        id: crypto.randomUUID(),
        type: 'achievement',
        action: 'Unlocked achievement',
        title: 'Bootcamp Champion',
        time: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error checking bootcamp achievements:', error);
  }
}

/**
 * Initialize bootcamp data for a user (if not exists)
 */
export async function initializeBootcampData(userId: string): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    if (!user.learningData?.bootcamps) {
      await cosmosService.updateUser(userId, {
        learningData: {
          ...user.learningData,
          bootcamps: [],
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error initializing bootcamp data:', error);
    return false;
  }
}
