const Footer = () => {
  return (
    <footer className="bg-[#f5f5f7] py-12 ">
      <div className="max-w-7xl mx-auto px-4 w-[85%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Footer content goes here */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Shop and Learn</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-800 text-sm"
                >
                  Store
                </a>
              </li>
              {/* Add more footer links */}
            </ul>
          </div>
          {/* Add more footer columns */}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
