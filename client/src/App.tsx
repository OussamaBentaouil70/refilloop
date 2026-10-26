// Quiet Utility reminder: keep routing shallow, provide clear escape routes, and use semantic titles for every page.

import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { PageShell } from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/NotFound";
import { About, Account, Contact, HowItWorks, Saved, Subscriptions } from "@/pages/InfoPages";
import { AdminApp } from "@/admin/AdminApp";
import { ArticlesPage, ArticleDetailPage, BlogPage, BlogDetailPage, CategoryPage, AboutSustainabilityPage, RefillGuidePage, ShippingAndReturnsPage, FaqPage, PrivacyPage, TermsPage } from "@/pages/ContentPages";

function RoutedShell({ children }: { children: React.ReactNode }) { return <PageShell>{children}</PageShell>; }
function CheckoutShell() { return <div className="min-h-screen bg-paper text-charcoal"><Checkout /></div>; }

function TitleManager() {
  const [location] = useLocation();
  useEffect(() => {
    const title = location === "/" ? "RefillLoop — Refill your routine. Reduce your waste." : location === "/shop" ? "Shop refills — RefillLoop" : location === "/subscriptions" ? "Subscriptions — RefillLoop" : location === "/how-it-works" ? "How it works — RefillLoop" : location === "/about" ? "Our story — RefillLoop" : location === "/contact" ? "Contact — RefillLoop" : location === "/cart" ? "Your bag — RefillLoop" : location === "/checkout" ? "Checkout — RefillLoop" : location === "/saved" ? "Saved items — RefillLoop" : "RefillLoop";
    document.title = title;
  }, [location]);
  return null;
}

function Router() {
  return <Switch>
    <Route path="/"><RoutedShell><Home /></RoutedShell></Route>
    <Route path="/shop"><RoutedShell><Shop /></RoutedShell></Route>
    <Route path="/product/:slug"><RoutedShell><ProductDetail /></RoutedShell></Route>
    <Route path="/cart"><RoutedShell><Cart /></RoutedShell></Route>
    <Route path="/checkout"><CheckoutShell /></Route>
    <Route path="/subscriptions"><RoutedShell><Subscriptions /></RoutedShell></Route>
    <Route path="/how-it-works"><RoutedShell><HowItWorks /></RoutedShell></Route>
    <Route path="/about"><RoutedShell><About /></RoutedShell></Route>
    <Route path="/contact"><RoutedShell><Contact /></RoutedShell></Route>
    <Route path="/saved"><RoutedShell><Saved /></RoutedShell></Route>
    <Route path="/account"><RoutedShell><Account /></RoutedShell></Route>
    <Route path="/articles"><RoutedShell><ArticlesPage /></RoutedShell></Route>
    <Route path="/articles/:slug"><RoutedShell><ArticleDetailPage /></RoutedShell></Route>
    <Route path="/blog"><RoutedShell><BlogPage /></RoutedShell></Route>
    <Route path="/blog/:slug"><RoutedShell><BlogDetailPage /></RoutedShell></Route>
    <Route path="/categories/:slug"><RoutedShell><CategoryPage /></RoutedShell></Route>
    <Route path="/about-sustainability"><RoutedShell><AboutSustainabilityPage /></RoutedShell></Route>
    <Route path="/refill-guide"><RoutedShell><RefillGuidePage /></RoutedShell></Route>
    <Route path="/shipping-and-returns"><RoutedShell><ShippingAndReturnsPage /></RoutedShell></Route>
    <Route path="/faq"><RoutedShell><FaqPage /></RoutedShell></Route>
    <Route path="/privacy"><RoutedShell><PrivacyPage /></RoutedShell></Route>
    <Route path="/terms"><RoutedShell><TermsPage /></RoutedShell></Route>
    <Route path="/admin/:rest*"><AdminApp /></Route>
    <Route path="/404"><RoutedShell><NotFound /></RoutedShell></Route>
    <Route><RoutedShell><NotFound /></RoutedShell></Route>
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><ShopProvider><TitleManager /><Toaster position="bottom-right" closeButton /><Router /></ShopProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
