/* eslint-disable react/no-unescaped-entities */

import { Link } from "@/i18n";

const TermsOfServiceScene = () => {
  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <section className="w-full pt-[48px] pb-[96px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h4 className="text-[32px] text-center">Bowers Terms of Service</h4>
          <p className="mt-2 font-bold">Effective Date: 2 May, 2025</p>
          <p className="mt-2 font-bold">Last Updated: 2 May, 2025</p>
          <p className="mt-2">
            These Terms of Service ("Terms") govern your access to and use of Bowers
            ("we," "our," "us"), including making service bookings with beauty stores
            ("Partners"). By continuing to use Bowers, you agree to these Terms.
          </p>
          <div className="my-6 border-b-2 border-dotted border-greyOutline" />
          <h6>1. Our Role</h6>
          <p className="mt-2">
            Bowers is a technology platform that connects customers with beauty and
            wellness service providers.
          </p>
          <p className="mt-2">
            Bowers acts solely as an intermediary. We do not operate, control, or provide
            the services booked through our platform.
          </p>
          <p className="mt-2">
            Your contract for any service is directly between you and the selected store
            (Partner).
          </p>
          <h6 className="mt-6">2. User Accounts</h6>
          <p className="mt-2">
            To use Bowers, you may verify your phone number or sign in through Google or
            Facebook.
          </p>
          <p className="mt-2">
            You agree to provide accurate and up-to-date information during registration
            and throughout your use of the platform.
          </p>
          <h6 className="mt-6">3. Bookings</h6>
          <p className="mt-2">
            <ul className="mt-2 ml-8 list-disc">
              <li>
                Bookings made through Bowers are sent directly to the selected Partner.
              </li>
              <li>Bowers is not responsible for the services provided by Partners.</li>
              <li>Bowers cannot guarantee Partner availability or service quality.</li>
              <li>
                Store locations, services, and availability are managed by each Partner.
              </li>
            </ul>
          </p>
          <h6 className="mt-6">4. Payments</h6>
          <p className="mt-2">
            All payments for services are made directly between you and the store.
          </p>
          <p className="mt-2">
            Bowers does not collect, process, or handle customer payments.
          </p>
          <p className="mt-2">
            Any payment disputes must be resolved directly with the store.
          </p>
          <h6 className="mt-6">5. Cancellations and No-Shows</h6>
          <p className="mt-2">
            <ul className="mt-2 ml-8 list-disc">
              <li>
                Customers may cancel or reschedule their appointments through Bowers up to
                12 hours before the scheduled service time.
              </li>
              <li>
                If you need to cancel or reschedule within 12 hours of your appointment,
                you must contact the store directly.
              </li>
              <li>
                Bowers does not guarantee that cancellations or rescheduling requests made
                less than 12 hours in advance will be accepted by the store
              </li>
              <li>
                Repeated cancellations, no-shows, or misuse of booking privileges may
                result in suspension or termination of your access to Bowers.
              </li>
              <li>
                Bowers also reserves the right to share a customer's booking behavior
                (such as repeated no-shows or late cancellations) with affected stores to
                protect service quality.
              </li>
            </ul>
          </p>
          <p className="mt-2">
            Repeated cancellations, no-shows, or misuse of booking privileges may result
            in suspension or termination of your access to Bowers.
          </p>

          <h6 className="mt-6">6. Customer Behavior</h6>
          <p className="mt-2">You agree to use Bowers responsibly and respectfully.</p>
          <p className="mt-2">
            Bowers reserves the right to restrict or terminate access if you:
            <ul className="mt-2 ml-8 list-disc">
              <li>Repeatedly cancel or miss appointments without notice</li>
              <li>Spam or abuse the booking system</li>
              <li>Behave inappropriately toward store staff or Bowers representatives</li>
            </ul>
          </p>

          <h6 className="mt-6">7. Partner Responsibilities</h6>
          <p className="mt-2">
            Partners are solely responsible for:
            <ul className="mt-2 ml-8 list-disc">
              <li>Providing accurate service information</li>
              <li>Delivering services booked through Bowers</li>
              <li>
                Managing their own appointment availability, pricing, policies, and any
                applicable taxes
              </li>
            </ul>
          </p>
          <p className="mt-2">
            Bowers is not liable for any issues arising from the services provided by
            Partners.
          </p>

          <h6 className="mt-6">8. Complaints and Disputes</h6>
          <p className="mt-2">
            If you experience any issues with a Partner:
            <ul className="mt-2 ml-8 list-disc">
              <li>We recommend contacting the store directly to resolve the issue.</li>
              <li>
                You may also report problems to Bowers at{" "}
                <Link
                  href={"mailto:support@bowers.app"}
                  className="text-purplePrimary cursor-pointer"
                >
                  support@bowers.app
                </Link>
                , and we will assist where possible.
              </li>
            </ul>
          </p>
          <p className="mt-2">
            However, Bowers is not responsible for service quality or refunds.
          </p>

          <h6 className="mt-6">9. Data Collection and Privacy</h6>
          <p className="mt-2">
            By using Bowers, you agree to our Privacy Policy, which explains how we
            collect, use, and share your personal information.
          </p>
          <p className="mt-2">
            Bowers may share your personal information with Partners to facilitate your
            bookings.
          </p>

          <h6 className="mt-6">10. External Links</h6>
          <p className="mt-2">
            Bowers may contain links to third-party websites or content.
          </p>
          <p className="mt-2">
            We are not responsible for the privacy practices, terms, or accuracy of
            third-party sites.
          </p>

          <h6 className="mt-6">11. Changes to Terms</h6>
          <p className="mt-2">We may update these Terms from time to time.</p>
          <p className="mt-2">
            Continued use of Bowers after updates means you accept the revised Terms.
          </p>

          <h6 className="mt-6">12. Additional Terms for Store Owners</h6>
          <p className="mt-2">
            <ul className="mt-2 ml-8 list-disc">
              <li>
                If you register as a store owner on Bowers, you agree to provide accurate
                and updated business information, including your store name, location,
                services, and contact details.
              </li>
              <li>
                You are responsible for managing your service availability, appointment
                times, prices, and customer communication.
              </li>
              <li>
                You agree to use customer information (such as names and phone numbers)
                solely for fulfilling services booked through Bowers and not for unrelated
                marketing or third-party sharing.
              </li>
              <li>
                Bowers reserves the right to suspend or remove a store account if it
                violates these Terms or negatively impacts customer experience.
              </li>
            </ul>
          </p>

          <h6 className="mt-6">13. Contact Us</h6>
          <p className="mt-2">
            If you have any questions about these Terms of Use, please contact us at:{" "}
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

export default TermsOfServiceScene;
