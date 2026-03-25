import { Sparkles, Users, Award, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative min-h-[60vh] flex items-center section-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF69B4]/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#87CEEB]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 py-16">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl text-[#2D3142] mb-6 leading-tight">
              Every Step <span className="bg-gradient-to-r from-[#FF69B4] to-[#87CEEB] bg-clip-text text-transparent">Tells a Story</span>
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed">
              Chelouve was born from a simple belief: that shoes are more than just objects. They're companions on your journey, witnesses to your stories, and expressions of who you are.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-[1920px] mx-auto px-6 md:px-12">
        <h2 className="font-serif text-4xl text-[#2D3142] mb-16 text-center">Our Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.pexels.com/photos/1456705/pexels-photo-1456705.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Craftsmanship"
              className="w-full aspect-video object-cover rounded-3xl shadow-xl"
            />
          </div>
          <div>
            <h3 className="font-serif text-3xl text-[#2D3142] mb-6">Handcrafted Excellence</h3>
            <p className="text-[#6B7280] leading-relaxed mb-6">
              Founded in 2018, Chelouve brings together master craftspeople from around the world. Each pair is meticulously handcrafted using premium materials and traditional techniques that have been perfected over generations.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              We believe in quality over quantity. Every stitch, every curve, every detail is a testament to our commitment to excellence. We don't just make shoes; we create walking art.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#FFE4F5]/50 via-[#F0F8FF]/50 to-[#FFE4F5]/50">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-4xl text-[#2D3142] mb-16 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Quality',
                desc: 'Premium materials and meticulous craftsmanship in every pair',
              },
              {
                icon: Heart,
                title: 'Sustainability',
                desc: 'Eco-friendly practices and ethical manufacturing processes',
              },
              {
                icon: Users,
                title: 'Community',
                desc: 'Supporting artisans and celebrating diverse footwear cultures',
              },
              {
                icon: Award,
                title: 'Innovation',
                desc: 'Blending timeless tradition with contemporary design',
              },
            ].map((value, idx) => (
              <div key={idx} className="card-soft p-8 text-center group hover:scale-105 transition-all duration-500">
                <value.icon className="w-12 h-12 mx-auto mb-4 text-[#FF69B4] group-hover:text-[#87CEEB] transition-colors" />
                <h3 className="font-bold text-[#2D3142] mb-3">{value.title}</h3>
                <p className="text-sm text-[#6B7280]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-[1920px] mx-auto px-6 md:px-12">
        <h2 className="font-serif text-4xl text-[#2D3142] mb-16 text-center">Why Choose Chelouve</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'Timeless Design',
              desc: 'Our pieces are crafted to transcend trends. They age gracefully and gain character with every wear.',
            },
            {
              title: 'Perfect Fit',
              desc: 'We offer comprehensive sizing guides and personalized fit consultations to ensure your shoes fit perfectly.',
            },
            {
              title: 'Lifetime Support',
              desc: 'From resoles to repairs, we stand behind our products with lifetime support and maintenance services.',
            },
          ].map((item, idx) => (
            <div key={idx} className="border-l-4 border-[#FF69B4] pl-6">
              <h3 className="font-serif text-2xl text-[#2D3142] mb-4">{item.title}</h3>
              <p className="text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
