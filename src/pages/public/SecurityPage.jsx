import { Link } from "react-router-dom";
import { CozyBadge } from "../../components/common/UIComponents";
import { MapleLeafIcon } from "../../components/illustrations/CozyIllustrations";
import { Lock, Key, Server, ShieldCheck, FileCode, CheckCircle2, Cpu, Globe, Mail } from "lucide-react";

export const SecurityPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <CozyBadge variant="autumn">Security & Infrastructure</CozyBadge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
          Data Encryption & Security
        </h1>
        <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
          MindBloom employs robust cryptographic standards, multi-layer API authentication, and strict privacy architecture to safeguard your emotional wellness data.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE6] dark:bg-[#2C221B] border border-[#E8DDD0] dark:border-[#3D2E24] text-[11px] font-semibold text-[#8B5E3C] dark:text-[#E29578]">
          <span>Last Updated: August 2026</span>
        </div>
      </div>

      {/* Security Principles Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cozy-card p-5 space-y-2 border-t-4 border-t-[#8B5E3C]">
          <div className="w-9 h-9 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">Hashed Passwords</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            Strong cryptographic password hashing algorithms protect your login credentials.
          </p>
        </div>

        <div className="cozy-card p-5 space-y-2 border-t-4 border-t-[#D4A373]">
          <div className="w-9 h-9 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">JWT Auth</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            Stateless JSON Web Tokens authorize every sensitive backend API request.
          </p>
        </div>

        <div className="cozy-card p-5 space-y-2 border-t-4 border-t-[#E07A5F]">
          <div className="w-9 h-9 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">Environment Keys</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            API keys & LLM credentials are strictly stored in server environment variables.
          </p>
        </div>

        <div className="cozy-card p-5 space-y-2 border-t-4 border-t-[#889868]">
          <div className="w-9 h-9 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">HTTPS / TLS</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            All data in transit is encrypted using production HTTPS protocols.
          </p>
        </div>
      </div>

      {/* Security Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">

        {/* 1. Password Security */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Password Security</h2>
          </div>
          <p>
            Your account credentials are safeguarded with strict password security policies:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Secure Password Hashing:</strong> Passwords are <strong>securely hashed</strong> using salted cryptographic hashing algorithms (such as PBKDF2 or bcrypt) before storage in PostgreSQL.</li>
            <li><strong>Zero Plain-Text Storage:</strong> Plain-text passwords are never stored, logged, or exposed across any backend services or database records.</li>
            <li><strong>Complexity Enforcement:</strong> Password creation requires inclusion of special characters (e.g. <code>!@#$%^&*</code>) to defend against dictionary attacks and brute-force guessing.</li>
          </ul>
        </section>

        {/* 2. JWT Authentication */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">JWT Authentication</h2>
          </div>
          <p>
            MindBloom uses JSON Web Tokens (JWT) for secure authentication management:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Protected Endpoints:</strong> All sensitive API endpoints (e.g. journal logs, mood entries, profile settings) require a valid JWT Bearer authentication token.</li>
            <li><strong>Token Expiration:</strong> Authentication tokens expire automatically, reducing risk in the event of an idle browser session.</li>
            <li><strong>Role-Based Control:</strong> Admin endpoints enforce multi-tier authorization to isolate administrative actions from standard user data.</li>
          </ul>
        </section>

        {/* 3. Secure Data Storage */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Secure Data Storage</h2>
          </div>
          <p>
            Stored user data is defended with strict access rules:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Encryption at Rest:</strong> Database volumes (PostgreSQL / Firestore) are encrypted at rest using industry-standard AES encryption.</li>
            <li><strong>Admin Privacy Shield Guarantee:</strong> Backend queries isolate user content. System administrators cannot view private journal entry text.</li>
            <li><strong>Client-Side Storage Isolation:</strong> Local storage caches non-sensitive UI states and user session preferences safely inside browser boundaries.</li>
          </ul>
        </section>

        {/* 4. Secure API Communication */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Secure API Communication</h2>
          </div>
          <p>
            All data transmitted between the React frontend, Django REST Framework backend, and external microservices is protected in transit:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>HTTPS in Production:</strong> <strong>HTTPS encryption must be used in production</strong> to prevent eavesdropping, man-in-the-middle attacks, or packet interception.</li>
            <li><strong>TLS Transport Security:</strong> Network connections utilize TLS encryption protocols to secure header credentials and payload data.</li>
          </ul>
        </section>

        {/* 5. Environment Variable Protection */}
        <section className="cozy-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#8B5E3C]">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
              5
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Environment Variable Protection</h2>
          </div>
          <p>
            System secrets and API keys are isolated using strict server architecture:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Server-Side Only:</strong> Sensitive API keys (such as Gemini LLM keys, database connection strings, and JWT secret keys) are <strong>stored exclusively using server-side environment variables</strong>.</li>
            <li><strong>Zero Browser Exposure:</strong> Backend proxy routes handle external AI and service calls. API keys are never bundled into client-side JavaScript or committed to source code repositories.</li>
          </ul>
        </section>

        {/* 6. Input Validation */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
              6
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Input Validation</h2>
          </div>
          <p>
            All incoming request data passes through strict validation pipelines:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Sanitization & Escaping:</strong> Input fields sanitize user inputs to prevent SQL Injection, Cross-Site Scripting (XSS), and HTML payload injection.</li>
            <li><strong>Schema Checking:</strong> Django REST Framework serializers and backend validators reject malformed or unexpected request payloads automatically.</li>
          </ul>
        </section>

        {/* 7. Best Security Practices */}
        <section className="cozy-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
              7
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Best Security Practices</h2>
          </div>
          <p>MindBloom adheres to continuous security hygiene:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Regular security audits and automated dependency vulnerability patching.</li>
            <li>Session control options allowing users to clear local session data or delete their profile at any time.</li>
            <li>Strict CORS (Cross-Origin Resource Sharing) headers to prevent unauthorized domain requests.</li>
          </ul>
        </section>

        {/* Contact Security */}
        <section className="cozy-card p-6 sm:p-8 space-y-4 bg-[#FAF6F0] dark:bg-[#2A201A]">
          <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#382D25] pb-3">
            <ShieldCheck className="w-6 h-6 text-[#8B5E3C]" />
            <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Security Team Contact</h2>
          </div>
          <p>
            If you discover a potential security vulnerability or have questions about our infrastructure protections, please contact our security team:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:security@mindbloom.app"
              className="cozy-btn-secondary text-xs px-4 py-2.5 inline-flex items-center gap-2 w-fit"
            >
              <Mail className="w-4 h-4 text-[#8B5E3C]" />
              <span>security@mindbloom.app</span>
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
