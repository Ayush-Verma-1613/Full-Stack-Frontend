import React from "react";

// Reusable Section Component
const Section = ({ title, children, delay = 0 }) => (
  <section 
    className="mb-8 sm:mb-10 opacity-0 translate-y-8 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 relative">
      {title}
      <div className="absolute -bottom-1 left-0 w-8 sm:w-12 h-0.5 bg-emerald-600 rounded-full"></div>
    </h2>
    <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
      {children}
    </div>
  </section>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <div 
    className="bg-white/40 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-white/20 hover:bg-white/50 transition-all duration-300 hover:scale-105 opacity-0 translate-y-8 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{icon}</div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
  </div>
);

// Tech Stack Badge Component
const TechBadge = ({ tech, delay = 0 }) => (
  <span 
    className="inline-block bg-emerald-100 text-emerald-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium m-1 opacity-0 scale-95 animate-popIn hover:bg-emerald-200 transition-colors duration-200"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    {tech}
  </span>
);

const AboutUs = () => {
  const features = [
    {
      icon: "🎯",
      title: "Smart Skill Matching",
      description: "Advanced algorithm matches developers based on complementary skills and project requirements"
    },
    {
      icon: "👥",
      title: "Developer Profiles",
      description: "Comprehensive profiles showcasing skills, experience, portfolio, and availability"
    },
    {
      icon: "🤝",
      title: "Team Formation",
      description: "Create or join development teams for projects, hackathons, and collaborative coding"
    },
    {
      icon: "💼",
      title: "Project Opportunities",
      description: "Discover projects that match your expertise level and technology preferences"
    }
  ];

  const techStack = ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Tailwind CSS"];

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes popIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-popIn {
          animation: popIn 0.4s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl w-full bg-white/60 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-10 backdrop-blur-sm">
          {/* Animated Heading */}
          <div className="text-center mb-8 sm:mb-12 translate-y-8 animate-fadeInUp">
             <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 px-2">
            About <span className="text-emerald-600">CodeBase</span>
          </h1>
  
          </div>

          {/* Intro */}
          <div 
            className="text-center mb-8 sm:mb-12 opacity-0 translate-y-8 animate-fadeInUp"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <p className="text-base sm:text-lg text-slate-950 leading-relaxed px-2">
              <span className="font-semibold text-emerald-600">CodeBase</span> is an intelligent developer matching platform 
              that connects talented developers based on their skills, experience, and project requirements. 
              Find your perfect coding partner or discover opportunities that match your expertise.
            </p>
          </div>

          {/* Tech Stack */}
          <div 
            className="text-center mb-8 sm:mb-12 opacity-0 translate-y-8 animate-fadeInUp"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Built With</h3>
            <div className="flex flex-wrap justify-center">
              {techStack.map((tech, index) => (
                <TechBadge key={tech} tech={tech} delay={600 + (index * 100)} />
              ))}
            </div>
          </div>

          {/* What CodeBase Does */}
          <Section title="What CodeBase Does" delay={800}>
            <p className="mb-4">
              CodeBase revolutionizes how developers connect and collaborate. Our platform uses intelligent 
              matching algorithms to bring together the right developers for the right projects:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={feature.title} 
                  {...feature} 
                  delay={1000 + (index * 150)} 
                />
              ))}
            </div>
          </Section>

          {/* How It Works */}
          <Section title="How It Works" delay={1600}>
            <div className="space-y-3 sm:space-y-4">
              <p>
                <strong className="text-emerald-600">1. Create Your Profile:</strong> Build a comprehensive developer 
                profile showcasing your skills, experience level, preferred technologies, and project interests.
              </p>
              <p>
                <strong className="text-emerald-600">2. Smart Matching:</strong> Our algorithm analyzes your skills 
                and matches you with developers who have complementary abilities or similar project goals.
              </p>
              <p>
                <strong className="text-emerald-600">3. Connect & Collaborate:</strong> Browse matched profiles, 
                send connection requests, and start conversations with potential teammates or project partners.
              </p>
              <p>
                <strong className="text-emerald-600">4. Form Teams:</strong> Create project teams, join existing 
                ones, or find solo opportunities that match your expertise and availability.
              </p>
            </div>
          </Section>

          {/* Key Features */}
          <Section title="Key Features" delay={1800}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">🔍 Matching Features:</h4>
                <ul className="space-y-1 text-xs sm:text-sm">
                  <li>• Skill-based compatibility scoring</li>
                  <li>• Experience level filtering</li>
                  <li>• Technology stack preferences</li>
                  <li>• Project type matching</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">👤 Profile Features:</h4>
                <ul className="space-y-1 text-xs sm:text-sm">
                  <li>• Portfolio showcase</li>
                  <li>• Skill endorsements</li>
                  <li>• Availability status</li>
                  <li>• Project history</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Our Vision */}
          <Section title="Our Vision" delay={2000}>
            <p>
              We believe that great software is built by great teams. CodeBase aims to eliminate the barriers 
              that prevent talented developers from finding each other. By intelligently matching skills, 
              experience levels, and project interests, we're building a community where every developer 
              can find their perfect coding companion and every project can find its ideal team.
            </p>
          </Section>

          {/* Animated Closing */}
          <div 
            className="text-center mt-8 sm:mt-12 opacity-0 translate-y-8 animate-fadeInUp"
            style={{ animationDelay: '2200ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold text-base sm:text-lg">
              🚀 Connecting developers, creating possibilities ☕
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Find your coding tribe. Build something amazing together.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;