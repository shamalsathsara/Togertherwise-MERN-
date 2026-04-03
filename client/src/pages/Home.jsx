/**
 * Home.jsx — Landing Page
 * Sections: Hero, Impact Counters, Our Mission, Current Campaigns,
 *           Success Stories, Projects & Campaigns, News & Updates, CTA Banner
 */

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import axiosInstance from "../api/axiosInstance";
import SEO from "../components/SEO";

// (Deleted unused dummy arrays)

//  News Data 
const newsItems = [
  { id: 1, tag: "COMPLETE", label: "Clean Water Project in Village 1 — A new solar pump is providing clean, safe water to 500+ families.", color: "bg-lime text-forest", image: "https://images.unsplash.com/photo-1590318719961-6e74a0cccfcb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, tag: "IN PROGRESS", label: "School Refurbishment In Community — Teachers tasked and curriculum up.", color: "bg-blue-100 text-blue-700", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh0d-xiYqb1w9-xTqC5P-DTuG-qkZ0jAQe5A&s" },
];

// (Deleted featuredProjects since they use DB now)

//  Sub-Components 

const CampaignCard = ({ campaign }) => {
  const percent = Math.round((campaign.raised / campaign.goal) * 100);
  return (
    <div className="card bg-white overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="badge-lime text-xs">{campaign.category}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-forest text-base mb-2 line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-forest">Funds raised to ${campaign.raised.toLocaleString()} goal</span>
            <span className="text-lime-dark font-bold">{percent}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => window.location.href = "/donate"}
          className="btn-primary w-full text-sm py-2"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const percent = Math.round((project.raised / project.goal) * 100);
  return (
    <div className="card flex gap-4 p-4">
      <img
        src={project.image}
        alt={project.title}
        className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-forest text-sm mb-1 line-clamp-2">
          {project.title}
        </h4>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
          <span className="font-semibold text-gray-500">PROBLEM: </span>
          {project.problem}
        </p>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-500">
            GOAL: <span className="font-bold text-forest">${project.goal.toLocaleString()}</span>
          </span>
          <span className="text-gray-500">
            Raised: <span className="font-bold text-lime-dark">${project.raised.toLocaleString()}</span>
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <button className="text-xs px-3 py-1 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-colors">
            Learn more
          </button>
          <button
            onClick={() => window.location.href = "/donate"}
            className="text-xs px-3 py-1 rounded-full bg-lime text-forest font-semibold hover:bg-lime-dark transition-colors"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Hero Slide Data ──────────────────────────────────────────────────────────
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80",
    alt: "Children smiling — community empowerment",
  },
  {
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1600&q=80",
    alt: "Volunteers building together",
  },
  {
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&q=80",
    alt: "Clean water initiative",
  },
  {
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600&q=80",
    alt: "Education for all",
  },
];

