import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext/CartContext";
import { jwtDecode } from 'jwt-decode';

export default function Header({ ...props }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isGleryDropdownOpen, setGleryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const gleryDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    navigate("/login"); // Redirect ke login
    window.location.replace("/login");
    window.location.reload();
    setProfileDropdownOpen(false); // Tutup dropdown
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  {
    /* Galeri Sidebar */
  }
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setProfileDropdownOpen(false);
    setGleryDropdownOpen(false);
  };

  const toggleGleryDropdown = () => {
    setGleryDropdownOpen(!isGleryDropdownOpen);
    setDropdownOpen(false);
  };

  {
    /* Icon Profil */
  }
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setDropdownOpen(false);
  };

  // Mendecode token untuk mendapatkan role
  const getUserRole = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik

      // Periksa apakah token sudah kadaluarsa
      if (decodedToken.exp < currentTime) {
        // console.log("Token has expired.");
        return null;
      }

      // Kembalikan role user jika token valid
      return decodedToken.user ? decodedToken.user.role : null;
    } catch (error) {
      // console.log("Invalid token or decoding error:", error);
      return null;
    }
  };

  // Mengecek apakah user adalah admin
  const isAdmin = getUserRole() === 'admin';


  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  // State untuk scroll shadow
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek untuk memantau scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#galeri-button")
      ) {
        setDropdownOpen(false);
      }
      if (
        gleryDropdownRef.current &&
        !gleryDropdownRef.current.contains(event.target) &&
        !event.target.closest("#glery-button")
      ) {
        setGleryDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !event.target.closest("#profile-button")
      ) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchVisible(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <header
      {...props}
      className={`${
        props.className
      } sticky top-0 z-50 flex justify-center items-center py-[20px] bg-white border-b-2 ${
        isScrolled ? "shadow-md" : "border-b-black"
      }`}
    >
      <div className="container-xs flex items-center justify-between gap-[2px] pr-24 w-full">
        {/* Burger Menu for Small Screens */}
        <div className="sm:hidden">
          <button
            onClick={toggleSidebar}
            className="pl-6 pr-6 mt-2 text-gray-600 hover:text-black focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25px"
              height="25px"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {isSidebarOpen && (
            <div
              className={`fixed top-auto left-0 min-h-fit w-full bg-white shadow-lg border-l border-black z-50 transform transition-all duration-500 ease-in-out ${
                isSidebarOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <ul className="py-0 text-left">
                {/* Galeri Sidebar */}
                <li>
                  <div>
                    {/* Tombol Galeri */}
                    <button
                      id="glery-button"
                      className="w-full flex flex-row text-left block px-4 py-3 pt-2 border-t border-black text-md font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
                      onClick={toggleGleryDropdown} // Fungsi toggle untuk dropdown
                    >
                      <span>Galeri</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className={`w-4 h-4 ml-3 transition-transform ${
                          isGleryDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown langsung di bawah tombol */}
                    {isGleryDropdownOpen && (
                      <ul className="py-2 bg-white space-y-1 ">
                        <li>
                          <Link
                            to="/Harian"
                            className="text-sm pl-14 font-normal text-blk hover:bg-black hover:text-white px-4 pb-2 block"
                          >
                            Harian
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/formal"
                            className="text-sm pl-14 border-t border-black font-normal text-blk hover:bg-black hover:text-white px-4 py-2 block"
                          >
                            Formal
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/Khusus"
                            className="text-sm pl-14 border-t border-black font-normal text-blk hover:bg-black hover:text-white px-4 pt-2 block"
                          >
                            Khusus
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>

                <li>
                  <Link
                    to="/Tips-Bahan"
                    className="block border-t border-black px-4 py-3 text-md font-bold text-gray-700 hover:bg-gray-100"
                    onClick={toggleSidebar}
                  >
                    Tips
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Kreasi"
                    className="block border-t border-black px-4 py-3 text-md font-bold text-gray-700 hover:bg-gray-100"
                    onClick={toggleSidebar}
                  >
                    Kreasi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Produk-Kami/Kaos"
                    className="block border-t border-black px-4 py-3 text-md font-bold text-gray-700 hover:bg-gray-100"
                    onClick={toggleSidebar}
                  >
                    Produk Kami
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Move Logo next to Burger Menu for Small Screens */}
        <div className="sm:hidden flex items-center ml-2">
          <Link to="/home">
            <img
              src="/asset/image/logo-new.svg"
              alt="Logo"
              className="max-w-[60px] mr-[16vh] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Logo for Larger Screens */}
        <div className="hidden sm:flex items-center justify-center ml-28">
          <Link to="/home">
            <img
              src="/asset/image/logo-new.svg"
              alt="Logo"
              className="lg:w-[90%] ml-8 pr-2 mt-2 mb-1 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Menu for Larger Screens */}
        <div className="hidden sm:flex flex-1 justify-center items-center mx-auto">
          <ul className="flex gap-7">
            <li>
              <div className="relative">
                <button
                  id="galeri-button"
                  className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
                  onClick={toggleDropdown}
                >
                  Galeri
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10"
                  >
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/Harian"
                          className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
                        >
                          Harian
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/Formal"
                          className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
                        >
                          Formal
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/Khusus"
                          className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
                        >
                          Khusus
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link
                to="/Tips-Bahan"
                className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
              >
                Tips
              </Link>
            </li>
            <li>
              <Link
                to="/Kreasi"
                className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
              >
                Kreasi
              </Link>
            </li>
            <li>
              <Link
                to="/Produk-Kami/Kaos"
                className="text-[18px] font-normal text-blk hover:bg-black hover:text-white px-4 py-2"
              >
                Produk Kami
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex gap-3 sm:gap-2 md:gap-6 lg:gap-7 relative md:mr-0">
          {/* Profile Button */}
          <a id="profile-button" href="#" onClick={toggleProfileDropdown}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-5 sm:h-5 md:w-8 md:h-8 lg:w-[32px] lg:h-[32px]"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx={12} cy={7} r={4}></circle>
              </g>
            </svg>
          </a>
          {isProfileDropdownOpen && (
            <div
              ref={profileDropdownRef}
              className="absolute right-24 sm:right-12 md:right-24 mt-6 sm:mt-8 md:mt-10 w-28 sm:w-48 md:w-56 bg-white border border-gray-300 shadow-lg z-10"
            >
              <ul className="py-2">
                <li>
                  <Link
                    to="/UserProfile"
                    className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-black hover:text-white"
                  >
                    Profil Saya
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Order"
                    className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-black hover:text-white"
                  >
                    Pesanan Saya
                  </Link>
                </li>
                {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-black hover:text-white"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-black hover:text-white"
                  >
                    Keluar
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Cart Button */}
          <a href="#" onClick={toggleCart} className="pr-[55px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-4 sm:h-4 md:w-7 md:h-7 lg:w-8 lg:h-8"
              viewBox="0 0 56 56"
            >
              <path
                fill="currentColor"
                d="M14.559 51.953h27.586c4.218 0 6.656-2.437 6.656-7.266V20.43c0-4.828-2.461-7.266-7.36-7.266h-3.726c-.14-4.922-4.406-9.117-9.703-9.117c-5.32 0-9.586 4.195-9.727 9.117H14.56c-4.875 0-7.36 2.414-7.36 7.266v24.258c0 4.851 2.485 7.265 7.36 7.265M28.012 7.61c3.304 0 5.812 2.485 5.93 5.555h-11.86c.094-3.07 2.602-5.555 5.93-5.555M14.629 48.18c-2.344 0-3.656-1.242-3.656-3.679V20.617c0-2.437 1.312-3.68 3.656-3.68h26.766c2.296 0 3.632 1.243 3.632 3.68V44.5c0 2.438-1.336 3.68-2.953 3.68Z"
              />
            </svg>
          </a>

          {/* Cart Sidebar */}
          <div
            ref={cartRef}
            className={`fixed top-[75px] bottom-12 sm:top-[72px] md:top-0 lg:top-0 right-0 h-auto  sm:h-1/2 lg:h-full w-[300px] sm:w-[300px] md:w-[477px] lg:w-[577px] bg-white transform transition-transform duration-300 ease-in-out ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            } shadow-lg z-50 border-l border-black`}
          >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-black">
                <h2 className="text-lg font-bold text-center">Keranjang</h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Keranjang masih kosong</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="border-b border-black"
                    >
                      <div className="flex">
                        <div
                          className="w-[105px] h-[147px] border-r border-black
                                        sm:w-[105px] sm:h-[127px]
                                        md:w-[127px] md:h-[127px]
                                        lg:w-[127px] lg:h-[147px]"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-full ${
                              item.category === "aksesoris"
                                ? "object-cover object-[50%_100%]"
                                : "object-cover"
                            }`}
                          />
                        </div>
                        <div
                          className="flex-1 pr-5 pl-3 py-4
                                        sm:px-4 sm:py-4
                                        md:px-4 md:py-4
                                        lg:px-8 lg:py-4"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3
                                className="text-sm font-bold
                                              sm:text:sm 
                                              md:text-md 
                                              lg:text-lg"
                              >
                                {item.title}
                              </h3>
                              {item.category !== "aksesoris" && (
                                <p className="text-sm mt-1">
                                  Ukuran: {item.size}
                                </p>
                              )}
                              <p
                                className="text-sm mt-1 font-bold text-gray-600
                                            sm:text-md sm:mt-1
                                            md:text-lg md:mt-0
                                            md:text-lg lg:mt-0
                                            "
                              >
                                Rp {item.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="w-8 h-8 mt-7 mr-4 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors font-extrabold
                                        sm:w-8 sm:h-8 sm:mt-7 sm:mr-2
                                        md:w-9 md:h-9 md:mt-7 md:mr-2 
                                        lg:w-9 lg:h-9 lg:mt-7 lg:mr-2 "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                className="font-extrabold"
                              >
                                <path
                                  fill="currentColor"
                                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center mt-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-5 h-5 border border-black rounded-full flex items-center justify-center font-bold text-sm
                                        sm:w-5 sm:h-5
                                        md:w-6 md:h-6
                                        lg:w-6 lg:h-6"
                            >
                              -
                            </button>
                            <span className="mx-2 text-sm sm:text-sm md:text-md lg:text-lg font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              className="w-5 h-5 border text-sm border-black rounded-full flex items-center justify-center font-bold
                                        sm:w-5 sm:h-5
                                        md:w-6 md:h-6
                                        lg:w-6 lg:h-6"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto">
                <div className="p-4">
                  <button
                    onClick={toggleCart}
                    className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors
                              sm:w-8 sm:h-8
                              md:w-12 md:h-12
                              lg:w-12 lg:h-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="border-2 border-black ml-2 mr-8 mb-2 sm:mb-4 sm:mx-4 lg:mx-4 lg:mb-4">
                  <div className="p-4 flex justify-between items-center">
                    <p className="text-sm sm:text-sm md:text-md lg:text-lg font-bold">
                      Total: <br /> Rp {getCartTotal().toLocaleString()}
                    </p>
                    {cartItems.length > 0 && (
                      <button
                        onClick={() => {
                          navigate("/Pembayaran");
                          toggleCart();
                        }}
                        className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-300 hover:text-black transition-all duration-300"
                      >
                        Bayar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay when cart is open */}
          {isCartOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleCart}
            />
          )}
        </div>
      </div>
    </header>
  );
}
