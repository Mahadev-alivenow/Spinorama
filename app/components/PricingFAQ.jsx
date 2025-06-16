export default function PricingFAQ() {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">How does billing work?</h3>
          <p className="text-gray-600">
            All plans are billed either monthly or yearly. You can upgrade,
            downgrade, or cancel at any time.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
          <p className="text-gray-600">
            Yes, you can change your plan at any time. If you upgrade, you'll be
            charged the prorated amount for the remainder of your billing cycle.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">
            What happens if I exceed my campaign limit?
          </h3>
          <p className="text-gray-600">
            You'll need to upgrade to a higher plan to create more campaigns.
            You can still manage your existing campaigns.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">
            How do I cancel my subscription?
          </h3>
          <p className="text-gray-600">
            You can cancel your subscription at any time from your account
            settings. Your plan will remain active until the end of your billing
            cycle.
          </p>
        </div>
      </div>
    </div>
  );
}
