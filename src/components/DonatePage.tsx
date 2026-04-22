import { Heart, Coffee } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function DonatePage() {
  const paypalOptions = {
    "clientId": (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "AaE5riMq_83CiSRB8oCYq4pwktlZKOdPVylnJqxxXkq9Fqddf9GUHYrBsVWgbQpkiKWJ93n77fBuSAXM",
    currency: "USD",
    intent: "capture",
  };


  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      {/* Hero Section */}
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
            <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons 
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
                            value: "5.00",
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
                    alert("A PayPal error occurred during the transaction.");
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
