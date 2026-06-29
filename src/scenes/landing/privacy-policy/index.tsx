/* eslint-disable react/no-unescaped-entities */
import { Link } from "@/i18n";

const PrivacyPolicyScene = () => {
  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <section className="w-full pt-[48px] pb-[96px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h4 className="text-[32px] text-center">Bowers Privacy Policy</h4>
          <p className="mt-2 font-bold">Effective Date: 2 May, 2025</p>
          <p className="mt-2 font-bold">Last Updated: 2 May, 2025</p>
          <p className="mt-2">
            At Bowers ("we," "our," or "us"), we are committed to protecting your privacy.
          </p>
          <p className="mt-2">
            This Privacy Policy applies to all users of Bowers, including customers
            booking services and store owners offering services through our platform
            ("Services").
          </p>
          <p className="mt-2">
            By continuing to use Bowers — whether verifying your phone number, signing in
            via Google, Facebook, or browsing — you consent to the practices described in
            this Privacy Policy.
          </p>

          <div className="my-6 border-b-2 border-dotted border-greyOutline" />

          <h6>1. Who We Are</h6>
          <p className="mt-2">
            Bowers Innovation Co., Ltd. is the data controller responsible for your
            personal data unless otherwise stated.
          </p>
          <p className="mt-2">
            For questions, contact us at:{" "}
            <Link
              href={"mailto:support@bowers.app"}
              className="text-purplePrimary cursor-pointer"
            >
              support@bowers.app
            </Link>
          </p>

          <h6 className="mt-6">2. Information We Collect</h6>
          <p className="mt-2">
            We collect different types of information depending on how you interact with
            Bowers:
          </p>

          <p className="mt-2 font-bold">a. When You Use Our Services</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>Name, phone number, email address, and booking history</li>
            <li>
              Device information (IP address, browser type, operating system, device ID)
            </li>
            <li>Usage data (pages visited, clicks, browsing behavior)</li>
            <li>Cookies and tracking technologies</li>
            <li>Location data (country or region based on IP address)</li>
          </ul>

          <p className="mt-2 font-bold">
            b. When You Use Google or Facebook to Sign In
          </p>
          <ul className="mt-1 ml-8 list-disc">
            <li>
              Name, email address, profile picture (subject to your privacy settings with
              those platforms)
            </li>
          </ul>

          <p className="mt-2 font-bold">c. For Store Owners</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>Business name, business address, service offerings, contact details</li>
          </ul>

          <p className="mt-2 font-bold">d. Customer Support</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>
              Contact information and communication records (emails, calls, in-app
              messages)
            </li>
          </ul>

          <h6 className="mt-6">3. How We Use Your Information</h6>
          <p className="mt-2">We use your information to:</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>Manage and process bookings</li>
            <li>Display store profiles and services</li>
            <li>Communicate booking updates, reminders, and support messages</li>
            <li>Personalize your experience and recommend services</li>
            <li>Analyze usage to improve the platform</li>
            <li>Detect fraud and secure the platform</li>
            <li>Fulfill legal obligations</li>
          </ul>
          <p className="mt-2">We may also use anonymized and aggregated data for service improvements, research, and analytics.</p>

          <h6 className="mt-6">4. Automated Decision-Making</h6>
          <p className="mt-2">
            We may use automated systems to analyze your activity and deliver personalized
            experiences or marketing. You can opt out of marketing communications at any
            time.
          </p>
          <p className="mt-2">
            Bowers does not make solely automated decisions that have legal or similarly
            significant effects on individuals.
          </p>

          <h6 className="mt-6">5. Data Sharing</h6>
          <p className="mt-2">We may share your information with:</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>Stores to fulfill your bookings</li>
            <li>Service providers (e.g., SMS, email, hosting, payment systems)</li>
            <li>
              Third-party partners (with your consent) for marketing and business
              development
            </li>
            <li>Authorities or legal entities if required by law</li>
            <li>Our professional advisors (legal, audit)</li>
          </ul>

          <h6 className="mt-6">6. Sale of Personal Information</h6>
          <p className="mt-2">
            By continuing to use Bowers, you consent to the sale or sharing of your
            personal information (name, phone number, email address) with trusted
            third-party partners for marketing purposes.
          </p>
          <p className="mt-2">
            If you do not consent, you may opt out at any time by contacting{" "}
            <Link
              href={"mailto:support@bowers.app"}
              className="text-purplePrimary cursor-pointer"
            >
              support@bowers.app
            </Link>
            .
          </p>

          <h6 className="mt-6">7. External Links</h6>
          <p className="mt-2">
            Our Services may contain links to third-party websites. We are not responsible
            for the privacy practices or content of those sites.
          </p>

          <h6 className="mt-6">8. International Data Transfers</h6>
          <p className="mt-2">
            Your personal data may be stored and processed on servers located outside your
            country of residence. We implement reasonable safeguards to protect your
            information during international transfers.
          </p>

          <h6 className="mt-6">9. Data Retention</h6>
          <p className="mt-2">We retain your personal information:</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>As long as necessary to provide services</li>
            <li>
              For up to six (6) years after your last interaction for legal or operational
              reasons
            </li>
            <li>Longer if required by law or if needed for pending legal matters</li>
          </ul>
          <p className="mt-2">
            Anonymized data (not personally identifiable) may be kept indefinitely for
            analytics and service improvement.
          </p>

          <h6 className="mt-6">10. Your Rights</h6>
          <p className="mt-2">Depending on your jurisdiction, you may have rights to:</p>
          <ul className="mt-1 ml-8 list-disc">
            <li>Access your personal information</li>
            <li>Correct or update your information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing or marketing</li>
            <li>Opt out of sale of personal data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <Link
              href={"mailto:support@bowers.app"}
              className="text-purplePrimary cursor-pointer"
            >
              support@bowers.app
            </Link>
            .
          </p>

          <h6 className="mt-6">11. How We Protect Your Information</h6>
          <p className="mt-2">
            We implement industry-standard security measures (encryption, access controls,
            secured databases) to protect your information. However, no system can
            guarantee 100% security.
          </p>

          <h6 className="mt-6">12. Updates to This Privacy Policy</h6>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Significant changes will
            be posted on this page with an updated effective date.
          </p>

          <h6 className="mt-6">13. Contact Us</h6>
          <p className="mt-2">
            For any privacy questions or concerns:
            <br />
            <Link
              href={"mailto:support@bowers.app"}
              className="text-purplePrimary cursor-pointer"
            >
              support@bowers.app
            </Link>
          </p>
        </div>
      </section>
      <div className="w-full h-[80px] bg-darkPrimary"></div>
    </div>
  );
};

export default PrivacyPolicyScene;
