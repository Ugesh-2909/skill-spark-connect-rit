
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { GraduationCap } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");

  const handleDemoAccess = () => {
    // In a real app, you would authenticate as demo user
    // For now, we'll just navigate to home
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-uprit-indigo" />
          <span className="font-display font-bold text-2xl text-uprit-indigo">UpRIT</span>
        </div>
        <Button onClick={handleDemoAccess} variant="ghost">
          Try Demo
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-12">
        {/* Left Column - Platform Info */}
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Showcase your achievements, connect with peers
            </h1>
            <p className="text-lg text-gray-600">
              UpRIT helps students document their journey, build portfolios, and engage in friendly competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-blue-100 p-2 rounded-full text-uprit-indigo">🏆</span>
                  Track Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Document and get credit for hackathons, projects, and academic milestones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-purple-100 p-2 rounded-full text-uprit-purple">👥</span>
                  Build Your Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Connect with like-minded peers and form teams for future projects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-green-100 p-2 rounded-full text-green-600">📊</span>
                  Compete & Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Track your progress on leaderboards and push yourself to achieve more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-orange-100 p-2 rounded-full text-orange-600">🚀</span>
                  Showcase Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Create detailed portfolios of your work to share with peers and recruiters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Auth Forms */}
        <div className="w-full max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome to UpRIT</CardTitle>
              <CardDescription className="text-center">
                Your platform for academic achievements and networking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Log In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onSuccess={() => navigate("/")} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onSuccess={() => setActiveTab("login")} />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-sm text-gray-500 text-center">
                By continuing, you agree to UpRIT's
                <Link to="/terms" className="text-uprit-indigo hover:underline mx-1">Terms of Service</Link>
                and
                <Link to="/privacy" className="text-uprit-indigo hover:underline mx-1">Privacy Policy</Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} UpRIT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
