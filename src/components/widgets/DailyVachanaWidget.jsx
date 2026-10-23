import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
  Check,
} from "lucide-react";

const FALLBACK_VACHANAS = [
  {
    _id: "vachana-basavanna",
    titleKannada: "ಕಳಬೇಡ, ಕೊಲಬೇಡ",
    titleEnglish: "Do Not Steal, Do Not Kill",
    authorKannada: "ಬಸವಣ್ಣ (Basavanna)",
    authorEnglish: "Basavanna (12th Century Mystic & Social Reformer)",
    originalVerses: [
      "ಕಳಬೇಡ, ಕೊಲಬೇಡ, ಹುಸಿಯ ನುಡಿಯಲು ಬೇಡ,",
      "ಮುನಿಯಬೇಡ, ಅನ್ಯರಿಗೆ ಅಸಹ್ಯಪಡಬೇಡ,",
      "ತನ್ನ ಬಣ್ಣಿಸಬೇಡ, ಇದಿರ ಹಳಿಯಲು ಬೇಡ.",
      "ಇದೇ ಅಂತರಂಗಶುದ್ಧಿ, ಇದೇ ಬಹಿರಂಗಶುದ್ಧಿ,",
      "ಇದೇ ನಮ್ಮ ಕೂಡಲಸಂಗಮದೇವರನೊಲಿಸುವ ಪರಿ.",
    ],
    englishTranslation: [
      "Do not steal, do not kill, do not utter lies,",
      "Do not lose temper, do not harbor revulsion towards others,",
      "Do not boast of yourself, do not demean those before you.",
      "This alone is inner purity, this alone is outer purity,",
      "This is the only path that pleases our Lord Kudalasangama.",
    ],
  },
  {
    _id: "akka-mahadevi-vachana",
    titleKannada: "ಬೆಟ್ಟದ ಮೇಲೊಂದು ಮನೆಯ ಮಾಡಿ",
    titleEnglish: "Having Built a Home Upon the Hill",
    authorKannada: "ಅಕ್ಕಮಹಾದೇವಿ (Akka Mahadevi)",
    authorEnglish: "Akka Mahadevi (12th Century Rebel Mystic)",
    originalVerses: [
      "ಬೆಟ್ಟದ ಮೇಲೊಂದು ಮನೆಯ ಮಾಡಿ ಮೃಗಂಗಳಿಗಂಜಿದಡೆಂತಯ್ಯಾ?",
      "ಸಮುದ್ರದ ತಡಿಯಲೊಂದು ಮನೆಯ ಮಾಡಿ ನೊರೆ ತೆರೆಗಳಿಗಂಜಿದಡೆಂತಯ್ಯಾ?",
      "ಸಂತೆಯೊಳಗೊಂದು ಮನೆಯ ಮಾಡಿ ಶಬ್ದಕ್ಕಂಜಿದಡೆಂತಯ್ಯಾ?",
      "ಚೆನ್ನಮಲ್ಲಿಕಾರ್ಜುನದೇವ ಕೇಳಯ್ಯಾ,",
      "ಲೋಕದೊಳಗೆ ಹುಟ್ಟಿದ ಬಳಿಕ ಸ್ತುತಿ ನಿಂದೆಗಳು ಬಂದಡೆ ಮನದಲ್ಲಿ ಕೋಪವ ತಾಳದೆ ಸಮಾಧಾನಿಯಾಗಿರಬೇಕು.",
    ],
    englishTranslation: [
      "Having built a home atop the mountain, how can one fear wild beasts?",
      "Having built a house upon the ocean shore, how can one fear crashing waves?",
      "Having built a dwelling in the midst of a bazaar, how can one fear noise?",
      "Listen, O Lord Chennamallikarjuna,",
      "Once born into this world, when praise or slander arrives, one must banish anger and remain serene.",
    ],
  },
  {
    _id: "kuvempu-anthem",
    titleKannada: "ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ",
    titleEnglish: "Victory to Mother Karnataka",
    authorKannada: "ಕುವೆಂಪು (Rashtrakavi Kuvempu)",
    authorEnglish: "Rashtrakavi Kuvempu (K.V. Puttappa)",
    originalVerses: [
      "ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ,",
      "ಜಯ ಹೇ ಕರ್ನಾಟಕ ಮಾತೆ!",
      "ಜಯ ಸುಂದರ ನದಿ ವನಗಳ ನಾಡೇ,",
      "ಜಯ ಹೇ ರಸಋಷಿಗಳ ಬೀಡೇ!",
      "ಸರ್ವ ಜನಾಂಗದ ಶಾಂತಿಯ ತೋಟ,",
      "ರಸಿಕರ ಕಂಗಳ ಸೆಳೆಯುವ ನೋಟ!",
    ],
    englishTranslation: [
      "Victory to thee, revered daughter of Mother India,",
      "Victory to thee, O Mother Karnataka!",
      "Land of glistening rivers and sacred emerald forests,",
      "Sanctuary of poets, mystics, and enlightened seers!",
      "A peaceful garden sheltering people of every heritage and creed!",
    ],
  },
];

