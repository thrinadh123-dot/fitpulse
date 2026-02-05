import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon, ArrowLeftIcon, QrCodeIcon, CheckCircle } from "lucide-react";

// Inject CSS animations
const injectStyles = () => {
  if (typeof document !== 'undefined') {
    const styleId = 'pricing-checkout-animations';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        @keyframes checkmark-circle {
          0% {
            stroke-dashoffset: 157;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes checkmark-check {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .checkmark-circle-animation {
          stroke-dasharray: 157;
          stroke-dashoffset: 157;
          animation: checkmark-circle 0.6s ease-in-out forwards;
        }
        
        .checkmark-check-animation {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkmark-check 0.3s ease-in-out 0.6s forwards;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }
};

/* ---------------- TYPES ---------------- */
type PlanId = "starter" | "pro" | "elite";
type PaymentMethod = "upi" | "debit" | "credit" | "wallet";
type CheckoutStep = "plan" | "method" | "details" | "success";

type Plan = {
  id: PlanId;
  name: string;
  basePrice: number;
  color: string;
  badge?: string;
  features: string[];
};

type PaymentOption = {
  id: PaymentMethod;
  label: string;
  feePercent: number;
};

/* ---------------- DATA ---------------- */
const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    basePrice: 499,
    color: "#4A8BDF",
    features: [
      "Smart Workout Tracker",
      "Basic Nutrition Guide",
      "Progress Dashboard",
      "Weekly Insights",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    basePrice: 999,
    color: "#FF5841",
    badge: "Most Popular",
    features: [
      "All Starter Features",
      "AI Nutrition Coaching",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    basePrice: 1499,
    color: "#FFD233",
    features: [
      "All Pro Features",
      "1-on-1 Coaching",
      "Custom Meal Plans",
      "Premium Community",
    ],
  },
];

const PAYMENT_METHODS: PaymentOption[] = [
  { id: "upi", label: "UPI (Recommended)", feePercent: 0 },
  { id: "debit", label: "Debit Card", feePercent: 2 },
  { id: "credit", label: "Credit Card", feePercent: 4 },
  { id: "wallet", label: "Wallets", feePercent: 3 },
];

// Wallet apps data
const WALLET_APPS = [
  { id: "gpay", name: "Google Pay" },
  { id: "phonepe", name: "PhonePe" },
  { id: "paytm", name: "Paytm" },
  { id: "amazon", name: "Amazon Pay" },
  { id: "wallet", name: "Wallet Balance" },
];

/* ------------- HELPERS ------------- */
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

/* ------------- UPI VALIDATION ------------- */
const isValidUpi = (upi: string) => {
  return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi);
};

/* ------------- CARD HELPER FUNCTIONS ------------- */
const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCardNumber = (value: string) => {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})/g, "$1 ").trim();
};

const maskedCardNumber = (value: string) => {
  const digits = onlyDigits(value);
  const last4 = digits.slice(-4);
  return last4 ? "**** **** **** " + last4 : "**** **** **** ****";
};

const formatExpiry = (value: string) => {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2, 4);
};

/* ------------- CHILD COMPONENTS ------------- */

type PlanCardProps = {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
};

