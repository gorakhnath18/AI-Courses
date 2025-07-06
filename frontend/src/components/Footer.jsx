 
function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-12 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p className="text-sm">
          © {currentYear} Course.ai. All Rights Reserved  2025 @Gorakhnath Jaiswal.
        </p>
      </div>
    </footer>
  );
}

export default Footer;