export default function DailyVachanaWidget() {
  const [vachanas, setVachanas] = useState(FALLBACK_VACHANAS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchVachanas = async () => {
      try {
        setLoading(true);
        // Fetch all active vachanas
        const res = await fetch(`${API_BASE}/api/vachanas`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const activeList = data.filter((v) => v.isActive !== false);
            if (activeList.length > 0) {
              setVachanas(activeList);

              // Check if today's specific vachana exists to set initial index
              try {
                const todayRes = await fetch(`${API_BASE}/api/vachanas/today`);
                if (todayRes.ok) {
                  const todayData = await todayRes.json();
                  const foundIdx = activeList.findIndex(
                    (item) => item._id === todayData._id,
                  );
                  if (foundIdx !== -1) {
                    setCurrentIndex(foundIdx);
                  }
                }
              } catch (_) {
                // Ignore today lookup error, default index 0 is fine
              }
            }
          }
        }
      } catch (err) {
        // Silently fallback to FALLBACK_VACHANAS
        console.warn("Using fallback vachanas:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVachanas();
  }, [API_BASE]);

  const currentWork =
    vachanas[currentIndex % vachanas.length] || FALLBACK_VACHANAS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vachanas.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? vachanas.length - 1 : prev - 1));
  };

  const copyToClipboard = () => {
    const verses = Array.isArray(currentWork.originalVerses)
      ? currentWork.originalVerses.join("\n")
      : currentWork.originalVerses;
    const text = `${currentWork.titleKannada}\n- ${currentWork.authorKannada}\n\n${verses}\n\nಕನ್ನಡ ಕೂಟ • PES University`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const versesList = Array.isArray(currentWork.originalVerses)
    ? currentWork.originalVerses
    : typeof currentWork.originalVerses === "string"
      ? currentWork.originalVerses.split("\n")
      : [];

  const translationList = Array.isArray(currentWork.englishTranslation)
    ? currentWork.englishTranslation
    : typeof currentWork.englishTranslation === "string"
      ? currentWork.englishTranslation.split("\n")
      : [];

  return (
    <div className="bg-white border border-[#EFEBE4] rounded-2xl p-6 elevation-1 relative overflow-hidden transition-all flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF8E1] border border-[#F5B000]/40 flex items-center justify-center text-[#7C5800]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
                ದಿನದ ವಚನ & ದರ್ಶನ
              </span>
              <span className="text-[10px] bg-[#F6F3F2] px-1.5 py-0.5 rounded text-[#5C403D]">
                Daily Wisdom
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[#1C1B1B] font-kannada">
              {currentWork.authorKannada}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-lg text-[#5C403D] hover:bg-[#F6F3F2] hover:text-[#1C1B1B] transition-colors cursor-pointer"
            title="Copy Vachana"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-[#5C403D] hover:bg-[#F6F3F2] transition-colors cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-[#5C403D] hover:bg-[#F6F3F2] transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Verses Display */}
      <div className="my-5 space-y-4">
        <h4 className="text-xl font-bold text-[#1C1B1B] font-kannada">
          "{currentWork.titleKannada}"
        </h4>

        {/* Verses */}
        <div className="bg-[#FCF9F8] p-4 rounded-xl border border-[#EFEBE4] space-y-1.5 font-kannada text-base sm:text-lg text-[#1C1B1B] leading-relaxed">
          {versesList.map((verse, idx) => (
            <p key={idx} className="tracking-wide">
              {verse}
            </p>
          ))}
        </div>

        {/* English Translation */}
        {showEnglish && translationList.length > 0 && (
          <div className="space-y-1 text-xs sm:text-sm text-[#5C403D] italic bg-[#F6F3F2]/60 p-3 rounded-lg border border-[#EFEBE4]">
            <div className="font-medium not-italic text-[11px] uppercase tracking-wider text-[#916F6B] mb-1">
              Poetic Meaning ({currentWork.titleEnglish})
            </div>
            {translationList.map((verse, idx) => (
              <p key={idx}>{verse}</p>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-[#EFEBE4] flex items-center justify-between">
        <span className="text-xs text-[#5C403D]">
          {currentIndex + 1} of {vachanas.length}
        </span>

        <button
          onClick={() => setShowEnglish(!showEnglish)}
          className="text-xs font-semibold text-[#7C5800] hover:text-[#9B000E] underline cursor-pointer"
        >
          {showEnglish ? "Hide English" : "Show English"}
        </button>
      </div>
    </div>
  );
}
