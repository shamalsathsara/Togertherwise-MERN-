/**
 * SuccessStories.jsx — Success Stories Page
 * Displays stories fetched live from the database.
 * Admin can manage stories via the admin panel.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";

const SuccessStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axiosInstance.get("/success-stories");
        if (response.data.success) {
          setStories(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  const getImageUrl = (url) => url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const featuredStory = stories[0];
  const gridStories = stories.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Success Stories" 
        description="Read about the real impact of your donations. Real stories of transformation from villages across the globe."
        path="/success-stories"
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative py-28 text-center overflow-hidden" style={{
        background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(156,252,92,0.06)", transform: "translate(-20%,20%)" }} />
          {/* Geometric */}
          <div className="absolute top-8 right-12 w-40 h-40 rounded-full border border-lime/10 hidden lg:block" />
          <div className="absolute bottom-8 left-12 w-32 h-32 rounded-full border border-white/6 hidden lg:block" />
          {/* Stars floating */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute text-lime/20 text-2xl hidden lg:block animate-float" style={{
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${12 + i * 4}px`
            }}>⭐</div>
          ))}
        </div>

        <div className="section-wrapper relative z-10">
          <span className="badge-lime mb-5 inline-block animate-fade-in">Real Impact</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-6xl mb-4 animate-slide-up leading-tight">
            Success <span className="text-gradient-lime">Stories</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto animate-slide-up delay-200">
            Every number has a name. Every project has a story. These are the people your donations support.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-14">
        {isLoading ? (
          <div className="flex justify-center items-center py-28">
            <div className="relative w-14 h-14">
              <div className="w-14 h-14 border-4 border-gray-100 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-4 border-t-lime rounded-full animate-spin" />
            </div>
          </div>
        ) : stories.length === 0 ? (
          /* Empty state — shown when no stories exist in DB */
          <div className="text-center py-28">
            <div className="w-24 h-24 rounded-3xl bg-forest/5 flex items-center justify-center mx-auto mb-5">
              <span className="text-5xl">⭐</span>
            </div>
            <h2 className="font-display font-bold text-forest text-2xl mb-3">No Stories Yet</h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Success stories will appear here once they are added by the admin. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured story */}
            {featuredStory && (
              <div className="card-luxury overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-80 lg:h-auto overflow-hidden group">
                  {featuredStory.video ? (
                    <video src={getImageUrl(featuredStory.video)} preload="none" poster={getImageUrl(featuredStory.image)} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <img src={getImageUrl(featuredStory.image)} alt={featuredStory.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
                  <span className="absolute bottom-4 left-4 badge-lime">{featuredStory.tag}</span>
                  {/* Featured label */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-forest" style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                    ⭐ Featured
                  </div>
                </div>
                <div className="p-10 flex flex-col justify-center relative">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(156,252,92,0.06), transparent 70%)" }} />

                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">📍 {featuredStory.location}</span>
                  <h2 className="font-display font-black text-forest text-3xl mb-5 leading-tight">{featuredStory.title}</h2>
                  <blockquote className="text-gray-600 text-lg italic leading-relaxed mb-6" style={{ borderLeft: "4px solid #9CFC5C", paddingLeft: "1rem" }}>
                    "{featuredStory.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-forest font-bold" style={{ background: "linear-gradient(135deg,#9CFC5C,#7DD940)" }}>
                      {featuredStory.person ? featuredStory.person.charAt(0) : "S"}
                    </div>
                    <div>
                      <p className="font-bold text-forest text-sm">{featuredStory.person}</p>
                      <p className="text-gray-400 text-xs">{featuredStory.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Story Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {gridStories.map((story) => (
                <div key={story._id} className="card-luxury group overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    {story.video ? (
                      <video src={getImageUrl(story.video)} preload="none" poster={getImageUrl(story.image)} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <img src={getImageUrl(story.image)} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <span className="badge-lime text-xs">{story.tag}</span>
                      <span className="text-white/70 text-xs line-clamp-1 max-w-[120px]">📍 {story.location}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Quote accent */}
                    <div className="w-6 h-1 rounded-full mb-3" style={{ background: "linear-gradient(90deg,#9CFC5C,#7DD940)" }} />
                    <h3 className="font-display font-bold text-forest text-lg mb-3 line-clamp-2">{story.title}</h3>
                    <blockquote className="text-gray-500 text-sm italic leading-relaxed mb-4 line-clamp-3">
                      "{story.quote}"
                    </blockquote>
                    <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid rgba(27,48,34,0.06)" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-forest font-bold text-xs flex-shrink-0" style={{ background: "linear-gradient(135deg,rgba(156,252,92,0.25),rgba(156,252,92,0.1))", border: "1px solid rgba(156,252,92,0.2)" }}>
                        {story.person ? story.person.charAt(0) : "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-forest text-xs truncate">{story.person}</p>
                        <p className="text-gray-400 text-[11px] truncate">{story.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="rounded-3xl p-12 text-center relative overflow-hidden" style={{
          background: "linear-gradient(135deg, #111E16 0%, #1B3022 55%, #2D4F37 100%)"
        }}>
          {/* Decorative */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl" style={{ background: "rgba(156,252,92,0.1)", transform: "translate(30%,-30%)" }} />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-2xl" style={{ background: "rgba(156,252,92,0.08)", transform: "translate(-20%,20%)" }} />
            <div className="absolute top-1/2 left-8 w-20 h-20 rounded-full border border-lime/10 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
            <div className="absolute top-1/2 right-8 w-14 h-14 rounded-full border border-white/8 hidden lg:block" style={{ transform: "translateY(-50%)" }} />
          </div>

          <div className="relative z-10">
            {/* Label */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5" style={{ background: "rgba(156,252,92,0.12)", border: "1px solid rgba(156,252,92,0.25)" }}>
              <span className="text-lime text-xs font-semibold tracking-wider uppercase">Make an Impact</span>
            </div>

            <h2 className="font-display font-black text-white text-3xl mb-3 leading-tight">
              Write the Next <span className="text-gradient-lime">Success Story</span>
            </h2>
            <p className="text-white/65 mb-8 max-w-lg mx-auto leading-relaxed">
              Your donation today can become tomorrow's story of transformation. Every contribution makes a difference.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate("/donate")} className="btn-primary">Donate Now</button>
              <button onClick={() => navigate("/volunteer")} className="btn-secondary">Volunteer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
