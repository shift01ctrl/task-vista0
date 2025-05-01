
import { motion } from "framer-motion";
import { SidebarWrapper } from "./Sidebar";
import { PanelLeft, PanelRight } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <SidebarWrapper>
      {({ toggleSidebar, state }) => (
        <motion.main
          className="flex-1 container mx-auto px-4 py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleSidebar} 
                className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                {state === "collapsed" ? (
                  <PanelRight size={20} className="text-primary animate-pulse" />
                ) : (
                  <PanelLeft size={20} className="text-primary" />
                )}
              </button>
              <motion.h2 
                className="text-2xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {title}
              </motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {children}
          </motion.div>
        </motion.main>
      )}
    </SidebarWrapper>
  );
};

export default PageLayout;
