import React, { useState, useEffect } from 'react';
import { BookMarked, ArrowRight, Lightbulb, Check, Copy } from 'lucide-react';

const FALLBACK_WORDS = [
  {
    _id: 'word-aatmeeyate',
    wordKannada: 'ಆತ್ಮೀಯತೆ',
    transliteration: 'Aatmeeyate',
    partOfSpeech: 'ನಾಮಪದ (Noun)',
    meaningEnglish: 'Warm, hospitable kinship; genuine affection from the core of one\'s soul.',
    exampleSentenceKannada: 'ನಮ್ಮ ಕನ್ನಡ ಕೂಟಕ್ಕೆ ಬರುವ ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಆತ್ಮೀಯತೆಯ ಸ್ವಾಗತ.',
    exampleSentenceEnglish: 'A warm, affectionate welcome awaits every student who walks into Kannada Koota.'
  },
  {
    _id: 'word-beragu',
    wordKannada: 'ಬೆರಗು',
    transliteration: 'Beragu',
    partOfSpeech: 'ಭಾವನಾತ್ಮಕ ನಾಮಪದ (Noun)',
    meaningEnglish: 'Wonderment, sublime awe, being spellbound by pure artistic beauty.',
    exampleSentenceKannada: 'ಹಂಪಿಯ ಶಿಲ್ಪಕಲೆಯ ಕೆತ್ತನೆಯನ್ನು ನೋಡಿ ಕಣ್ಣುಗಳಲ್ಲಿ ಬೆರಗು ಮೂಡಿತು.',
    exampleSentenceEnglish: 'Witnessing the intricate stone sculptures of Hampi filled our eyes with spellbinding wonder.'
  },
  {
    _id: 'word-sambhrama',
    wordKannada: 'ಸಂಭ್ರಮ',
    transliteration: 'Sambhrama',
    partOfSpeech: 'ನಾಮಪದ (Noun)',
    meaningEnglish: 'Jubilant festivity, communal excitement, high-spirited celebration.',
    exampleSentenceKannada: 'ಪಿ.ಇ.ಎಸ್ ಆವರಣದಲ್ಲಿ ರಾಜ್ಯೋತ್ಸವದ ರಂಗು ಹಾಗೂ ಸಂಭ್ರಮ ತುಂಬಿ ತುಳುಕುತ್ತಿದೆ.',
    exampleSentenceEnglish: 'The PES campus is overflowing with festive color and jubilant celebration for Rajyotsava.'
  }
];

export default function WordOfTheDayWidget() {
  const [words, setWords] = useState(FALLBACK_WORDS);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        // Fetch all active words
        const res = await fetch(`${API_BASE}/api/wordofday`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const activeList = data.filter((w) => w.isActive !== false);
            if (activeList.length > 0) {
              setWords(activeList);

              // Check if today's specific word exists to set initial index
              try {
                const todayRes = await fetch(`${API_BASE}/api/wordofday/today`);
                if (todayRes.ok) {
                  const todayData = await todayRes.json();
                  const foundIdx = activeList.findIndex((item) => item._id === todayData._id);
                  if (foundIdx !== -1) {
                    setIndex(foundIdx);
                  }
                }
              } catch (_) {
                // Ignore today lookup error, default index 0 is fine
              }
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback words:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [API_BASE]);

  const current = words[index % words.length] || FALLBACK_WORDS[0];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % words.length);
  };

  const copyWord = () => {
    navigator.clipboard?.writeText(
      `${current.wordKannada} (${current.transliteration}): ${current.meaningEnglish}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#EFEBE4] rounded-2xl p-6 elevation-1 flex flex-col justify-between h-full transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFD6D1] border border-[#C4151C]/20 flex items-center justify-center text-[#9B000E]">
            <BookMarked className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B000E]">
              ಇಂದಿನ ಕನ್ನಡ ಪದ
            </span>
            <div className="text-xs text-[#5C403D] font-medium">Word of the Day</div>
          </div>
        </div>

        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 font-semibold">
          {current.partOfSpeech}
        </span>
      </div>

      {/* Main Word Display */}
      <div className="my-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="space-y-0.5">
            <h4 className="text-3xl font-extrabold text-[#1C1B1B] font-kannada tracking-wide">
              {current.wordKannada}
            </h4>
            <div className="text-sm font-semibold text-[#9B000E]">
              [{current.transliteration}]
            </div>
          </div>

          <button
            onClick={copyWord}
            className="p-1.5 rounded-md hover:bg-[#F6F3F2] text-[#5C403D] text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy Word"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* English Meaning */}
        <p className="text-sm text-[#1C1B1B] font-medium bg-[#FCF9F8] p-3 rounded-lg border border-[#EFEBE4] leading-relaxed">
          {current.meaningEnglish}
        </p>

        {/* Contextual Usage */}
        {(current.exampleSentenceKannada || current.exampleSentenceEnglish) && (
          <div className="space-y-1 text-xs text-[#5C403D] pt-1">
            <div className="flex items-center gap-1 font-semibold text-[#9B000E]">
              <Lightbulb className="w-3 h-3" />
              <span>ವಾಕ್ಯ ಪ್ರಯೋಗ (Usage in Context):</span>
            </div>
            {current.exampleSentenceKannada && (
              <p className="font-kannada text-sm text-[#1C1B1B] pl-4 border-l-2 border-[#F5B000]">
                "{current.exampleSentenceKannada}"
              </p>
            )}
            {current.exampleSentenceEnglish && (
              <p className="italic text-[11px] text-[#5C403D] pl-4">
                {current.exampleSentenceEnglish}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-[#EFEBE4] flex items-center justify-between">
        <span className="text-xs text-[#5C403D]">
          Word {(index % words.length) + 1} of {words.length}
        </span>

        <button
          onClick={handleNext}
          className="text-xs font-semibold text-[#9B000E] hover:text-[#7C5800] flex items-center gap-1 cursor-pointer"
        >
          <span>ಇನ್ನೊಂದು ಪದ (Next Word)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
