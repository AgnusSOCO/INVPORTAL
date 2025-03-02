import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import { 
  BarChart3, 
  ChevronRight, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowRight, 
  Lock, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Reveal content with delay for dramatic effect
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-[120px] opacity-5"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-600 rounded-full filter blur-[120px] opacity-5"></div>
      </div>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled 
        ? isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md' 
        : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-emerald-500" />
              <span className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"} tracking-tight`}>OBSIDIAN CAPITAL</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden sm:flex sm:items-center sm:gap-4">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    className={isDark 
                      ? "border-gray-800 bg-black/50 text-gray-300 hover:bg-gray-900 hover:text-white" 
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}
                  >
                    Member Access
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className={isDark 
                      ? "bg-black border border-emerald-500/50 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300 transition-all duration-300" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"}
                  >
                    Request Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col justify-center pt-20 pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ease-in-out transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className={`inline-flex items-center rounded-full ${isDark 
                ? "border border-emerald-500/20 bg-emerald-500/5" 
                : "border border-emerald-500/30 bg-emerald-50"} px-3 py-1 text-xs text-emerald-600 mb-6`}>
                <Lock className="h-3 w-3 mr-1" />
                <span>BY INVITATION ONLY</span>
              </div>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"} mb-6`}>
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">Obsidian</span> Capital Collective
              </h1>
              <p className={`text-lg md:text-xl ${isDark ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto mb-8`}>
                An exclusive investment vehicle for sophisticated investors seeking exposure to the premium GPU market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className={`w-full sm:w-auto ${isDark 
                      ? "bg-black border border-emerald-500/50 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700"} transition-all duration-300`}
                  >
                    Request Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className={`w-full sm:w-auto ${isDark 
                      ? "border-gray-800 bg-black/50 text-gray-300 hover:bg-gray-900 hover:text-white" 
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    Member Login
                    <Lock className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ease-in-out transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-emerald-700/20 opacity-20 blur-xl"></div>
              <div className={`relative rounded-2xl ${isDark 
                ? "border border-gray-800/50 bg-black/80" 
                : "border border-gray-200 bg-white/90"} backdrop-blur-sm p-8 md:p-10`}>
                <div className="space-y-8">
                  <div className={`flex items-center justify-between border-b ${isDark 
                    ? "border-gray-800/50" 
                    : "border-gray-200"} pb-4`}>
                    <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Current Performance</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-semibold">+27.8%</span>
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>YTD</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">Annual ROI</span>
                          </div>
                          <span className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}>27.8%</span>
                        </div>
                        <div className={`h-2 ${isDark ? "bg-gray-800" : "bg-gray-200"} rounded-full overflow-hidden`}>
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 w-[27.8%]"></div>
                        </div>
                        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Target: 20%</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">AUM</span>
                          </div>
                          <span className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}>$3.2M</span>
                        </div>
                        <div className={`h-2 ${isDark ? "bg-gray-800" : "bg-gray-200"} rounded-full overflow-hidden`}>
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 w-[64%]"></div>
                        </div>
                        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Capacity: $5M</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 h-48 md:h-auto">
                      <div className="w-full h-full bg-[url('/chart-placeholder.svg')] bg-no-repeat bg-contain bg-center opacity-80"></div>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 border-t ${isDark 
                    ? "border-gray-800/50" 
                    : "border-gray-200"} pt-6`}>
                    <div className={`rounded-lg ${isDark 
                      ? "bg-gray-900/20" 
                      : "bg-gray-50"} p-4`}>
                      <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Members</span>
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>42</p>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Limited to 50 investors</p>
                    </div>
                    <div className={`rounded-lg ${isDark 
                      ? "bg-gray-900/20" 
                      : "bg-gray-50"} p-4`}>
                      <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">Min Investment</span>
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>$50K</p>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>8 slots remaining</p>
                    </div>
                    <div className={`rounded-lg ${isDark 
                      ? "bg-gray-900/20" 
                      : "bg-gray-50"} p-4`}>
                      <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Next Distribution</span>
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Jun 30</p>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Est. yield: 6.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-16">
            <button 
              className={`flex items-center gap-2 ${isDark 
                ? "text-gray-500 hover:text-gray-300" 
                : "text-gray-400 hover:text-gray-600"} transition-colors`}
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Discover Our Approach</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className={`relative z-10 border-t ${isDark 
        ? "border-gray-800/50 bg-black/80" 
        : "border-gray-200 bg-white/90"} backdrop-blur-sm py-24`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>Investment Philosophy</h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Obsidian Capital Collective employs a proprietary strategy focused on acquiring, optimizing, and distributing high-performance computing hardware to maximize investor returns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`rounded-xl ${isDark 
              ? "border border-gray-800/50 bg-black/50 hover:border-emerald-900/50 hover:bg-gray-900/10" 
              : "border border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"} backdrop-blur-sm p-6 transition-all duration-300`}>
              <div className={`rounded-full ${isDark 
                ? "bg-emerald-500/5" 
                : "bg-emerald-50"} w-12 h-12 flex items-center justify-center mb-4`}>
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>Asymmetric Opportunity</h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Our team leverages industry connections and market intelligence to secure premium GPU inventory at preferential rates, creating immediate equity for our investors.
              </p>
            </div>
            
            <div className={`rounded-xl ${isDark 
              ? "border border-gray-800/50 bg-black/50 hover:border-emerald-900/50 hover:bg-gray-900/10" 
              : "border border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"} backdrop-blur-sm p-6 transition-all duration-300`}>
              <div className={`rounded-full ${isDark 
                ? "bg-emerald-500/5" 
                : "bg-emerald-50"} w-12 h-12 flex items-center justify-center mb-4`}>
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>Risk Mitigation</h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Our diversified approach spans multiple market segments, with strategic inventory management and hedging protocols to protect capital during market fluctuations.
              </p>
            </div>
            
            <div className={`rounded-xl ${isDark 
              ? "border border-gray-800/50 bg-black/50 hover:border-emerald-900/50 hover:bg-gray-900/10" 
              : "border border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"} backdrop-blur-sm p-6 transition-all duration-300`}>
              <div className={`rounded-full ${isDark 
                ? "bg-emerald-500/5" 
                : "bg-emerald-50"} w-12 h-12 flex items-center justify-center mb-4`}>
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>Exclusive Network</h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Members gain access to our proprietary market intelligence, quarterly private briefings, and networking opportunities with industry leaders and fellow investors.
              </p>
            </div>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto">
            <div className={`rounded-xl ${isDark 
              ? "border border-gray-800/50 bg-black/50" 
              : "border border-gray-200 bg-white"} backdrop-blur-sm p-6`}>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4 flex items-center`}>
                <Lock className="h-5 w-5 text-emerald-600 mr-2" />
                Membership Requirements
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Accredited investor status with verifiable assets</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Minimum investment commitment of $50,000</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Professional reference or introduction from existing member</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Commitment to minimum 18-month investment horizon</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Link to="/register">
                  <Button className={isDark 
                    ? "bg-black border border-emerald-500/50 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700"}>
                    Apply for Membership
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className={`relative z-10 border-t ${isDark 
        ? "border-gray-800/50 bg-black/90" 
        : "border-gray-200 bg-gray-50/80"} backdrop-blur-sm py-24`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>Member Perspectives</h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Insights from our exclusive community of investors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`rounded-xl ${isDark 
              ? "border border-gray-800/50 bg-black/50" 
              : "border border-gray-200 bg-white"} backdrop-blur-sm p-6`}>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} italic mb-6`}>
                "Obsidian Capital has consistently delivered returns that outperform my traditional investment portfolio. Their market intelligence and execution are unparalleled in this space."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${isDark ? "text-white" : "text-gray-900"} font-medium`}>J.K.</p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Managing Director, Private Equity</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`rounded-xl ${isDark 
              ? "border border-gray-800/50 bg-black/50" 
              : "border border-gray-200 bg-white"} backdrop-blur-sm p-6`}>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} italic mb-6`}>
                "The quarterly briefings alone are worth the investment. The level of insight and access to industry leaders has been invaluable for my broader investment strategy."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${isDark ? "text-white" : "text-gray-900"} font-medium`}>M.R.</p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Family Office Principal</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`relative z-10 border-t ${isDark 
        ? "border-gray-800/50 bg-black/70" 
        : "border-gray-200 bg-white/90"} backdrop-blur-sm py-24`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-emerald-700/30 opacity-30 blur-xl"></div>
                <div className={`relative ${isDark 
                  ? "bg-black/80 border border-gray-800/50" 
                  : "bg-white/90 border border-gray-200"} backdrop-blur-sm rounded-2xl p-8 md:p-12`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>Ready to Join the Collective?</h2>
                      <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-6`}>
                        Our current investment round closes on June 30th. Limited slots remain for qualified investors.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/register">
                          <Button className={`w-full sm:w-auto ${isDark 
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900" 
                            : "bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800"} text-white border-0`}>
                            Apply Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to="/login">
                          <Button 
                            variant="outline" 
                            className={`w-full sm:w-auto ${isDark 
                              ? "border-gray-700 bg-black/50 text-gray-300 hover:bg-gray-900 hover:text-white" 
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
                          >
                            Member Login
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className={`rounded-xl ${isDark 
                      ? "border border-gray-800/50 bg-black/50" 
                      : "border border-gray-200 bg-white"} backdrop-blur-sm p-6`}>
                      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>Contact Our Team</h3>
                      <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-4`}>
                        For private inquiries or to schedule a consultation with our investment team:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600">Email:</span>
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>private@obsidiancapital.org</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600">Phone:</span>
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>+1 (555) 123-4567</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`relative z-10 border-t ${isDark 
        ? "border-gray-800/50 bg-black/90" 
        : "border-gray-200 bg-gray-50/90"} backdrop-blur-sm py-12`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
              <span className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"} tracking-tight`}>OBSIDIAN CAPITAL</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-sm">
              <Link to="/login" className={`${isDark ? "text-gray-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-600"} transition-colors`}>Member Access</Link>
              <Link to="/register" className={`${isDark ? "text-gray-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-600"} transition-colors`}>Apply</Link>
              <a href="#" className={`${isDark ? "text-gray-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-600"} transition-colors flex items-center gap-1`}>
                Terms <ExternalLink className="h-3 w-3" />
              </a>
              <a href="#" className={`${isDark ? "text-gray-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-600"} transition-colors flex items-center gap-1`}>
                Privacy <ExternalLink className="h-3 w-3" />
              </a>
              <a href="#" className={`${isDark ? "text-gray-400 hover:text-emerald-400" : "text-gray-600 hover:text-emerald-600"} transition-colors flex items-center gap-1`}>
                Disclosures <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${isDark ? "border-gray-800/50" : "border-gray-200/50"} text-center text-gray-600 text-xs`}>
            <p>© 2025 Obsidian Capital Collective. All rights reserved.</p>
            <p className="mt-2">
              Investment opportunities involve risk. Past performance is not indicative of future results.
              Obsidian Capital Collective is available exclusively to accredited investors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;