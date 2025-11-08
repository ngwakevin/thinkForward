"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { Session } from 'next-auth';

interface ProfileClientProps {
  initialUserData: any;
  session: Session;
}

export default function ProfileClient({ initialUserData, session }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'achievements' | 'activity' | 'certifications' | 'learning-paths' | 'mentorship'>('overview');

  // Extract real user data or use defaults
  const profile = initialUserData?.profile || {};
  const fullName = [initialUserData?.firstName, initialUserData?.lastName].filter(Boolean).join(' ');
  const displayName = profile?.displayName || session.user?.name || fullName || 'User';
  const email = initialUserData?.email || session.user?.email || '';
  const avatar = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Extract learning data with fallbacks
  const learningData = initialUserData?.learningData;
  const stats = learningData?.stats;
  
  // Real user data with empty fallbacks (no mock data)
  const userData = {
    name: fullName || displayName,
    email: email,
    role: profile?.currentTitle || profile?.headline || "Cloud Learner",
    joinDate: initialUserData?.createdAt ? new Date(initialUserData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
    avatar: avatar,
    location: profile?.location || "Not specified",
    bio: profile?.bio || "Passionate about cloud technologies and continuous learning.",
    
    // Use real stats if available, otherwise show 0
    stats: [
      { label: "Courses Completed", value: stats?.coursesCompleted?.toString() || "0" },
      { label: "Hours Learned", value: stats?.hoursLearned?.toString() || "0" },
      { label: "Certifications", value: stats?.certificationsCount?.toString() || "0" },
      { label: "Streak Days", value: stats?.streakDays?.toString() || "0" },
    ],
    
    // Use real course data only
    currentCourses: learningData?.currentCourses || [],
    
    // Use real completed courses only
    completedCourses: learningData?.completedCourses || [],
    
    // Use real achievements only
    achievements: learningData?.achievements || [],
    
    // Use real activity only
    recentActivity: learningData?.recentActivity || [],
    
    // Use real certifications only
    certifications: learningData?.certifications || [],
    
    // Use real learning paths only
    learningPaths: learningData?.learningPaths || [],
    
    // Use real mentorship data only
    mentorship: learningData?.mentorship || {
      role: "none",
      upcomingSessions: [],
      pastSessions: [],
      mentoringOthers: [],
    },
  };

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero Section with Profile Header */}
      <section className="relative bg-gradient-to-b from-bg-alt to-bg pt-24 pb-16 px-6">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Profile Card - Stacked Designlab Style */}
          <div className="bg-gradient-to-br from-bg-alt/80 to-bg/60 rounded-[32px] p-8 md:p-12 border border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={userData.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover shadow-lg shadow-accent/30 border-4 border-accent/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-bg font-bold text-4xl shadow-lg shadow-accent/30">
                    {userData.avatar}
                  </div>
                )}
                {/* Online indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-bg-alt"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {userData.name}
                  </h1>
                  <p className="text-xl text-accent font-semibold mb-2">{userData.role}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-fg-muted">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {userData.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined {userData.joinDate}
                    </span>
                  </div>
                </div>

                <p className="text-base text-fg-muted leading-relaxed max-w-2xl">
                  {userData.bio}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-bg-alt text-white font-bold rounded-lg border border-white/10 hover:border-accent/50 transition-colors uppercase tracking-wide text-sm">
                    Share Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid - Overlapping style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
              {userData.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                  <div className="text-sm text-fg-muted uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liquid Glass Separator */}
      <div className="h-24 bg-gradient-to-b from-bg to-bg-alt" />

      {/* Tabs Navigation - Pill Style */}
      <section className="relative bg-bg-alt py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {(['overview', 'courses', 'certifications', 'learning-paths', 'mentorship', 'achievements', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full font-semibold uppercase tracking-wide text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-accent text-bg shadow-lg shadow-accent/30'
                    : 'bg-bg text-fg-muted hover:bg-bg/80 hover:text-white'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="relative bg-bg-alt py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">Learning Overview</h2>
              
              {/* Current Courses */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Current Courses</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.currentCourses.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all space-y-4"
                    >
                      {/* Difficulty Badge */}
                      <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-xs font-semibold text-accent uppercase">
                        {course.difficulty}
                      </div>

                      <h4 className="text-lg font-bold text-white">{course.title}</h4>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-fg-muted">Progress</span>
                          <span className="text-accent font-semibold">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-bg rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent to-accent-alt rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <p className="text-sm text-fg-muted">Next: {course.nextLesson}</p>
                      </div>

                      <button className="w-full px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent/20 transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">My Courses</h2>
              
              {/* Completed Courses */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Completed Courses</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {userData.completedCourses.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{course.title}</h4>
                          <p className="text-sm text-fg-muted">Completed {course.completedDate}</p>
                        </div>
                        {course.certificate && (
                          <div className="text-accent text-2xl">🎓</div>
                        )}
                      </div>
                      {course.certificate && (
                        <button className="w-full px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent/20 transition-colors text-sm">
                          View Certificate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Certifications</h2>
                <button className="px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm">
                  Add Certification
                </button>
              </div>

              {/* Active Certifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Active Certifications</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {userData.certifications
                    .filter((cert: any) => cert.status === 'active')
                    .map((cert: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-2xl p-8 border border-accent/20 hover:border-accent/40 transition-all space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-5xl">{cert.logo}</div>
                          <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-semibold text-green-400 uppercase">
                            Active
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{cert.name}</h4>
                          <p className="text-sm text-accent font-semibold mb-4">{cert.issuer}</p>
                          <div className="space-y-2 text-sm text-fg-muted">
                            <div className="flex justify-between">
                              <span>Issued:</span>
                              <span className="text-white">{cert.issueDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span className="text-white">{cert.expiryDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Credential ID:</span>
                              <span className="text-white font-mono text-xs">{cert.credentialId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-white/5">
                          <button className="flex-1 px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent/20 transition-colors text-sm">
                            View Certificate
                          </button>
                          <button className="flex-1 px-4 py-2 bg-bg text-white font-semibold rounded-lg hover:bg-bg/80 transition-colors text-sm">
                            Verify
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* In Progress Certifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">In Progress</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {userData.certifications
                    .filter((cert: any) => cert.status === 'in-progress')
                    .map((cert: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-2xl p-8 border border-white/5 hover:border-accent/30 transition-all space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-5xl">{cert.logo}</div>
                          <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-semibold text-yellow-400 uppercase">
                            In Progress
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{cert.name}</h4>
                          <p className="text-sm text-accent font-semibold mb-4">{cert.issuer}</p>
                          <div className="space-y-2 text-sm text-fg-muted">
                            <div className="flex justify-between">
                              <span>Expected:</span>
                              <span className="text-white">{cert.expiryDate}</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-accent text-bg font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm">
                          Continue Preparation
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Planned Certifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Planned</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.certifications
                    .filter((cert: any) => cert.status === 'planned')
                    .map((cert: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-bg/60 to-bg-alt/40 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all space-y-3"
                      >
                        <div className="text-4xl">{cert.logo}</div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{cert.name}</h4>
                          <p className="text-sm text-fg-muted">{cert.issuer}</p>
                        </div>
                        <button className="w-full px-4 py-2 bg-bg text-accent font-semibold rounded-lg hover:bg-bg/80 transition-colors text-sm">
                          Start Learning
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Learning Paths Tab */}
          {activeTab === 'learning-paths' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Learning Paths</h2>
                <button className="px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm">
                  Browse All Paths
                </button>
              </div>

              <div className="space-y-6">
                {userData.learningPaths.map((path: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-3xl p-8 border border-white/5 hover:border-accent/30 transition-all space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-white">{path.title}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            path.difficulty === 'advanced'
                              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                              : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                          }`}>
                            {path.difficulty}
                          </div>
                        </div>
                        <p className="text-base text-fg-muted">{path.description}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-3xl font-bold text-accent">{path.progress}%</div>
                        <div className="text-sm text-fg-muted">{path.completedCourses}/{path.totalCourses} courses</div>
                        <div className="text-xs text-fg-muted">~{path.estimatedTime}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-3 bg-bg rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-accent-alt rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill: any, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Milestones */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">Milestones</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {path.milestones.map((milestone: any, mIndex: number) => (
                          <div
                            key={mIndex}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                              milestone.completed
                                ? 'bg-accent/10 border-accent/30'
                                : 'bg-bg/50 border-white/5'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                              milestone.completed
                                ? 'bg-accent text-bg'
                                : 'bg-bg border border-white/10 text-fg-muted'
                            }`}>
                              {milestone.completed ? '✓' : mIndex + 1}
                            </div>
                            <span className={`text-sm font-semibold ${
                              milestone.completed ? 'text-white' : 'text-fg-muted'
                            }`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm">
                      Continue Path 👉
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentorship Tab */}
          {activeTab === 'mentorship' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">Mentorship</h2>

              {/* Your Mentor Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Your Mentor</h3>
                <div className="bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-3xl p-8 border border-accent/20 space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Mentor Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-bg font-bold text-3xl shadow-lg">
                      {userData.mentorship.mentor.avatar}
                    </div>

                    {/* Mentor Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-1">{userData.mentorship.mentor.name}</h4>
                        <p className="text-base text-accent font-semibold mb-2">{userData.mentorship.mentor.role}</p>
                        <p className="text-sm text-fg-muted">{userData.mentorship.mentor.experience} in cloud architecture</p>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2">
                        {userData.mentorship.mentor.specialties.map((specialty: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full border border-accent/30"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 pt-3">
                        <div>
                          <div className="text-2xl font-bold text-accent">{userData.mentorship.mentor.totalSessions}</div>
                          <div className="text-xs text-fg-muted uppercase">Sessions</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Session Card */}
                    <div className="bg-bg/80 rounded-2xl p-6 border border-accent/20 min-w-[280px]">
                      <div className="text-xs text-accent font-bold uppercase tracking-wide mb-2">Next Session</div>
                      <div className="text-sm text-white font-semibold mb-4">{userData.mentorship.mentor.nextSession}</div>
                      <button className="w-full px-4 py-2 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors text-sm">
                        Join Meeting
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Upcoming Sessions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {userData.mentorship.upcomingSessions.map((session: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-accent font-bold text-sm mb-1">{session.date}</div>
                          <div className="text-fg-muted text-sm mb-3">{session.time}</div>
                          <h4 className="text-lg font-bold text-white">{session.topic}</h4>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent uppercase">
                          {session.type}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-white/5">
                        <button className="flex-1 px-4 py-2 bg-accent text-bg font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm">
                          Join
                        </button>
                        <button className="px-4 py-2 bg-bg text-white font-semibold rounded-lg hover:bg-bg/80 transition-colors text-sm">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Sessions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Past Sessions</h3>
                <div className="space-y-3">
                  {userData.mentorship.pastSessions.map((session: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-bg/60 to-bg-alt/40 rounded-xl p-6 border border-white/5 hover:border-accent/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-base font-bold text-white">{session.topic}</h4>
                            <span className="text-xs text-fg-muted">{session.duration}</span>
                          </div>
                          <p className="text-sm text-fg-muted mb-2">{session.notes}</p>
                          <div className="text-xs text-fg-muted">{session.date}</div>
                        </div>
                        <button className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent/20 transition-colors text-sm whitespace-nowrap">
                          View Notes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentoring Others */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Mentoring Others</h3>
                  <button className="px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent/20 transition-colors text-sm">
                    Become a Mentor
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {userData.mentorship.mentoringOthers.map((mentee: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-bg font-bold text-xl shadow-lg">
                          {mentee.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{mentee.name}</h4>
                          <p className="text-sm text-accent font-semibold mb-2">{mentee.role}</p>
                          <div className="text-xs text-fg-muted">
                            <div>Started: {mentee.startDate}</div>
                            <div>{mentee.sessions} sessions completed</div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/5">
                        <div className="text-xs text-fg-muted mb-2">Next Session:</div>
                        <div className="text-sm text-white font-semibold mb-3">{mentee.nextSession}</div>
                        <button className="w-full px-4 py-2 bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent/20 transition-colors text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">Achievements</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.achievements.map((achievement: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-2xl p-8 border border-accent/20 hover:border-accent/40 transition-all text-center space-y-4"
                  >
                    <div className="text-6xl">{achievement.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{achievement.title}</h4>
                      <p className="text-sm text-fg-muted mb-2">{achievement.description}</p>
                      <p className="text-xs text-accent font-semibold">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {userData.recentActivity.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-bg/80 to-bg-alt/60 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon based on type */}
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                        {activity.type === 'course' && (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        )}
                        {activity.type === 'achievement' && (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        )}
                        {activity.type === 'community' && (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm text-fg-muted mb-1">{activity.action}</p>
                        <h4 className="text-base font-semibold text-white mb-1">{activity.title}</h4>
                        <p className="text-xs text-fg-muted">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Liquid Glass Separator */}
      <div className="h-24 bg-gradient-to-b from-bg-alt to-bg" />

      {/* CTA Section */}
      <section className="relative bg-bg py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Keep Learning & Growing
          </h2>
          <p className="text-xl text-fg-muted max-w-2xl mx-auto">
            Explore new courses, connect with the community, and advance your cloud career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="px-8 py-4 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide"
            >
              Browse Courses 👉
            </a>
            <a
              href="/community"
              className="px-8 py-4 bg-bg-alt text-white font-bold rounded-lg border border-white/10 hover:border-accent/50 transition-colors uppercase tracking-wide"
            >
              Join Community
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