function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <Card
      className={[
        "bg-[#1a1a1a] border-2 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg",
        isSelected ? "border-indigo-500 shadow-indigo-500/40" : "border-gray-800",
      ].join(" ")}
      onClick={onSelect}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
     <CardContent className="p-8 flex flex-col h-full">
  <div className="flex items-center justify-between mb-4">
    <h3
      className="text-3xl font-bold"
      style={{ color: plan.color }}
    >
      {plan.name}
    </h3>

    {plan.badge && (
      <span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/40">
        {plan.badge}
      </span>
    )}
  </div>



        <p className="text-4xl font-bold mb-6">
          {formatCurrency(plan.basePrice)}
          <span className="text-sm text-gray-400"> /month</span>
        </p>

        <ul className="space-y-3 text-gray-300 flex-grow">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button
          className="mt-8 font-bold w-full"
          style={{ backgroundColor: plan.color }}
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "Selected" : `Choose ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  );
}

type PaymentMethodRowProps = {
  option: PaymentOption;
  isSelected: boolean;
  onSelect: () => void;
  darkMode?: boolean;
};

function PaymentMethodRow({
  option,
  isSelected,
  onSelect,
  darkMode = false,
}: PaymentMethodRowProps) {
  return (
    <label
      className={[
        "flex justify-between items-center border rounded-lg p-4 cursor-pointer transition-colors",
        isSelected 
          ? darkMode 
            ? "border-gray-500 bg-[#111]" 
            : "border-indigo-500 bg-indigo-50"
          : darkMode 
            ? "border-gray-800 hover:border-gray-600" 
            : "border-gray-200",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="payment-method"
          value={option.id}
          checked={isSelected}
          onChange={onSelect}
          className="accent-indigo-600"
        />
        <span className={`text-sm md:text-base ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          {option.label}
        </span>
      </div>

      <span className={`text-xs md:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {option.feePercent === 0
          ? "No extra fee"
          : `+${option.feePercent}% fee`}
      </span>
    </label>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function PricingWithCheckout() {
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("plan");
  
  // States for UPI features
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(7);
  
  // States for Card payment
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // State for Wallet payment
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Inject styles on component mount
  useEffect(() => {
    injectStyles();
  }, []);

  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.id === selectedPlanId) ?? null,
    [selectedPlanId],
  );

  const finalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod);
    const feePercent = method?.feePercent ?? 0;
    return Math.round(selectedPlan.basePrice + (selectedPlan.basePrice * feePercent) / 100);
  }, [selectedPlan, paymentMethod]);

  // Auto-redirect effect
  useEffect(() => {
    if (checkoutStep === "success") {
      setRedirectCountdown(7);

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate("/login");
      }, 7000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [checkoutStep, navigate]);

  const handlePlanSelect = (planId: PlanId) => {
    setSelectedPlanId(planId);
    setCheckoutStep("method");
  };

  const handlePayment = () => {
    if (!selectedPlan) return;
    
    // Validation for UPI
    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        setUpiError("Please enter your UPI ID");
        return;
      }
      if (!isValidUpi(upiId)) {
        setUpiError("Please enter a valid UPI ID (format: name@bank)");
        return;
      }
    }
    
    // Validation for Card payments
    if (paymentMethod === "debit" || paymentMethod === "credit") {
      if (onlyDigits(cardNumber).length < 16) {
        return;
      }
      if (!cardName.trim()) {
        return;
      }
      if (expiry.length !== 5) {
        return;
      }
      if (cvv.length < 3 || cvv.length > 4) {
        return;
      }
    }

    // Validation for Wallet
    if (paymentMethod === "wallet" && !selectedWallet) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    console.log("Processing payment:", {
      planId: selectedPlanId,
      paymentMethod,
      amount: finalPrice,
      upiId: paymentMethod === "upi" ? upiId : undefined,
      cardNumber: paymentMethod === "debit" || paymentMethod === "credit" ? maskedCardNumber(cardNumber) : undefined,
      wallet: paymentMethod === "wallet" ? selectedWallet : undefined,
    });
    
    // Show success after a short delay to simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("success");
    }, 1000);
  };

  const resetCheckout = () => {
    setSelectedPlanId(null);
    setPaymentMethod("upi");
    setUpiId("");
    setUpiError("");
    setShowQR(false);
    setCheckoutStep("plan");
    setIsProcessing(false);
    setRedirectCountdown(7);
    // Reset card details
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    // Reset wallet selection
    setSelectedWallet(null);
  };

  const handleUpiIdChange = (value: string) => {
    setUpiId(value);
    if (upiError) setUpiError("");
  };

  const handleCardNumberChange = (value: string) => {
    const digits = onlyDigits(value);
    setCardNumber(digits);
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value);
    setExpiry(formatted);
  };

  const handleCvvChange = (value: string) => {
    const digits = onlyDigits(value);
    setCvv(digits);
  };

  const isCardFormValid = () => {
    return (
      onlyDigits(cardNumber).length === 16 &&
      cardName.trim().length > 0 &&
      expiry.length === 5 &&
      cvv.length >= 3 &&
      cvv.length <= 4
    );
  };

  return (
    <section className="py-20 px-4 bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Find the Perfect Plan
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Choose a plan that matches your fitness journey. Upgrade or cancel anytime.
          </p>
        </div>

        {/* PLAN SELECTION STEP */}
        {checkoutStep === "plan" && (
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => handlePlanSelect(plan.id)}
              />
            ))}
          </div>
        )}

        {/* PAYMENT METHOD STEP */}
        {selectedPlan && checkoutStep === "method" && (
          <div className="max-w-xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 text-gray-400 hover:text-white"
              onClick={() => setCheckoutStep("plan")}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>

            {/* Payment Method Selection */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Choose Payment Method
                </h3>
                <p className="text-gray-400">
                  Selected: <span style={{ color: selectedPlan.color }} className="font-semibold">{selectedPlan.name}</span> • {formatCurrency(selectedPlan.basePrice)}/month
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentMethodRow
                    key={method.id}
                    option={method}
                    isSelected={paymentMethod === method.id}
                    onSelect={() => setPaymentMethod(method.id)}
                    darkMode
                  />
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-800 pt-6 space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>{formatCurrency(selectedPlan.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Fee</span>
                  <span>
                    {formatCurrency(
                      finalPrice - selectedPlan.basePrice,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-800">
                  <span>Total Payable</span>
                  <span>{formatCurrency(finalPrice)}</span>
                </div>
              </div>

              <Button
                className="mt-8 w-full bg-gray-200 text-black hover:bg-white font-bold"
                onClick={() => setCheckoutStep("details")}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {/* PAYMENT DETAILS STEP */}
        {checkoutStep === "details" && (
          <div className="max-w-md mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 text-gray-400 hover:text-white"
              onClick={() => setCheckoutStep("method")}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Payment Methods
            </Button>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">
                Complete Your Payment
              </h3>
              <p className="text-gray-400 mb-6">
                Pay {formatCurrency(finalPrice)} for <span className="text-white font-semibold">{selectedPlan?.name}</span> plan
              </p>

              {/* UPI Payment Form */}
              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => handleUpiIdChange(e.target.value)}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder="name@bank"
                  />
                  
                  {upiError && (
                    <p className="text-red-400 text-sm mt-2">{upiError}</p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your UPI ID (e.g., username@okbank)
                  </p>

                  {/* QR Code Option */}
                  <button
                    type="button"
                    className="mt-4 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                    onClick={() => setShowQR(!showQR)}
                  >
                    <QrCodeIcon className="h-4 w-4" />
                    {showQR ? "Hide QR Code" : "Generate QR Code"}
                  </button>

                  {showQR && (
                    <div className="mt-4 bg-[#111] border border-gray-800 rounded-lg p-6 text-center">
                      <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                        {/* Fake QR Code */}
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} border`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-gray-300 font-semibold mb-1">Scan & Pay</p>
                        <p className="text-gray-400 text-sm mb-3">Use any UPI app to scan</p>
                        <div className="bg-[#1a1a1a] border border-gray-800 rounded p-3">
                          <p className="text-gray-400 text-xs">Amount</p>
                          <p className="text-white font-bold text-lg">{formatCurrency(finalPrice)}</p>
                          <p className="text-gray-500 text-xs mt-1">Valid for 10 minutes</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Payment Form */}
              {(paymentMethod === "debit" || paymentMethod === "credit") && (
                <div className="space-y-4">
                  {/* Minimal Card Preview – Clean & Clear */}
                  <div
                    className="mb-6 relative rounded-2xl p-6 text-[#e5e7eb]
                    border border-gray-800
                    bg-gradient-to-br from-[#1a1a1a] via-[#18212d] to-[#141414]"
                  >
                    {/* Soft accent glow */}
                    <div className="absolute inset-0 rounded-2xl 
                      bg-gradient-to-br from-[#1f3a5f]/20 via-transparent to-transparent 
                      pointer-events-none" />

                    {/* Header */}
                    <div className="relative flex justify-between items-center mb-6">
                      <span className="text-sm uppercase tracking-wide text-[#9ca3af]">
                        {paymentMethod === "credit" ? "CREDIT CARD" : "DEBIT CARD"}
                      </span>
                      <span className="text-sm font-medium text-[#c7d2fe]">
                        VISA
                      </span>
                    </div>

                    {/* Card Number - Show only last 4 digits or masked */}
                    <div className="relative mb-6 font-mono text-lg tracking-[0.25em] text-[#9ca3af]">
                      {maskedCardNumber(cardNumber)}
                    </div>

                    {/* Footer - Matching the image layout */}
                    <div className="relative flex justify-between items-end">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[#9ca3af]">
                          CARD HOLDER
                        </p>
                        <p className="font-medium text-[#e5e7eb]">
                          {cardName || "YOUR NAME"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wide text-[#9ca3af]">
                          EXPIRY
                        </p>
                        <p className="font-medium text-[#c7d2fe]">
                          {expiry || "MM/YY"}
                        </p>
                      </div>
                    </div>

                    {/* Contactless icon - Smooth curved lines matching the image */}
                    <div className="absolute top-14 right-6 opacity-40">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* First wave (smallest) */}
                        <path
                          d="M8.5 9C9.7 10.2 9.7 13.8 8.5 15"
                          stroke="#9ca3af"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Second wave (medium) */}
                        <path
                          d="M11 7C12.8 8.8 12.8 15.2 11 17"
                          stroke="#9ca3af"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Third wave (largest) */}
                        <path
                          d="M13.5 5C15.9 7.4 15.9 16.6 13.5 19"
                          stroke="#9ca3af"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Card Inputs */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^a-zA-Z\s]/g, "") // only letters + space
                          .toUpperCase();
                        setCardName(value);
                      }}
                      className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                      placeholder="JOHN DOE"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Payment Form */}
              {paymentMethod === "wallet" && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Complete Your Payment
                    </h3>
                    <p className="text-gray-400 mt-1">
                      Pay {formatCurrency(finalPrice)} for{" "}
                      <span className="text-white font-medium">
                        {selectedPlan?.name}
                      </span>{" "}
                      plan
                    </p>
                  </div>

                  {/* Wallet Selection */}
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-wide text-gray-400">
                      Choose Wallet App
                    </p>

                    {WALLET_APPS.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                          border transition
                          ${
                            selectedWallet === wallet.id
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-800 bg-[#111] hover:border-gray-600"
                          }`}
                      >
                        <span className="text-white">{wallet.name}</span>
                        {selectedWallet === wallet.id && (
                          <span className="text-blue-400 text-sm">Selected</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Info Message */}
                  {selectedWallet && (
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-gray-300">
                      You will be redirected to{" "}
                      <span className="text-white font-semibold">
                        {WALLET_APPS.find(w => w.id === selectedWallet)?.name}
                      </span>{" "}
                      to complete the payment of{" "}
                      <span className="text-white font-semibold">{formatCurrency(finalPrice)}</span>.
                    </div>
                  )}
                </div>
              )}

              <Button
                className="mt-8 w-full bg-gray-200 text-black hover:bg-white font-bold disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={handlePayment}
                disabled={
                  isProcessing ||
                  (paymentMethod === "upi" && (!upiId.trim() || !isValidUpi(upiId))) ||
                  ((paymentMethod === "debit" || paymentMethod === "credit") && !isCardFormValid()) ||
                  (paymentMethod === "wallet" && !selectedWallet)
                }
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatCurrency(finalPrice)}`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {checkoutStep === "success" && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 text-center">
              {/* Animated Success Checkmark */}
              <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center">
                <svg
                  className="w-20 h-20"
                  viewBox="0 0 52 52"
                  fill="none"
                >
                  {/* Circle */}
                  <circle
                    cx="26"
                    cy="26"
                    r="25"
                    stroke="#22c55e"
                    strokeWidth="3"
                    className="checkmark-circle-animation"
                  />

                  {/* Check */}
                  <path
                    d="M14 27 L22 35 L38 18"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="checkmark-check-animation"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h2>

              <p className="text-gray-400 mb-6">
                Welcome to <span style={{ color: selectedPlan?.color }} className="font-semibold">{selectedPlan?.name}</span> plan
              </p>
              
              {/* Transaction Details */}
              <div className="bg-[#111] border border-gray-800 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(finalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-gray-300 font-mono">TXN{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Date</span>
                  <span className="text-gray-300">{new Date().toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-gray-300 capitalize">
                    {paymentMethod === "debit" ? "Debit Card" : 
                     paymentMethod === "credit" ? "Credit Card" : 
                     paymentMethod === "wallet" ? 
                       WALLET_APPS.find(w => w.id === selectedWallet)?.name || "Wallet" : 
                     paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-500 font-semibold">Completed</span>
                </div>
              </div>

              {/* Auto-redirect message */}
              <div className="mb-6">
                <p className="text-gray-500 text-sm">
                  Redirecting to login in{" "}
                  <span className="text-white font-bold">
                    {redirectCountdown}
                  </span>{" "}
                  second{redirectCountdown !== 1 ? "s" : ""}...
                </p>
              </div>

              {/* Manual continue button */}
              <Button
                className="w-full bg-gray-200 text-black hover:bg-white font-bold"
                onClick={() => navigate("/login")}
              >
                Continue to Login
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}