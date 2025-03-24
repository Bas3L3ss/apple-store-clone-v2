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
import ProductPage from "./pages/admin/admin-products-page";
import ErrorBoundary from "./pages/error-boundary"; // Import ErrorBoundary

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
const UserEditPage = lazy(() => import("./pages/admin/user-edit-page"));
const ProductCreatePage = lazy(
  () => import("./pages/admin/product-create-page")
);
const KanbanPage = lazy(() => import("./pages/admin/kanban-page"));
const AdminUsersPage = lazy(() => import("./pages/admin/admin-users-page"));
const AdminOrdersPage = lazy(() => import("./pages/admin/admin-orders-page"));

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
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Home />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/shop"
                element={
                  <ErrorBoundary>
                    <ShopPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/shop/:slug"
                element={
                  <ErrorBoundary>
                    <ProductOrderPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/more/:slug"
                element={
                  <ErrorBoundary>
                    <ItemDetails />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/auth"
                element={
                  <GuestOnlyWrapper>
                    <ErrorBoundary>
                      <AppleAuthPage />
                    </ErrorBoundary>
                  </GuestOnlyWrapper>
                }
              />
              <Route
                path="/auth/forgot"
                element={
                  <GuestOnlyWrapper>
                    <ErrorBoundary>
                      <ForgotPasswordPage />
                    </ErrorBoundary>
                  </GuestOnlyWrapper>
                }
              />
              <Route
                path="/auth/reset-password"
                element={
                  <ErrorBoundary>
                    <ResetPassword />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/support"
                element={
                  <ErrorBoundary>
                    <Support />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/cart"
                element={
                  <ErrorBoundary>
                    <Cart />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/order"
                element={
                  <AppleAuthWrapper>
                    <ErrorBoundary>
                      <OrdersPage />
                    </ErrorBoundary>
                  </AppleAuthWrapper>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <AppleAuthWrapper>
                    <ErrorBoundary>
                      <OrderDetailsPage />
                    </ErrorBoundary>
                  </AppleAuthWrapper>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppleAuthWrapper>
                    <ErrorBoundary>
                      <ProfilePage />
                    </ErrorBoundary>
                  </AppleAuthWrapper>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AppleAuthWrapper>
                    <AdminWrapper>
                      <ErrorBoundary>
                        <AdminDashboard />
                      </ErrorBoundary>
                    </AdminWrapper>
                  </AppleAuthWrapper>
                }
              >
                <Route index element={<OverViewLayout />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="product/create" element={<ProductCreatePage />} />
                <Route path="product/:id" element={<ProductEditPage />} />
                <Route path="user" element={<AdminUsersPage />} />
                <Route path="user/:id" element={<UserEditPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<ProductEditPage />} />
                <Route path="kanban" element={<KanbanPage />} />
              </Route>
              <Route
                path="/checkout-success"
                element={
                  <ErrorBoundary>
                    <CheckoutSuccess />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/checkout-cancelled"
                element={
                  <ErrorBoundary>
                    <CheckoutCancelled />
                  </ErrorBoundary>
                }
              />
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
