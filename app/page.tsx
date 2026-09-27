import FoodCard from "@/components/FoodCard";
import Navbar from "@/components/Navbar";
import { menuItems } from "@/data/menu";

const categories = [
  "Rice Meals",
  "Sandwiches",
  "Shawarma",
  "Drinks",
  "Desserts",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#171717]">
      {/* Navigation */}
      {/* <Navbar /> */}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Hero Text */}
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-700">
              Freshly prepared • Made with care
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Good food.
              <span className="block text-orange-500">Good moments.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-black/60 sm:text-lg">
              Discover delicious meals prepared by Dfamiliz and order your
              favourites with FAMZI.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#menu"
                className="rounded-full bg-orange-500 px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Explore Menu
              </a>

              <a
                href="#popular"
                className="rounded-full border border-black/10 bg-white px-7 py-3.5 text-center text-sm font-bold transition hover:bg-black/5"
              >
                View Popular Meals
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-black/50">
              <span>✓ Freshly prepared</span>
              <span>✓ Easy ordering</span>
              <span>✓ Dfamiliz quality</span>
            </div>
          </div>

          {/* Hero Food Placeholder */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-full bg-orange-200/40 blur-3xl" />

            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-100 via-[#fff4df] to-orange-200 shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="text-7xl sm:text-8xl">🍛</div>

                <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  Food Image Placeholder
                </p>

                <p className="mt-2 max-w-xs text-sm text-black/40">
                  Our final Dfamiliz food photography will replace this image.
                </p>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white px-4 py-3 shadow-xl sm:bottom-7 sm:left-7">
              <p className="text-xs font-medium text-black/40">From</p>
              <p className="text-lg font-black">₦1,500</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Meals */}
      <section id="popular" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Customer favourites
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Popular meals
              </h2>

              <p className="mt-3 max-w-xl text-black/55">
                Start with some of the meals our customers love.
              </p>
            </div>

            <a
              href="/menu"
              className="text-sm font-bold text-orange-500 hover:text-orange-600"
            >
              View full menu →
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {menuItems
              .filter((item) => item.popular)
              .map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="menu" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            What are you craving?
          </h2>

          <div className="mt-8 flex gap-3 overflow-x-auto pb-3">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold transition ${
                  index === 0
                    ? "bg-[#171717] text-white"
                    : "bg-white text-black/60 ring-1 ring-black/10 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why FAMZI */}
      <section id="about" className="bg-[#171717] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="mb-5 text-3xl">🍳</div>

              <h3 className="text-xl font-extrabold">Freshly prepared</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Meals prepared with care and served fresh.
              </p>
            </div>

            <div>
              <div className="mb-5 text-3xl">⚡</div>

              <h3 className="text-xl font-extrabold">Simple ordering</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Find what you want, add it to your cart and place your order
                with ease.
              </p>
            </div>

            <div>
              <div className="mb-5 text-3xl">❤️</div>

              <h3 className="text-xl font-extrabold">Made for you</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                A digital food experience built around Dfamiliz customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="bg-orange-500 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              Ready to eat?
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Browse the menu and place your order with FAMZI.
            </p>
          </div>

          <a
            href="/menu"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-orange-600 transition hover:bg-black hover:text-white"
          >
            Order Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-black">FAMZI</p>

            <p className="text-xs text-white/40">by Dfamiliz</p>
          </div>

          <p className="text-white/40">
            © {new Date().getFullYear()} FAMZI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}