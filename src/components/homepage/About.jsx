import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Sparkles, Heart, Users, MessageSquare, Send, CheckCircle2, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function About() {
  const { isKannada } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    emailjs
      .sendForm(
        'service_x9v20q7',
        'template_gyxbf7k',
        e.target,
        'mArKdrHINvHIZxIjI'
      )
      .then(() => {
        setSuccessMsg(true);
        setSending(false);
        e.target.reset();
        setTimeout(() => {
          setSuccessMsg(false);
          setShowModal(false);
        }, 2500);
      })
      .catch((error) => {
        setSending(false);
        alert('❌ Submission failed: ' + error.text);
      });
  };

  const sections = [
    {
      title: isKannada ? 'ನಮ್ಮ ಬಗ್ಗೆ' : 'Who We Are',
      text: isKannada
        ? 'ಪಿ.ಇ.ಎಸ್ ವಿಶ್ವವಿದ್ಯಾಲಯದಲ್ಲಿನ ಕನ್ನಡದ ಮನಸ್ಸುಗಳನ್ನು ಅಭಿಮಾನದ ಬೆಸುಗೆಯಿಂದ ಬಂಧಿಸುವ ಕೊಂಡಿ ನಮ್ಮ ಕೂಟ. ಕನ್ನಡದ ಮಣಿಹಾರಕ್ಕೆ ಕೂಟ ಒಂದು ದಾರ. ಕನ್ನಡವೇ ನಮ್ಮ ಸಾರ, ಕನ್ನಡವೇ ನಮ್ಮ ವಿಚಾರ!'
        : 'Kannada Koota is a premier Techno-Cultural club at PES University dedicated to preserving, promoting, and celebrating the richness of Kannada language, traditions, and heritage.',
    },
    {
      title: isKannada ? 'ನಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ' : 'What We Do',
      text: isKannada
        ? 'ಭಾವ-ಜೀವಗಳನ್ನು ಮುತ್ತಿನಂತೆ ಪೋಣಿಸುವ, ಅಭಿಮಾನವನ್ನು ಉಣಿಸುವ, ಹೃದಯಗಳನ್ನು ತಣಿಸುವ, ಮನಗಳನ್ನು ಕುಣಿಸುವ ಕಾರ್ಯಕ್ರಮಗಳ ಮೂಲಕ ನಮ್ಮ ಹೆಜ್ಜೆ ಗುರುತುಗಳನ್ನು ಮೂಡಿಸುತ್ತೇವೆ. ಕನ್ನಡದ ದೀಪ ಹಚ್ಚುವ ಬತ್ತಿಯಾಗುತ್ತೇವೆ, ಕನ್ನಡದ ಚಿತ್ರಪಟಕ್ಕೆ ಭಿತ್ತಿಯಾಗುತ್ತೇವೆ.'
        : 'From grand theatrical productions and classical music concerts to literary debates, folk dances, and heritage workshops, we craft impactful cultural experiences for students.',
    },
    {
      title: isKannada ? 'ಮಹತ್ವ' : 'Why It Matters',
      text: isKannada
        ? 'ಬೇರು ಗಟ್ಟಿಯಿದ್ದರೆ ಮಾತ್ರವೇ ಬೇರೆಲ್ಲವೂ ಗಟ್ಟಿಯಿರಲು ಸಾಧ್ಯ. ಮಾತೃಭಾಷೆ ಮಾತ್ರವೇ ಪ್ರತಿ ವ್ಯಕ್ತಿಗೆ ಮತ್ತು ಅಭಿವ್ಯಕ್ತಿಗೆ ಸಂಪೂರ್ಣ ಸ್ವಾತಂತ್ರ್ಯದ ಹಿತಕೊಡುತ್ತದೆ ಎಂಬುದು ನಮ್ಮ ನಂಬಿಕೆ.'
        : 'We believe roots give wings. Mother tongue and cultural identity empower students with confidence, creative expression, and communal harmony in the modern technological world.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C4151C]" />
          <span className="font-kannada">ಸಂಸ್ಕೃತಿ & ಪರಂಪರೆ • OUR ESSENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1B1B] font-kannada leading-tight">
          {isKannada ? 'ಕನ್ನಡ ಕೂಟದ ಹೆಜ್ಜೆಯಿಡುವ ಬಗೆ' : 'About Kannada Koota PES University'}
        </h2>
        <p className="text-sm sm:text-base text-[#5C403D]">
          {isKannada
            ? 'ಸಂಸ್ಕೃತಿ, ಏಕತೆ ಮತ್ತು ಪರಂಪರೆಯ ಸಂಗಮ — ನಮ್ಮ ವಿದ್ಯಾರ್ಥಿ ಬಳಗ'
            : 'Uniting hearts through literature, performing arts, and technology at PES University.'}
        </p>
      </div>

      {/* Main Grid: Content + Visual Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (7 cols): Information Cards */}
        <div className="lg:col-span-7 space-y-4">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EFEBE4] p-6 elevation-1 hover:elevation-2 transition-all"
            >
              <h3 className="text-xl font-bold font-kannada text-[#9B000E] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F5B000]" />
                {sec.title}
              </h3>
              <p className="text-sm sm:text-base text-[#5C403D] leading-relaxed">
                {sec.text}
              </p>
            </div>
          ))}

          {/* Cultural Quote Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF8E1] to-[#FCF9F8] border-l-4 border-[#F5B000] text-[#7C5800] font-kannada text-base font-bold italic shadow-xs">
            {isKannada
              ? '“ಕನ್ನಡ ಬರೀ ಪ್ರೀತಿ ಅಲ್ಲ, ನಮ್ಮ ಬದುಕಿನ ರೀತಿ!” — ಕನ್ನಡ ಕೂಟ'
              : '"Kannada is not merely a language, it is our way of life!" — Kannada Koota'}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="crimson-gradient text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ (Send a Message to Team)</span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Photo Feature & Quick Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#EFEBE4] shadow-md bg-white">
            <img
              src="/about.png"
              alt="PES Kannada Koota Heritage"
              className="w-full h-72 sm:h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/pes.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xs uppercase font-bold text-[#F5B000] tracking-wider">
                PES UNIVERSITY
              </div>
              <div className="text-lg font-bold font-kannada leading-tight">
                ಯುವ ಶಕ್ತಿ & ಕಲಾ ವೈಭವ
              </div>
              <div className="text-xs text-stone-300">
                Nurturing creative leaders & passionate artists.
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#EFEBE4] elevation-1 text-center space-y-1">
              <div className="text-3xl font-extrabold text-[#9B000E] font-serif">300+</div>
              <div className="text-xs font-semibold text-[#1C1B1B] font-kannada">ಸಕ್ರಿಯ ಸದಸ್ಯರು</div>
              <div className="text-[11px] text-[#5C403D]">Campus Volunteers</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#EFEBE4] elevation-1 text-center space-y-1">
              <div className="text-3xl font-extrabold text-[#7C5800] font-serif">30+</div>
              <div className="text-xs font-semibold text-[#1C1B1B] font-kannada">ಕಾರ್ಯಕ್ರಮಗಳು</div>
              <div className="text-[11px] text-[#5C403D]">Annual Celebrations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EFEBE4] shadow-2xl p-6 max-w-md w-full relative">
            <div className="h-1.5 w-full gold-crimson-bar absolute top-0 left-0 rounded-t-2xl" />
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4] mt-1">
              <h3 className="font-bold text-[#1C1B1B] text-lg font-kannada">
                ತಂಡಕ್ಕೆ ಸಂದೇಶ ಕಳುಹಿಸಿ (Contact Us)
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#5C403D] hover:text-[#1C1B1B] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center space-y-2 text-emerald-700">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <div className="font-bold">ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಂದೇಶ ತಲುಪಿದೆ.</div>
                <div className="text-xs">Your message has been received. We will get back to you!</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1B] mb-1">ನಿಮ್ಮ ಹೆಸರು (Name) *</label>
                  <input
                    type="text"
                    name="from_name"
                    required
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1B] mb-1">ಇಮೇಲ್ (Email) *</label>
                  <input
                    type="email"
                    name="from_email"
                    required
                    placeholder="name@pesu.pes.edu"
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1B] mb-1">ಸಂದೇಶ (Message) *</label>
                  <textarea
                    name="message"
                    required
                    rows="3"
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full crimson-gradient text-white font-semibold py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'ಸಂದೇಶ ಕಳುಹಿಸಿ (Send)'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
