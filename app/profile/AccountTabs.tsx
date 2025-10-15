"use client";
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import BootcampRegistrationsSection from './BootcampRegistrationsSection';

export interface AccountTabsProps {
  initialData: any;
  us          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'privacy'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('bootcamps')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bootcamps'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
            }`}
          >
            Bootcamps
          </button> name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AccountTabs({ initialData, user }: AccountTabsProps) {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Function to save profile data
  const saveProfile = async (profileData: any) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  };
  
  // Profile form state
  const [profile, setProfile] = useState({
    displayName: initialData?.displayName || user?.name || session?.user?.name || '',
    bio: initialData?.bio || '',
    headline: initialData?.headline || '',
    avatarUrl: initialData?.avatarUrl || user?.image || session?.user?.image || '',
    email: initialData?.email || user?.email || session?.user?.email || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phoneNumber: initialData?.phoneNumber || '',
    location: initialData?.location || '',
    timezone: initialData?.timezone || '',
    preferredLanguage: initialData?.preferredLanguage || 'English',
    
    // Professional info
    currentCompany: initialData?.currentCompany || '',
    currentTitle: initialData?.currentTitle || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    githubUrl: initialData?.githubUrl || '',
    portfolioUrl: initialData?.portfolioUrl || '',
    
    // Privacy settings
    showProfilePublic: initialData?.showProfilePublic || false,
    showEmailPublic: initialData?.showEmailPublic || false,
    receiveNotifications: initialData?.receiveNotifications || true,
  });

  // File upload for avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file (image only, max 5MB)
    if (!file.type.startsWith('image/')) {
      setSaveMessage('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('Image must be less than 5MB');
      return;
    }
    
    setUploadingAvatar(true);
    setSaveMessage('Uploading image...');
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to our profile avatar API endpoint
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update profile with new avatar URL
      setProfile(prev => ({
        ...prev,
        avatarUrl: data.url
      }));
      
      setSaveMessage('Image uploaded successfully');
    } catch (error) {
      setSaveMessage('Failed to upload image');
      console.error('Avatar upload error:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('Saving...');
    
    try {
      // Save profile data
      const result = await saveProfile(profile);
      
      // Update the session with new data (if using next-auth)
      if (result.success) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: profile.displayName,
            image: profile.avatarUrl
          }
        });
        setSaveMessage('Profile saved successfully');
      } else {
        setSaveMessage(`Error: ${result.message || 'Failed to save profile'}`);
      }
    } catch (error) {
      console.error('Profile save error:', error);
      setSaveMessage('Failed to save profile');
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'privacy'
                ? 'border-accent text-accent'
                : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
            }`}
          >
            Privacy & Notifications
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div 
                  onClick={handleAvatarClick} 
                  className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-bg-alt cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {profile.avatarUrl ? (
                    <Image 
                      src={profile.avatarUrl} 
                      alt="Profile" 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-accent/10 text-accent">
                      {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 flex-1">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium mb-1">First name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium mb-1">Last name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="displayName" className="block text-xs font-medium mb-1">Display name</label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={profile.displayName}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">About you</h3>
              
              <div>
                <label htmlFor="headline" className="block text-xs font-medium mb-1">Headline</label>
                <input
                  id="headline"
                  name="headline"
                  type="text"
                  placeholder="Software Developer, Project Manager, etc."
                  value={profile.headline}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-xs font-medium mb-1">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-xs font-medium mb-1">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                
                <div>
                  <label htmlFor="timezone" className="block text-xs font-medium mb-1">Timezone</label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={profile.timezone}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Select timezone</option>
                    <option value="America/Los_Angeles">Pacific Time (US)</option>
                    <option value="America/Denver">Mountain Time (US)</option>
                    <option value="America/Chicago">Central Time (US)</option>
                    <option value="America/New_York">Eastern Time (US)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Central Europe</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional information</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentCompany" className="block text-xs font-medium mb-1">Company</label>
                  <input
                    id="currentCompany"
                    name="currentCompany"
                    type="text"
                    value={profile.currentCompany}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                
                <div>
                  <label htmlFor="currentTitle" className="block text-xs font-medium mb-1">Job title</label>
                  <input
                    id="currentTitle"
                    name="currentTitle"
                    type="text"
                    value={profile.currentTitle}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="linkedinUrl" className="block text-xs font-medium mb-1">LinkedIn URL</label>
                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={profile.linkedinUrl}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                
                <div>
                  <label htmlFor="githubUrl" className="block text-xs font-medium mb-1">GitHub URL</label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    placeholder="https://github.com/username"
                    value={profile.githubUrl}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                
                <div>
                  <label htmlFor="portfolioUrl" className="block text-xs font-medium mb-1">Portfolio URL</label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={profile.portfolioUrl}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-1">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled={session?.user?.email ? true : false}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:bg-bg-alt/50 disabled:text-fg-muted"
                />
                {session?.user?.email && (
                  <p className="mt-1 text-xs text-fg-muted">Email is managed by your Microsoft account</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-medium mb-1">Phone number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              
              <div>
                <label htmlFor="preferredLanguage" className="block text-xs font-medium mb-1">Preferred language</label>
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={profile.preferredLanguage}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
              <p className="mt-1 text-sm text-fg-muted">Permanently delete your account and all of your content.</p>
              <div className="mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors"
                  onClick={() => {
                    // This would typically open a confirmation dialog
                    alert('This feature is not yet implemented.');
                  }}
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Privacy Settings</h3>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">Public profile</p>
                  <p className="text-xs text-fg-muted">Allow others to view your profile information</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="showProfilePublic"
                    checked={profile.showProfilePublic}
                    onChange={handleProfileChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-bg-alt/70 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <p className="font-medium text-sm">Email visibility</p>
                  <p className="text-xs text-fg-muted">Show your email in your public profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="showEmailPublic"
                    checked={profile.showEmailPublic}
                    onChange={handleProfileChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-bg-alt/70 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <p className="font-medium text-sm">Email notifications</p>
                  <p className="text-xs text-fg-muted">Receive email notifications about activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="receiveNotifications"
                    checked={profile.receiveNotifications}
                    onChange={handleProfileChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-bg-alt/70 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium">Data & Privacy</h3>
              <p className="mt-1 text-sm text-fg-muted">Manage your data and privacy settings.</p>
              
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-bg-alt hover:bg-bg-alt/80 rounded-md text-sm font-medium transition-colors"
                  onClick={() => {
                    // This would typically open a modal or navigate to a data export page
                    alert('Data export feature is not yet implemented.');
                  }}
                >
                  Export your data
                </button>
                
                <div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-bg-alt hover:bg-bg-alt/80 rounded-md text-sm font-medium transition-colors"
                    onClick={() => {
                      // This would typically open the privacy policy
                      window.open('/privacy-policy', '_blank');
                    }}
                  >
                    View privacy policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bootcamps Tab */}
        {activeTab === 'bootcamps' && (
          <BootcampRegistrationsSection userId={session?.user?.id || initialData?.id} />
        )}

        {/* Save Button (fixed at bottom) */}
        <div className="sticky bottom-6 flex items-center justify-between bg-bg-alt rounded-lg border border-border p-4 shadow-md">
          {saveMessage && (
            <div className={`text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {saveMessage}
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}