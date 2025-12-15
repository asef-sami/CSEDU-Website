import HeroSection from "../components/HeroSection"
import AnnouncementCard from "../components/AnnouncementCard"
import QuickLinkCard from "../components/QuickLinkCard"
import EventCard from "../components/EventCard"
import AchievementCard from "../components/AchievementCard"
import { announcements } from "../data/announcements"
import { quickLinks } from "../data/quickLinks"
import { events } from "../data/events"
import { achievements } from "../data/achievements"
import { Search, TrendingUp, Users, BookOpen } from "lucide-react"

export default function HomePage() {
  const featuredAnnouncements = announcements.slice(0, 3)
  const upcomingEvents = events.slice(0, 3)
  const recentAchievements = achievements.slice(0, 3)

  // Button gradient styles (dark blue to yellow)
  const buttonGradient = `bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-400`
  const buttonHoverGradient = `hover:from-yellow-400 hover:via-yellow-300 hover:to-blue-900`

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Register Button Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => (window.location.href = "/user-registration")}
            className={`text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${buttonGradient} ${buttonHoverGradient}`}
            style={{ backgroundSize: "200% auto" }}
          >
            Register as a User
          </button>
        </div>
      </section>

      {/* Login Button Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => (window.location.href = "/login")}
            className={`text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${buttonGradient} ${buttonHoverGradient}`}
            style={{ backgroundSize: "200% auto" }}
          >
            Log in
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: Users, label: "Faculty Members", count: "25+" },
              { Icon: BookOpen, label: "Students", count: "800+" },
              { Icon: TrendingUp, label: "Research Projects", count: "50+" },
              { Icon: Search, label: "Years of Excellence", count: "30+" },
            ].map(({ Icon, label, count }) => (
              <div
                key={label}
                className="text-center cursor-pointer transition-transform transform hover:scale-110 hover:text-blue-900"
              >
                <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-md">
                  <Icon className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">{count}</h3>
                <p className="text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Featured Announcements */}
<section className="py-12">
  <div className="container mx-auto px-4">
    <h2 className="section-title text-blue-900 font-bold text-3xl mb-8 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-900 bg-clip-text text-transparent">
      Featured Announcements
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-gradient-to-br from-gray-300 to-blue-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 hover:scale-[1.04] cursor-pointer border border-transparent hover:border-yellow-400"
          tabIndex={0}
          aria-label={`Announcement: ${announcement.title}`}
        >
          <div className="text-white">
            <AnnouncementCard announcement={announcement} />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Quick Links */}
<section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="section-title text-blue-900 font-bold text-3xl mb-8 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-900 bg-clip-text text-transparent">
      Quick Links
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {quickLinks.map((link, index) => (
        <div
          key={index}
          className="bg-gradient-to-tr from-gray-300 to-blue-300 rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer border border-transparent hover:border-yellow-400"
          tabIndex={0}
          aria-label={`Quick Link: ${link.title || link.label || 'Link'}`}
        >
          <div className="text-white">
            <QuickLinkCard link={link} />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Upcoming Events */}
<section className="py-12">
  <div className="container mx-auto px-4">
    <h2 className="section-title text-blue-900 font-bold text-3xl mb-8 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-900 bg-clip-text text-transparent">
      Upcoming Events
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="bg-gradient-to-bl from-gray-300 to-blue-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 hover:scale-[1.05] cursor-pointer border border-transparent hover:border-yellow-400"
          tabIndex={0}
          aria-label={`Event: ${event.title}`}
        >
          <div className="text-white">
            <EventCard event={event} />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


     {/* Global Search Section */}
<section className="py-12 bg-gradient-to-r from-gray-400 via-blue-500 to-blue-700 text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-900 bg-clip-text text-transparent">
      Find What You're Looking For
    </h2>
    <p className="text-lg mb-6 opacity-90">
      Search for courses, faculty, events, and more across our department
    </p>
    <div className="max-w-2xl mx-auto relative">
      <input
        type="text"
        placeholder="Search for courses, faculty, events..."
        className="w-full p-4 pl-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
      />
      <Search className="absolute left-4 top-4 h-6 w-6 text-gray-600" />
    </div>
  </div>
</section>

    </div>
  )
}