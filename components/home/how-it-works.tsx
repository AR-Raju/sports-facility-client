import { Calendar, CheckCircle, CreditCard, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Facilities",
    description:
      "Explore our wide range of sports facilities and find the perfect match for your needs.",
  },
  {
    icon: Calendar,
    title: "Check Availability",
    description:
      "Select your preferred date and time slot to see real-time availability.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description:
      "Complete your booking with our secure payment system and get instant confirmation.",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Your Game",
    description:
      "Show up and enjoy your booked facility with all the amenities included.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Booking your perfect sports facility is simple and straightforward.
            Follow these easy steps to get started.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Connecting Line - Positioned to connect step numbers */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-0.5 z-0">
            <div className="relative h-full mx-16">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full"></div>
              {/* Connection dots at each step */}
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-2/4 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center group relative">
                {/* Step Number - Positioned above everything */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto shadow-lg border-4 border-white relative z-30">
                    {index + 1}
                  </div>
                </div>

                {/* Icon Container */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 shadow-md">
                    <step.icon className="h-10 w-10 text-primary group-hover:text-primary/80 transition-colors" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm px-2">
                    {step.description}
                  </p>
                </div>

                {/* Mobile connector arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="hidden lg:block absolute -top-4 -left-4 w-8 h-8 bg-primary/10 rounded-full"></div>
          <div className="hidden lg:block absolute -top-2 -right-6 w-6 h-6 bg-primary/20 rounded-full"></div>
          <div className="hidden lg:block absolute -bottom-4 left-1/3 w-4 h-4 bg-primary/15 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
