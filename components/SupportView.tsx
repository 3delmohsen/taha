import React, { useState } from 'react';
import { ArrowRight, MessageSquare, ChevronDown, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

const SupportView: React.FC<Props> = ({ goBack }) => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    { id: 0, q: t('faq1_q'), a: t('faq1_a') },
    { id: 1, q: t('faq2_q'), a: t('faq2_a') },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    // Simulate API call
    setTimeout(() => {
        setSent(true);
        setMessage('');
        setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white p-4 pt-8 shadow-sm border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button onClick={goBack} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 rtl:rotate-180">
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-bold text-slate-800">{t('support')}</h1>
            </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto no-scrollbar">
            
            {/* FAQ Section */}
            <div>
                <h2 className="text-lg font-bold text-emerald-800 mb-3 px-1">{t('faq')}</h2>
                <div className="space-y-3">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-4 text-start hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-700 text-sm">{faq.q}</span>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-40 opacity-100 border-t border-slate-50' : 'max-h-0 opacity-0'}`}>
                                <p className="p-4 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form */}
            <div>
                <h2 className="text-lg font-bold text-emerald-800 mb-3 px-1">{t('contactUs')}</h2>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    {sent ? (
                        <div className="flex flex-col items-center justify-center py-8 text-emerald-600 animate-fade-in">
                            <CheckCircle2 size={48} className="mb-2" />
                            <span className="font-bold">{t('msgSent')}</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">{t('name')}</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">{t('message')}</label>
                                <textarea 
                                    rows={4} 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                                ></textarea>
                            </div>
                            <button 
                                onClick={handleSend}
                                disabled={!message.trim()}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} className="rtl:-rotate-90" />
                                {t('sendMessage')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};

export default SupportView;