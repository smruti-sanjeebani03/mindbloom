import { Link } from "react-router-dom";
import { CozyBadge } from "../../components/common/UIComponents";
import { MapleLeafIcon } from "../../components/illustrations/CozyIllustrations";
import { Shield, EyeOff, Database, Share2, UserCheck, Lock, RefreshCw, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <CozyBadge variant="autumn">Legal & Transparency</CozyBadge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
          At MindBloom, your privacy is sacred. We are committed to protecting your personal information and maintaining full transparency in how we handle your data.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE6] dark:bg-[#2C221B] border border-[#E8DDD0] dark:border-[#3D2E24] text-[11px] font-semibold text-[#8B5E3C] dark:text-[#E29578]">
          <span>Last Updated: August 2026</span>
        </div>
      </div>

      {/* Highlights Box */}
      <div className="cozy-card p-6 border-l-4 border-l-[#8B5E3C] bg-[#FAF6F0] dark:bg-[#251C16] space-y-3">
        <div className="flex items-center gap-2 text-[#3B281C] dark:text-[#FFFBF7]">
          <Shield className="w-5 h-5 text-[#8B5E3C]" />
          <h3 className="font-serif font-bold text-base">Privacy at a Glance</h3>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#705D52] dark:text-[#D4C3B3]">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#889868] shrink-0" />
            <span>BloomBot chats are temporary & not saved permanently</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#889868] shrink-0" />
            <span>Conversations are never used for AI model training</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#889868] shrink-0" />
            <span>We never sell or monetize your personal data</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#889868] shrink-0" />
            <span>Full autonomy to export or delete your account anytime</span>
          </li>
        </ul>
      </div>

      {/* Sections List */}
      <div className="space-y-8 text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">

        {/* 1. Information We Collect */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Information We Collect</h2>
          </div>
          <p>
            To provide a personalized, cozy emotional wellness sanctuary, MindBloom collects specific types of information when you interact with our platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Information:</strong> When you register, we collect your name, email address, and encrypted credentials. If you sign in via third-party providers (e.g. Google or Facebook), we receive profile basics like your name and email.
            </li>
            <li>
              <strong>Wellness & Personal Data:</strong> Information you voluntarily log inside MindBloom, including journal entries, mood ratings, gratitude notes, and daily reflection responses.
            </li>
            <li>
              <strong>Usage & Technical Data:</strong> Standard log information such as your device type, browser specifications, IP address, and platform usage metrics to ensure reliable operation.
            </li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">How We Use Your Information</h2>
          </div>
          <p>We use the collected information strictly for legitimate wellness and application operational purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Delivering, maintaining, and enhancing MindBloom's core features (Journaling, Mood Tracker, Reflection).</li>
            <li>Generating personalized emotional insights, mood trend charts, and daily wellness statistics for your personal viewing.</li>
            <li>Authenticating your account, protecting system integrity, and preventing unauthorized access.</li>
            <li>Providing responsive customer support and sending critical account-related communications.</li>
          </ul>
        </section>

        {/* 3. AI Conversations */}
        <section className="cozy-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#E07A5F]">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#E07A5F]" />
              <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">AI Conversations (BloomBot)</h2>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-[#3B281C] dark:text-[#FFFBF7]">
              BloomBot chat sessions are strictly private and temporary:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>No Permanent Storage:</strong> BloomBot conversations are <strong>NOT permanently stored</strong> on our backend databases. Chat sessions exist only during your active session and are automatically cleared when you start a new conversation or navigate away from the chat.
              </li>
              <li>
                <strong>No AI Training:</strong> Your chat messages and interactions with BloomBot are <strong>NEVER used for AI model training</strong> or fine-tuning underlying Large Language Models (LLMs).
              </li>
              <li>
                <strong>Temporary Context:</strong> Dialogue history is maintained only in transient session state to allow BloomBot to respond cohesively during your active conversation.
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Data Storage */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Data Storage</h2>
          </div>
          <p>
            Your account credentials, journal logs, and reflection records are stored in secure cloud database infrastructure (PostgreSQL / Firestore) using strong encryption standards.
          </p>
          <p>
            We also utilize browser local storage (<code>localStorage</code>) to keep your active theme preferences and session tokens cached conveniently on your device. You can clear your client storage or export your entire data archive as a JSON file at any time via your Account Settings.
          </p>
        </section>

        {/* 5. Data Sharing */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              5
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Data Sharing</h2>
          </div>
          <p>
            MindBloom maintains a strict zero-monetization policy for user data. We <strong>do not sell, rent, trade, or share</strong> your personal or emotional wellness logs with third-party advertisers or data brokers.
          </p>
          <p>
            Data disclosures occur only under minimal, exceptional circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Legal Requirements:</strong> If compelled by applicable law, subpoena, or valid court order.</li>
            <li><strong>Safety Exceptions:</strong> In rare cases to prevent imminent physical harm, illegal activity, or severe safety threats.</li>
          </ul>
        </section>

        {/* 6. User Rights */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
              6
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">User Rights</h2>
          </div>
          <p>You maintain full control over your personal information at all times:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access & Export:</strong> Download a full copy of your journal entries, mood records, and reflections anytime.</li>
            <li><strong>Rectification:</strong> Edit your user profile name, email, or password whenever needed.</li>
            <li><strong>Deletion:</strong> Delete individual entries or permanently erase your entire account and stored data.</li>
          </ul>
        </section>

        {/* 7. Data Security */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
              7
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Data Security</h2>
          </div>
          <p>
            We implement comprehensive technical and organizational measures to safeguard your data, including end-to-end HTTPS/TLS encryption for network transmission, secure cryptographic password hashing, JWT access controls, and strict server-side environment protections.
          </p>
        </section>

        {/* 8. Policy Updates */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
              8
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Policy Updates</h2>
          </div>
          <p>
            We may update this Privacy Policy from time to time to reflect evolving legal regulations or feature enhancements. Any material revisions will be prominently announced on this page with an updated modification date.
          </p>
        </section>

        {/* 9. Contact Information */}
        <section className="cozy-card p-6 sm:p-8 space-y-4 bg-[#FAF6F0] dark:bg-[#2A201A]">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              9
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Contact Information</h2>
          </div>
          <p>
            If you have any questions, concerns, or privacy requests regarding this Privacy Policy, please reach out to our team:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:privacy@mindbloom.app"
              className="cozy-btn-secondary text-xs px-4 py-2.5 inline-flex items-center gap-2 w-fit"
            >
              <Mail className="w-4 h-4 text-[#8B5E3C]" />
              <span>privacy@mindbloom.app</span>
            </a>
            <Link
              to="/contact"
              className="cozy-btn-primary text-xs px-4 py-2.5 inline-flex items-center gap-2 w-fit"
            >
              <MapleLeafIcon className="w-4 h-4 text-[#FFFBF7]" />
              <span>Contact Support Team</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
