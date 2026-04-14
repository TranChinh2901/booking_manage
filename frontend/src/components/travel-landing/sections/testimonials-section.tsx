import { testimonials } from "../data";

export function TestimonialsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0e7490]">
            Traveler Testimonials
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-5xl">
            Planned carefully. Remembered vividly.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              className="rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_20px_55px_rgba(12,74,110,0.09)]"
              key={testimonial.name}
            >
              <blockquote className="text-lg font-semibold leading-8 text-[#254c60]">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <figcaption className="mt-8 border-t border-[#e3f2f7] pt-5">
                <p className="font-black text-[#062f42]">{testimonial.name}</p>
                <p className="mt-1 text-sm font-bold text-[#0e7490]">
                  {testimonial.route}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
