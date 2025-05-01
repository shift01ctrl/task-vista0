
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Camera, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { translateToFrench } from "@/utils/translations";

// Translation helper function for this component
const t = translateToFrench;

const SettingsPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has previously set a preference
    const savedTheme = localStorage.getItem("theme");
    // Check user system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    return savedTheme === "dark" || (savedTheme === null && prefersDark);
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load user data
    const savedUsername = localStorage.getItem("username");
    const savedEmail = localStorage.getItem("email");
    const savedProfileImage = localStorage.getItem("profileImage");
    
    if (savedUsername) setUsername(savedUsername);
    if (savedEmail) setEmail(savedEmail);
    if (savedProfileImage) setProfileImage(savedProfileImage);
    
    // Apply theme
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  
  const handleSaveProfile = () => {
    if (!username || !email) {
      toast.error(t("Please fill in all required fields"));
      return;
    }
    
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    toast.success(t("Profile updated successfully! 🎉"));
  };
  
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("Please fill in all password fields"));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(t("New passwords do not match"));
      return;
    }
    
    // In a real app, we'd verify the current password against stored value
    // and make an API call to update the password
    
    toast.success(t("Password changed successfully! 🔒"));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleSignOut = () => {
    localStorage.setItem("isAuthenticated", "false");
    toast.success(t("Signed out successfully! 👋"));
    navigate("/login");
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        localStorage.setItem("profileImage", result);
      };
      reader.readAsDataURL(file);
      toast.success(t("Profile image updated! 📷"));
    }
  };
  
  return (
    <PageLayout title={t("Settings") + " ⚙️"}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("Profile Settings 👤")}</CardTitle>
            <CardDescription>{t("Update your personal information")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32">
                  {profileImage ? (
                    <AvatarImage src={profileImage} />
                  ) : null}
                  <AvatarFallback className="text-4xl">
                    {username ? username.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="relative">
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                  <Label 
                    htmlFor="profile-image" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {t("Upload Image")}
                  </Label>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">{t("Full Name")}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("Enter your name")}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("Email Address")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("Enter your email")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile}>{t("Save Changes")}</Button>
          </CardFooter>
        </Card>
        
        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("App Settings 🔧")}</CardTitle>
            <CardDescription>{t("Customize your experience")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("Dark Mode")}</Label>
                <div className="text-sm text-muted-foreground">{t("Toggle between light and dark theme")}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className={`h-4 w-4 ${!isDarkMode ? "text-yellow-500" : "text-muted-foreground"}`} />
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                <Moon className={`h-4 w-4 ${isDarkMode ? "text-blue-400" : "text-muted-foreground"}`} />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={handleSignOut} className="w-full gap-2">
                <LogOut className="h-4 w-4" />
                {t("Sign Out")}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Password Settings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("Password Settings 🔒")}</CardTitle>
            <CardDescription>{t("Update your password")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="current-password">{t("Current Password")}</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-password">{t("New Password")}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">{t("Confirm New Password")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChangePassword}>{t("Change Password")}</Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
