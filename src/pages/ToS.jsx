import React from "react";
import "../pages/styles/LegalPages.css"; // Shared CSS for styling

function TermsOfService() {
  return (
    <div className="legal-container">
      <h1>Terms of Service</h1>
      <p><strong>Effective Date:</strong> January 1, 2024</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using <strong>eBooksHub</strong>, you agree to comply with these Terms of Service.
      </p>

      <h2>2. User Accounts</h2>
      <ul>
        <li>Users must be at least 13 years old to create an account.</li>
        <li>Users are responsible for maintaining the confidentiality of their login credentials.</li>
        <li>We reserve the right to terminate accounts that violate our policies.</li>
      </ul>

      <h2>3. Content Ownership</h2>
      <p>
        Authors retain ownership of their books. By publishing content on <strong>eBooksHub</strong>, 
        you grant us a license to display and distribute it on our platform.
      </p>

      <h2>4. Prohibited Activities</h2>
      <p>
        Users must not:
        <ul>
          <li>Upload illegal, offensive, or copyrighted content.</li>
          <li>Engage in harassment, spamming, or fraudulent activities.</li>
          <li>Attempt to hack or disrupt our platform.</li>
        </ul>
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        <strong>eBooksHub</strong> is not liable for any damages resulting from platform usage. 
        We do not guarantee uninterrupted service.
      </p>

      <h2>6. Changes to Terms</h2>
      <p>
        We may update these Terms of Service at any time. Continued use of our platform 
        constitutes acceptance of the updated terms.
      </p>
    </div>
  );
}

export default TermsOfService;
