

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

import { Separator } from "@/shared/shadcn/components/ui/separator";

/**
 * Terms
 * Component in charge of displaying the terms of use.
 */
const Terms = () => (
  <>
    <h2 className='text-lg font-semibold'>Welcome to Balancer!</h2>
    <p>
      These Terms of Use ("Terms") govern your access to and use of the Balancer platform, software,
      and related services (collectively, the "Platform"). Please read these Terms carefully before
      using the Platform. By accessing or using the Platform, you agree to be bound by these Terms.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>1. Overview</h3>
    <p>
      Balancer is an open-source Bitcoin trading platform designed for individuals to manage their
      own Bitcoin trading. Balancer provides a platform, tools, and resources for you to trade
      Bitcoin, but it does not provide financial advice or act as a broker.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>2. Eligibility</h3>
    <p>
      You must be at least 18 years old and legally competent to enter into contracts to use
      Balancer. If you are accessing Balancer on behalf of a company or organization, you represent
      and warrant that you have the authority to bind that entity to these Terms.
    </p>

    <h3 className='text-lg font-semibold'>3. Risk Disclaimer</h3>
    <p>
      <strong>Trading Bitcoin is inherently risky.</strong> You understand and acknowledge that:
    </p>
    <ul>
      <li>
        <p>
          <strong>Balancer is not responsible for any losses you may incur due to bugs in the
            code.</strong> While we strive to ensure the Platform's stability and functionality,
            there is always the possibility of bugs or errors.
        </p>
      </li>
      <li>
        <p>
          <strong>The Platform's behavior can be unpredictable during exchange
            outages.</strong> Exchange outages can impact trading activity and may result in
             unexpected outcomes.
        </p>
      </li>
      <li>
        <p>
          <strong>Significant price drops or extended downtrends are inherent risks of Bitcoin
            trading.</strong> We cannot control or predict market fluctuations.
        </p>
      </li>
      <li>
        <p>
          <strong>You are responsible for safeguarding your own funds.</strong> Balancer does not
          hold your Bitcoin, and we are not liable for any loss of funds due to exchange insolvency,
          hacks, or mismanagement of assets by exchanges.
        </p>
      </li>
      <li>
        <p>
          <strong>You should consult with a financial advisor before making any investment
            decisions.</strong>
        </p>
      </li>
    </ul>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>4. Platform Use</h3>
    <p>
      You agree to use the Platform in accordance with these Terms and all applicable laws and
      regulations. You are solely responsible for all activity that occurs under your account.
      You are prohibited from:
    </p>
    <ul>
      <li>
        <p><strong>Using the Platform for any illegal or unauthorized purpose.</strong></p>
      </li>
      <li>
        <p><strong>Interfering with or disrupting the Platform.</strong></p>
      </li>
      <li>
        <p><strong>Violating any security measures implemented by Balancer.</strong></p>
      </li>
      <li>
        <p>
          <strong>Attempting to access accounts or systems that you are not authorized to
            access.</strong>
        </p>
      </li>
      <li>
        <p>
          <strong>Using the Platform for any commercial purpose without a license from
            Balancer.</strong>
        </p>
      </li>
    </ul>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>5. Intellectual Property</h3>
    <p>
      Balancer owns all right, title, and interest in and to the Platform, including but not
      limited to all intellectual property rights.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>6. Open Source and Commercial Use</h3>
    <p>
      Balancer is and will always be open source and free to use for individuals. You are welcome to
      download, modify, and redistribute the code for personal use.
    </p>
    <p>
      However, any commercial use of Balancer, including but not limited to:
    </p>
    <ul>
      <li><p>Redistributing the code for profit</p></li>
      <li><p>Using Balancer to offer trading services to others</p></li>
      <li><p>Developing derivative works for commercial purposes</p></li>
    </ul>
    <p>
      requires a separate license from Balancer. Please contact us for information on obtaining a
       commercial license.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>7. Disclaimer of Warranties</h3>
    <p>
        The Platform is provided "as is" and "as available" without warranties of any kind, express
        or implied, including, but not limited to, warranties of merchantability, fitness for a
        particular purpose, and non-infringement. Balancer does not warrant that the Platform will
        be uninterrupted, secure, or error-free.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>8. Limitation of Liability</h3>
    <p>
      To the fullest extent permitted by law, Balancer will not be liable for any direct, indirect,
      incidental, consequential, special, or exemplary damages arising out of or in connection
      with your use of the Platform, even if we have been advised of the possibility of such
      damages.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>9. Modifications to the Terms</h3>
    <p>
      Balancer may modify these Terms at any time by posting the revised Terms on the Platform.
       Your continued use of the Platform after the posting of revised Terms constitutes your
        agreement to be bound by the revised Terms.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>10. Governing Law and Dispute Resolution</h3>
    <p>
      These Terms will be governed by and construed in accordance with the laws of Venezuela,
       without regard to its conflict of laws provisions. Any dispute arising out of or relating
        to these Terms will be subject to the exclusive jurisdiction of the courts in Venezuela.
    </p>
    <Separator className='my-5' />

    <h3 className='text-lg font-semibold'>11. Contact Us</h3>
    <p>
      If you have any questions about these Terms, please contact us
       at <strong>jesusgraterol.dev@protonmail.com</strong>.
    </p>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Terms;
