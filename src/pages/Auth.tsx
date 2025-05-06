
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSuccess = () => {
    // Handled by AuthContext
  };

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="h-10 w-10 text-uprit-indigo" />
          </div>
          <h1 className="text-2xl font-bold text-uprit-indigo">UpRIT</h1>
          <p className="text-gray-600">Gamified Skills Showcase for RIT Students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to UpRIT</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to start building your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onSuccess={handleLoginSuccess} />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm onSuccess={handleSignupSuccess} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
