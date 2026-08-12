import { Link } from "react-router-dom";
import { CozyBadge } from "../../components/common/UIComponents";
import { MapleLeafIcon } from "../../components/illustrations/CozyIllustrations";
import { FileText, AlertTriangle, ShieldCheck, Heart, User, Sparkles, Scale, Ban, Mail } from "lucide-react";

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <CozyBadge variant="autumn">Legal Agreement</CozyBadge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
          Welcome to MindBloom. Please read these Terms of Service carefully before using our emotional wellness application and companion services.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE6] dark:bg-[#2C221B] border border-[#E8DDD0] dark:border-[#3D2E24] text-[11px] font-semibold text-[#8B5E3C] dark:text-[#E29578]">
          <span>Last Updated: August 2026</span>
        </div>
      </div>

      {/* Critical Medical Disclaimer Banner */}
      <div className="cozy-card p-6 border-l-4 border-l-[#E07A5F] bg-[#FDF0ED] dark:bg-[#322019] space-y-3">
        <div className="flex items-center gap-2.5 text-[#A83D24] dark:text-[#FF9E80]">
          <AlertTriangle className="w-5 h-5 shrink-0 text-[#E07A5F]" />
          <h3 className="font-serif font-bold text-base">Important AI Wellness & Medical Disclaimer</h3>
        </div>
        <p className="text-xs text-[#705D52] dark:text-[#E5C9BF] leading-relaxed">
          <strong>BloomBot is an AI-powered emotional wellness companion and is NOT a licensed therapist, psychologist, psychiatrist, or medical professional.</strong> MindBloom does not provide clinical diagnosis, medical treatment, or crisis intervention services. If you are experiencing severe emotional distress, thoughts of self-harm, or a medical emergency, please seek immediate help from a healthcare professional or contact emergency crisis hotlines.
        </p>
      </div>

      {/* Terms Content Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">

        {/* 1. Acceptance of Terms */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Acceptance of Terms</h2>
          </div>
          <p>
            By creating an account, accessing, or using the MindBloom website, application, or associated services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue using MindBloom immediately.
          </p>
        </section>

        {/* 2. Purpose of MindBloom */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Purpose of MindBloom</h2>
          </div>
          <p>
            MindBloom is an AI-powered emotional wellness web application designed to support daily self-care, personal reflection, mindfulness, and emotional tracking. Features include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>BloomBot AI Companion:</strong> An interactive conversational AI assistant for gentle support and self-reflection.</li>
            <li><strong>Guided Journaling:</strong> Structured writing prompts to process feelings and record life events.</li>
            <li><strong>Mood & Emotion Tracker:</strong> Visual tools to track emotional states over time.</li>
            <li><strong>Daily Reflection & Gratitude:</strong> Check-in tools for cultivating gratitude and positive self-talk.</li>
            <li><strong>Inspire & Resources:</strong> Curated affirmations, quotes, articles, and breathing exercises.</li>
          </ul>
        </section>

        {/* 3. User Responsibilities */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">User Responsibilities</h2>
          </div>
          <p>As a MindBloom user, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate, current registration details during sign-up.</li>
            <li>Safeguard your account credentials and maintain password confidentiality.</li>
            <li>Ensure you are at least 13 years old (or the applicable minimum legal age in your jurisdiction) to use the platform.</li>
            <li>Promptly notify MindBloom support if you suspect any unauthorized account activity.</li>
          </ul>
        </section>

        {/* 4. Appropriate Use */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Appropriate Use</h2>
          </div>
          <p>You agree to use MindBloom solely for personal, non-commercial wellness purposes. You are strictly prohibited from:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Engaging in illegal activities, harassment, or distributing harmful software.</li>
            <li>Attempting to compromise system security, reverse-engineer API endpoints, or bypass authentication controls.</li>
            <li>Submitting automated spam or manipulating AI response mechanisms maliciously.</li>
          </ul>
        </section>

        {/* 5. AI Disclaimer */}
        <section className="cozy-card p-6 sm:p-8 space-y-4 bg-[#FAF6F0] dark:bg-[#2A201A] border-l-4 border-l-[#E07A5F]">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
              5
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">AI Disclaimer</h2>
          </div>
          <p className="font-medium text-[#3B281C] dark:text-[#FFFBF7]">
            Please read and acknowledge the operational nature of BloomBot AI:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>BloomBot offers automated, supportive dialogue based on pattern analysis; it does not possess human consciousness or clinical judgment.</li>
            <li>Content provided by BloomBot is for general wellness guidance only and should not be relied upon as clinical advice.</li>
            <li>MindBloom is not liable for actions taken based on conversational outputs from AI models.</li>
          </ul>
        </section>

        {/* 6. Intellectual Property */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              6
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Intellectual Property</h2>
          </div>
          <p>
            All MindBloom software, source code, visual design, custom logos, illustrations, graphics, and brand trademarks belong exclusively to MindBloom Inc.
          </p>
          <p>
            You retain 100% ownership of the personal journal entries, mood notes, and reflection content you author inside the application.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
              7
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Limitation of Liability</h2>
          </div>
          <p>
            MindBloom is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. To the fullest extent permitted by law, MindBloom Inc. disclaims all liability for direct, indirect, incidental, or consequential damages arising from your use of or inability to use the platform.
          </p>
        </section>

        {/* 8. Account Responsibility & Termination */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
              8
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Account Responsibility & Termination</h2>
          </div>
          <p>
            You are responsible for all actions occurring under your account. MindBloom reserves the right to suspend or terminate accounts that violate these Terms of Service or engage in abusive behavior.
          </p>
          <p>
            You may terminate your account at any time by accessing your Profile settings or contacting support.
          </p>
        </section>

        {/* 9. Changes to Terms */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
              9
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Changes to Terms</h2>
          </div>
          <p>
            We may revise these Terms of Service periodically to reflect platform enhancements or legal changes. Your continued use of MindBloom following any updates constitutes acceptance of the modified terms.
          </p>
        </section>

        {/* 10. Contact Information */}
        <section className="cozy-card p-6 sm:p-8 space-y-4 bg-[#FAF6F0] dark:bg-[#2A201A]">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              10
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Contact Information</h2>
          </div>
          <p>
            For questions or inquiries regarding these Terms of Service, please reach out:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:legal@mindbloom.app"
              className="cozy-btn-secondary text-xs px-4 py-2.5 inline-flex items-center gap-2 w-fit"
            >
              <Mail className="w-4 h-4 text-[#8B5E3C]" />
              <span>legal@mindbloom.app</span>
            </a>
            <Link
              to="/contact"
              className="cozy-btn-primary text-xs px-4 py-2.5 inline-flex items-center gap-2 w-fit"
            >
              <MapleLeafIcon className="w-4 h-4 text-[#FFFBF7]" />
              <span>Contact Support</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
