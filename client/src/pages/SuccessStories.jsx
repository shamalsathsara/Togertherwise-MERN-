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
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Success Stories" 
        description="Read about the real impact of your donations. Real stories of transformation from villages across the globe."
        path="/success-stories"
      />
      <div className="bg-forest py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-64 h-64 bg-lime rounded-full absolute -top-20 right-20" />
        </div>
        <div className="section-wrapper relative z-10">
          <span className="badge-lime mb-4 inline-block">Real Impact</span>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">Success Stories</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Every number has a name. Every project has a story. These are the people your donations support.
          </p>
        </div>
      </div>

      <div className="section-wrapper py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-lime border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : stories.length === 0 ? (
          /* Empty state — shown when no stories exist in DB */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="font-display font-bold text-forest text-2xl mb-2">No Stories Yet</h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Success stories will appear here once they are added by the admin. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured story */}
            {featuredStory && (
              <div className="card overflow-hidden mb-10 grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <img src={getImageUrl(featuredStory.image)} alt={featuredStory.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 badge-lime">{featuredStory.tag}</span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">📍 {featuredStory.location}</span>
                  <h2 className="font-display font-black text-forest text-3xl mb-4">{featuredStory.title}</h2>
                  <blockquote className="text-gray-600 text-lg italic leading-relaxed mb-6 border-l-4 border-lime pl-4">
                    "{featuredStory.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lime rounded-full flex items-center justify-center text-forest font-bold text-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {gridStories.map((story) => (
                <div key={story._id} className="card group overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    <img src={getImageUrl(story.image)} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <span className="badge-lime text-xs">{story.tag}</span>
                      <span className="text-white/70 text-xs line-clamp-1 max-w-[120px]">📍 {story.location}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-forest text-lg mb-3 line-clamp-2">{story.title}</h3>
                    <blockquote className="text-gray-500 text-sm italic leading-relaxed mb-4 line-clamp-3">
                      "{story.quote}"
                    </blockquote>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-lime/20 rounded-full flex items-center justify-center text-forest font-bold text-xs flex-shrink-0">
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
        <div className="bg-forest rounded-3xl p-10 text-center">
          <h2 className="font-display font-black text-white text-3xl mb-3">
            Write the Next <span className="text-lime">Success Story</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Your donation today can become tomorrow's story of transformation. Every contribution makes a difference.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate("/donate")} className="btn-primary">Donate Now</button>
            <button onClick={() => navigate("/volunteer")} className="btn-secondary">Volunteer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;

