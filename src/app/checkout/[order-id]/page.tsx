'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Lock, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

interface CheckoutProps {
  params: {
    'order-id': string;
  };
}

export default function CheckoutPage({ params }: CheckoutProps) {
  const [step, setStep] = useState<'cart' | 'payment' | 'confirmation'>('cart');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const mockOrder = {
    event: 'Solstice Festival 2026',
    date: 'Dec 22, 2026',
    location: 'Centennial Park, Sydney',
    quantity: 2,
    ticketPrice: 89.99,
    feesPercent: 0.09,
  };

  const subtotal = mockOrder.quantity * mockOrder.ticketPrice;
  const fees = subtotal * mockOrder.feesPercent;
  const total = subtotal + fees;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
  };

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="page-shell max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-primary hover:text-primary/80 mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-black text-white mb-2">Checkout</h1>
          <p className="text-[#aaaaaa] mb-4">Order session: {params['order-id']}</p>
          <div className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-offwhite/85">
            <strong className="text-white">MVP:</strong> Embedded checkout is out of scope. Production redirects to the ticketing
            partner with <code className="text-primary">sp_creator</code>, <code className="text-primary">sp_campaign</code>, and
            UTM params preserved. This page is a UI placeholder only.
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {['Cart', 'Payment', 'Confirmation'].map((stepName, idx) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  (idx === 0 && step !== 'cart') || (idx === 1 && step === 'confirmation')
                    ? 'bg-green-500 text-white'
                    : step === 'cart' && idx === 0
                      ? 'bg-primary text-dark'
                      : step === 'payment' && (idx === 0 || idx === 1)
                        ? 'bg-primary text-dark'
                        : 'bg-white/10 text-white'
                }`}
              >
                {(idx === 0 && step !== 'cart') || (idx === 1 && step === 'confirmation') ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              {idx < 2 && <div className={`w-16 h-1 mx-2 ${step === 'cart' ? 'bg-white/10' : 'bg-primary'}`} />}
            </div>
          ))}
        </div>

        {/* Cart Review */}
        {step === 'cart' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-6 pb-8 border-b border-white/10">
                <div>
                  <h3 className="text-white font-bold mb-2">{mockOrder.event}</h3>
                  <p className="text-[#aaaaaa] text-sm mb-3">
                    {mockOrder.date} • {mockOrder.location}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white">General Admission Ticket</span>
                    <span className="text-white font-semibold">x{mockOrder.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#aaaaaa]">${mockOrder.ticketPrice.toFixed(2)} each</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-6">
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaaaaa]">Fees & Service Charge</span>
                  <span className="text-white">${fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-4">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-primary font-black text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Button variant="default" size="lg" onClick={() => setStep('payment')} className="w-full h-14 text-lg">
              Proceed to Payment <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Payment Form */}
        {step === 'payment' && (
          <Card className="p-8 bg-white/5 border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Lock className="w-6 h-6" /> Payment Information
            </h2>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Card Details */}
              <div>
                <label className="block text-white font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '') })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">CVC</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={formData.cvc}
                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                    maxLength={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded" />
                <span className="text-[#aaaaaa] text-sm">
                  I agree to the{' '}
                  <Link href="/legal/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <div className="space-y-3">
                <Button type="submit" variant="default" size="lg" className="w-full h-14 text-lg">
                  Complete Payment ${total.toFixed(2)}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-white border-white/30 hover:bg-white/10"
                  onClick={() => setStep('cart')}
                >
                  Back to Cart
                </Button>
              </div>

              <p className="text-[#aaaaaa] text-xs text-center mt-6">
                Your payment information is processed securely. We never store your full card details.
              </p>
            </form>
          </Card>
        )}

        {/* Confirmation */}
        {step === 'confirmation' && (
          <div className="text-center">
            <Link href={`/order/${params['order-id']}`}>
              <Card className="p-12 bg-white/5 border-white/10 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Payment Successful!</h2>
                <p className="text-[#aaaaaa] mb-8">Redirecting to your order confirmation...</p>
                <p className="text-sm text-primary">Click to continue →</p>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
