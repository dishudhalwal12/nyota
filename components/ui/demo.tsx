import React from "react";
import { AwardBadge } from "@/components/ui/award-badge";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const demoLink = "https://www.producthunt.com/golden-kitty-awards/hall-of-fame?year=2024#bootstrapped-small-teams-2";

export const GoldenKitty = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AwardBadge type="golden-kitty" link={demoLink} />
    </div>
  );
};

export const ProductOfTheDay = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AwardBadge type="product-of-the-day" place={1} link={demoLink} />
    </div>
  );
};

export const ProductOfTheMonth = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AwardBadge type="product-of-the-month" place={2} link={demoLink} />
    </div>
  );
};

export const ProductOfTheWeek = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AwardBadge type="product-of-the-week" place={3} link={demoLink} />
    </div>
  );
};

export const NyotaBest = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AwardBadge type="nyota-best" link="#templates" />
    </div>
  );
};

// --- Testimonials Custom Human-written Wedding invite copy (Zero AI clichés) ---
const testimonials = [
  {
    text: "This invite is SO beautiful I'm lowkey jealous. The detailing, the colors, everything is so elegant. When Shweta told me it was a template she customised herself, I was like WHAT.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    name: "Riya & Sai",
    role: "Bride's friends",
  },
  {
    text: "My uncle actually called to ask 'where did you get this invite from?' That never happens.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    name: "Saurab & Tamanna",
    role: "Bride and Groom",
  },
  {
    text: "My god, I have never seen a wedding invite this pretty. Nyota = 100/10",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    name: "Jatin & Monika",
    role: "Groom's sister-in-law",
  },
  {
    text: "\"Where did you get this invite from 😍?\" was the most common question.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    name: "Amisha & Bharat",
    role: "Groom's brother and sister-in-law",
  },
  {
    text: "Honestly, it was actually easier than Canva, and way more premium than a WhatsApp video.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80",
    name: "Sidhant & Roshni",
    role: "Bride's friends",
  },
  {
    text: "Absolutely stunning. Half of our relatives saved it just to look at it again later.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    name: "Karan & Diya",
    role: "Groom's cousins",
  },
  {
    text: "We had so many last-minute changes to the venue map, and being able to edit it in 2 minutes saved us so much stress. Guests loved the directions link.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    name: "Pooja & Rohan",
    role: "Bride and Groom",
  },
  {
    text: "Sent the link on WhatsApp and everyone RSVP'd within two days. No Excel sheets, no manual follow-ups. Best decision ever.",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80",
    name: "Devika & Kabir",
    role: "Bride's sister",
  },
  {
    text: "We were skeptical about a digital card, but seeing our relatives navigate it so easily convinced us. The music play feature is such a warm touch.",
    image: "https://images.unsplash.com/photo-1440589473619-3cde28941638?w=120&auto=format&fit=crop&q=80",
    name: "Manish & Shruti",
    role: "Groom's parents",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};
