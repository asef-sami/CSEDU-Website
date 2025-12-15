import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import hero from "../images/header.jpg"

export default function HeroSection() {
  return (
    <section className="relative h-full py-16 md:py-24 overflow-hidden">
    {/* ✅ Background image */}
    <img
      src={hero}
      alt="CSEDU Campus"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  
    {/* ✅ Softer gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/60 to-blue-900/30 z-0"></div>
  
    {/* ✅ Foreground content */}
    <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-1 text-center text-white">
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Department of Computer Science & Engineering
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          Empowering future innovators with cutting-edge education and research opportunities at the University of
          Dhaka.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link
            to="/admissions"
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-6 py-3 rounded-md font-medium flex items-center"
          >
            Apply Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/academics"
            className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium"
          >
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  </section>
  )
}  