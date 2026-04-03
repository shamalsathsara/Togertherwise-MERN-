/**
 * SuccessStories.jsx — Success Stories Page
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";

const STORIES = [
  { id: 1, title: "Clean Water Changes Everything", location: "Sri Lanka", tag: "Water Projects", image: "https://images.unsplash.com/photo-1590318719961-6e74a0cccfcb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", quote: "Before Togetherwise came, we walked 3 miles each day for water. Now our children drink clean water at school and our mothers spend their time on building businesses.", person: "Kumari Navaratne", role: "Village Elder, Hambantota" },
  { id: 2, title: "Solar Power Lights Up Learning", location: "India", tag: "Education", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80", quote: "Our students now study after dark. The solar panels didn't just bring electricity — they brought hope for a different future for our children.", person: "Rajesh Kumar", role: "School Principal, Tamil Nadu" },
  { id: 3, title: "Women Rising Through Micro-Finance", location: "Bangladesh", tag: "Community Development", image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&q=80", quote: "The loan was small but the impact is enormous. My weaving business now supports my whole family and I teach five other women my skills.", person: "Fatima Begum", role: "Entrepreneur, Dhaka" },
  { id: 4, title: "Trees Reclaim the Land", location: "Southeast Asia", tag: "Reforestation", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80", quote: "We planted over 15,000 trees this year. The forest is coming back and so is the rain that our farmers depend on.", person: "Thiri Zaw", role: "Environmental Officer, Myanmar" },
  { id: 5, title: "Mobile Clinics Save Lives", location: "Africa", tag: "Medical Aid", image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600&q=80", quote: "The mobile clinic comes to our village every month. My son had malaria and was treated within hours. Without it, I don't know what would have happened.", person: "Ama Owusu", role: "Mother, Northern Ghana" },
  { id: 6, title: "Community Centers Build Unity", location: "Sri Lanka", tag: "Community Development", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80", quote: "The center is where we meet, argue, resolve, celebrate, and plan. It's the heart of our village now.", person: "Sunil Perera", role: "Community Leader, Kandy" },
];

const SuccessStories = () => {
  const navigate = useNavigate();
  const [liveStories, setLiveStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axiosInstance.get("/success-stories");
        if (response.data.success && response.data.data.length > 0) {
          setLiveStories(response.data.data);
        } else {
          setLiveStories(STORIES); // Fallback to demo
        }
      } catch (err) {
        setLiveStories(STORIES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  const displayStories = liveStories.length > 0 ? liveStories : STORIES;
  const featuredStory = displayStories[0];
  const gridStories = displayStories.slice(1);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const getImageUrl = (url) => url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

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
                <div key={story._id || story.id} className="card group overflow-hidden">
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
