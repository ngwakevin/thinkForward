// Learning data management service for Cosmos DB
import { cosmosService, Course, CompletedCourse, Certification, LearningPath, Achievement, Activity, Mentorship } from './cosmos-service';

/**
 * Enroll user in a course
 */
export async function enrollInCourse(userId: string, course: Course): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const currentCourses = user.learningData?.currentCourses || [];
    
    // Check if already enrolled
    if (currentCourses.some(c => c.id === course.id)) {
      return true; // Already enrolled
    }

    const updatedCourse = {
      ...course,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        currentCourses: [...currentCourses, updatedCourse],
      },
    });

    // Add activity
    await addActivity(userId, {
      id: crypto.randomUUID(),
      type: 'course',
      action: 'Started new course',
      title: course.title,
      time: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
}

/**
 * Update course progress
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  progress: number,
  nextLesson?: string
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const currentCourses = user.learningData?.currentCourses || [];
    const updatedCourses = currentCourses.map(course =>
      course.id === courseId
        ? {
            ...course,
            progress,
            nextLesson: nextLesson || course.nextLesson,
            lastAccessedAt: new Date().toISOString(),
          }
        : course
    );

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        currentCourses: updatedCourses,
      },
    });

    // Update streak
    await updateStreak(userId);

    return true;
  } catch (error) {
    console.error('Error updating course progress:', error);
    return false;
  }
}

/**
 * Complete a course
 */
export async function completeCourse(
  userId: string,
  courseId: string,
  certificate: boolean = false,
  certificateUrl?: string,
  finalScore?: number
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const currentCourses = user.learningData?.currentCourses || [];
    const completedCourses = user.learningData?.completedCourses || [];
    
    const courseToComplete = currentCourses.find(c => c.id === courseId);
    if (!courseToComplete) return false;

    // Remove from current courses
    const updatedCurrentCourses = currentCourses.filter(c => c.id !== courseId);

    // Add to completed courses
    const completedCourse: CompletedCourse = {
      id: courseToComplete.id,
      title: courseToComplete.title,
      completedDate: new Date().toISOString(),
      certificate,
      certificateUrl,
      finalScore,
    };

    // Update stats
    const stats = user.learningData?.stats || {
      coursesCompleted: 0,
      hoursLearned: 0,
      certificationsCount: 0,
      streakDays: 0,
    };

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        currentCourses: updatedCurrentCourses,
        completedCourses: [...completedCourses, completedCourse],
        stats: {
          ...stats,
          coursesCompleted: stats.coursesCompleted + 1,
          lastActivityDate: new Date().toISOString(),
        },
      },
    });

    // Add activity
    await addActivity(userId, {
      id: crypto.randomUUID(),
      type: 'course',
      action: 'Completed course',
      title: courseToComplete.title,
      time: new Date().toISOString(),
    });

    // Check for achievements
    await checkCourseAchievements(userId, stats.coursesCompleted + 1);

    return true;
  } catch (error) {
    console.error('Error completing course:', error);
    return false;
  }
}

/**
 * Add or update certification
 */
export async function addCertification(userId: string, certification: Certification): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const certifications = user.learningData?.certifications || [];
    
    // Check if certification already exists
    const existingIndex = certifications.findIndex(c => c.id === certification.id);
    
    let updatedCertifications;
    if (existingIndex >= 0) {
      // Update existing
      updatedCertifications = [...certifications];
      updatedCertifications[existingIndex] = certification;
    } else {
      // Add new
      updatedCertifications = [...certifications, { ...certification, id: certification.id || crypto.randomUUID() }];
    }

    // Update stats if certification is active
    const stats = user.learningData?.stats || {
      coursesCompleted: 0,
      hoursLearned: 0,
      certificationsCount: 0,
      streakDays: 0,
    };

    const activeCertCount = updatedCertifications.filter(c => c.status === 'active').length;

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        certifications: updatedCertifications,
        stats: {
          ...stats,
          certificationsCount: activeCertCount,
        },
      },
    });

    // Add activity if new certification
    if (existingIndex < 0 && certification.status === 'active') {
      await addActivity(userId, {
        id: crypto.randomUUID(),
        type: 'certification',
        action: 'Earned certification',
        title: certification.name,
        time: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding certification:', error);
    return false;
  }
}

/**
 * Enroll in learning path
 */
export async function enrollInLearningPath(userId: string, learningPath: LearningPath): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const learningPaths = user.learningData?.learningPaths || [];
    
    // Check if already enrolled
    if (learningPaths.some(lp => lp.id === learningPath.id)) {
      return true;
    }

    const updatedPath = {
      ...learningPath,
      enrolledAt: new Date().toISOString(),
    };

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        learningPaths: [...learningPaths, updatedPath],
      },
    });

    return true;
  } catch (error) {
    console.error('Error enrolling in learning path:', error);
    return false;
  }
}

/**
 * Update learning path progress
 */
export async function updateLearningPathProgress(
  userId: string,
  pathId: string,
  completedCourses: number,
  milestones?: { title: string; completed: boolean }[]
): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const learningPaths = user.learningData?.learningPaths || [];
    const updatedPaths = learningPaths.map(path =>
      path.id === pathId
        ? {
            ...path,
            completedCourses,
            progress: Math.round((completedCourses / path.totalCourses) * 100),
            milestones: milestones || path.milestones,
          }
        : path
    );

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        learningPaths: updatedPaths,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating learning path progress:', error);
    return false;
  }
}

