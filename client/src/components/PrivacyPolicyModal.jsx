/**
 * PrivacyPolicyModal.jsx — Privacy Policy Modal
 * Opens when the user clicks the "Privacy Policy" link in the footer.
 * Overlaid on the current page without navigating away.
 */

import React, { useEffect } from "react";

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-forest px-8 py-6 flex items-center justify-between flex-shrink-0">
          <h2 id="privacy-modal-title" className="font-display font-bold text-2xl text-white">
            Privacy Policy & Terms
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                       text-white hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8 custom-scrollbar">
          <p className="text-gray-500 text-sm mb-6">Last updated: March 2026</p>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">1. Information We Collect</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Togetherwise collects information you provide directly to us, including when you make a donation,
              register as a volunteer, or contact us. This includes your name, email address, phone number,
              and payment information (processed securely through our payment partners).
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use the information we collect to process donations and send receipts, communicate with you
              about our programs and campaigns, fulfill your volunteer registration, improve our services,
              and comply with legal obligations.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">3. Data Security</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including
              SSL encryption, bcrypt password hashing, and secure server infrastructure. Your payment
              information is never stored on our servers.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">4. Cookies</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use HttpOnly session cookies for authentication purposes only. These cookies are essential
              for the secure operation of our platform and do not track you across other websites.
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">5. Third-Party Services</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may use trusted third-party services (such as Stripe for payment processing) that have their
              own privacy policies. We encourage you to review the privacy policies of any third-party services
              you interact with through our platform.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">6. Your Rights</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You have the right to access, correct, or delete your personal information. To exercise these
              rights or if you have any privacy concerns, please contact us at{" "}
              <a href="mailto:thilan9109@gmail.com" className="text-forest font-medium hover:underline">
                thilan9109@gmail.com
              </a>.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-display font-bold text-forest text-lg mb-3">7. Contact Us</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact:<br />
              <strong>Togetherwise</strong><br />
              No 1/C Singhapura Hokandara South<br />
              Email: thilan9109@gmail.com<br />
              Phone: +94 778821632
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="btn-forest w-full"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
