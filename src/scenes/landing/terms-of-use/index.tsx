/* eslint-disable react/no-unescaped-entities */

import { Link } from "@/i18n";

const TermsScene = () => {
  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <section className="w-full pt-[48px] pb-[96px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h4 className="text-[32px] text-center">Bowers Terms of Use</h4>
          <p className="mt-2 font-bold">Effective Date: 2 May, 2025</p>
          <p className="mt-2 font-bold">Last Updated: 2 May, 2025</p>
          <p className="mt-2">
            Welcome to Bowers! These Terms of Use ("Terms") govern your access to and use
            of the Bowers website, mobile application, and platform ("Bowers," "we,"
            "our," "us").
          </p>
          <p className="mt-2">
            By accessing or using Bowers, you agree to comply with these Terms. If you do
            not agree, please do not use Bowers.
          </p>
          <div className="my-6 border-b-2 border-dotted border-greyOutline" />
          <h6>1. Acceptable Use</h6>
          <p className="mt-2">
            You agree to use Bowers only for lawful purposes. You must not:
            <ul className="mt-2 ml-8 list-disc">
              <li>Violate any applicable laws or regulations</li>
              <li>
                Upload, post, or transmit any harmful, illegal, or misleading content
              </li>
              <li>
                Attempt to hack, disrupt, or interfere with the platform, servers, or
                network
              </li>
              <li>
                Use bots, scrapers, or automated systems to access Bowers without our
                permission
              </li>
              <li>Misuse or exploit the platform for unauthorized commercial purposes</li>
            </ul>
          </p>
          <h6 className="mt-6">2. User Accounts</h6>
          <p className="mt-2">
            If you create an account with Bowers, you are responsible for:
            <ul className="mt-2 ml-8 list-disc">
              <li>Keeping your login information secure</li>
              <li>All activities that occur under your account</li>
              <li>
                Immediately notifying us of any unauthorized access or security breach
              </li>
            </ul>
          </p>
          <p className="mt-2">
            Bowers is not responsible for any loss or damage resulting from your failure
            to protect your account.
          </p>
          <h6 className="mt-6">3. Intellectual Property</h6>
          <p className="mt-2">
            All content, trademarks, logos, graphics, and software on Bowers are owned by
            Bowers Innovation Co., Ltd., or licensed to us.
          </p>
          <p className="mt-2">
            You may not copy, modify, distribute, reproduce, or create derivative works
            from any part of Bowers without our written permission.
          </p>
          <h6 className="mt-6">4. Platform Availability</h6>
          <p className="mt-2">
            We aim to keep Bowers available at all times, but we cannot guarantee
            uninterrupted service.
          </p>
          <p className="mt-2">
            We may modify, update, suspend, or discontinue parts of the platform at any
            time without notice.
          </p>
          <h6 className="mt-6">5. External Links</h6>
          <p className="mt-2">
            Bowers may contain links to third-party websites or resources.
          </p>
          <p className="mt-2">
            We are not responsible for the content, availability, or security of external
            sites.
          </p>
          <h6 className="mt-6">6. Changes to These Terms</h6>
          <p className="mt-2">We may update these Terms from time to time.</p>
          <p className="mt-2">
            When we make changes, we will update the "Last Updated" date.
          </p>
          <p className="mt-2">
            Your continued use of Bowers after changes are posted constitutes acceptance
            of the updated Terms.
          </p>
          <h6 className="mt-6">7. Governing Law</h6>
          <p className="mt-2">These Terms are governed by the laws of Thailand.</p>
          <p className="mt-2">
            Any disputes arising from or related to these Terms will be subject to the
            exclusive jurisdiction of the courts of Thailand.
          </p>
          <h6 className="mt-6">8. Contact Us</h6>
          <p className="mt-2">
            If you have any questions about these Terms of Use, please contact us at:{" "}
            <Link href={"mailto:support@bowers.app"} className="text-purplePrimary cursor-pointer">support@bowers.app</Link>
          </p>
        </div>
      </section>
      <div className="w-full h-[80px] bg-darkPrimary"></div>
    </div>
  );
};

export default TermsScene;