// Main Home Component 
const Home = ({ lang }) => {
  const navigate = useNavigate();
  const [liveStories, setLiveStories] = useState([]);
  const [liveCampaigns, setLiveCampaigns] = useState([]);
  const [liveStats, setLiveStats] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { ref: counterRef, inView: counterInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Auto-advance the hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch Success Stories
        const storiesRes = await axiosInstance.get("/success-stories/featured");
        if (storiesRes.data.success && storiesRes.data.data.length > 0) {
          setLiveStories(storiesRes.data.data);
        }

        // Fetch Projects
        const projectsRes = await axiosInstance.get("/projects?status=active");
        if (projectsRes.data.success) {
           setLiveCampaigns(projectsRes.data.projects.slice(0, 4));
        }

        // Fetch Stats
        const statsRes = await axiosInstance.get("/projects/public-stats");
        if (statsRes.data.success) {
           const dbStats = statsRes.data.stats;
           setLiveStats([
             { value: dbStats.total * 25, suffix: "+", label: "Families Helped", icon: "🏠" },
             { value: dbStats.completed, suffix: "+", label: "Projects Completed", icon: "✅" },
             { value: dbStats.total * 12, suffix: "+", label: "Active Volunteers", icon: "🌟" },
             { value: dbStats.active, suffix: "+", label: "Project Supporting", icon: "🤝" },
           ]);
        }
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-white">
      <SEO
        title="Empowering Communities"
        description="Togetherwise — From village to global. Join us in transforming lives through donations, volunteering, and community empowerment."
        path="/"
      />

      {/*  */}
      {/* HERO SECTION — IMAGE SLIDESHOW                                  */}
      {/*  */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Sliding Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 z-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              style={{
                animation: currentSlide === index ? 'kenburns 8s ease-in-out forwards' : 'none',
              }}
            />
          </div>
        ))}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-forest/90 via-forest/70 to-forest/30" />

        {/* Hero Content */}
        <div className="relative z-10 section-wrapper py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-lime/20 border border-lime/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-lime rounded-full animate-pulse" />
              <span className="text-lime text-sm font-medium">Over 0 Active Volunteers</span>
            </div>

            <h1 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6 animate-slide-up">
              Empowering Communities:{" "}
              <span className="text-lime">From Village to Global.</span>{" "}
              Your support changes lives.
            </h1>

            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Village to Global is dedicated to supporting organizations and local initiatives
              that uplift communities. We empower people through sustainable development,
              access to essential resources, and community-driven programs.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="btn-primary text-base px-8 py-4"
                id="hero-donate-btn"
              >
                Donate Now ↗
              </button>
              <button
                onClick={() => navigate("/volunteer")}
                className="btn-secondary text-base px-8 py-4"
              >
                Join With Us
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-500 ${
                currentSlide === index
                  ? 'w-8 h-2.5 bg-lime'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* */}
      {/* IMPACT COUNTERS                                                */}
      {/* */}
      <section ref={counterRef} className="bg-forest py-16">
        <div className="section-wrapper">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {liveStats.map((stat, i) => (
              <div key={i} className="counter-card">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display font-black text-4xl text-white mb-1">
                  {counterInView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      delay={i * 0.2}
                    />
                  ) : "0"}
                  <span className="text-lime">{stat.suffix}</span>
                </div>
                <p className="text-white/70 text-sm font-medium text-center">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* */}
      {/* OUR MISSION                                                    */}
      {/**/}
      <section className="py-20 bg-gray-50">
        <div className="section-wrapper">
          <div className="text-center mb-12">
            <span className="badge-lime mb-3 inline-block">Our Mission</span>
            <h2 className="section-title">Building Stronger Communities</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Village to Global is dedicated to supporting organizations and local initiatives that uplift
              communities. We focus on empowering people through sustainable development.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {liveStats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100
                                      hover:border-lime hover:shadow-md transition-all duration-300">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="font-display font-black text-3xl text-forest mb-1">
                  {stat.value.toLocaleString()}+
                </div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* */}
      {/* CURRENT CAMPAIGNS                                              */}
      {/*  */}
      <section className="py-20 bg-white">
        <div className="section-wrapper">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge-forest mb-3 inline-block">Active Now</span>
              <h2 className="section-title">Current Campaigns</h2>
            </div>
            <Link
              to="/campaigns"
              className="text-forest font-semibold text-sm hover:text-lime-dark transition-colors flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveCampaigns.map((campaign) => {
              // Ensure we pass the schema format to CampaignCard (using coverImage, currentFunds)
              const mappedCampaign = {
                 ...campaign,
                 image: campaign.coverImage || campaign.image,
                 raised: campaign.currentFunds ?? campaign.raised,
                 description: campaign.shortDescription || campaign.description
              };
              return <CampaignCard key={mappedCampaign._id || mappedCampaign.id} campaign={mappedCampaign} />
            })}
          </div>
        </div>
      </section>

      {/*  */}
      {/* SUCCESS STORIES                                                */}
      {/*  */}
      <section className="py-20 bg-gray-50">
        <div className="section-wrapper">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge-lime mb-3 inline-block">Real Impact</span>
              <h2 className="section-title">Success Stories</h2>
            </div>
            <Link
              to="/success-stories"
              className="text-forest font-semibold text-sm hover:text-lime-dark transition-colors flex items-center gap-1"
            >
              Read All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveStories.map((story) => (
              <div key={story._id || story.id} className="card group overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={story.image.startsWith("http") ? story.image : `${import.meta.env.VITE_API_URL || ""}${story.image}`}
                    alt={`Success story from ${story.location}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 badge-lime text-xs">{story.location}</span>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm italic leading-relaxed mb-4">
                    "{story.quote}"
                  </p>
                  <Link
                    to="/success-stories"
                    className="btn-forest text-sm py-2"
                  >
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  */}
      {/* PROJECTS & CAMPAIGNS                                           */}
      {/*  */}
      <section className="py-20 bg-white">
        <div className="section-wrapper">
          <div className="text-center mb-10">
            <span className="badge-forest mb-3 inline-block">Portfolio</span>
            <h2 className="section-title">Projects & Campaigns</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveCampaigns.map((project) => {
              const mappedProject = {
                 ...project,
                 image: project.coverImage || project.image,
                 raised: project.currentFunds ?? project.raised,
                 problem: project.problem || project.description
              };
              return <ProjectCard key={mappedProject._id || mappedProject.id} project={mappedProject} />
            })}
          </div>
        </div>
      </section>

      {/* */}
      {/* NEWS & UPDATES                                                 */}
      {/* */}
      <section className="py-16 bg-gray-50">
        <div className="section-wrapper">
          <div className="flex items-end justify-between mb-6">
            <h2 className="section-title">News & Updates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100
                           hover:border-lime transition-all duration-200 hover:shadow-sm cursor-pointer"
              >
                {/* Replace src string below with actual image imports or paths if needed */}
                {item.image && (
                  <img
                    src={item.image}
                    alt="News Update"
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex flex-col items-start gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.color}`}>
                    {item.tag}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  */}
      {/* CTA BANNER                                                     */}
      {/*  */}
      <section className="py-20 bg-forest relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="section-wrapper relative z-10 text-center">
          <h2 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl mb-4">
            Be a Catalyst for Change.{" "}
            <span className="text-lime">Together, we can make a difference.</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Join us in transforming lives. Whether through donations, volunteering, or partnerships,
            your support helps build stronger communities and a better world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/volunteer")}
              className="btn-secondary text-base px-8 py-4"
            >
              Join with Us
            </button>
            <button
              onClick={() => navigate("/donate")}
              className="btn-primary text-base px-8 py-4"
              id="cta-donate-btn"
            >
              Donate Now ↗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
