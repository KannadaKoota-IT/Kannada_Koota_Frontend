import React, { useState } from 'react';
import { X, Award, CheckCircle2, QrCode, Sparkles, Copy, Check } from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';

export default function MembershipModal() {
  const { isMembershipOpen, closeMembership, handleMemberRegistered } = useMembership();
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    fullName: '',
    kannadaName: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    year: '2nd Year',
    email: '',
    interests: ['ಸಾಹಿತ್ಯ & ಚರ್ಚೆ (Literature & Debate)'],
  });
  const [generatedMember, setGeneratedMember] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isMembershipOpen) return null;

  const interestOptions = [
    'ಸಾಹಿತ್ಯ & ಚರ್ಚೆ (Literature & Debate)',
    'ರಂಗಭೂಮಿ & ಅಭಿನಯ (Theatre & Drama)',
    'ಶಾಸ್ತ್ರೀಯ & ಜಾನಪದ ಸಂಗೀತ (Music)',
    'ಜಾನಪದ ನೃತ್ಯ (Folk Dance & Yakshagana)',
    'ಛಾಯಾಗ್ರಹಣ & ಮಾಧ್ಯಮ (Media & Tech)',
    'ಕಾರ್ಯಕ್ರಮ ಸಂಯೋಜನೆ (Event Organizing)',
  ];

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.studentId || !formData.email) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newMember = {
      id: `KK-${randomNum}`,
      fullName: formData.fullName,
      kannadaName: formData.kannadaName || formData.fullName,
      studentId: formData.studentId.toUpperCase(),
      department: formData.department,
      year: formData.year,
      email: formData.email,
      interests: formData.interests,
      joinDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      membershipNumber: `KK-PESU-${randomNum}`,
    };

    setGeneratedMember(newMember);
    handleMemberRegistered();
    setStep('card');
  };

  const copyCardDetails = () => {
    if (!generatedMember) return;
    navigator.clipboard?.writeText(
      `Kannada Koota Member ID: ${generatedMember.membershipNumber} | Name: ${generatedMember.fullName} (${generatedMember.department})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAndClose = () => {
    setStep('form');
    closeMembership();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EFEBE4] overflow-hidden my-6">
        
        {/* Top 2px highlight */}
        <div className="h-1.5 w-full gold-crimson-bar" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#F6F3F2] hover:bg-[#EAE7E7] text-[#1C1B1B] flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'form' ? (
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF8E1] text-[#7C5800] border border-[#F5B000]/40 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#C4151C]" />
                <span className="font-kannada">ಸದಸ್ಯತ್ವ ನೋಂದಣಿ 2026</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1C1B1B] font-kannada">
                ಕನ್ನಡ ಕೂಟಕ್ಕೆ ಪ್ರವೇಶ ಪಡೆಯಿರಿ
              </h3>
              <p className="text-xs sm:text-sm text-[#5C403D]">
                Join PES University's premier cultural club for theatre auditions, festivals, debates, and leadership opportunities.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1B1B]">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharath Rao"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1B1B] font-kannada">ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ)</label>
                  <input
                    type="text"
                    placeholder="ಉದಾ: ಶರತ್ ರಾವ್"
                    value={formData.kannadaName}
                    onChange={(e) => setFormData({ ...formData, kannadaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1B1B]">Student ID / SRN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PES1UG24CS001"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] uppercase focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1B1B]">College Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@pesu.pes.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1B1B]">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Department of Law">Department of Law</option>
                    <option value="Design & Architecture">Design & Architecture</option>
                    <option value="Management Studies (BBA/MBA)">Management Studies (BBA/MBA)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1B1B]">Academic Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] focus:outline-none focus:ring-2 focus:ring-[#9B000E]"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                  </select>
                </div>
              </div>

              {/* Cultural Interests */}
              <div className="space-y-2 pt-2">
                <label className="font-semibold text-[#1C1B1B] block">
                  ಆಸಕ್ತಿಯ ಕ್ಷೇತ್ರಗಳು (Areas of Cultural Interest)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`text-left p-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        formData.interests.includes(interest)
                          ? 'border-[#9B000E] bg-[#FFF8E1] text-[#7C5800] font-semibold'
                          : 'border-[#EFEBE4] bg-[#FCF9F8] text-[#5C403D] hover:bg-[#F6F3F2]'
                      }`}
                    >
                      <span>{interest}</span>
                      {formData.interests.includes(interest) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9B000E] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full crimson-gradient hover:opacity-95 text-white font-semibold py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Award className="w-4 h-4 text-[#FFD6D2]" />
                  <span className="font-kannada text-base">ಸದಸ್ಯತ್ವ ಕಾರ್ಡ್ ರಚಿಸಿ</span>
                  <span className="text-xs text-white/80 font-normal">/ Generate Digital Pass</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-kannada text-[#1C1B1B]">
                ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಸದಸ್ಯತ್ವ ಸಿದ್ಧವಾಗಿದೆ
              </h3>
              <p className="text-xs sm:text-sm text-[#5C403D]">
                Welcome to Kannada Koota family. Here is your official collegiate cultural pass.
              </p>
            </div>

            {/* Official Digital ID Card */}
            {generatedMember && (
              <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#2A1517] to-[#1A1A1A] text-white rounded-2xl p-6 shadow-xl border-2 border-[#F5B000]/60 text-left overflow-hidden">
                {/* Top ribbon on card */}
                <div className="h-1.5 w-full gold-crimson-bar absolute top-0 left-0" />

                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#F5B000] relative flex items-center justify-center">
                      <div className="absolute inset-0 grid grid-rows-2">
                        <div className="bg-[#F5B000]" />
                        <div className="bg-[#C4151C]" />
                      </div>
                      <span className="relative z-10 font-bold text-[#8A0E14] text-sm bg-white/90 w-6 h-6 rounded flex items-center justify-center">
                        ಕೃ
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm font-kannada leading-tight text-[#F5B000]">
                        ಕನ್ನಡ ಕೂಟ • PES University
                      </div>
                      <div className="text-[10px] text-stone-300">Collegiate Cultural Society</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-stone-400">ID PASS</div>
                    <div className="font-mono text-xs font-bold text-[#F5B000]">
                      {generatedMember.membershipNumber}
                    </div>
                  </div>
                </div>

                {/* Member Body */}
                <div className="py-4 grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2 space-y-2">
                    <div>
                      <div className="text-lg font-bold font-kannada leading-tight text-white">
                        {generatedMember.kannadaName}
                      </div>
                      <div className="text-sm font-medium text-stone-300">
                        {generatedMember.fullName}
                      </div>
                    </div>

                    <div className="text-xs text-stone-400 space-y-0.5">
                      <div><span className="text-stone-300 font-semibold">SRN:</span> {generatedMember.studentId}</div>
                      <div><span className="text-stone-300 font-semibold">Dept:</span> {generatedMember.department}</div>
                      <div><span className="text-stone-300 font-semibold">Year:</span> {generatedMember.year}</div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl text-[#1A1A1A] shadow-inner">
                    <QrCode className="w-16 h-16" />
                    <span className="text-[9px] font-mono mt-1 text-center font-bold">VERIFIED</span>
                  </div>
                </div>

                {/* Footer on Card */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400">
                  <span>Issued: {generatedMember.joinDate}</span>
                  <span className="text-[#F5B000] font-semibold">"ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={copyCardDetails}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#EFEBE4] bg-[#FCF9F8] hover:bg-[#F6F3F2] text-xs font-semibold text-[#1C1B1B] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Details' : 'Copy Member Details'}</span>
              </button>
              <button
                onClick={resetAndClose}
                className="flex-1 crimson-gradient text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs cursor-pointer hover:opacity-95"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
