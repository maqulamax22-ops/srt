import { useState } from 'react';
import { Heart, Coffee, DollarSign } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function DonatePage() {
  const [amount, setAmount] = useState('5.00');
  
  const paypalOptions = {
    "clientId": (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "AaE5riMq_83CiSRB8oCYq4pwktlZKOdPVylnJqxxXkq9Fqddf9GUHYrBsVWgbQpkiKWJ93n77fBuSAXM",
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      {/* ... Hero Section remains same ... */}
      <div className="bg-indigo-600 rounded-[40px] p-8 sm:p-20 text-white text-center relative overflow-hidden mb-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-full">
            <Heart size={32} fill="white" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            <span className="text-insta-gradient">Support this Tools</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 font-light leading-relaxed">
            We're on a mission to build the best free tools for creators worldwide. 
            Your support helps us cover high server costs, maintenance, and allows us to 
            keep the generator 100% free with no annoying advertisements or email walls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <Coffee className="text-amber-500" />
               Buy us a Coffee
             </h3>
             <p className="text-slate-500 font-light leading-relaxed">
               Help us stay awake and focused on shipping new features every week! Even a the smallest gesture makes a huge difference to our small team.
             </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <Heart className="text-pink-500" />
               Join the Community
             </h3>
             <p className="text-slate-500 font-light leading-relaxed">
               By donating, you're not just supporting a tool, you're helping us build a sustainable future for independent creator software.
             </p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-insta-gradient opacity-80" />
           
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Make a Donation</h2>
            <p className="text-slate-500 text-sm mt-2 font-light">Secure payments processed via PayPal</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Select Donation Amount (USD)</label>
              <div className="grid grid-cols-4 gap-3">
                {['5.00', '10.00', '25.00', '50.00'].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-3 rounded-2xl font-bold transition-all border ${
                      amount === amt 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    ${amt.split('.')[0]}
                  </button>
                ))}
              </div>
              
              <div className="relative mt-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-slate-400" />
                </div>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-lg"
                  placeholder="Custom Amount"
                />
              </div>
            </div>

            <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons 
                  key={amount} // Important: Re-render buttons when amount changes
                  style={{ 
                    layout: "vertical",
                    shape: "rect",
                    label: "donate"
                  }} 
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: "Creator Support Donation",
                          amount: {
                            currency_code: "USD",
                            value: parseFloat(amount || '1').toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      alert(`Transaction completed by ${details.payer.name?.given_name}! Thank you for your support.`);
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                  }}
                />
            </PayPalScriptProvider>
          </div>

          <div className="text-center pt-8 border-t border-slate-50 mt-8">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              Secure SSL Encrypted Transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
