import { useState } from "react";
import { CozyBadge } from "../../components/common/UIComponents";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { CozyCatLogo } from "../../components/illustrations/CozyIllustrations";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
export const ContactPage = () => {
  const { addToast } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [openFaq, setOpenFaq] = useState("f-1");
  const faqs = apiService.getFAQs();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast("Missing fields", "Please fill in all contact form fields", "warning");
      return;
    }
    addToast("Message Sent!", "Thank you for reaching out. We will respond within 24 hours.", "success");
    setFormData({ name: "", email: "", message: "" });
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {
    /* Page Header */
  }
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <CozyBadge variant="autumn">Get In Touch</CozyBadge>
        <h1 className="font-serif text-4xl font-bold text-[#3B281C]">Contact Us</h1>
        <p className="text-sm text-[#705D52]">We'd love to hear from you! Reach out for support or feedback.</p>
      </div>

      {
    /* Main Grid: Form + Info matching reference image */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Left Info & Illustration */
  }
        <div className="lg:col-span-5 space-y-6">
          <div className="cozy-card p-6 space-y-5">
            <h3 className="font-serif text-xl font-bold text-[#3B281C]">Reach Out Directly</h3>
            <div className="space-y-4 text-xs text-[#5C3D2E]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#3B281C]">Email Support</div>
                  <a href="mailto:support@mindbloom.com" className="text-[#8C7667] hover:underline">support@mindbloom.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF2E6] text-[#D4A373] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#3B281C]">Helpline</div>
                  <span className="text-[#8C7667]">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#4F5D3D] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#3B281C]">Location</div>
                  <span className="text-[#8C7667]">Bhubaneswar, Odisha, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center p-4">
            <CozyCatLogo className="w-36 h-36" />
          </div>
        </div>

        {
    /* Right Form matching reference image */
  }
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="cozy-card p-8 space-y-5">
            <h3 className="font-serif text-xl font-bold text-[#3B281C]">Send Us a Message</h3>

            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">Your Name</label>
              <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="Enter your full name"
    className="cozy-input w-full text-xs"
  />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">Your Email</label>
              <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="you@example.com"
    className="cozy-input w-full text-xs"
  />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">Your Message</label>
              <textarea
    rows={4}
    value={formData.message}
    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
    placeholder="Tell us what is on your mind..."
    className="cozy-input w-full text-xs"
  />
            </div>

            <button type="submit" className="cozy-btn-primary w-full text-xs py-3 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {
    /* FAQs Section */
  }
      <div className="space-y-6 pt-8 border-t border-[#E6DCCD]">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#3B281C]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#705D52]">Find quick answers to common questions about MindBloom.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => <div key={faq.id} className="cozy-card p-4 transition">
              <button
    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
    className="w-full flex items-center justify-between text-left font-serif font-bold text-sm text-[#3B281C]"
  >
                <span>{faq.question}</span>
                <span className="text-[#8B5E3C] font-mono text-base">{openFaq === faq.id ? "\u2212" : "+"}</span>
              </button>
              {openFaq === faq.id && <p className="text-xs text-[#705D52] mt-3 pt-3 border-t border-[#EFE6DC] leading-relaxed">
                  {faq.answer}
                </p>}
            </div>)}
        </div>
      </div>
    </div>;
};
