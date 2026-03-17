import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 section-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF69B4]/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#87CEEB]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl md:text-6xl text-[#2D3142] mb-4">Get in Touch</h1>
          <p className="text-xl text-[#6B7280] max-w-2xl">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {[
            {
              icon: Mail,
              title: 'Email',
              content: 'hello@manzil.com',
              desc: 'We respond within 24 hours',
            },
            {
              icon: Phone,
              title: 'Phone',
              content: '+1 (555) 123-4567',
              desc: 'Mon-Fri, 9am-6pm EST',
            },
            {
              icon: MapPin,
              title: 'Visit Us',
              content: '123 Fashion Ave, NY 10001',
              desc: 'Flagship store & studio',
            },
          ].map((contact, idx) => (
            <div key={idx} className="card-soft p-8 text-center group hover:scale-105 transition-all">
              <contact.icon className="w-12 h-12 mx-auto mb-4 text-[#FF69B4] group-hover:text-[#87CEEB] transition-colors" />
              <h3 className="font-bold text-[#2D3142] text-lg mb-2">{contact.title}</h3>
              <p className="font-semibold text-[#FF69B4] mb-2">{contact.content}</p>
              <p className="text-sm text-[#6B7280]">{contact.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="font-serif text-3xl text-[#2D3142] mb-8">Send us a Message</h2>

            <div>
              <label className="block text-sm font-bold text-[#2D3142] mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2D3142] mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2D3142] mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2D3142] mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors resize-none"
                rows={6}
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-bold"
            >
              Send Message
            </button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-[#2D3142] mb-4">Business Hours</h3>
              <div className="space-y-3 card-soft p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#FF69B4]" />
                  <div>
                    <p className="font-bold text-[#2D3142]">Monday - Friday</p>
                    <p className="text-[#6B7280]">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#FF69B4]" />
                  <div>
                    <p className="font-bold text-[#2D3142]">Saturday</p>
                    <p className="text-[#6B7280]">10:00 AM - 4:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#FF69B4]" />
                  <div>
                    <p className="font-bold text-[#2D3142]">Sunday</p>
                    <p className="text-[#6B7280]">Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-[#2D3142] mb-4">Quick Support</h3>
              <div className="space-y-3">
                <a href="#" className="block card-soft p-4 hover:shadow-lg transition-all">
                  <p className="font-bold text-[#2D3142]">Shipping & Delivery</p>
                  <p className="text-sm text-[#6B7280]">Get tracking info and delivery estimates</p>
                </a>
                <a href="#" className="block card-soft p-4 hover:shadow-lg transition-all">
                  <p className="font-bold text-[#2D3142]">Returns & Exchanges</p>
                  <p className="text-sm text-[#6B7280]">Learn about our 30-day return policy</p>
                </a>
                <a href="#" className="block card-soft p-4 hover:shadow-lg transition-all">
                  <p className="font-bold text-[#2D3142]">Care Instructions</p>
                  <p className="text-sm text-[#6B7280]">How to maintain your shoes</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
