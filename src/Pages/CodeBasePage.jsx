import React, { useState } from 'react';
import { Code2, Heart, Code, Users, Zap, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillMatchingLandingPage = () => {
  const [selectedSkill, setSelectedSkill] = useState('React');
  const navigate = useNavigate();
  
  const skills = [
    { name: 'React', color: 'from-blue-500 to-blue-600', users: 1247, icon: '⚛️' },
    { name: 'Node.js', color: 'from-green-500 to-green-600', users: 892, icon: '🟢' },
    { name: 'Python', color: 'from-yellow-500 to-orange-500', users: 1583, icon: '🐍' },
    { name: 'JavaScript', color: 'from-orange-500 to-red-500', users: 2341, icon: '🚀' },
    { name: 'TypeScript', color: 'from-blue-600 to-indigo-600', users: 756, icon: '📘' },
    { name: 'MongoDB', color: 'from-green-600 to-teal-600', users: 634, icon: '🍃' }
  ];


  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Skill-Based Matching',
      description: 'Connect with developers who share your technical expertise and interests'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Professional Networking',
      description: 'Build meaningful professional relationships in the tech community'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-Time Connections',
      description: 'Instantly connect with like-minded developers in your area or globally'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-8 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 sm:bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 sm:bottom-40 right-1/3 w-9 h-9 sm:w-14 sm:h-14 bg-green-500 rounded-full animate-bounce"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
               <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
             </div>

            <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"> CodeBase </span>
              </div>
              
            <p className="text-lg sm:text-2xl text-amber-400 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4"> 
              "Excellence is not a skill, it's an attitude."</p><p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
               We connect exceptional developers with extraordinary opportunities through intelligent skill matching.
               </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <button onClick={() => navigate("/login")}className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto">
                Start Matching Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline" />
              </button>
             
            </div>
          </div>
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">Match by Your Favorite Technologies</h2>
          <p className="text-white/70 text-base sm:text-lg">Select a skill to see potential matches</p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 sm:gap-12 max-w-18xl mx-auto place-items-center size-lg">
          {/* Skills Grid */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-x-10 sm:gap-y-6 max-w-18xl mx-auto mb-12 sm:mb-16">
              {skills.map((skill) => (
 <button
                key={skill.name}
                onClick={() => setSelectedSkill(skill.name)}
                className={`group p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedSkill === skill.name
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                    : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:bg-gray-800/50'
                } backdrop-blur-sm`}
              >
                <div className="text-xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{skill.name}</h3>
                <div className={`text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${skill.color} text-white font-medium`}>
                  {skill.users}+ devs
                </div>
              </button>
              ))}
            </div>
          </div>

          {/* Demo Profiles */}
         
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">Why Developers Choose Us</h2>
            <p className="text-white/70 text-base sm:text-lg">Built by developers, for developers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-white/70 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-y border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-base sm:text-xl text-white/80 mb-8 sm:mb-12 px-4">Join thousands of developers connecting through shared expertise</p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-8 sm:px-12 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-lg w-full sm:w-auto">
              Get Started Free
            </button>
            <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatchingLandingPage;