export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} Binodia Express. All rights reserved.</p>
        <p className="text-gray-400">Made with ❤️ & tasty code.</p>
      </div>
    </footer>
  );
}


