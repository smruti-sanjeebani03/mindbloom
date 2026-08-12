import { useState, useEffect } from "react";
import { CozyBadge } from "../../components/common/UIComponents";
import { apiService } from "../../services/apiService";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquarePlus, CheckCircle2, HeartHandshake } from "lucide-react";

export const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Review Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");

  const loadTestimonials = async () => {
  try {
    const list = await apiService.getTestimonials();

    setTestimonials(
      Array.isArray(list) ? list : []
    );
  } catch (error) {
    console.error("Error loading testimonials:", error);
    setTestimonials([]);
  }
};

useEffect(() => {
  loadTestimonials();
}, []);

const nextTestimonial = () => {
  if (testimonials.length === 0) return;
  setActiveIdx(
    (prev) => (prev + 1) % testimonials.length
  );
};

const prevTestimonial = () => {
  if (testimonials.length === 0) return;
  setActiveIdx(
    (prev) => (prev - 1 + testimonials.length) % testimonials.length
  );
};

const handleSubmitReview = async (e) => {
  e.preventDefault();

  if (!quote.trim()) return;

  try {
    await apiService.addTestimonial({
      name: name.trim() || "Anonymous Reviewer",
      role: role.trim() || "MindBloom User",
      rating,
      quote: quote.trim(),
    });

    setName("");
    setRole("");
    setRating(5);
    setQuote("");

    await loadTestimonials();

    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowForm(false);
    }, 2500);
  } catch (error) {
    console.error("Error submitting testimonial:", error);
  }
};

const current = testimonials[activeIdx];

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <CozyBadge variant="autumn">User Feedback</CozyBadge>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3B281C]">
          User Reviews & Experience
        </h1>
        <p className="text-sm text-[#705D52]">
          Reviews submitted by testing users and community members. Share your honest review below!
        </p>
      </div>

      {/* Action Button to Submit Review */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="cozy-btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#FFE8D6]" />
          <span>{showForm ? "Close Form" : "Submit Your Review"}</span>
        </button>
      </div>

      {/* Review Submission Form Container */}
      {showForm && (
        <div className="max-w-2xl mx-auto bg-[#FFFBF7] border border-[#E6DCCD] rounded-2xl p-6 sm:p-8 shadow-md space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-[#8B5E3C] border-b border-[#E6DCCD] pb-3">
            <HeartHandshake className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg text-[#3B281C]">Write a Review</h3>
          </div>

          {submittedSuccess ? (
            <div className="p-6 bg-[#F4F7EF] border border-[#C5D8B5] rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#4F5D3D] mx-auto" />
              <h4 className="font-bold text-sm text-[#3B281C]">Thank you for your feedback!</h4>
              <p className="text-xs text-[#5C3A2E]">
                Your review has been recorded in the backend and is now live on the page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex M. (or leave blank for Anonymous)"
                    className="cozy-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Student, Designer, Daily Journaler"
                    className="cozy-input text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-[#D4A373] hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-current" : "text-[#D6C5B3]"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#3B281C] ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
                  Your Review / Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Share your experience using MindBloom..."
                  className="cozy-input text-xs w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cozy-btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cozy-btn-primary text-xs px-6 py-2"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Testimonials Display Section */}
      {testimonials.length === 0 ? (
        <div className="max-w-2xl mx-auto bg-[#FFFBF7] border border-dashed border-[#D6C5B3] rounded-3xl p-10 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center">
            <Quote className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#3B281C]">No Reviews Yet</h3>
          <p className="text-xs text-[#705D52] max-w-md mx-auto leading-relaxed">
            As this project is newly launched for testing, there are no pre-recorded reviews.
            Be the first user to submit your review!
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="cozy-btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write First Review</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Featured Carousel Card */}
          {current && (
            <div className="max-w-3xl mx-auto bg-[#FFFBF7] border border-[#E6DCCD] rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden text-center space-y-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center">
                <Quote className="w-6 h-6" />
              </div>

              <p className="font-serif text-lg sm:text-xl text-[#3B281C] italic leading-relaxed">
                "{current.quote}"
              </p>

              <div className="flex items-center justify-center gap-1 text-[#D4A373]">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <div className="flex flex-col items-center gap-2">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4C3B3]"
                />
                <div>
                  <h4 className="font-serif font-bold text-[#3B281C]">{current.name}</h4>
                  <p className="text-xs text-[#8C7667]">{current.role}</p>
                </div>
              </div>

              {/* Carousel Navigation Controls */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-[#EFE6DC]">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-xl bg-[#F5EFE6] text-[#5C3D2E] hover:bg-[#E6DCCD] transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition ${
                          idx === activeIdx ? "bg-[#5C3D2E] w-6" : "bg-[#E6DCCD]"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-xl bg-[#F5EFE6] text-[#5C3D2E] hover:bg-[#E6DCCD] transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Testimonials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="cozy-card p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#D4A373]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#705D52] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#EFE6DC]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-serif font-bold text-xs text-[#3B281C]">
                      {t.name}
                    </h5>
                    <p className="text-[10px] text-[#8C7667]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
