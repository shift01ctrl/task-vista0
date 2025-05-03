import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { Sparkles, LogIn } from "lucide-react";
import { translateToFrench } from "@/utils/translations";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // For demo, we'll just simulate a login
    setIsLoading(true);
    setAnimate(true);
    
    // Simulate API request
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", email.split("@")[0]);
      localStorage.setItem("email", email);
      
      toast.success(translateToFrench("Welcome back! 👋"), {
        description: "You have successfully logged in.",
      });
      
      setIsLoading(false);

      // Wait for animation to complete before navigating
      setTimeout(() => {
        navigate("/");
      }, 800);
    }, 1500);
  };

  // Trigger subtle background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthLayout>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <motion.div 
          className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-primary overflow-hidden">
            <motion.img 
              src="https://res.cloudinary.com/monday-blogs/fl_lossy,f_auto,q_auto/wp-blog/2024/07/project-management.png" 
              alt="Project management" 
              className={`w-full h-full object-cover opacity-20 ${animate ? 'animate-pulse' : ''}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: animate ? 1.05 : 1 }}
              transition={{ duration: 4 }}
            />
          </div>
          <motion.div 
            className="relative z-20 flex items-center text-lg font-medium"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div 
              className="bg-white/10 p-2 rounded-md backdrop-blur-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <span>TaskVista 📝</span>
            </motion.div>
          </motion.div>
          <motion.div 
            className="relative z-20 mt-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <blockquote className="space-y-2">
              <motion.p 
                className="text-lg"
                whileHover={{ scale: 1.02 }}
              >
                "TaskVista has transformed how our team manages projects, making collaboration 
                seamless and task tracking intuitive."
              </motion.p>
              <motion.footer 
                className="text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                Sofia Davis
              </motion.footer>
            </blockquote>
          </motion.div>
        </motion.div>

        <motion.div 
          className="lg:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <motion.div 
              className="flex flex-col space-y-2 text-center"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center justify-center gap-2 mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className={`bg-primary p-2 rounded-md ${animate ? 'animate-bounce' : ''}`}
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                >
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </motion.div>
                <motion.h1 
                  className="text-2xl font-semibold tracking-tight"
                  animate={{ 
                    textShadow: animate ? "0 0 8px rgba(131, 94, 251, 0.5)" : "0 0 0px rgba(131, 94, 251, 0)"
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  TaskVista
                </motion.h1>
              </motion.div>
              <motion.h2 
                className="text-xl font-semibold"
                variants={itemVariants}
              >
                {translateToFrench("Welcome back 👋")}
              </motion.h2>
              <motion.p 
                className="text-sm text-muted-foreground"
                variants={itemVariants}
              >
                {translateToFrench("Enter your email to sign in to your account")}
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid gap-6"
              variants={itemVariants}
            >
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <motion.div 
                    className="grid gap-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Label htmlFor="email">{translateToFrench("Email Address")}</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="transition-all duration-300 focus:ring-2"
                    />
                  </motion.div>
                  <motion.div 
                    className="grid gap-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{translateToFrench("Password")}</Label>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                          {translateToFrench("Forgot Password?")}
                        </Link>
                      </motion.div>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="transition-all duration-300 focus:ring-2"
                    />
                  </motion.div>
                  
                  {error && (
                    <motion.div 
                      className="bg-destructive/10 text-destructive text-sm p-2 rounded-md"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full ${animate ? 'animate-pulse' : ''}`}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          {translateToFrench("Signing In...")}
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="flex items-center justify-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <LogIn className="h-4 w-4" />
                          {translateToFrench("Sign In")}
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
            
            <motion.div 
              className="mx-auto text-center text-sm"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-muted-foreground">
                {translateToFrench("Don't have an account?")}{" "}
                <Link
                  to="/signup"
                  className="text-primary underline-offset-4 hover:underline relative inline-block"
                >
                  {translateToFrench("Sign Up")}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
