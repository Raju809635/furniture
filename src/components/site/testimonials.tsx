import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Riya S.",
    quote: "The sofa quality is exceptional. The finish looks premium and fits perfectly in our living room."
  },
  {
    name: "Arjun K.",
    quote: "Minimalist design, sturdy build, and smooth delivery. The table feels like a statement piece."
  },
  {
    name: "Neha P.",
    quote: "Warm tones and clean lines—exactly what we wanted. The team was quick on WhatsApp too."
  }
];

export function Testimonials() {
  return (
    <section className="container py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Loved by homes</p>
          <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl">Customer testimonials</h2>
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-background">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">“{t.quote}”</p>
              <p className="mt-4 text-sm font-semibold">{t.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

