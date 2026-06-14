"use client";

export function CommunitySection() {
  const testimonials = [
    {
      name: "Jessica Martinez",
      title: "Found Lost Passport",
      text: "Within 24 hours, my lost passport was found and returned. The community support was incredible!",
      rating: 5,
    },
    {
      name: "David Kumar",
      title: "Lost and Found Dog",
      text: "My dog was lost for 3 days. This platform connected me with someone who spotted him. Life-changing!",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      title: "Recovered Wedding Ring",
      text: "After losing my grandmother's ring, I thought it was gone forever. This community helped reunite us!",
      rating: 5,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 mb-20">
      <h2 className="text-center text-2xl font-bold mb-4">
        Community Success Stories
      </h2>
      <p className="text-center text-foreground/60 mb-12">
        Real people, real items, real reunions
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 border border-slate-200"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(item.rating)].map((_, idx) => (
                <span key={idx} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed">"{item.text}"</p>
            <div>
              <p className="font-semibold text-slate-800">{item.name}</p>
              <p className="text-sm text-foreground/60">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
