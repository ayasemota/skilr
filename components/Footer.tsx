export const Footer = () => (
  <footer className="border-t border-gray-800 mt-12 py-6">
    <div className="text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} Skilr. All rights reserved.</p>
      <p className="mt-2">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          GitHub
        </a>
      </p>
    </div>
  </footer>
);
