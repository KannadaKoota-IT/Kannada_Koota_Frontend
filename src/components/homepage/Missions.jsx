import React from 'react';
import { Target, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Missions() {
  const { isKannada } = useLanguage();

  const sections = [
    {
      icon: <Target className="w-5 h-5 text-[#9B000E]" />,
      tag: 'VISION',
      title: isKannada ? 'ನಮ್ಮ ಧ್ಯೇಯ' : 'Our Vision',
      content: isKannada ? [
        'ಮನಸ್ಸುಗಳ ನಡುವೆ ಭಾವಪರಾಗವನ್ನು ರವಾನಿಸುವ ದುಂಬಿ ಭಾಷೆ. ದುಂಬಿ ಸಂಪಾದಿಸಿಹ ಜೇನು ಕನ್ನಡ! ಆ ಜೇನ ಹೀರುವ ರಸಿಕರು ನಾವುಗಳು!',
        'ಕನ್ನಡದ ಪರವಾಗಬೇಕು, ಕನ್ನಡದ ಕಾಯಕಕ್ಕೆ ಕೈ ಜೋಡಿಸುವ ಕರವಾಗಬೇಕು, ಮಾತೆಯ ಕೊರಳಲ್ಲಿನ ಸರವಾಗಬೇಕು, ಕನ್ನಡದ ಉದ್ಯಾನದಲ್ಲೊಂದು ಮರವಾಗಬೇಕು ಎಂಬುದೇ ನಮ್ಮ ಆಶಯ!',
      ] : [
        'To create a vibrant, inclusive collegiate space that celebrates Karnataka’s living heritage. Through arts, language, and community, we inspire students to embrace and celebrate their cultural roots.',
        'We strive to keep traditions alive, nurture self-expression, and inspire pride in where we come from.',
      ],
    },
    {
      icon: <Compass className="w-5 h-5 text-[#7C5800]" />,
      tag: 'PATHWAY',
      title: isKannada ? 'ನಮ್ಮ ದಾರಿ' : 'Our Path',
      content: isKannada ? [
        'ಕರ್ನಾಟಕದ ಹಾಡು-ಕುಣಿತ, ಭವ್ಯತೆ-ನವ್ಯತೆ, ಪ್ರಕೃತಿ-ಸಂಸ್ಕೃತಿ, ಸಂಪದ-ಜಾನಪದ, ಉಡುಗೆ-ತೊಡುಗೆ, ಊಟ-ಉಪಚಾರ, ಹಬ್ಬ-ಹರಿದಿನ, ವ್ಯವಹಾರ-ಆಚರಣೆ, ರೀತಿ-ನೀತಿ‌-ಪ್ರೀತಿ ಹೀಗೆ ಹತ್ತು ಹಲವಾರು ಧಾತುಗಳ ನಡುವಿನ ಸೇತುವಾಗಿ ನಿಲ್ಲುವುದೇ ನಮ್ಮ ನಿಲುವು. ಇವೆಲ್ಲವನ್ನು ಸ್ವಾಗತಿಸುವ ಮತ್ತು ಸಂಭ್ರಮಿಸುವ ಸಾಂಸ್ಕೃತಿಕ ಹಾಗೂ ತಾಂತ್ರಿಕ ಕಾರ್ಯಕ್ರಮಗಳ ಮುಖಾಂತರ ನಮ್ಮತನದ ಭಾವನೆಯನ್ನು ಉದ್ದೀಪಿಸುವ ಕೆಲಸ ನಮ್ಮದು.',
      ] : [
        'We bridge classical tradition with modern student life. From festive Rajyotsava rallies and traditional cuisine to contemporary techno-cultural competitions, we cultivate unity and identity.',
      ],
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#9B000E]" />,
      tag: 'BELIEF',
      title: isKannada ? 'ನಮ್ಮ ನಂಬಿಕೆ' : 'Our Belief',
      content: isKannada ? [
        'ಭಾಷೆ ಎಂಬುದು ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಗಾಜಿನ ಹಿಂದಿಟ್ಟು ಸಂರಕ್ಷಿಸುವ ಗ್ರಂಥ ಎನ್ನುವುದಕ್ಕಿಂತ ಅದರ ಪ್ರತಿ ಶಬ್ದವೂ ನಮ್ಮ ಸ್ವಂತ ಎನ್ನುವುದು ನಮ್ಮ ನಂಬಿಕೆ.',
        'ನಮ್ಮ ಪಾಲಿಗೆ ಇದು ಬರೀ ಭಾಷೆಯಲ್ಲ, ನಮ್ಮ ನಾಲಿಗೆಯ ತುಡಿತ, ಎದೆಯ ಬಡಿತ, ಮನಸ್ಸಿನ ಮಿಡಿತ!',
      ] : [
        'Language and culture are not museum exhibits locked behind glass — they are living, breathing facets of our daily collegiate life, camaraderie, and creative ambition.',
      ],
    },
  ];

  return (
    <section className="py-12">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <span className="text-xs uppercase font-bold tracking-wider text-[#9B000E]">
          ಧ್ಯೇಯ & ನಿಲುವು • CORE VALUES
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1B1B] font-kannada">
          {isKannada ? 'ನಮ್ಮ ಧ್ಯೇಯ, ದಾರಿ ಮತ್ತು ನಂಬಿಕೆ' : 'Vision, Mission & Guiding Principles'}
        </h2>
        <p className="text-xs sm:text-sm text-[#5C403D]">
          The timeless values that inspire every festival, stage show, and workshop at PES University.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#EFEBE4] p-6 elevation-1 hover:elevation-2 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] border border-[#F5B000]/40 flex items-center justify-center">
                  {sec.icon}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FCF9F8] border border-[#EFEBE4] text-[#5C403D]">
                  {sec.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1C1B1B] font-kannada mt-4 mb-3">
                {sec.title}
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm text-[#5C403D] leading-relaxed">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#EFEBE4]">
              <div className="h-1 w-12 rounded-full gold-crimson-bar" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