/**
 * Add achievement
 */
export async function addAchievement(userId: string, achievement: Achievement): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const achievements = user.learningData?.achievements || [];
    
    // Check if achievement already exists
    if (achievements.some(a => a.id === achievement.id)) {
      return true;
    }

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        achievements: [...achievements, achievement],
      },
    });

    // Add activity
    await addActivity(userId, {
      id: crypto.randomUUID(),
      type: 'achievement',
      action: 'Unlocked achievement',
      title: achievement.title,
      time: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error adding achievement:', error);
    return false;
  }
}

/**
 * Add activity to feed
 */
export async function addActivity(userId: string, activity: Activity): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const recentActivity = user.learningData?.recentActivity || [];
    
    // Keep only last 50 activities
    const updatedActivity = [activity, ...recentActivity].slice(0, 50);

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        recentActivity: updatedActivity,
      },
    });

    return true;
  } catch (error) {
    console.error('Error adding activity:', error);
    return false;
  }
}

/**
 * Update mentorship info
 */
export async function updateMentorship(userId: string, mentorship: Mentorship): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        mentorship,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating mentorship:', error);
    return false;
  }
}

/**
 * Update learning streak
 */
export async function updateStreak(userId: string): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    const stats = user.learningData?.stats || {
      coursesCompleted: 0,
      hoursLearned: 0,
      certificationsCount: 0,
      streakDays: 0,
    };

    const lastActivityDate = stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreakDays = stats.streakDays;

    if (!lastActivityDate) {
      // First activity
      newStreakDays = 1;
    } else {
      const lastActivity = new Date(lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change
        return true;
      } else if (daysDiff === 1) {
        // Consecutive day
        newStreakDays += 1;
      } else {
        // Streak broken
        newStreakDays = 1;
      }
    }

    await cosmosService.updateUser(userId, {
      learningData: {
        ...user.learningData,
        stats: {
          ...stats,
          streakDays: newStreakDays,
          lastActivityDate: new Date().toISOString(),
        },
      },
    });

    // Check for streak achievements
    await checkStreakAchievements(userId, newStreakDays);

    return true;
  } catch (error) {
    console.error('Error updating streak:', error);
    return false;
  }
}

/**
 * Check and award course completion achievements
 */
async function checkCourseAchievements(userId: string, coursesCompleted: number): Promise<void> {
  const achievements = [
    {
      count: 1,
      achievement: {
        id: 'first-course',
        icon: '🎓',
        title: 'First Course',
        description: 'Completed your first course',
        date: new Date().toISOString(),
        rarity: 'common' as const,
      },
    },
    {
      count: 5,
      achievement: {
        id: 'course-enthusiast',
        icon: '📚',
        title: 'Course Enthusiast',
        description: 'Completed 5 courses',
        date: new Date().toISOString(),
        rarity: 'rare' as const,
      },
    },
    {
      count: 10,
      achievement: {
        id: 'learning-master',
        icon: '🏆',
        title: 'Learning Master',
        description: 'Completed 10 courses',
        date: new Date().toISOString(),
        rarity: 'epic' as const,
      },
    },
  ];

  for (const { count, achievement } of achievements) {
    if (coursesCompleted === count) {
      await addAchievement(userId, achievement);
    }
  }
}

/**
 * Check and award streak achievements
 */
async function checkStreakAchievements(userId: string, streakDays: number): Promise<void> {
  const achievements = [
    {
      count: 7,
      achievement: {
        id: 'week-streak',
        icon: '🔥',
        title: '7 Day Streak',
        description: 'Maintained a 7-day learning streak',
        date: new Date().toISOString(),
        rarity: 'common' as const,
      },
    },
    {
      count: 20,
      achievement: {
        id: '20-day-streak',
        icon: '🔥',
        title: '20 Day Streak',
        description: 'Maintained a 20-day learning streak',
        date: new Date().toISOString(),
        rarity: 'rare' as const,
      },
    },
    {
      count: 30,
      achievement: {
        id: 'month-streak',
        icon: '⚡',
        title: '30 Day Streak',
        description: 'Maintained a 30-day learning streak',
        date: new Date().toISOString(),
        rarity: 'epic' as const,
      },
    },
    {
      count: 100,
      achievement: {
        id: 'century-streak',
        icon: '💯',
        title: '100 Day Streak',
        description: 'Maintained a 100-day learning streak',
        date: new Date().toISOString(),
        rarity: 'legendary' as const,
      },
    },
  ];

  for (const { count, achievement } of achievements) {
    if (streakDays === count) {
      await addAchievement(userId, achievement);
    }
  }
}

/**
 * Initialize learning data for new user
 */
export async function initializeLearningData(userId: string): Promise<boolean> {
  try {
    const user = await cosmosService.getUserById(userId);
    if (!user) return false;

    // Only initialize if learningData doesn't exist
    if (user.learningData) return true;

    await cosmosService.updateUser(userId, {
      learningData: {
        stats: {
          coursesCompleted: 0,
          hoursLearned: 0,
          certificationsCount: 0,
          streakDays: 0,
        },
        currentCourses: [],
        completedCourses: [],
        certifications: [],
        learningPaths: [],
        achievements: [],
        recentActivity: [],
        mentorship: {
          role: 'mentee',
        },
      },
    });

    return true;
  } catch (error) {
    console.error('Error initializing learning data:', error);
    return false;
  }
}
