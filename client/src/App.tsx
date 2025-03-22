import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AppleAuthWrapper from "./provider/AuthWrapper";
import GuestOnlyWrapper from "./provider/GuestOnlyWrapper";
import AdminWrapper from "./provider/AdminWrapper";
import { Support } from "./pages/support";
import GlobalLoader from "./components/global-loader";
import ResetPassword from "./pages/reset-password-page";
import AdminDashboard from "./pages/dashboard";
import OverViewLayout from "./pages/admin/overview";
import ProductPage from "./pages/admin/product-page";

// Lazy load pages
const Home = lazy(() => import("./pages/home"));
const ItemDetails = lazy(() => import("./pages/product-details-page"));
const ProductOrderPage = lazy(() => import("./pages/product-order-page"));
const ShopPage = lazy(() => import("@/src/pages/shop-page"));
const NotFound = lazy(() => import("./pages/not-found"));
const AppleAuthPage = lazy(() => import("./pages/auth"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password-page"));
const Cart = lazy(() => import("./pages/cart"));
const OrdersPage = lazy(() => import("./pages/order"));
const OrderDetailsPage = lazy(() => import("./pages/one-order"));
const ProfilePage = lazy(() => import("./pages/profile"));
const CreateProductPage = lazy(
  () => import("./components/dashboard/product-form")
);

const CheckoutSuccess = lazy(() =>
  import("./pages/checkout").then((m) => ({ default: m.CheckoutSuccess }))
);
const CheckoutCancelled = lazy(() =>
  import("./pages/checkout").then((m) => ({ default: m.CheckoutCancelled }))
);

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main className="min-h-[100vh] pt-16">
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:slug" element={<ProductOrderPage />} />
              <Route path="/more/:slug" element={<ItemDetails />} />
              <Route
                path="/auth"
                element={
                  <GuestOnlyWrapper>
                    <AppleAuthPage />
                  </GuestOnlyWrapper>
                }
              />
              <Route
                path="/auth/forgot"
                element={
                  <GuestOnlyWrapper>
                    <ForgotPasswordPage />
                  </GuestOnlyWrapper>
                }
              />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/support" element={<Support />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/order"
                element={
                  <AppleAuthWrapper>
                    <OrdersPage />
                  </AppleAuthWrapper>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <AppleAuthWrapper>
                    <OrderDetailsPage />
                  </AppleAuthWrapper>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppleAuthWrapper>
                    <ProfilePage />
                  </AppleAuthWrapper>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AppleAuthWrapper>
                    <AdminWrapper>
                      <AdminDashboard />
                    </AdminWrapper>
                  </AppleAuthWrapper>
                }
              >
                <Route index element={<OverViewLayout />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="product/create" element={<CreateProductPage />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="user" element={<CreateProductPage />} />
                <Route path="user/create" element={<CreateProductPage />} />
                <Route path="user/:id" element={<CreateProductPage />} />
                <Route path="orders" element={<CreateProductPage />} />
                <Route path="orders/:id" element={<CreateProductPage />} />
              </Route>
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              <Route
                path="/checkout-cancelled"
                element={<CheckoutCancelled />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
