import React from 'react';
import {
  HeartPulse,
  Droplets,
  Ambulance,
  FileText,
  QrCode,
  HeartHandshake,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  PhoneCall,
  MapPin,
  Clock,
  HelpCircle,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from '../common/Logo.tsx';
import { Badge } from '../common/Badge.tsx';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, language, setLanguage } = useApp();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const modules = [
    {
      id: 'find-care',
      title: 'Location-Aware "Find Care Near Me"',
      desc: 'Proximity search for verified hospitals, ambulances, blood banks, and community donors with privacy shielding.',
      icon: <Navigation className="w-6 h-6 text-emerald-600" />,
      badge: 'Location-Aware',
    },
    {
      id: 'ai-assistant',
      title: 'AI Health & Cancer Awareness',
      desc: 'Understand symptoms in plain language, identify warning signs, and find appropriate specialist referral guidance.',
      icon: <HeartPulse className="w-6 h-6 text-[#0F766E]" />,
      badge: 'Gemini AI',
    },
    {
      id: 'blood',
      title: 'Blood Availability',
      desc: 'Stock queries across regional blood banks (J.A. Hospital Gwalior, Morena District Hospital, DMCH) for rare groups, platelets, and plasma.',
      icon: <Droplets className="w-6 h-6 text-red-600" />,
      badge: 'Regional Network',
    },
    {
      id: 'ambulance',
      title: 'Ambulance Locator',
      desc: 'Instant access to verified BLS, ALS cardiac, and neonatal emergency ambulances across Gwalior, Morena, and regional hubs.',
      icon: <Ambulance className="w-6 h-6 text-amber-600" />,
      badge: 'GPS & Tele-Dispatch',
    },
    {
      id: 'documents',
      title: 'Medical Documents & Translation',
      desc: 'Upload complex lab reports and prescriptions to receive simple, plain-language explanations with zero medical jargon.',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      badge: 'AI Translator',
    },
    {
      id: 'qr-profile',
      title: 'QR-Based Health Profile',
      desc: 'Generates an emergency summary token for first responders and doctors without exposing private records.',
      icon: <QrCode className="w-6 h-6 text-teal-600" />,
      badge: 'Encrypted Access',
    },
    {
      id: 'ngo-assistance',
      title: 'NGO & Financial Assistance',
      desc: 'Connect with cancer care foundations, crowdfunding, and Ayushman Bharat PM-JAY government schemes.',
      icon: <HeartHandshake className="w-6 h-6 text-rose-600" />,
      badge: 'Patient Grants',
    },
    {
      id: 'hospitals',
      title: 'Hospital & Insurance Directory',
      desc: 'Search empaneled cashless hospitals (GRMC J.A. Hospital Gwalior, Morena District Hospital, DMCH) with Ayushman Mitra helpdesks.',
      icon: <Building2 className="w-6 h-6 text-slate-700" />,
      badge: 'Empaneled List',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#172B3A] flex flex-col font-sans">
      {/* Top Banner Disclaimer */}
      <div className="bg-[#123047] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-[#0F766E] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
          College Startup Prototype
        </span>
        <span>
          Designed initially for Darbhanga, Bihar & Tier 2/3 Indian Cities. Non-clinical demonstration platform.
        </span>
      </div>

      {/* Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" showTagline={true} />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
            </button>

            <button
              onClick={() => setCurrentPage('overview')}
              className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <span>Explore Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-gradient-to-b from-white to-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brief copy & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F5F2] border border-teal-200 text-[#0F766E] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Health Equity for Bharat</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123047] tracking-tight leading-tight">
                Healthcare Help, All in One Place.
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl">
                Find health guidance, discover healthcare services, organize medical documents and explore financial assistance through one simple platform.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => setCurrentPage('overview')}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Healthcare Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#172B3A] font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-slate-300 shadow-2xs transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>See How It Works</span>
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#0F766E]">7 Modules</div>
                  <div className="text-xs text-[#64748B] mt-0.5">End-to-end Care</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#123047]">Darbhanga</div>
                  <div className="text-xs text-[#64748B] mt-0.5">District Pilot Pilot</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#15803D]">100% Free</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Open Patient Access</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual UI Composition / Connected Network Concept */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200">
                {/* Decorative header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E6F5F2] flex items-center justify-center text-[#0F766E]">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172B3A]">SehatSetu Care Connected</p>
                      <p className="text-[10px] text-slate-400">Darbhanga Health Network</p>
                    </div>
                  </div>
                  <Badge variant="verified">Pilot Hub</Badge>
                </div>

                {/* Simulated Interactive Cards in Hero */}
                <div className="space-y-3 mt-4">
                  {/* Card 1: Blood Availability */}
                  <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-600 text-white rounded-lg">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">DMCH Model Blood Centre</p>
                        <p className="text-[11px] text-slate-500">B+ Packed Red Cells: 28 Units</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Available
                    </span>
                  </div>

                  {/* Card 2: AI Report Insight */}
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#0F766E] text-white rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">CBC Report Simplified</p>
                        <p className="text-[11px] text-slate-500">Hemoglobin 13.8 g/dL (Optimal)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#0F766E] bg-white px-2 py-0.5 rounded-md border border-teal-200">
                      Translated
                    </span>
                  </div>

                  {/* Card 3: Emergency Dispatch Notice */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-600 text-white rounded-lg">
                        <Ambulance className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">ALS Cardiac Ambulance</p>
                        <p className="text-[11px] text-slate-500">1.8 km from Allpatti, Darbhanga</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      On-Call
                    </span>
                  </div>

                  {/* Card 4: Ayushman & Financial Grants */}
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-600 text-white rounded-lg">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Ayushman Bharat PM-JAY</p>
                        <p className="text-[11px] text-slate-500">₹5,00,000 Cashless Hospital Cover</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                      Empaneled
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Darbhanga, Bihar Pilot</span>
                  </span>
                  <span className="text-[#0F766E] font-bold">Encrypted & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#E6F5F2] text-[#0F766E] flex items-center justify-center font-bold mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123047] mb-1">Accessible Healthcare</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Designed for low digital literacy, simple navigation, high readability, and bilingual English-Hindi support.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#E6F5F2] text-[#0F766E] flex items-center justify-center font-bold mb-3">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123047] mb-1">AI-Assisted Guidance</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Clinically grounded Gemini intelligence translates confusing symptoms and medical jargon without diagnosing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#E6F5F2] text-[#0F766E] flex items-center justify-center font-bold mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123047] mb-1">Connected Patient Support</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Single unified window bridging patients to blood banks, ambulances, cancer foundations, and hospital cashless desks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#E6F5F2] text-[#0F766E] flex items-center justify-center font-bold mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#123047] mb-1">Designed for Indian Cities</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Tailored for Tier 2 and Tier 3 cities like Darbhanga, factoring in real district infrastructure and government schemes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION SECTION */}
      <section className="py-16 bg-[#F7FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123047] tracking-tight">
              Solving Healthcare Fragmentation in Smaller Cities
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2">
              Patients and rural caregivers in Tier 2/3 districts face tremendous stress contacting multiple uncoordinated providers during medical emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Fragmented Reality */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-200 shadow-sm relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold mb-4">
                The Status Quo Challenge
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Manual, Stressful & Disconnected
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Calling 5 different blood banks manually while a relative is in surgery.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Struggling to find reliable ambulance operators with oxygen support at night.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Dense lab reports and prescriptions that patients cannot decipher.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Missing out on Ayushman Bharat and NGO grants due to lack of awareness.</span>
                </li>
              </ul>
            </div>

            {/* The SehatSetu Solution */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-200 shadow-sm relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E6F5F2] text-[#0F766E] text-xs font-bold mb-4">
                The SehatSetu Bridge
              </div>
              <h3 className="text-lg font-bold text-[#123047] mb-3">
                Coordinated, Empathetic & Technology-Enabled
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>Centralized regional blood centre availability directory with online enquiries.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>Verified ambulance operator listings with clear categories (BLS/ALS/Neonatal).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>Plain-language AI report explanation empowering patients before seeing the doctor.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>Integrated government healthcare schemes and verified cancer relief NGOs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID: 7 MODULES */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0F766E] tracking-wider uppercase">
              Comprehensive Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123047] tracking-tight mt-1">
              Seven Integrated Healthcare Modules
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Every module is fully functional in this demonstration. Click any card to launch that service immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setCurrentPage(m.id as any)}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0F766E] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-[#E6F5F2] transition-colors">
                      {m.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 group-hover:bg-teal-100/70 group-hover:text-[#0F766E] px-2 py-0.5 rounded-full transition-colors">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#172B3A] group-hover:text-[#0F766E] transition-colors mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works-section" className="py-16 bg-[#F7FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              Simple 4-Step Patient Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123047] tracking-tight mt-1">
              How SehatSetu Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                Select a Service
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose from symptom check, blood search, ambulance transport, report explanation, or financial assistance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                Enter Required Info
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide basic details in plain language (e.g. blood group, pickup location, or symptom duration).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                Receive Guidance or Submit
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get an instant clinical AI breakdown or submit an availability enquiry directly to verified provider queues.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                Track Request & Follow Next Steps
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitor status updates in real-time in 'My Requests' with clear provider contact numbers and consultation advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BUILT FOR TIER 2 & TIER 3 CITIES */}
      <section className="py-16 bg-[#123047] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Regional Focus & Scaling Strategy
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Built with Tier 2 and Tier 3 Cities in Mind
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Unlike metropolitan health-tech platforms built exclusively for private hospital chains, SehatSetu starts in Darbhanga, Bihar. We embrace the reality of district medical colleges (DMCH), charitable blood banks, rural ambulance operators, and Ayushman Bharat PM-JAY integration.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-sm text-teal-300 mb-1">Hindi & Regional Language First</h4>
                  <p className="text-xs text-slate-300">
                    Designed to expand to Maithili, Bhojpuri, and Magahi so non-English speakers can navigate care with dignity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-sm text-teal-300 mb-1">Future WhatsApp Integration</h4>
                  <p className="text-xs text-slate-300">
                    A conceptual demonstration of how simple WhatsApp chat messages will soon connect users to this same data engine.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <button
                onClick={() => setCurrentPage('overview')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 mt-3">
                No real personal information required for demo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <Logo size="md" showTagline={true} />
              <p className="text-xs text-slate-500 leading-relaxed">
                Healthcare Access. Connected for Everyone. Pioneering healthcare equity for Darbhanga and Tier 2/3 India.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><button onClick={() => setCurrentPage('ai-assistant')} className="hover:text-[#0F766E]">AI Health Guidance</button></li>
                <li><button onClick={() => setCurrentPage('blood')} className="hover:text-[#0F766E]">Blood Availability</button></li>
                <li><button onClick={() => setCurrentPage('ambulance')} className="hover:text-[#0F766E]">Ambulance Locator</button></li>
                <li><button onClick={() => setCurrentPage('documents')} className="hover:text-[#0F766E]">Medical Documents</button></li>
                <li><button onClick={() => setCurrentPage('ngo-assistance')} className="hover:text-[#0F766E]">Financial Assistance</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Regional Hubs
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>Darbhanga Medical College (DMCH)</li>
                <li>Indian Red Cross Society, Laheriasarai</li>
                <li>Paras Global Hospital, NH-27 Bela</li>
                <li>Sadar Hospital, Tower Chowk</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Competition Prototype
              </h4>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Disclaimer:</strong> This is an educational prototype developed for a national college startup competition. All provider stock figures and response times are simulated demo records. In emergency situations, dial 112 / 108.
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>© 2026 SehatSetu. Built for College Startup Competition Demonstration.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy (Demo)</span>
              <span>Terms of Service</span>
              <span>Prototype Audit v2.4</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
