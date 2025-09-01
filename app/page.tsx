// app/page.jsx (Next.js 13+ with App Router)
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Find Your Perfect Space</h1>
        <p className="max-w-2xl mb-6 text-lg">
          Rent coworking spaces, meeting rooms, or event halls with ease and flexibility.
        </p>
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-gray-100">
            Book Now
          </button>
          {/* <button className="px-6 py-3 border border-white rounded-xl hover:bg-white/20">
            Learn More
          </button> */}
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Flexible Booking</h3>
            <p>Book spaces by the hour, day, or month – whatever suits your needs.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
            <p>Choose from a wide range of spaces across the city.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Affordable Pricing</h3>
            <p>Get premium spaces at competitive prices with no hidden costs.</p>
          </div>
        </div>
      </section> */}

      {/* Featured Spaces Section */}
      <section className="py-20 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Spaces</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            {
              img: "/sample.avif",
              title: "Modern Coworking Hub",
              details: "Downtown • From $20/hr",
            },
            {
              img: "/sample.avif",
              title: "Creative Studio",
              details: "Arts District • From $35/hr",
            },
            {
              img: "/sample.avif",
              title: "Event Conference Hall",
              details: "City Center • From $100/hr",
            },
            {
              img: "/sample.avif",
              title: "Private Meeting Room",
              details: "Business Park • From $15/hr",
            },
          ].map((space, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow overflow-hidden flex flex-col"
            >
              <img
                src={space.img}
                alt={space.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{space.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{space.details}</p>
                <button className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Space?</h2>
        <p className="mb-6 text-lg">Find and book the perfect spot in minutes.</p>
        <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} SpaceRent. All rights reserved.</p>
      </footer>
    </main>
  );
}
