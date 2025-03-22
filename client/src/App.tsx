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
const OrderDetailsPage = lazy(() => import("./pages/order-details-page"));
const ProfilePage = lazy(() => import("./pages/profile"));
const ProductEditPage = lazy(() => import("./pages/admin/product-edit-page"));
const ProductCreatePage = lazy(
  () => import("./pages/admin/product-create-page")
);
const KanbanPage = lazy(() => import("./pages/admin/kanban-page"));

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
                <Route path="product/create" element={<ProductCreatePage />} />
                <Route path="product/:id" element={<ProductEditPage />} />
                <Route path="user" element={<ProductEditPage />} />
                <Route path="user/create" element={<ProductEditPage />} />
                <Route path="user/:id" element={<ProductEditPage />} />
                <Route path="orders" element={<ProductEditPage />} />
                <Route path="orders/:id" element={<ProductEditPage />} />
                <Route path="kanban" element={<KanbanPage />} />
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
