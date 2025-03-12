export default function HomePage() {
  return (
    <main
      className="w-screen flex items-center justify-center flex-col min-h-screen pb-[100px] font-montserrat"
      style={{
        background: "black",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        fontFamily: "Boogaloo",
      }}
    >
      <h1 className="text-3xl lg:text-6xl font-bold">Will be back soon</h1>
      <p className="mt-4 text-lg lg:text-2xl">
        We are currently performing maintenance. Please check back later.
      </p>
    </main>
  );
}
