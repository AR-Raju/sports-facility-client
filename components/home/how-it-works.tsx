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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block relative left-full w-full h-0.5 bg-gray-200 transform -translate-x-1/2">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
