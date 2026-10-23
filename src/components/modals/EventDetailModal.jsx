import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, ExternalLink, CheckCircle2, Ticket, Share2, Check } from 'lucide-react';
import { getMediaUrl, handleImageError, DEFAULT_EVENT_IMAGE } from '../../utils/mediaUtils';

export default function EventDetailModal({ event, onClose }) {
  const [copied, setCopied] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [name, setName] = useState('');
  const [srn, setSrn] = useState('');

  if (!event) return null;

  const handleRsvp = (e) => {
    e.preventDefault();
    if (!name || !srn) return;
    setRsvpDone(true);
  };

  const handleShare = () => {
    const text = `${event.title} - Kannada Koota PES University\nDate: ${event.date} at ${event.time || event.eventTime || ''}\nVenue: ${event.location || event.venue || 'PES Campus'}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const eventDateObj = new Date(event.date);
  const formattedMonth = !isNaN(eventDateObj) ? eventDateObj.toLocaleDateString('en-US', { month: 'short' }) : 'NOV';
  const formattedDay = !isNaN(eventDateObj) ? eventDateObj.toLocaleDateString('en-US', { day: 'numeric' }) : '01';
  const displayDate = !isNaN(eventDateObj) ? eventDateObj.toLocaleDateString('en-US', { dateStyle: 'long' }) : event.date;

  return (
    /* Full-screen fixed overlay — clicking the dark area closes the modal */
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Scrollable card wrapper — py-10 so there's breathing room above/below */}
      <div className="relative w-full max-w-2xl mx-4 my-10">

        {/* ── Close button – fixed to the top-right corner of the viewport ── */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-white text-[#1C1B1B] shadow-xl flex items-center justify-center hover:bg-[#EFEBE4] transition-all cursor-pointer"
          aria-label="Close event detail"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-2xl border border-[#EFEBE4] overflow-hidden">

          {/* Top 2px highlight */}
          <div className="h-1.5 w-full gold-crimson-bar" />

          {/* Header Media — capped at 40vh so it never dominates */}
          <div className="relative w-full bg-[#141313] flex items-center justify-center overflow-hidden" style={{ maxHeight: '40vh', minHeight: '180px' }}>
            {event.imageUrl || event.image ? (
              <>
                {/* Blurred atmospheric background */}
                <img
                  src={getMediaUrl(event.imageUrl || event.image, DEFAULT_EVENT_IMAGE)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110"
                />
                {/* Full uncropped poster */}
                <img
                  src={getMediaUrl(event.imageUrl || event.image, DEFAULT_EVENT_IMAGE)}
                  alt={event.title}
                  onError={(e) => handleImageError(e, DEFAULT_EVENT_IMAGE)}
                  className="relative z-10 max-w-full w-auto object-contain mx-auto shadow-lg"
                  style={{ maxHeight: '40vh' }}
                />
              </>
            ) : (
              <div className="w-full h-48 crimson-gradient flex items-center justify-center text-white">
                <Calendar className="w-16 h-16 opacity-30" />
              </div>
            )}

            {/* Floating Date Pill */}
            <div className="absolute top-3 left-3 z-20 bg-[#F5B000] text-[#1A1A1A] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 font-bold border border-[#E0A200]">
              <span className="text-[10px] uppercase">{formattedMonth}</span>
              <span className="text-lg font-extrabold">{formattedDay}</span>
            </div>
          </div>

          {/* Title */}
          <div className="px-6 sm:px-8 pt-5 pb-3 bg-white border-b border-[#EFEBE4]">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C4151C] text-white uppercase tracking-wider mb-2 inline-block">
              ಕಾರ್ಯಕ್ರಮ ವಿವರ • Event Spotlight
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1B1B] font-kannada leading-snug">
              {event.title || event.title_k || 'Event Details'}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Metadata quick strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FCF9F8] rounded-xl border border-[#EFEBE4] text-xs sm:text-sm text-[#1C1B1B]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#9B000E] shrink-0" />
                <div>
                  <div className="font-semibold">{displayDate}</div>
                  {(event.time || event.eventTime) && (
                    <div className="text-[11px] text-[#5C403D] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {event.time || event.eventTime}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#9B000E] shrink-0" />
                <div>
                  <div className="font-semibold font-kannada">{event.location || event.venue || 'PES University Campus'}</div>
                  <div className="text-[11px] text-[#5C403D]">Campus Venue</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B000E]">
                ಕಾರ್ಯಕ್ರಮದ ಕುರಿತು (About the Event)
              </h4>
              <p className="text-sm text-[#5C403D] leading-relaxed whitespace-pre-line">
                {event.description || event.description_k || 'No description provided.'}
              </p>
            </div>

            {/* Registration / RSVP */}
            <div className="pt-2 border-t border-[#EFEBE4] space-y-4">
              {event.link ? (
                <div className="p-4 bg-[#FFF8E1] rounded-xl border border-[#F5B000]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#7C5800] space-y-0.5 text-center sm:text-left">
                    <div className="font-bold font-kannada text-sm">ಅಧಿಕೃತ ನೋಂದಣಿ ಲಿಂಕ್ ಲಭ್ಯವಿದೆ</div>
                    <div>Official registration or form link is active for this event.</div>
                  </div>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crimson-gradient hover:opacity-95 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <span>ನೋಂದಾಯಿಸಿ (Register)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : rsvpDone ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                  <div className="font-bold text-sm">RSVP Confirmed!</div>
                  <div className="text-xs text-emerald-700">Thank you, {name}. See you at {event.title}!</div>
                </div>
              ) : (
                <form onSubmit={handleRsvp} className="p-4 bg-[#FCF9F8] rounded-xl border border-[#EFEBE4] space-y-3">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#9B000E]" />
                    <span className="text-xs font-bold text-[#1C1B1B]">Quick Campus RSVP</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#EFEBE4] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="SRN / Student ID"
                      value={srn}
                      onChange={(e) => setSrn(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#EFEBE4] bg-white text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full crimson-gradient hover:opacity-95 text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs cursor-pointer active:scale-98"
                  >
                    Confirm RSVP
                  </button>
                </form>
              )}
            </div>

            {/* Footer Share */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#5C403D]">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-[#9B000E] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Event Copied!' : 'Share Event'}</span>
              </button>
              <span className="text-[11px] text-[#916F6B]">ಕನ್ನಡ ಕೂಟ • PES University</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
