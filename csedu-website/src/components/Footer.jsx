
import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, LogOut } from "lucide-react"

export default function Footer() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // clear session, tokens etc.
    localStorage.clear()
    navigate("/login")
  }

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">About CSEDU</h3>
            <p className="text-gray-300 mb-4">
              Department of Computer Science and Engineering at University of Dhaka, established in 1992, is one of the
              leading CS departments in Bangladesh.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/academics" className="text-gray-300 hover:text-white">
                  Academics
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="text-gray-300 hover:text-white">
                  Admissions
                </Link>
              </li>
              <li>
                <Link to="/notices" className="text-gray-300 hover:text-white">
                  Notices
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-white">
                  Faculty Directory
                </Link>
              </li>
              <li>
                <Link to="/fees-projects" className="text-gray-300 hover:text-white">
                  Student Projects
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Library</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Research</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Publications</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Career Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Alumni Network</a></li>
            </ul>
          </div>

Rokonuzzaman..cse.du.fr, [7/16/25 10:49 PM]
{/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-primary" />
                <span className="text-gray-300">Science Complex, University of Dhaka, Dhaka-1000</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span className="text-gray-300">+880-2-9661900 Ext. 7423</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span className="text-gray-300">office@cse.du.ac.bd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Department of CSE, University of Dhaka. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}