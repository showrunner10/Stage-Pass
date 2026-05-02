'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

interface OrderConfirmationProps {
  params: {
    'order-id': string;
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const mockOrder = {
    id: params['order-id'],
    event: 'Solstice Festival 2026',
    date: 'Dec 22, 2026',
    location: 'Centennial Park, Sydney',
    quantity: 2,
    totalPrice: 197.98,
    purchaseDate: 'May 2, 2026',
    ticketNumbers: ['SLO-001-A234', 'SLO-001-A235'],
  };

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="page-shell max-w-3xl">
        {/* Success Banner */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Order Confirmed!</h1>
          <p className="text-xl text-[#aaaaaa] mb-2">Your tickets are on the way.</p>
          <p className="text-[#aaaaaa]">Confirmation email sent to your@email.com (ticketing partner branding).</p>
        </div>

        <Card className="p-6 bg-primary/10 border-primary/25 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Creator attribution</h2>
          <p className="text-sm text-offwhite/75 leading-relaxed">
            This purchase is attributed to the creator campaign that referred you. Commission is recorded internally (pending →
            cleared after the refund window). You don&apos;t need to do anything — the creator sees performance in their
            dashboard.
          </p>
        </Card>

        {/* Order Details */}
        <Card className="p-10 bg-white/5 border-white/10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 pb-10 border-b border-white/10">
            <div>
              <p className="text-[#aaaaaa] text-sm uppercase tracking-wider mb-2">Order Number</p>
              <p className="text-2xl font-black text-white">{mockOrder.id}</p>
            </div>
            <div>
              <p className="text-[#aaaaaa] text-sm uppercase tracking-wider mb-2">Purchase Date</p>
              <p className="text-2xl font-bold text-white">{mockOrder.purchaseDate}</p>
            </div>
          </div>

          {/* Event Info */}
          <div className="mb-10 pb-10 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#aaaaaa]">Event</span>
                <span className="text-white font-semibold">{mockOrder.event}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#aaaaaa]">Date & Time</span>
                <span className="text-white font-semibold">{mockOrder.date}, 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#aaaaaa]">Location</span>
                <span className="text-white font-semibold">{mockOrder.location}</span>
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="mb-10 pb-10 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Your Tickets</h2>
            <div className="space-y-4">
              {mockOrder.ticketNumbers.map((ticket, idx) => (
                <div key={ticket} className="p-6 rounded-lg bg-gradient-to-r from-primary/20 to-transparent border border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Ticket {idx + 1}</p>
                      <p className="text-2xl font-black text-white font-mono">{ticket}</p>
                      <p className="text-[#aaaaaa] text-sm mt-2">General Admission</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">Valid</p>
                      <p className="text-[#aaaaaa] text-sm">Dec 22, 2026</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#aaaaaa]">Subtotal ({mockOrder.quantity} tickets)</span>
              <span className="text-white">${(mockOrder.totalPrice * 0.91).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#aaaaaa]">Fees</span>
              <span className="text-white">${(mockOrder.totalPrice * 0.09).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4">
              <span className="text-white font-bold text-lg">Total Paid</span>
              <span className="text-primary font-black text-lg">${mockOrder.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Button variant="default" className="h-14 px-8 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download Tickets
          </Button>
          <Button variant="outline" className="h-14 px-8 text-white border-white/30 hover:bg-white/10 flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" /> Share
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="p-8 bg-white/5 border-white/10 mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">1</span>
              <div>
                <p className="text-white font-semibold">Download Your Tickets</p>
                <p className="text-[#aaaaaa] text-sm">Save them on your phone or print them out. You'll need them at the door.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">2</span>
              <div>
                <p className="text-white font-semibold">Arrive Early</p>
                <p className="text-[#aaaaaa] text-sm">Plan to arrive 30-45 minutes before doors open for faster entry.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">3</span>
              <div>
                <p className="text-white font-semibold">Check Event Details</p>
                <p className="text-[#aaaaaa] text-sm">Review the event page for parking, dress code, and what to bring.</p>
              </div>
            </li>
          </ol>
        </Card>

        {/* FAQ Section */}
        <Card className="p-8 bg-white/5 border-white/10 mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Need Help?</h2>
          <div className="space-y-4">
            <Link href="/contact">
              <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start flex items-center gap-2">
                <Mail className="w-5 h-5" /> Contact Support
              </Button>
            </Link>
            <Link href="/legal/terms">
              <Button variant="outline" className="w-full h-12 text-white border-white/30 hover:bg-white/10 justify-start">
                Refund Policy
              </Button>
            </Link>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
