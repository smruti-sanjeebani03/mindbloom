import { CozyBadge } from "../../components/common/UIComponents";
import { CozyCatLogo, MapleLeafIcon } from "../../components/illustrations/CozyIllustrations";
import { Heart, Sparkles, Linkedin, Github } from "lucide-react";
export const AboutPage = () => {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {
    /* About Header */
  }
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <CozyBadge variant="autumn">Our Story & Purpose</CozyBadge>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
          About MindBloom
        </h1>
        <p className="text-sm sm:text-base text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
          MindBloom was created with a simple belief: mental wellness should be accessible, personal, and empowering. We combine AI technology with evidence-based wellness practices to help you understand your emotions, build healthier habits, and become the best version of yourself.
        </p>
      </div>

      {
    /* Grid Cards: Mission, Vision, Values, Promise */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="cozy-card p-6 space-y-3 border-t-4 border-t-[#8B5E3C]">
          <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] dark:bg-[#342820] text-[#8B5E3C] dark:text-[#E29578] flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">Our Mission</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            To empower everyone to prioritize their mental well-being and live a balanced, mindful life inside a cozy space.
          </p>
        </div>

        <div className="cozy-card p-6 space-y-3 border-t-4 border-t-[#D4A373]">
          <div className="w-10 h-10 rounded-xl bg-[#FAF2E6] dark:bg-[#382A1E] text-[#D4A373] dark:text-[#E29578] flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">Our Vision</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            A world where mental wellness is a daily practice, not an occasional choice or overwhelming chore.
          </p>
        </div>

        <div className="cozy-card p-6 space-y-3 border-t-4 border-t-[#E07A5F]">
          <div className="w-10 h-10 rounded-xl bg-[#FBEBE6] dark:bg-[#3D251F] text-[#E07A5F] flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">Our Values</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            Empathy, Privacy, Inclusivity, Growth, and Positive Impact guide every feature we design.
          </p>
        </div>

        <div className="cozy-card p-6 space-y-3 border-t-4 border-t-[#889868]">
          <div className="w-10 h-10 rounded-xl bg-[#EAEFE6] dark:bg-[#25321F] text-[#4F5D3D] dark:text-[#B5DB92] flex items-center justify-center font-bold">
            04
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">Our Promise</h3>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            We are here for you, whenever you need support, guidance, reflection, or gentle motivation.
          </p>
        </div>
      </div>

      {
    /* Why We Built MindBloom */
  }
      <div className="cozy-card p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Why We Built MindBloom</h2>
          <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            Standard productivity apps treat human beings like machines. Corporate wellness software feels sterile, cold, and transactional. We wanted to build something different—an intimate space that feels like sitting by a rain-slicked window with a warm mug of tea, writing in your favorite leather journal.
          </p>
          <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
            Whether you are navigating college exams, career transitions, burnout, or daily anxiety, MindBloom provides an unconditionally warm ear through BloomBot, structured gratitude logs, and emotional insight charts.
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-center">
          <CozyCatLogo className="w-36 h-36" />
        </div>
      </div>

      {
    /* Creators Credits Section at the bottom */
  }
      <div className="space-y-6 pt-4 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#E07A5F]">
            <Heart className="w-5 h-5 fill-[#E07A5F] text-[#E07A5F]" />
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B281C] dark:text-[#FFFBF7]">
              Built with Care, for Your Well-being
            </h2>
            <Sparkles className="w-5 h-5 text-[#D88A5C]" />
          </div>
          <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3]">Designed with empathy, creativity, and purpose.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              name: "Sayan Biswas", 
              role: "Team MindBloom", 
              linkedin: "https://www.linkedin.com/in/sayan-biswas-466681363/",
              github: "https://github.com/SayanBiswas" 
            },
            { 
              name: "Sharmistha Panda", 
              role: "Team MindBloom", 
              linkedin: "https://www.linkedin.com/in/sharmistha-panda-ba5a08258/",
              github: "https://github.com/SharmisthaPanda" 
            },
            { 
              name: "Shreeja Sayena", 
              role: "Team MindBloom", 
              linkedin: "https://www.linkedin.com/in/shreeja-sayena-50721a25a/",
              github: "https://github.com/ShreejaSayena" 
            },
            { 
              name: "Smruti Sanjeebani", 
              role: "Team MindBloom", 
              linkedin: "https://www.linkedin.com/in/smruti-sanjeebani/",
              github: "https://github.com/SmrutiSanjeebani" 
            }
          ].map((member, idx) => (
            <div
              key={idx}
              className="cozy-card-warm p-6 rounded-2xl border-2 border-[#EAD8C7] dark:border-[#3E3229] bg-[#FFF8F1] dark:bg-[#27201B] hover:bg-white dark:hover:bg-[#322A23] hover:border-[#D88A5C] hover:shadow-md transition-all duration-300 shadow-xs flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF0E6] dark:bg-[#382C23] border border-[#EAD8C7] dark:border-[#4D3D31] flex items-center justify-center text-[#E07A5F] group-hover:scale-110 transition-transform">
                <MapleLeafIcon className="w-6 h-6 text-[#E07A5F]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7] group-hover:text-[#E07A5F] transition-colors flex items-center justify-center gap-1.5">
                  <span>{member.name}</span>
                </h3>
                <span className="text-[11px] text-[#8C7667] dark:text-[#C4B2A5] font-medium block">
                  {member.role}
                </span>
              </div>
              
              <div className="pt-2 flex items-center justify-center gap-2 flex-wrap w-full">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0A66C2] dark:text-[#52A5FF] bg-[#0A66C2]/10 dark:bg-[#0A66C2]/25 border border-transparent dark:border-[#0A66C2]/40 hover:bg-[#0A66C2] hover:text-white dark:hover:bg-[#0A66C2] dark:hover:text-white px-3 py-1.5 rounded-full transition-all duration-200"
                    title={`Connect with ${member.name} on LinkedIn`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#24292E] dark:text-[#F0F6FC] bg-[#24292E]/10 dark:bg-white/15 border border-transparent dark:border-white/25 hover:bg-[#24292E] hover:text-white dark:hover:bg-white dark:hover:text-[#0D1117] dark:hover:border-white px-3 py-1.5 rounded-full transition-all duration-200 shadow-xs"
                    title={`View ${member.name}'s GitHub profile`}
                  >
                    <Github className="w-3.5 h-3.5 text-[#24292E] dark:text-[#F0F6FC] group-hover/gh:text-white transition-colors" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>;
};
