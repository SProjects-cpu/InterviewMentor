'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Briefcase,
  Save,
  Edit,
  CheckCircle,
  AlertTriangle,
  Camera,
  Settings,
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  institution?: string;
  degree?: string;
  graduation_year?: string;
  skills?: string;
  profile_picture?: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Demo profile data
  const [profile] = useState<UserProfile>({
    id: 'demo-user',
    username: 'DemoUser',
    email: 'demo@interviewmentor.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    institution: 'University of Technology',
    degree: 'Bachelor of Computer Science',
    graduation_year: '2024',
    skills: 'JavaScript, Python, React, Node.js, Machine Learning, Communication, Leadership',
  });

  const [formData, setFormData] = useState({
    phone: profile.phone || '',
    location: profile.location || '',
    institution: profile.institution || '',
    degree: profile.degree || '',
    graduation_year: profile.graduation_year || '',
    skills: profile.skills || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess('');

    try {
      // Demo save - just show success message
      setSuccess('Profile updated successfully! (Demo Mode)');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      // In demo mode, this won't happen
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        phone: profile.phone || '',
        location: profile.location || '',
        institution: profile.institution || '',
        degree: profile.degree || '',
        graduation_year: profile.graduation_year || '',
        skills: profile.skills || '',
      });
    }
    setIsEditing(false);
    setError('');
  };



  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardTitle>{profile.username}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Member since 2024</span>
              </div>
              {profile.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.institution && (
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.institution}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  placeholder="City, Country"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  disabled={!isEditing}
                  placeholder="University or College name"
                  className="mt-2"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Bachelor of Science"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="graduation_year">Graduation Year</Label>
                  <Input
                    id="graduation_year"
                    value={formData.graduation_year}
                    onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., 2024"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  disabled={!isEditing}
                  placeholder="List your skills separated by commas (e.g., JavaScript, Python, Communication, Leadership)"
                  className="mt-2"
                />
              </div>
              
              {formData.skills && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => router.push('/aptitude')}>
              Take Aptitude Test
            </Button>
            <Button variant="outline" onClick={() => router.push('/coding-test')}>
              Practice Coding
            </Button>
            <Button variant="outline" onClick={() => router.push('/career-guidance')}>
              Career Guidance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
