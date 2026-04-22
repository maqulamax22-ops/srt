export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      <div className="text-center space-y-4 mb-20">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          <span className="text-insta-gradient">About Commentify</span>
        </h1>
        <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">

          The ultimate productivity companion for the modern content creator.
        </p>
      </div>

      <div className="prose prose-slate max-w-none">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-2xl font-bold">Our Story</h3>
             <p className="text-slate-600 leading-relaxed font-light">
               Commentify started as a tiny internal tool built by UGC creators who were tired of spending hours in Photoshop just to mock up a realistic social media comment. 
               We realized that thousands of other creators faced the same struggle every day.
             </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-2xl font-bold">Our Mission</h3>
             <p className="text-slate-600 leading-relaxed font-light">
               We believe that high-quality production value shouldn't be locked behind a paywall. Our tools are designed to be fast, free, and accessible to everyone starting their content journey.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
