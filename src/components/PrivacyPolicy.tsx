import React from 'react'

interface PrivacyPolicyProps {
  onClose: () => void
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = React.useState(false)

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  return (
    <div className={`terms-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="terms-header">
          <h1 className="terms-title">Privacy Policy</h1>
          <button className="terms-close-button" onClick={handleClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="terms-content">
          <p className="terms-last-updated">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="terms-section">
            <h2 className="terms-section-title">1. Introduction</h2>
            <p className="terms-text">
              Knowrist ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">2. Information We Collect</h2>
            <p className="terms-text">We collect information that you provide directly to us, including:</p>
            <ul className="terms-list">
              <li>Account information (full name, username, email address, password)</li>
              <li>Profile information and preferences</li>
              <li>Game participation and performance data</li>
              <li>Payment and transaction information</li>
              <li>Communications with us (support requests, feedback)</li>
            </ul>
            <p className="terms-text">We also automatically collect certain information when you use our services:</p>
            <ul className="terms-list">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">3. How We Use Your Information</h2>
            <p className="terms-text">We use the information we collect to:</p>
            <ul className="terms-list">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              <li>Personalize your experience and provide content tailored to your interests</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">4. Information Sharing and Disclosure</h2>
            <p className="terms-text">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in 
              the following circumstances:
            </p>
            <ul className="terms-list">
              <li>With your consent or at your direction</li>
              <li>To comply with legal obligations or respond to legal requests</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>With service providers who perform services on our behalf (subject to confidentiality agreements)</li>
              <li>In connection with a business transfer (merger, acquisition, etc.)</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">5. Data Security</h2>
            <p className="terms-text">
              We implement appropriate technical and organizational security measures to protect your personal information. 
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to 
              use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">6. Your Rights and Choices</h2>
            <p className="terms-text">You have the right to:</p>
            <ul className="terms-list">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability (receive your data in a structured format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">7. Cookies and Tracking Technologies</h2>
            <p className="terms-text">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you 
              do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">8. Children's Privacy</h2>
            <p className="terms-text">
              Our service is not intended for children under the age of 18. We do not knowingly collect personal information 
              from children under 18. If you are a parent or guardian and believe your child has provided us with personal 
              information, please contact us immediately.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">9. International Data Transfers</h2>
            <p className="terms-text">
              Your information may be transferred to and maintained on computers located outside of your state, province, 
              country, or other governmental jurisdiction where data protection laws may differ. By using our service, you 
              consent to the transfer of your information to these facilities.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">10. Changes to This Privacy Policy</h2>
            <p className="terms-text">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
              Policy periodically for any changes.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">11. Contact Us</h2>
            <p className="terms-text">
              If you have any questions about this Privacy Policy, please contact us at privacy@knowrist.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
