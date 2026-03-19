import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <div className="container py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Contact</p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl">Let’s design your space</h1>
        <p className="mt-3 text-muted-foreground">
          For quick orders, use the cart enquiry flow. For custom requests, share your requirements and we’ll get back soon.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Business hours</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Mon–Sat: 10:00 AM – 7:00 PM</p>
              <p className="mt-2">Support: WhatsApp for faster responses.</p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Need help now?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Add products to your cart and send an enquiry with your phone number.</p>
              <p className="mt-2">We’ll confirm availability, delivery, and customization options.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

